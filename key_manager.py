import time
import random
import threading
from collections import defaultdict

class KeyManager:
    def __init__(self, keys=None):
        """Initialize the key manager with a list of API keys"""
        self.keys = keys or []
        self.key_status = {}  # Store status of each key
        self.rate_limit_data = defaultdict(lambda: {"errors": 0, "last_error": 0})
        self.lock = threading.Lock()  # For thread safety
        
        # Initialize all keys as available
        for key in self.keys:
            self.key_status[key] = {"available": True, "last_used": 0}
    
    def add_keys(self, keys):
        """Add one or more keys to the manager"""
        with self.lock:
            for key in keys:
                if key and key not in self.keys:
                    self.keys.append(key)
                    self.key_status[key] = {"available": True, "last_used": 0}
    
    def get_key(self):
        """Get the best available API key"""
        with self.lock:
            if not self.keys:
                raise ValueError("No API keys available")
            
            # Filter out keys that had recent rate limit errors
            current_time = time.time()
            available_keys = [
                key for key in self.keys 
                if self.key_status.get(key, {}).get("available", True) and
                (current_time - self.rate_limit_data[key]["last_error"] > 60 or 
                 self.rate_limit_data[key]["errors"] < 3)
            ]
            
            # If no keys are available, use any key (better than failing)
            if not available_keys:
                # Reset keys that have been in timeout for over 5 minutes
                for key in self.keys:
                    if (current_time - self.rate_limit_data[key]["last_error"] > 300):
                        self.rate_limit_data[key]["errors"] = 0
                        available_keys.append(key)
                
                # If still no keys, use any key
                if not available_keys:
                    available_keys = self.keys
            
            # Prefer keys with fewer errors
            available_keys.sort(key=lambda k: self.rate_limit_data[k]["errors"])
            
            # Get the best key
            selected_key = available_keys[0]
            self.key_status[selected_key]["last_used"] = current_time
            return selected_key
    
    def mark_rate_limited(self, key):
        """Mark a key as having hit a rate limit"""
        with self.lock:
            if key in self.keys:
                self.rate_limit_data[key]["errors"] += 1
                self.rate_limit_data[key]["last_error"] = time.time()
    
    def reset_key(self, key):
        """Reset a key's status after successful use"""
        with self.lock:
            if key in self.keys and self.rate_limit_data[key]["errors"] > 0:
                # Gradually reduce error count for successful calls
                self.rate_limit_data[key]["errors"] = max(0, self.rate_limit_data[key]["errors"] - 0.5)