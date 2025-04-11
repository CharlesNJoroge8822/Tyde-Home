from flask import request, Blueprint, jsonify
from models import Delivery, Order, DeliveryUpdate, db
from datetime import datetime, timedelta

# Initialize blueprint with URL prefix
delivery_bp = Blueprint('delivery', __name__, url_prefix='/api/deliveries')

# Helper function for error responses
def error_response(message, status_code):
    return jsonify({"error": message}), status_code


# Create Delivery
@delivery_bp.route("", methods=["POST"])
def create_delivery():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['order_id', 'carrier', 'tracking_number']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields (order_id, carrier, tracking_number)"}), 400

        # Get order with user relationship
        order = Order.query.options(db.joinedload(Order.user)).get(data['order_id'])
        if not order:
            return jsonify({"error": "Order not found"}), 404
            
        # Check if order already has a delivery
        if order.deliveries:
            return jsonify({"error": "Order already has a delivery record"}), 400

        # Parse estimated_delivery if provided
        estimated_delivery = None
        estimated_delivery_str = data.get('estimated_delivery')
        if estimated_delivery_str:
            try:
                estimated_delivery = datetime.strptime(estimated_delivery_str, "%Y-%m-%d").date()
            except ValueError:
                return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400

        # Create delivery
        new_delivery = Delivery(
            order_id=data['order_id'],
            delivery_status="processing",
            carrier=data['carrier'],
            tracking_number=data['tracking_number'],
            tracking_url=data.get('tracking_url', ''),
            estimated_delivery=estimated_delivery
        )

        # Update order status
        order.status = "processing"
        
        # Create status update
        status_update = DeliveryUpdate(
            order_id=data['order_id'],
            status="processing",
            notes=f"Delivery created with {data['carrier']} (Tracking: {data['tracking_number']})",
            updated_by=data.get('admin_id', 1)  # Default admin ID
        )

        db.session.add_all([new_delivery, status_update])
        db.session.commit()

        return jsonify({
            "message": "Delivery created successfully",
            "delivery": new_delivery.to_dict(),
            "order_status": order.status
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@delivery_bp.route("/order/<int:order_id>", methods=["GET"])
def get_delivery_by_order(order_id):
    try:
        order = Order.query.get_or_404(order_id)
        delivery = Delivery.query.filter_by(order_id=order_id).first_or_404()
        
        # Get order status updates (not delivery updates)
        updates = DeliveryUpdate.query.filter_by(order_id=order_id)\
                    .order_by(DeliveryUpdate.updated_at.desc())\
                    .all()
        
        return jsonify({
            "delivery": delivery.to_dict(),
            "status_updates": [u.to_dict() for u in updates],
            "order_status": order.status
        }), 200
        
    except Exception as e:
        return error_response(str(e), 404)


# Get All Deliveries
@delivery_bp.route("", methods=["GET"])
def get_all_deliveries():
    try:
        query = Delivery.query
        
        # Apply filters
        if status := request.args.get('status'):
            query = query.filter_by(delivery_status=status)
        if carrier := request.args.get('carrier'):
            query = query.filter(Delivery.carrier.ilike(f"%{carrier}%"))
        if date_from := request.args.get('date_from'):
            query = query.filter(Delivery.created_at >= date_from)
        if date_to := request.args.get('date_to'):
            query = query.filter(Delivery.created_at <= date_to)
        
        deliveries = query.order_by(Delivery.estimated_delivery.asc()).all()
        return jsonify([d.to_dict() for d in deliveries]), 200
        
    except Exception as e:
        return error_response(str(e), 500)
    
    
    
    

# Update Delivery Status
@delivery_bp.route("/<int:delivery_id>/status", methods=["PUT"])
def update_delivery_status(delivery_id):
    data = request.get_json()
    print("Received data:", data)  # Debug print
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
        
    if 'status' not in data:
        return jsonify({"error": "Status is required"}), 400
        
    try:
        delivery = Delivery.query.get_or_404(delivery_id)
        print("Current delivery status:", delivery.delivery_status)  # Debug print
        
        # Validate status transition
        valid_statuses = ['processing', 'shipped', 'in transit', 'delivered', 'cancelled']
        if data['status'] not in valid_statuses:
            return jsonify({"error": f"Invalid status. Must be one of: {valid_statuses}"}), 400
            
        # Special handling for delivered status
        if data['status'] == 'delivered':
            data['actual_delivery'] = data.get('actual_delivery', datetime.utcnow())
            
        delivery.delivery_status = data['status']
        
        # Create status update record
        update = DeliveryUpdate(
            order_id=delivery.order_id,
            status=data['status'],
            notes=data.get('notes', f"Status changed to {data['status']}"),
            updated_by=data.get('admin_id', 1)
        )
        
        db.session.add(update)
        db.session.commit()
        
        return jsonify({
            "message": "Status updated successfully",
            "delivery": delivery.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print("Error:", str(e))  # Debug print
        return jsonify({"error": str(e)}), 500



@delivery_bp.route("/order/<int:order_id>/status", methods=["GET"])
def get_order_delivery_status(order_id):
    try:
        # Get the order first to verify it exists
        order = Order.query.get_or_404(order_id)
        
        # Get delivery information if it exists
        delivery = Delivery.query.filter_by(order_id=order_id).first()
        
        # Get all status updates for this order
        updates = DeliveryUpdate.query.filter_by(order_id=order_id)\
                    .order_by(DeliveryUpdate.updated_at.asc())\
                    .all()
        
        response_data = {
            "order_id": order.id,
            "order_status": order.status,
            "delivery": delivery.to_dict() if delivery else None,
            "status_updates": [u.to_dict() for u in updates]
        }
        
        return jsonify(response_data), 200
        
    except Exception as e:
        return error_response(str(e), 500)