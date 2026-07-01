import os
import time
import requests
import traceback
from typing import Tuple, Dict, Any, List
from datetime import datetime
from config import Config, ConfigManager
from exceptions import OmniVoiceError
from logger import omnivoice_logger

def check_omnivoice_status() -> bool:
    """Check if OmniVoice is reachable"""
    try:
        response = requests.get(f"{Config.OMNIVOICE_BASE_URL}/health", timeout=5)
        response.raise_for_status()
        return True
    except Exception:
        return False

def validate_voice_and_engine() -> Tuple[str, str]:
    """Automatically fetch available voices, fallback to defaults if needed"""
    try:
        response = requests.get(f"{Config.OMNIVOICE_BASE_URL}/v1/audio/voices", timeout=10)
        response.raise_for_status()
        
        data = response.json()
        import json
        omnivoice_logger.info("Raw API response: %s", json.dumps(data, ensure_ascii=True))
        
        voices_list = []
        if isinstance(data, list):
            voices_list = data
        elif isinstance(data, dict):
            if "voices" in data and isinstance(data["voices"], list):
                voices_list = data["voices"]
            elif "data" in data and isinstance(data["data"], list):
                voices_list = data["data"]
        
        voice_ids = []
        for v in voices_list:
            if isinstance(v, dict):
                vid = v.get("voice_id") or v.get("id") or v.get("name")
                if vid:
                    voice_ids.append(vid)
        
        voices_log_str = "\nAvailable voices:\n" + "\n".join([f"- {vid}" for vid in voice_ids])
        omnivoice_logger.info(voices_log_str)
        omnivoice_logger.info("Extracted voice IDs: %s", voice_ids)
        
        if not voice_ids:
            raise OmniVoiceError("No voices available")
            
        configured_voice = getattr(Config, 'OMNIVOICE_VOICE', None)
        omnivoice_logger.info("Requested voice: %s", configured_voice)
        
        selected_voice = None
        if configured_voice and configured_voice in voice_ids:
            selected_voice = configured_voice
        elif "demo0001" in voice_ids:
            selected_voice = "demo0001"
        elif "alloy" in voice_ids:
            selected_voice = "alloy"
        else:
            selected_voice = voice_ids[0]
            
        # Save selected voice in config.json
        ConfigManager.set("omnivoice", "voice", selected_voice)
        omnivoice_logger.info("Selected voice: %s", selected_voice)
        
        return "omnivoice", selected_voice
        
    except Exception as e:
        if isinstance(e, OmniVoiceError):
            raise
        err_msg = f"Failed to validate voice: {str(e)}\nTraceback: {traceback.format_exc()}"
        omnivoice_logger.error(err_msg)
        raise OmniVoiceError(err_msg)

def _chunk_text(text: str, max_length: int = 1000) -> List[str]:
    """Splits text into smaller chunks by sentence boundaries to avoid engine failure"""
    if len(text) <= max_length:
        return [text]
    
    chunks = []
    current_chunk = ""
    for sentence in text.replace('\n', ' ').split('. '):
        if len(current_chunk) + len(sentence) < max_length:
            current_chunk += sentence + ". "
        else:
            if current_chunk:
                chunks.append(current_chunk.strip())
            current_chunk = sentence + ". "
    if current_chunk:
        chunks.append(current_chunk.strip())
    
    final_chunks = []
    for c in chunks:
        if len(c) > max_length:
            for i in range(0, len(c), max_length):
                final_chunks.append(c[i:i+max_length])
        else:
            final_chunks.append(c)
            
    return final_chunks

def generate_speech_audio(text: str, output_dir: str) -> Dict[str, Any]:
    """
    Calls OmniVoice Studio with exponential backoff retries and streaming timeouts.
    Splits text if necessary and returns a dictionary.
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"audio_{timestamp}.mp3"
    filepath = os.path.join(output_dir, filename)

    engine, voice = validate_voice_and_engine()
    url = f"{Config.OMNIVOICE_BASE_URL}/v1/audio/speech"
    
    text_chunks = _chunk_text(text)
    omnivoice_logger.info("Text split into %d chunks.", len(text_chunks))
    
    total_size = 0
    
    # Open file in append-binary mode to stream chunks directly to disk
    with open(filepath, 'wb') as f:
        for i, chunk in enumerate(text_chunks):
            payload = {
                "model": engine,
                "input": chunk,
                "voice": voice,
                "response_format": "mp3",
                "speed": 1
            }

            chunk_success = False
            max_retries = 3
            
            for attempt in range(max_retries):
                try:
                    omnivoice_logger.info("OmniVoice Chunk %d/%d attempt %d...", i+1, len(text_chunks), attempt+1)
                    
                    if not check_omnivoice_status():
                        omnivoice_logger.warning("OmniVoice health check failed before attempt %d", attempt+1)
                        raise requests.exceptions.ConnectionError("OmniVoice health check failed.")

                    # Use (10, 300) timeout and stream=True
                    with requests.post(url, json=payload, timeout=(10, 300), stream=True) as response:
                        if response.status_code == 200:
                            content_type = response.headers.get("Content-Type", "").lower()
                            valid_types = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/*", "application/octet-stream", "application/x-download"]
                            if not any(vt in content_type for vt in valid_types):
                                raise OmniVoiceError(f"Unexpected Content-Type: {content_type}")
                                
                            chunk_size = 0
                            for audio_chunk in response.iter_content(chunk_size=8192):
                                if audio_chunk:
                                    f.write(audio_chunk)
                                    chunk_size += len(audio_chunk)
                                    total_size += len(audio_chunk)
                                    
                            if chunk_size < 1024:
                                raise OmniVoiceError(f"Returned MP3 audio is too small ({chunk_size} bytes).")
                                
                            chunk_success = True
                            break
                        else:
                            err_msg = f"OmniVoice Studio Error {response.status_code}: {response.text}"
                            omnivoice_logger.error(err_msg)
                            raise OmniVoiceError(err_msg)

                except Exception as e:
                    err_msg = f"OmniVoice request failed: {str(e)}\nTraceback: {traceback.format_exc()}"
                    omnivoice_logger.error(err_msg)
                    if attempt < max_retries - 1:
                        sleep_time = (2 ** attempt) * 2 # Exponential backoff: 2s, 4s, 8s
                        omnivoice_logger.info("Retrying in %d seconds...", sleep_time)
                        time.sleep(sleep_time)
                    else:
                        raise OmniVoiceError(f"Max retries ({max_retries}) reached. Final error: {err_msg}")
                        
            if not chunk_success:
                raise OmniVoiceError(f"Failed to generate audio for chunk {i+1}")

    if not os.path.exists(filepath) or total_size < 1024 or not filepath.endswith(".mp3"):
        raise OmniVoiceError("Final audio file validation failed. File is either missing, too small, or has incorrect extension.")

    omnivoice_logger.info("Saved streamed audio successfully: %s (%d bytes)", filepath, total_size)
    
    return {
        "success": True,
        "filename": filename,
        "path": filepath,
        "size": total_size
    }
