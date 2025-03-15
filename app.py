import os
import base64
import json
import requests
import time
import logging
from io import BytesIO
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
from dotenv import load_dotenv
import openai

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configure CORS based on environment
allowed_origins = os.environ.get('ALLOWED_ORIGINS', '*').split(',')
print(f"Allowing CORS for: {allowed_origins}")
CORS(app, origins=allowed_origins)

# Configuration
import random

# Load Gemini API keys from environment variables for security
GEMINI_API_KEYS = []

# Load all 24 Gemini API keys from environment variables
for i in range(1, 25):
    key_name = f'GEMINI_API_KEY_{i:02d}'
    api_key = os.getenv(key_name)
    if api_key:
        GEMINI_API_KEYS.append(api_key)
    else:
        print(f"Warning: {key_name} not found in environment variables")

# Verify we have API keys loaded
if not GEMINI_API_KEYS:
    logger.error("No Gemini API keys found in environment variables!")
    logger.error("Please make sure you have added at least GEMINI_API_KEY_01 to your environment")
else:
    logger.info(f"Loaded {len(GEMINI_API_KEYS)} Gemini API keys")

# Function to get a random API key
def get_random_api_key():
    if not GEMINI_API_KEYS:
        raise ValueError("No Gemini API keys available. Check your .env file.")
    return random.choice(GEMINI_API_KEYS)

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent"

# Initialize OpenAI client
openai.api_key = OPENAI_API_KEY

# Helper functions
def get_image_data(image_data_str):
    """
    Convert base64 image data to bytes
    """
    # If the string includes metadata (data:image/jpeg;base64,), remove it
    if 'base64,' in image_data_str:
        image_data_str = image_data_str.split('base64,')[1]
    return base64.b64decode(image_data_str)

def save_image_data(image_data):
    """
    Save image data to a temporary file and return the URL
    """
    try:
        # Use PIL to process the image
        img = Image.open(BytesIO(image_data))
        
        # Save as PNG (could be configured as needed)
        output = BytesIO()
        img.save(output, format='PNG')
        return output.getvalue(), 'image/png'
    except Exception as e:
        print(f"Error processing image: {e}")
        return None, None

def check_prompt_safety(prompt):
    """
    Check if a prompt is safe using OpenAI's GPT-3.5 model
    Returns a tuple of (is_safe, reason)
    """
    try:
        print(f"🔍 Checking prompt safety: {prompt}")
        
        # Create the system message instructing GPT to evaluate the prompt
        messages = [
            {
                "role": "system",
                "content": """You are a content moderation assistant that evaluates if image generation prompts are appropriate.
Respond with 'SAFE' or 'UNSAFE' followed by a brief reason.
Judge a prompt as UNSAFE if it contains any of the following:
1. Explicit sexual content or nudity
2. Graphic violence or gore
3. Hate speech, discrimination, or harassment
4. Content harmful to minors
5. Instructions for illegal activities
6. Personal information or privacy violations"""
            },
            {
                "role": "user",
                "content": f"Evaluate if this image generation prompt is appropriate: '{prompt}'"
            }
        ]
        
        # Make the API call to OpenAI
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=150
        )
        
        # Extract the response text
        response_text = response['choices'][0]['message']['content'].strip()
        print(f"🔍 Safety check response: {response_text}")
        
        # Parse the response to determine if safe or not
        is_safe = response_text.upper().startswith('SAFE')
        
        # Extract the reason from the response
        reason = response_text
        
        return (is_safe, reason)
    except Exception as e:
        print(f"🔍 Error during safety check: {str(e)}")
        # In case of error, default to allowing the prompt but log the error
        return (True, f"Error during safety check: {str(e)}")

# Routes
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "Backend server is running"})

