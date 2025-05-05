from flask import request, Blueprint, jsonify
from models import Order, OrderItem, Product, db, DeliveryUpdate
from datetime import datetime, timedelta
from sqlalchemy.exc import SQLAlchemyError
from flask_jwt_extended import jwt_required, get_jwt_identity
from cloudinary_config import get_cloudinary_url

order_bp = Blueprint("orders", __name__, url_prefix="/orders")

def error_response(message, status_code, **kwargs):
    response = {"error": message}
    response.update(kwargs)
    return jsonify(response), status_code

# Create New Order
@order_bp.route("/", methods=["POST"])
@jwt_required()
def create_order():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        # Validate payload existence
        if not data or "items" not in data:
            return error_response("Order items array is required", 400)
        
        items = data["items"]
        if not isinstance(items, list) or len(items) == 0:
            return error_response("Items must be a non-empty array", 400)

        total_amount = 0
        items_to_add = []

        for item in items:
            if not isinstance(item, dict):
                return error_response("Each item must be an object", 400)
            
            product_id = item.get("product_id")
            quantity = item.get("quantity")

            if product_id is None:
                return error_response("Each item requires product_id", 400)

            if quantity is None:
                return error_response("Each item requires quantity", 400)

            try:
                quantity = int(quantity)
                if quantity <= 0:
                    return error_response("Quantity must be a positive number", 400)
            except (ValueError, TypeError):
                return error_response("Quantity must be a valid number", 400)

            product = Product.query.get(product_id)
            if not product:
                return error_response(f"Product {product_id} not found", 404)

            if product.stock < quantity:
                return error_response(
                    f"Not enough stock for product {product.name}",
                    400,
                    product_id=product.id,
                    available=product.stock
                )

            total_amount += product.price * quantity
            items_to_add.append({
                "product": product,
                "quantity": quantity
            })

        # Create order and items
        new_order = Order(
            user_id=user_id,
            total_amount=total_amount,
            status="pending",
            estimated_delivery=datetime.utcnow() + timedelta(days=3)
        )
        db.session.add(new_order)
        db.session.flush()  # Get order ID before adding items

        for item in items_to_add:
            product = item["product"]
            quantity = item["quantity"]

            db.session.add(OrderItem(
                order_id=new_order.id,
                product_id=product.id,
                quantity=quantity,
                price_at_purchase=product.price
            ))

            product.stock -= quantity  # Reduce stock

        db.session.commit()

        return jsonify({
            "message": "Order created successfully",
            "order": new_order.to_dict(),
            "estimated_delivery": new_order.estimated_delivery.isoformat()
        }), 201

    except Exception as e:
        db.session.rollback()
        return error_response(f"An unexpected error occurred: {str(e)}", 500)
# processing

# Get Order Details
@order_bp.route("/<int:order_id>", methods=["GET"])
def get_order(order_id):
    try:
        order = Order.query.get_or_404(order_id)
        return jsonify(order.to_dict()), 200
    except Exception as e:
        return error_response(str(e), 404)

# Get User's Orders
@order_bp.route("/user/<int:user_id>", methods=["GET"])
def get_user_orders(user_id):
    try:
        page = request.args.get('page', 1, type=int)
        per_page = 10  # Items per page
        
        orders = Order.query.filter_by(user_id=user_id)\
            .order_by(Order.created_at.desc())\
            .paginate(page=page, per_page=per_page, error_out=False)
        
        # Convert items to dict including nested relationships
        orders_data = []
        for order in orders.items:
            order_data = order.to_dict()
            order_data['order_items'] = [item.to_dict() for item in order.order_items]
            order_data['delivery_updates'] = [update.to_dict() for update in order.delivery_updates]
            orders_data.append(order_data)
        
        return jsonify(orders_data), 200
    except Exception as e:
        return error_response(str(e), 500)
    
# Update Order Status
@order_bp.route("/<int:order_id>/status", methods=["PATCH"])
@jwt_required()
def update_order_status(order_id):
    data = request.get_json()
    if "status" not in data:
        return error_response("Status field is required", 400)
    
    try:
        order = Order.query.get_or_404(order_id)
        valid_statuses = ["pending", "processing", "shipped", "delivered", "cancelled", "returned"]
        
        if data["status"] not in valid_statuses:
            return error_response(
                "Invalid status",
                400,
                valid_statuses=valid_statuses
            )
        
        if data["status"] in ["shipped", "delivered"] and order.status != data["status"]:
            delivery_update = DeliveryUpdate(
                order_id=order.id,
                status=data["status"],
                notes=data.get("notes", ""),
                updated_by=get_jwt_identity()
            )
            db.session.add(delivery_update)
        
        order.status = data["status"]
        db.session.commit()
        
        return jsonify({
            "message": "Order status updated",
            "order": order.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), 500)

