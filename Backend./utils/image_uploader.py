# utils/image_uploader.py
import cloudinary.uploader

def upload_image_to_cloudinary(file):
    upload_result = cloudinary.uploader.upload(file)
    return upload_result.get("secure_url")
