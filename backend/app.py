from flask import Flask
from flask_cors import CORS
from routes import api_bp
from config import Config

app = Flask(__name__, static_folder="static")
app.config.from_object(Config)

# Enable CORS for the React frontend
CORS(app, resources={r"/*": {"origins": "*"}})

app.register_blueprint(api_bp)

import os
from flask import send_from_directory
from startup_manager import wait_for_services

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    dist_dir = os.path.abspath(os.path.join(app.root_path, '../dist'))
    if path != "" and os.path.exists(os.path.join(dist_dir, path)):
        return send_from_directory(dist_dir, path)
    else:
        return send_from_directory(dist_dir, 'index.html')

if __name__ == "__main__":
    print("==================================")
    print("VAANI AI Backend Starting...")
    print(f"Using TTS Model: {Config.CHATTERBOX_MODEL}")
    print("==================================")
    
    # Task 1: Startup Manager checks daemons before Flask binds
    wait_for_services()
    
    app.run(host="127.0.0.1", port=5000, debug=False)
