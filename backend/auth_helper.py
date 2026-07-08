from functools import wraps
from flask_jwt_extended import jwt_required
from config import Config

def optional_jwt_required():
    """
    Decorator that checks Flask configuration. If Config.AUTH_ENABLED is True,
    it executes the standard Flask-JWT-Extended jwt_required. Otherwise, it bypasses it.
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            if not getattr(Config, "AUTH_ENABLED", False):
                return fn(*args, **kwargs)
            return jwt_required()(fn)(*args, **kwargs)
        return wrapper
    return decorator
