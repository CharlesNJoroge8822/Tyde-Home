from flask import request, Blueprint, jsonify
from models import Payment, db, Product, Order

payment_bp = Blueprint("payment_bp", __name__)

#! Create Payment
@payment_bp.route("/payments", methods=["POST"])
def create_payment():
    data = request.get_json()
    order_id = data.get("order_id")
    phone_number = data.get("phone_number")

    if not order_id or not phone_number:
        return jsonify({"error": "order_id and phone_number are required"}), 400

    # ✅ Check if the order exists
    order = Order.query.get(order_id)
    if not order:
        return jsonify({"error": "Order not found"}), 404

    # ✅ Fetch the order amount
    amount = order.total_amount  # Assuming your Order model has a `total_amount` field

    # ✅ Create the payment with the fetched amount
    new_payment = Payment(order_id=order_id, phone_number=phone_number, status="Pending")

    db.session.add(new_payment)
    db.session.commit()

    return jsonify({
        "message": "Payment created successfully",
        "payment": new_payment.to_dict()
    }), 201



#! Get Payment by ID
@payment_bp.route("/payments/<int:payment_id>", methods=["GET"])
def get_payment(payment_id):
    payment = Payment.query.get(payment_id)

    if not payment:
        return jsonify({"error": "Payment not found"}), 404

    return jsonify(payment.to_dict()), 200


#! Update Payment Status
@payment_bp.route("/payments/<int:payment_id>", methods=["PATCH"])
def update_payment_status(payment_id):
    payment = Payment.query.get(payment_id)

    if not payment:
        return jsonify({"error": "Payment not found"}), 404

    data = request.get_json()
    status = data.get("status")

    if status:
        payment.status = status
        db.session.commit()

    return jsonify({"message": "Payment status updated successfully", "payment": payment.to_dict()}), 200


#! Delete Payment
@payment_bp.route("/payments/<int:payment_id>", methods=["DELETE"])
def delete_a_payment(payment_id):
    payment = Payment.query.get(payment_id)
    
    if payment is None:
        return jsonify({"error": "Payment with ID could not be resolved"}), 404
    
    db.session.delete(payment)
    db.session.commit()
    
    return jsonify({"message": "Payment Deleted Successfully"}), 200
