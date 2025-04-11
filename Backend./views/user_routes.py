from flask import request, Blueprint, jsonify
from models import User, db

user_bp = Blueprint("user_bp", __name__)

# Get All Users
@user_bp.route("/", methods=["GET"])
def get_all_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users]), 200

# Get Specific User
@user_bp.route("/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict()), 200

# Update User
@user_bp.route("/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()

    if 'name' in data:
        user.name = data['name']
    if 'email' in data:
        if User.query.filter(User.email == data['email'], User.id != user_id).first():
            return jsonify({"error": "Email already in use"}), 400
        user.email = data['email']
    if 'phone' in data:
        user.phone = data['phone']
    if 'address' in data:
        user.address = data['address']
    if 'is_admin' in data:
        user.is_admin = data['is_admin']
    
    db.session.commit()
    return jsonify({"message": "User updated", "user": user.to_dict()}), 200

# Delete User
@user_bp.route("/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully"}), 200
