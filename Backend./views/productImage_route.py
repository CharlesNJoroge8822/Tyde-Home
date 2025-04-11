from flask import request, Blueprint, jsonify
from models import ProductImage, Product, db
from werkzeug.utils import secure_filename
import os
from config import Config
import uuid
from flask_cors import cross_origin
from flask import send_from_directory


product_image_bp = Blueprint("product_image_bp", __name__)

# Configure upload folder
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@product_image_bp.route("/products/<int:product_id>/images", methods=["POST"])
@cross_origin()
def add_product_image(product_id):
    product = Product.query.get_or_404(product_id)
    
    if 'image_files' not in request.files and 'image_urls' not in request.form:
        return jsonify({"error": "No images provided"}), 400
    
    saved_images = []
    
    # Handle file uploads
    if 'image_files' in request.files:
        image_files = request.files.getlist('image_files')
        for image_file in image_files:
            if image_file and allowed_file(image_file.filename):
                filename = secure_filename(image_file.filename)
                unique_filename = f"{uuid.uuid4().hex}_{filename}"
                
                os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
                
                filepath = os.path.join(Config.UPLOAD_FOLDER, unique_filename)
                image_file.save(filepath)
                
                image_url = f"/static/uploads/{unique_filename}"
                
                new_image = ProductImage(
                    product_id=product_id,
                    image_url=image_url,
                    is_primary=False
                )
                db.session.add(new_image)
                saved_images.append(new_image)
    
    # Handle URL uploads
    if 'image_urls' in request.form:
        urls = request.form.getlist('image_urls')
        for url in urls:
            if url:
                new_image = ProductImage(
                    product_id=product_id,
                    image_url=url,
                    is_primary=False
                )
                db.session.add(new_image)
                saved_images.append(new_image)
    
    if not saved_images:
        return jsonify({"error": "No valid images provided"}), 400
    
    # Set first image as primary if no primary exists
    if not ProductImage.query.filter_by(product_id=product_id, is_primary=True).first():
        saved_images[0].is_primary = True
        product.primary_image_id = saved_images[0].id
    
    db.session.commit()
    
    return jsonify({
        "message": f"{len(saved_images)} images added successfully",
        "images": [img.to_dict() for img in saved_images]
    }), 201

@product_image_bp.route("/products/<int:product_id>/images", methods=["GET"])
@cross_origin()
def get_product_images(product_id):
    product = Product.query.get_or_404(product_id)
    images = ProductImage.query.filter_by(product_id=product_id).order_by(ProductImage.position).all()
    
    # Get primary image object if primary_image_id exists
    primary_image = None
    if product.primary_image_id:
        primary_image = ProductImage.query.get(product.primary_image_id)
    
    return jsonify({
        "product_id": product_id,
        "count": len(images),
        "images": [image.to_dict() for image in images],
        "primary_image": primary_image.to_dict() if primary_image else None
    }), 200

@product_image_bp.route("/images/<int:image_id>", methods=["GET"])
@cross_origin()
def get_image(image_id):
    image = ProductImage.query.get_or_404(image_id)
    return jsonify(image.to_dict()), 200

@product_image_bp.route("/images/<int:image_id>", methods=["PUT"])
@cross_origin()
def update_image(image_id):
    image = ProductImage.query.get_or_404(image_id)
    data = request.get_json()

    if 'position' in data:
        image.position = data['position']

    if 'is_primary' in data:
        if data['is_primary']:
            # Unset any existing primary image
            ProductImage.query.filter_by(
                product_id=image.product_id, 
                is_primary=True
            ).update({"is_primary": False})
            # Update product's primary_image_id reference
            product = Product.query.get(image.product_id)
            product.primary_image_id = image.id
        image.is_primary = data['is_primary']

    db.session.commit()
    return jsonify({
        "message": "Image updated successfully",
        "image": image.to_dict()
    }), 200

@product_image_bp.route("/images/<int:image_id>", methods=["DELETE"])
@cross_origin()
def delete_product_image(image_id):
    image = ProductImage.query.get_or_404(image_id)
    product_id = image.product_id
    
    # If deleting primary image, set another as primary
    if image.is_primary:
        first_other = ProductImage.query.filter(
            ProductImage.product_id == product_id,
            ProductImage.id != image.id
        ).first()
        if first_other:
            first_other.is_primary = True
            # Update product's primary_image_id reference
            product = Product.query.get(product_id)
            product.primary_image_id = first_other.id
    
    db.session.delete(image)
    db.session.commit()
    
    return jsonify({
        "message": "Product image deleted successfully",
        "product_id": product_id
    }), 200

@product_image_bp.route("/images/<int:image_id>/set-primary", methods=["PATCH"])
@cross_origin()
def set_primary_image(image_id):
    image = ProductImage.query.get_or_404(image_id)
    
    # Unset any existing primary image
    ProductImage.query.filter_by(
        product_id=image.product_id, 
        is_primary=True
    ).update({"is_primary": False})
    
    # Set this image as primary
    image.is_primary = True
    # Update product's primary_image_id reference
    product = Product.query.get(image.product_id)
    product.primary_image_id = image.id
    
    db.session.commit()
    
    return jsonify({
        "message": "Primary image updated successfully",
        "image": image.to_dict()
    }), 200




@product_image_bp.route('/static/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(Config.UPLOAD_FOLDER, filename)