# !payment status
# Update Payment Status (Admin only)
@order_bp.route("/<int:order_id>/payment-status", methods=["PATCH"])
@jwt_required()
def update_payment_status(order_id):
    data = request.get_json()
    if "payment_status" not in data:
        return error_response("Payment status field is required", 400)
    
    try:
        order = Order.query.get_or_404(order_id)
        valid_statuses = ["pending", "paid", "failed", "refunded"]
        
        if data["payment_status"] not in valid_statuses:
            return error_response(
                "Invalid payment status",
                400,
                valid_statuses=valid_statuses
            )
        
        order.payment_status = data["payment_status"]
        db.session.commit()
        
        return jsonify({
            "message": "Payment status updated",
            "order": order.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), 500)


# Cancel Order
@order_bp.route("/<int:order_id>/cancel", methods=["POST"])
def cancel_order(order_id):
    try:
        order = Order.query.get_or_404(order_id)
        
        if order.status not in ["pending", "processing"]:
            return error_response(
                "Order cannot be cancelled at this stage",
                400,
                current_status=order.status
            )
        
        order.status = "cancelled"
        
        for item in order.order_items:
            product = Product.query.get(item.product_id)
            product.stock += item.quantity
        
        db.session.commit()
        
        return jsonify({
            "message": "Order cancelled successfully",
            "order": order.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), 500)

# Get All Orders (with filtering)
@order_bp.route("/", methods=["GET"])
@jwt_required()
def get_all_orders():
    try:
        query = Order.query.options(
            db.joinedload(Order.user),
            db.joinedload(Order.order_items).joinedload(OrderItem.product),
            db.joinedload(Order.delivery_updates)
        )
        
        # Apply filters
        if order_id := request.args.get("id"):
            query = query.filter(Order.id == order_id)
        if status := request.args.get("status"):
            query = query.filter_by(status=status)
        if payment_status := request.args.get("payment_status"):
            query = query.filter_by(payment_status=payment_status)
        if user_id := request.args.get("user_id"):
            query = query.filter_by(user_id=user_id)
        if date_from := request.args.get("date_from"):
            query = query.filter(Order.created_at >= date_from)
        if date_to := request.args.get("date_to"):
            query = query.filter(Order.created_at <= date_to)
        
        orders = query.order_by(Order.created_at.desc()).all()
        
        orders_data = []
        for order in orders:
            if order is None:
                continue
                
            order_data = {
                "id": order.id,
                "user_id": order.user_id,
                "user": {
                    "id": order.user.id if order.user else None,
                    "name": getattr(order.user, 'name', 'Unknown Customer')
                },
                "total_amount": float(order.total_amount) if order.total_amount else 0.0,
                "status": order.status,
                "payment_status": order.payment_status,
                "created_at": order.created_at.isoformat() if order.created_at else None,
                "updated_at": order.updated_at.isoformat() if order.updated_at else None,
                "order_items_count": len(order.order_items)
            }
            
            orders_data.append(order_data)
        
        return jsonify(orders_data), 200
        
    except Exception as e:
        return error_response(str(e), 500)


@order_bp.route("/my-orders", methods=["GET"])
@jwt_required()
def get_current_user_orders():
    try:
        current_user_id = get_jwt_identity()
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)

        # Query orders with eager loading of related items
        orders = Order.query.filter_by(user_id=current_user_id)\
            .order_by(Order.created_at.desc())\
            .paginate(page=page, per_page=per_page, error_out=False)

        orders_data = []
        for order in orders.items:
            order_data = {
                "id": order.id,
                "status": order.status,
                "payment_status": order.payment_status,
                "total_amount": float(order.total_amount) if order.total_amount else 0.0,
                "created_at": order.created_at.isoformat() if order.created_at else None,
                "estimated_delivery": order.estimated_delivery.isoformat() if order.estimated_delivery else None,
                "order_items": [],
                "delivery_updates": []
            }

            # Add order items with optimized Cloudinary URLs
            for item in order.order_items:
                if item.product:
                    # Generate different image sizes for different use cases
                    image_url = get_cloudinary_url(
                        item.product.primary_image,
                        width=600,
                        height=600
                    )
                    thumbnail_url = get_cloudinary_url(
                        item.product.primary_image,
                        width=150,
                        height=150,
                        crop='thumb'
                    )

                    order_data["order_items"].append({
                        "id": item.id,
                        "product_id": item.product_id,
                        "product_name": item.product.name,
                        "sku": item.product.sku if item.product.sku else "N/A",
                        "quantity": item.quantity,
                        "price_at_purchase": float(item.price_at_purchase) if item.price_at_purchase else 0.0,
                        "image": image_url,  # Medium size for detail view
                        "thumbnail": thumbnail_url  # Small size for lists
                    })
                else:
                    # Handle case where product might be deleted
                    order_data["order_items"].append({
                        "id": item.id,
                        "product_id": item.product_id,
                        "product_name": "Unknown Product",
                        "sku": "N/A",
                        "quantity": item.quantity,
                        "price_at_purchase": float(item.price_at_purchase) if item.price_at_purchase else 0.0,
                        "image": None,
                        "thumbnail": None
                    })

            # Add delivery updates
            for update in order.delivery_updates:
                order_data["delivery_updates"].append({
                    "status": update.status,
                    "notes": update.notes,
                    "updated_at": update.updated_at.isoformat() if update.updated_at else None
                })

            orders_data.append(order_data)

        return jsonify({
            "orders": orders_data,
            "pagination": {
                "total": orders.total,
                "pages": orders.pages,
                "current_page": orders.page,
                "per_page": orders.per_page,
                "has_next": orders.has_next,
                "has_prev": orders.has_prev
            }
        }), 200

    except Exception as e:
        return error_response(str(e), 500)
    
    # admin enpoint to fetch each user orders
