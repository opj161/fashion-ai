import os
import base64
import json
import uuid
import time
from datetime import datetime
from pathlib import Path

# Define storage directory - create if it doesn't exist
STORAGE_DIR = Path("./storage")
IMAGES_DIR = STORAGE_DIR / "images"
METADATA_DIR = STORAGE_DIR / "metadata"

# Create directories if they don't exist
STORAGE_DIR.mkdir(exist_ok=True)
IMAGES_DIR.mkdir(exist_ok=True)
METADATA_DIR.mkdir(exist_ok=True)

def save_image(image_data_base64, metadata=None):
    """
    Save an image to persistent storage
    
    Args:
        image_data_base64: Base64-encoded image data
        metadata: Optional dict with additional information
        
    Returns:
        str: The image ID
    """
    # Generate a unique ID for this image
    image_id = f"{int(time.time())}_{uuid.uuid4().hex[:8]}"
    
    # Decode base64 image data
    try:
        image_data = base64.b64decode(image_data_base64)
    except Exception as e:
        print(f"Error decoding base64 image: {e}")
        return None
    
    # Save the image file
    image_path = IMAGES_DIR / f"{image_id}.jpg"
    with open(image_path, "wb") as f:
        f.write(image_data)
    
    # Save metadata if provided
    if metadata:
        metadata_path = METADATA_DIR / f"{image_id}.json"
        with open(metadata_path, "w") as f:
            # Add timestamp and id to metadata
            full_metadata = {
                "id": image_id,
                "timestamp": datetime.now().isoformat(),
                **metadata
            }
            json.dump(full_metadata, f, indent=2)
    
    print(f"Saved image {image_id} to {image_path}")
    return image_id

def get_image(image_id):
    """Retrieve an image from storage"""
    image_path = IMAGES_DIR / f"{image_id}.jpg"
    metadata_path = METADATA_DIR / f"{image_id}.json"
    
    if not image_path.exists():
        return None, None
    
    with open(image_path, "rb") as f:
        image_data = f.read()
    
    image_base64 = base64.b64encode(image_data).decode('utf-8')
    
    metadata = None
    if metadata_path.exists():
        with open(metadata_path, "r") as f:
            metadata = json.load(f)
    
    return image_base64, metadata

def update_image_metadata(image_id, new_metadata):
    """
    Update the metadata for an existing image
    
    Args:
        image_id: The ID of the image to update
        new_metadata: The metadata to update or replace
        
    Returns:
        bool: True if successful, False otherwise
    """
    metadata_path = METADATA_DIR / f"{image_id}.json"
    
    # Check if the metadata file exists
    if not metadata_path.exists():
        print(f"Metadata file not found for image {image_id}")
        return False
    
    try:
        # Load existing metadata
        with open(metadata_path, "r") as f:
            metadata = json.load(f)
        
        # Update with new values, preserving ID and timestamp
        original_id = metadata.get('id')
        original_timestamp = metadata.get('timestamp')
        
        metadata.update(new_metadata)
        
        # Ensure ID and timestamp are preserved
        if original_id:
            metadata['id'] = original_id
        if original_timestamp:
            metadata['timestamp'] = original_timestamp
        
        # Write updated metadata back to file
        with open(metadata_path, "w") as f:
            json.dump(metadata, f, indent=2)
        
        print(f"Updated metadata for image {image_id}")
        return True
    
    except Exception as e:
        print(f"Error updating metadata for image {image_id}: {e}")
        return False

def list_images(limit=50, offset=0, tag=None):
    """
    List available images with optional filtering
    
    Args:
        limit: Maximum number of images to return
        offset: Number of images to skip
        tag: Optional tag to filter by
        
    Returns:
        list: List of image metadata
    """
    result = []
    
    # Get all JSON metadata files
    metadata_files = sorted(METADATA_DIR.glob("*.json"), 
                           key=lambda x: os.path.getmtime(x),
                           reverse=True)
    
    # Apply offset
    metadata_files = metadata_files[offset:]
    
    # Process files
    for metadata_file in metadata_files:
        if len(result) >= limit:
            break
            
        with open(metadata_file, "r") as f:
            try:
                metadata = json.load(f)
                
                # Filter by tag if specified
                if tag and ('tags' not in metadata or tag not in metadata['tags']):
                    continue
                    
                # Get the corresponding image file
                image_id = metadata.get('id')
                if image_id:
                    image_path = IMAGES_DIR / f"{image_id}.jpg"
                    if image_path.exists():
                        # Read image data
                        with open(image_path, "rb") as img_file:
                            image_data = img_file.read()
                        
                        # Add base64 encoded image data to metadata
                        metadata['imageData'] = base64.b64encode(image_data).decode('utf-8')
                
                # Add to results
                result.append(metadata)
            except Exception as e:
                print(f"Error processing metadata file {metadata_file}: {e}")
                continue
    
    return result