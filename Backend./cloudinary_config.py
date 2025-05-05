# backend/cloudinary_config.py
import os
import cloudinary
from cloudinary import utils

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUD_NAME"),
    api_key=os.getenv("CLOUD_API_KEY"),
    api_secret=os.getenv("CLOUD_API_SECRET"),
    secure=True
)

def get_cloudinary_url(public_id, width=None, height=None, crop='fill'):
    """Generate optimized Cloudinary URL with transformations"""
    if not public_id:
        return None
    
    transformations = {
        'quality': 'auto',
        'fetch_format': 'auto'
    }
    
    if width and height:
        transformations.update({
            'width': width,
            'height': height,
            'crop': crop
        })
    
    return utils.cloudinary_url(public_id, **transformations)[0]