@app.route('/api/generate-image', methods=['POST'])
def generate_image():
    data = request.json
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
        
    prompt = data.get('prompt')
    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400
    
    # Check if the prompt is safe using GPT-3.5
    is_safe, safety_reason = check_prompt_safety(prompt)
    if not is_safe:
        return jsonify({"error": f"The prompt was flagged as inappropriate: {safety_reason}"}), 400
    
    # Set up for retry mechanism
    max_attempts = 3
    attempt = 0
    result_text = None
    result_image_data = None
    last_error = None
    
    # Track detailed retry information
    retry_info = {
        "attempts": 0,
        "max_attempts": max_attempts,
        "errors": [],
        "success": False
    }
    
    while attempt < max_attempts:
        attempt += 1
        
        try:
            print(f"🔍 ATTEMPT {attempt}/{max_attempts} to generate image")
            
            # Create request body following the Gemini API format
            request_body = {
                "contents": [
                    {
                        "role": "user",
                        "parts": [
                            {
                                "text": prompt
                            }
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 1,
                    "topP": 0.95,
                    "topK": 40,
                    "maxOutputTokens": 8192,
                    "responseModalities": ["image", "text"]
                },
                "safetySettings": [
                    {
                        "category": "HARM_CATEGORY_CIVIC_INTEGRITY",
                        "threshold": "BLOCK_NONE"
                    }
                ]
            }
            
            # Log request (without sensitive info)
            print(f"🔍 REQUEST MODEL: gemini-2.0-flash-exp")
            print(f"🔍 PROMPT: {prompt}")
            
            # Make the API call with a randomly selected API key
            url = f"{BASE_URL}?key={get_random_api_key()}"
            response = requests.post(
                url, 
                json=request_body,
                headers={"Content-Type": "application/json"}
            )
            
            # Handle errors
            if response.status_code != 200:
                print(f"🔍 RESPONSE STATUS: {response.status_code}")
                error_message = "Unknown error"
                try:
                    error_data = response.json()
                    if 'error' in error_data and 'message' in error_data['error']:
                        error_message = error_data['error']['message']
                except:
                    error_message = f"API Error: {response.status_code}"
                
                last_error = error_message
                # Record detailed error information
                retry_info["attempts"] = attempt
                retry_info["errors"].append({
                    "attempt": attempt,
                    "status_code": response.status_code,
                    "message": error_message,
                    "type": "api_error"
                })
                continue  # Try again
            
            # Process successful response
            response_data = response.json()
            print(f"🔍 RESPONSE STATUS: {response.status_code}")
            
            # Extract text and image data
            if 'candidates' in response_data and response_data['candidates']:
                first_candidate = response_data['candidates'][0]
                if 'content' in first_candidate and 'parts' in first_candidate['content']:
                    parts = first_candidate['content']['parts']
                    
                    for part in parts:
                        if 'text' in part:
                            result_text = part['text']
                        elif 'inlineData' in part:
                            inline_data = part['inlineData']
                            if 'data' in inline_data and 'mimeType' in inline_data:
                                mime_type = inline_data['mimeType']
                                if mime_type.startswith('image/'):
                                    image_data_b64 = inline_data['data']
                                    result_image_data = image_data_b64
                                    print(f"🔍 IMAGE RECEIVED: {len(image_data_b64)} chars, mime type: {mime_type}")
            
            # Check if we got an image back
            if result_image_data is not None:
                print(f"🔍 Successfully generated image on attempt {attempt}/{max_attempts}")
                # Record success information
                retry_info["attempts"] = attempt
                retry_info["success"] = True
                break  # Success - exit the retry loop
            else:
                print(f"🔍 No image data in response, attempt {attempt}/{max_attempts}")
                if attempt < max_attempts:
                    last_error = "No image data received from API"
                    # Record error about missing image data
                    retry_info["attempts"] = attempt
                    retry_info["errors"].append({
                        "attempt": attempt,
                        "message": "No image data received from API",
                        "type": "missing_data"
                    })
                    time.sleep(1)  # Short delay before retry
                    continue
        
        except Exception as e:
            print(f"🔍 Error during attempt {attempt}: {str(e)}")
            last_error = str(e)
            # Record exception information
            retry_info["attempts"] = attempt
            retry_info["errors"].append({
                "attempt": attempt,
                "message": str(e),
                "type": "exception"
            })
            if attempt < max_attempts:
                time.sleep(1)  # Short delay before retry
                continue
    
    # After all attempts, return what we have
    if result_image_data is None and last_error is not None:
        return jsonify({
            "error": f"Failed after {attempt} attempts. Last error: {last_error}",
            "retryInfo": retry_info
        }), 500
    
    # Return results
    return jsonify({
        "text": result_text,
        "imageData": result_image_data,
        "retryInfo": retry_info
    })

@app.route('/api/edit-image', methods=['POST'])
def edit_image():
    data = request.json
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
        
    prompt = data.get('prompt')
    image_data_b64 = data.get('imageData')
    
    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400
    
    if not image_data_b64:
        return jsonify({"error": "No image data provided"}), 400
    
    # Check if the prompt is safe using GPT-3.5
    is_safe, safety_reason = check_prompt_safety(prompt)
    if not is_safe:
        return jsonify({"error": f"The prompt was flagged as inappropriate: {safety_reason}"}), 400
    
    # Set up for retry mechanism
    max_attempts = 3
    attempt = 0
    result_text = None
    result_image_data = None
    last_error = None
    
    # Track detailed retry information
    retry_info = {
        "attempts": 0,
        "max_attempts": max_attempts,
        "errors": [],
        "success": False
    }
    
    while attempt < max_attempts:
        attempt += 1
        
        try:
            print(f"🔍 ATTEMPT {attempt}/{max_attempts} to edit image")
            
            # Create request with both image and prompt
            request_body = {
                "contents": [
                    {
                        "role": "user",
                        "parts": [
                            {
                                "inlineData": {
                                    "mimeType": "image/jpeg",
                                    "data": image_data_b64
                                }
                            },
                            {
                                "text": prompt
                            }
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 1,
                    "topP": 0.95,
                    "topK": 40,
                    "maxOutputTokens": 8192,
                    "responseModalities": ["image", "text"]
                },
                "safetySettings": [
                    {
                        "category": "HARM_CATEGORY_CIVIC_INTEGRITY",
                        "threshold": "BLOCK_NONE"
                    }
                ]
            }
            
            # Log request (without the image data to keep logs readable)
            print(f"🔍 REQUEST MODEL: gemini-2.0-flash-exp")
            print(f"🔍 PROMPT: {prompt}")
            print(f"🔍 WITH IMAGE: {len(image_data_b64) if image_data_b64 else 0} chars")
            
            # Make the API call with a randomly selected API key
            url = f"{BASE_URL}?key={get_random_api_key()}"
            response = requests.post(
                url, 
                json=request_body,
                headers={"Content-Type": "application/json"}
            )
            
            # Handle errors
            if response.status_code != 200:
                print(f"🔍 RESPONSE STATUS: {response.status_code}")
                error_message = "Unknown error"
                try:
                    error_data = response.json()
                    if 'error' in error_data and 'message' in error_data['error']:
                        error_message = error_data['error']['message']
                except:
                    error_message = f"API Error: {response.status_code}"
                
                last_error = error_message
                if attempt < max_attempts:
                    time.sleep(1)  # Short delay before retry
                    continue
                else:
                    return jsonify({
                        "error": error_message,
                        "retryInfo": retry_info
                    }), response.status_code
            
            # Process successful response
            response_data = response.json()
            print(f"🔍 RESPONSE STATUS: {response.status_code}")
            
            # Extract text and image data
            if 'candidates' in response_data and response_data['candidates']:
                first_candidate = response_data['candidates'][0]
                if 'content' in first_candidate and 'parts' in first_candidate['content']:
                    parts = first_candidate['content']['parts']
                    
                    for part in parts:
                        if 'text' in part:
                            result_text = part['text']
                        elif 'inlineData' in part:
                            inline_data = part['inlineData']
                            if 'data' in inline_data and 'mimeType' in inline_data:
                                mime_type = inline_data['mimeType']
                                if mime_type.startswith('image/'):
                                    result_image_data = inline_data['data']
                                    print(f"🔍 IMAGE RECEIVED: {len(result_image_data)} chars, mime type: {mime_type}")
            
            # Check if we got an image back
            if result_image_data is not None:
                print(f"🔍 Successfully edited image on attempt {attempt}/{max_attempts}")
                # Record success information
                retry_info["attempts"] = attempt
                retry_info["success"] = True
                break  # Success - exit the retry loop
            else:
                print(f"🔍 No image data in response, attempt {attempt}/{max_attempts}")
                if attempt < max_attempts:
                    last_error = "No image data received from API"
                    # Record error about missing image data
                    retry_info["attempts"] = attempt
                    retry_info["errors"].append({
                        "attempt": attempt,
                        "message": "No image data received from API",
                        "type": "missing_data"
                    })
                    time.sleep(1)  # Short delay before retry
                    continue
                else:
                    return jsonify({
                        "error": "No image data received after multiple attempts",
                        "retryInfo": retry_info
                    }), 500
        
        except Exception as e:
            print(f"🔍 Error during attempt {attempt}: {str(e)}")
            last_error = str(e)
            # Record exception information
            retry_info["attempts"] = attempt
            retry_info["errors"].append({
                "attempt": attempt,
                "message": str(e),
                "type": "exception"
            })
            if attempt < max_attempts:
                time.sleep(1)  # Short delay before retry
                continue
            else:
                return jsonify({
                    "error": str(e),
                    "retryInfo": retry_info
                }), 500
    
    # Return results
    return jsonify({
        "text": result_text,
        "imageData": result_image_data,
        "retryInfo": retry_info
    })

if __name__ == '__main__':
    # Get port from environment variable
    port = int(os.environ.get('PORT', 5002))
    
    # Debug mode should be disabled in production
    debug_mode = os.environ.get('DEBUG', 'False').lower() == 'true'
    
    # Only bind to all interfaces (0.0.0.0) in development
    # In production with proper reverse proxy, use 127.0.0.1
    host = '0.0.0.0' if debug_mode else '0.0.0.0'  # Render requires 0.0.0.0
    
    print(f"Starting server on {host}:{port} (debug={debug_mode})")
    app.run(host=host, port=port, debug=debug_mode)
