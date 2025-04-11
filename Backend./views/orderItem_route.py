from flask import request, Blueprint, jsonify
from models import OrderItem, Order, Product, db
from flask_jwt_extended import jwt_required, get_jwt_identity

order_item_bp = Blueprint("order_items", __name__, url_prefix="/order-items")

# Add Item to Order (with price validation)
@order_item_bp.route("/", methods=["POST"])
@jwt_required()
def add_order_item():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['order_id', 'product_id', 'quantity']
    if not all(field in data for field in required_fields):
        return jsonify({"error": f"Missing required fields: {', '.join(required_fields)}"}), 400
    
    try:
        # Verify order belongs to current user
        order = Order.query.filter_by(
            id=data['order_id'],
            user_id=current_user_id
        ).first_or_404()
        
        # Verify product exists and get current price
        product = Product.query.get_or_404(data['product_id'])
        
        # Check stock availability
        if product.stock < data['quantity']:
            return jsonify({
                "error": f"Only {product.stock} items available in stock",
                "available_stock": product.stock
            }), 400
        
        # Create order item with price snapshot
        new_item = OrderItem(
            order_id=data['order_id'],
            product_id=data['product_id'],
            quantity=data['quantity'],
            price_at_purchase=product.price  # Capture price at time of order
        )
        
        db.session.add(new_item)
        
        # Update order total (could also use SQL trigger)
        order.total_amount += (product.price * data['quantity'])
        db.session.commit()
        
        return jsonify({
            "message": "Item added to order",
            "order_item": new_item.to_dict(),
            "updated_order_total": order.total_amount
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Get Order Items (with product details)
@order_item_bp.route("/order/<int:order_id>", methods=["GET"])
@jwt_required()
def get_order_items(order_id):
    current_user_id = get_jwt_identity()
    
    try:
        # Verify order belongs to current user
        order = Order.query.filter_by(
            id=order_id,
            user_id=current_user_id
        ).first_or_404()
        
        # Get items with product details
        items = db.session.query(OrderItem, Product).join(
            Product, OrderItem.product_id == Product.id
        ).filter(
            OrderItem.order_id == order_id
        ).all()
        
        if not items:
            return jsonify({"message": "No items found in this order"}), 404
            
        # Combine order item and product data
        result = []
        for item, product in items:
            item_data = item.to_dict()
            item_data['product'] = product.to_dict()
            result.append(item_data)
        
        return jsonify({
            "order_id": order_id,
            "items": result,
            "total_items": len(result),
            "order_total": order.total_amount
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Update Order Item Quantity
@order_item_bp.route("/<int:item_id>", methods=["PATCH"])
@jwt_required()
def update_order_item(item_id):
    current_user_id = get_jwt_identity()
    
    try:
        # Get and validate the item
        item = OrderItem.query.join(
            Order, OrderItem.order_id == Order.id
        ).filter(
            OrderItem.id == item_id,
            Order.user_id == current_user_id
        ).first_or_404()
        
        data = request.get_json()
        new_quantity = data.get('quantity')
        
        if not new_quantity or new_quantity <= 0:
            return jsonify({"error": "Valid quantity required"}), 400
            
        # Get product for stock check
        product = Product.query.get_or_404(item.product_id)
        
        if product.stock < new_quantity:
            return jsonify({
                "error": f"Only {product.stock} items available",
                "available_stock": product.stock
            }), 400
        
        # Calculate difference and update
        quantity_diff = new_quantity - item.quantity
        item.quantity = new_quantity
        
        # Update order total
        order = Order.query.get(item.order_id)
        order.total_amount += (quantity_diff * item.price_at_purchase)
        
        db.session.commit()
        
        return jsonify({
            "message": "Order item updated",
            "order_item": item.to_dict(),
            "updated_order_total": order.total_amount
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Remove Item from Order
@order_item_bp.route("/<int:item_id>", methods=["DELETE"])
@jwt_required()
def remove_order_item(item_id):
    current_user_id = get_jwt_identity()
    
    try:
        # Get and validate the item
        item = OrderItem.query.join(
            Order, OrderItem.order_id == Order.id
        ).filter(
            OrderItem.id == item_id,
            Order.user_id == current_user_id
        ).first_or_404()
        
        # Update order total before deletion
        order = Order.query.get(item.order_id)
        order.total_amount -= (item.quantity * item.price_at_purchase)
        
        db.session.delete(item)
        db.session.commit()
        
        return jsonify({
            "message": "Item removed from order",
            "updated_order_total": order.total_amount,
            "remaining_items": OrderItem.query.filter_by(order_id=order.id).count()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500