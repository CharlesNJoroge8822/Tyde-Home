from flask import request, Blueprint, jsonify
from models import Product, ProductImage, db
from werkzeug.utils import secure_filename
import os
from datetime import datetime
from sqlalchemy import or_

product_bp = Blueprint('products', __name__, url_prefix='/products')  # Set prefix here

# Create Product
@product_bp.route('', methods=['POST'])  # Now just empty string since prefix is set
def create_product():   
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['name', 'price', 'description']
    if not all(field in data for field in required_fields):
        return jsonify({"error": f"Missing required fields: {', '.join(required_fields)}"}), 400

    try:
        new_product = Product(
            name=data['name'],
            description=data['description'],
            price=float(data['price']),
            stock=int(data.get('stock', 0)),
            sku=data.get('sku'),
            category=data.get('category')
        )
        
        db.session.add(new_product)
        db.session.commit()
        
        return jsonify({
            "message": "Product created successfully",
            "product": new_product.to_dict()
        }), 201
        
    except ValueError as e:
        return jsonify({"error": "Invalid price or stock value"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Get All Products (with optional filtering)
@product_bp.route('/', methods=['GET'])  # Just empty string
def get_products():
    try:
        # Get query parameters
        search = request.args.get('search', '')
        category = request.args.get('category', '')
        min_price = request.args.get('min_price')
        max_price = request.args.get('max_price')
        in_stock = request.args.get('in_stock', 'false').lower() == 'true'
        
        # Build query
        query = Product.query
        
        if search:
            query = query.filter(or_(
                Product.name.ilike(f'%{search}%'),
                Product.description.ilike(f'%{search}%')
            ))
            
        if category:
            query = query.filter(Product.category == category)
            
        if min_price:
            query = query.filter(Product.price >= float(min_price))
            
        if max_price:
            query = query.filter(Product.price <= float(max_price))
            
        if in_stock:
            query = query.filter(Product.stock > 0)
        
        # Execute query
        products = query.order_by(Product.created_at.desc()).all()
        
        return jsonify([product.to_dict() for product in products]), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get Single Product
@product_bp.route('/<int:product_id>', methods=['GET'])  # Just /<id>
def get_product(product_id):
    try:
        product = Product.query.get_or_404(product_id)
        return jsonify(product.to_dict()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 404

# Update Product
@product_bp.route('/<int:product_id>', methods=['PUT'])  # Just /<id>
def update_product(product_id):
    product = Product.query.get_or_404(product_id)
    data = request.get_json()
    
    try:
        if 'name' in data:
            product.name = data['name']
        if 'description' in data:
            product.description = data['description']
        if 'price' in data:
            product.price = float(data['price'])
        if 'stock' in data:
            product.stock = int(data['stock'])
        if 'sku' in data:
            product.sku = data['sku']
        if 'category' in data:
            product.category = data['category']
            
        db.session.commit()
        
        return jsonify({
            "message": "Product updated successfully",
            "product": product.to_dict()
        }), 200
        
    except ValueError as e:
        return jsonify({"error": "Invalid price or stock value"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Delete Product
@product_bp.route('/<int:product_id>', methods=['DELETE'])  # Just /<id>
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    
    try:
        # Delete associated images (optional - could also cascade)
        ProductImage.query.filter_by(product_id=product_id).delete()
        
        db.session.delete(product)
        db.session.commit()
        
        return jsonify({"message": "Product deleted successfully"}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Get Related Products
@product_bp.route('/<int:product_id>/related', methods=['GET'])  # Just /<id>/related
def get_related_products(product_id):
    try:
        product = Product.query.get_or_404(product_id)
        
        if not product.category:
            return jsonify({"related_products": []}), 200
            
        related_products = Product.query.filter(
            Product.category == product.category,
            Product.id != product.id
        ).limit(4).all()
        
        return jsonify({
            "related_products": [p.to_dict() for p in related_products]
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500




@product_bp.route('/categories', methods=['GET'])
def get_categories():
    try:
        categories = db.session.query(Product.category).distinct().all()
        categories = [c[0] for c in categories if c[0] is not None]  # Clean nulls
        return jsonify(categories), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
