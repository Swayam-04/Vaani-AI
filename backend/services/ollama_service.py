import requests
import logging
import traceback
from typing import Optional
from config import Config
from exceptions import OllamaError

def check_ollama_status() -> bool:
    """Checks if the local Ollama daemon is active and running"""
    try:
        response = requests.get(f"{Config.OLLAMA_BASE_URL}/", timeout=5)
        response.raise_for_status()
        return True
    except Exception:
        return False

def check_ollama_model() -> bool:
    """Checks if the required model is available in Ollama"""
    try:
        response = requests.get(f"{Config.OLLAMA_BASE_URL}/api/tags", timeout=5)
        response.raise_for_status()
        
        models = response.json().get("models", [])
        for m in models:
            if m.get("name") == Config.MODEL_NAME or m.get("name").startswith(Config.MODEL_NAME):
                return True
        return False
    except Exception:
        return False

def query_ollama_model(prompt: str) -> str:
    """Sends a generate request to the local Ollama instance"""
    try:
        # Verify model is available before making the request
        if not check_ollama_model():
            raise OllamaError(f"{Config.MODEL_NAME} model not found. Please run: ollama pull {Config.MODEL_NAME}")
        
        payload = {
            "model": Config.MODEL_NAME,
            "prompt": prompt,
            "stream": False,
            "options": {}
        }
        
        # Log the complete request details as requested
        logging.info("=== Ollama Complete Request ===")
        logging.info("Model: %s", payload.get("model"))
        logging.info("Prompt Length: %d", len(prompt))
        logging.info("Prompt: %s", prompt)
        logging.info("Options: %s", payload.get("options"))
        logging.info("Stream Flag: %s", payload.get("stream"))
        logging.info("===============================")
        
        response = requests.post(
            f"{Config.OLLAMA_BASE_URL}/api/generate",
            json=payload,
            timeout=(10, 300)
        )
        
        # Log complete response status and body before raise_for_status()
        logging.info("Ollama Response Status: %s", response.status_code)
        try:
            resp_body = response.text
            logging.info("Ollama Response Body: %s", resp_body)
        except Exception as body_err:
            logging.error("Failed to read response body: %s", body_err)
            
        response.raise_for_status()
        
        try:
            json_resp = response.json()
        except ValueError as e:
            raise OllamaError(f"Invalid JSON received from Ollama: {str(e)}\nTraceback: {traceback.format_exc()}")
            
        response_text = json_resp.get("response")
        
        if response_text is None or not str(response_text).strip():
            logging.error("Ollama returned empty text. Full JSON: %s", json_resp)
            raise OllamaError("No text generated")
            
        logging.info("Generated text length: %d characters", len(response_text))
        return str(response_text)
            
    except requests.exceptions.RequestException as e:
        err_msg = f"Ollama request failed: {str(e)}\nTraceback: {traceback.format_exc()}"
        logging.error(err_msg)
        raise OllamaError(err_msg)
    except Exception as e:
        if isinstance(e, OllamaError):
            raise
        err_msg = f"Unexpected error in query_ollama_model: {str(e)}\nTraceback: {traceback.format_exc()}"
        logging.error(err_msg)
        raise OllamaError(err_msg)

def query_ollama_chat(messages: list) -> str:
    """
    Sends a chat request (with message history) to the local Ollama instance's /api/chat.
    messages format: [{'role': 'system'/'user'/'assistant', 'content': 'text'}, ...]
    """
    try:
        # Verify model is available before making the request
        if not check_ollama_model():
            raise OllamaError(f"{Config.MODEL_NAME} model not found. Please run: ollama pull {Config.MODEL_NAME}")
        
        payload = {
            "model": Config.MODEL_NAME,
            "messages": messages,
            "stream": False
        }
        
        logging.info("Ollama Chat Request - Model: %s, Message Count: %d", Config.MODEL_NAME, len(messages))
        
        response = requests.post(
            f"{Config.OLLAMA_BASE_URL}/api/chat",
            json=payload,
            timeout=(10, 300)
        )
        
        logging.info("Ollama Chat Response Status: %s", response.status_code)
        response.raise_for_status()
        
        try:
            json_resp = response.json()
        except ValueError as e:
            raise OllamaError(f"Invalid JSON received from Ollama Chat: {str(e)}\nTraceback: {traceback.format_exc()}")
            
        logging.info("Raw Ollama Chat response: %s", json_resp)
        
        message_resp = json_resp.get("message", {})
        response_text = message_resp.get("content")
        
        if response_text is None or not str(response_text).strip():
            logging.error("Ollama Chat returned empty text. Full JSON: %s", json_resp)
            raise OllamaError("No text generated")
            
        logging.info("Generated chat text length: %d characters", len(response_text))
        return str(response_text)
            
    except requests.exceptions.RequestException as e:
        err_msg = f"Ollama Chat request failed: {str(e)}\nTraceback: {traceback.format_exc()}"
        logging.error(err_msg)
        raise OllamaError(err_msg)
    except Exception as e:
        if isinstance(e, OllamaError):
            raise
        err_msg = f"Unexpected error in query_ollama_chat: {str(e)}\nTraceback: {traceback.format_exc()}"
        logging.error(err_msg)
        raise OllamaError(err_msg)

def translate_to_hindi(text: str) -> str:
    """
    Translates English text to Hindi using the local Gemma 4 model.
    Prints timing and character metrics.
    """
    import time
    prompt = (
        "Translate the following text into natural Hindi.\n"
        "Return ONLY the translated Hindi text.\n\n"
        f"Text:\n\n{text}"
    )
    start_time = time.time()
    try:
        translated_text = query_ollama_model(prompt).strip()
    except Exception as e:
        logging.error("Ollama Hindi translation failed: %s", e)
        raise e
        
    duration = time.time() - start_time
    
    print("--- Hindi Translation Step ---")
    print(f"Original text:\n{text}")
    print(f"Translated Hindi text:\n{translated_text}")
    print(f"Translation time: {duration:.2f} seconds")
    print(f"Character count: {len(translated_text)}")
    print("-----------------------------")
    
    return translated_text