@order_bp.route("/admin-orders", methods=["GET"])
@jwt_required()
def get_all_orders_for_admin():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status', None)
        payment_status = request.args.get('payment_status', None)
        search = request.args.get('search', None)

        # Base query
        query = Order.query.options(
            db.joinedload(Order.user),
            db.joinedload(Order.order_items).joinedload(OrderItem.product),
            db.joinedload(Order.delivery_updates)
        )

        # Apply filters
        if status and status != 'all':
            query = query.filter(Order.status == status)
        if payment_status and payment_status != 'all':
            query = query.filter(Order.payment_status == payment_status)
        if search:
            query = query.join(Order.user).filter(
                db.or_(
                    Order.id.ilike(f'%{search}%'),
                    Order.user.name.ilike(f'%{search}%'),
                    Order.user.email.ilike(f'%{search}%'),
                    Order.user.phone.ilike(f'%{search}%')

                )
            )

        orders = query.order_by(Order.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)

        orders_data = []
        for order in orders.items:
            user = order.user if order.user else None
            
            order_data = {
                "id": order.id,
                "status": order.status,
                "payment_status": order.payment_status,
                "total_amount": float(order.total_amount) if order.total_amount else 0.0,
                "created_at": order.created_at.isoformat() if order.created_at else None,
                "updated_at": order.updated_at.isoformat() if order.updated_at else None,
                "estimated_delivery": order.estimated_delivery.isoformat() if order.estimated_delivery else None,
                "user": {
                    "id": user.id if user else None,
                    "name": getattr(user, 'name', 'Unknown Customer'),
                    "email": getattr(user, 'email', None),
                    "phone": getattr(user, 'phone', None),
                    "address" : getattr(user, 'address', None)

                },
                "order_items": [],
                "delivery_updates": []
            }

            # Add order items
            for item in order.order_items:
                order_data["order_items"].append({
                    "id": item.id,
                    "product_id": item.product_id,
                    "product_name": item.product.name if item.product else "Unknown Product",
                    "sku": item.product.sku if item.product else "N/A",
                    "quantity": item.quantity,
                    "price_at_purchase": float(item.price_at_purchase) if item.price_at_purchase else 0.0,
                    "image": item.product.primary_image if item.product and item.product.primary_image else None
                })

            # Add delivery updates
            for update in order.delivery_updates:
                order_data["delivery_updates"].append({
                    "status": update.status,
                    "notes": update.notes,
                    "updated_at": update.updated_at.isoformat() if update.updated_at else None
                })

            orders_data.append(order_data)

        return jsonify({
            "orders": orders_data,
            "pagination": {
                "total": orders.total,
                "pages": orders.pages,
                "current_page": orders.page,
                "per_page": orders.per_page,
                "has_next": orders.has_next,
                "has_prev": orders.has_prev
            }
        }), 200

    except Exception as e:
        return error_response(str(e), 500)
    

@order_bp.route("/<int:order_id>", methods=["GET"])
def get_single_order(order_id):
    try:
        # Get order with all related data
        order = Order.query.options(
            db.joinedload(Order.user),
            db.joinedload(Order.order_items).joinedload(OrderItem.product),
            db.joinedload(Order.delivery_updates)
        ).get(order_id)
        
        if not order:
            return jsonify({"error": "Order not found"}), 404
            
        # Build response
        order_data = {
            "id": order.id,
            "user_id": order.user_id,
            "user": {
                "id": order.user.id if order.user else None,
                "name": getattr(order.user, 'name', 'Unknown Customer'),
                "email": getattr(order.user, 'email', None),
                "phone": getattr(order.user, 'phone', None)

            },
            "total_amount": float(order.total_amount) if order.total_amount else 0.0,
            "status": order.status,
            "created_at": order.created_at.isoformat() if order.created_at else None,
            "estimated_delivery": order.estimated_delivery.isoformat() if order.estimated_delivery else None,
            "order_items": [{
                "id": item.id,
                "product_id": item.product_id,
                "product_name": item.product.name if item.product else "Unknown Product",
                "quantity": item.quantity,
                "price_at_purchase": float(item.price_at_purchase) if item.price_at_purchase else 0.0
            } for item in order.order_items],
            "delivery_updates": [{
                "status": update.status,
                "timestamp": update.updated_at.isoformat() if update.updated_at else None,
                "notes": update.notes
            } for update in order.delivery_updates]
        }
        
        return jsonify(order_data), 200
        
    except Exception as e:
        return error_response(str(e), 500)  