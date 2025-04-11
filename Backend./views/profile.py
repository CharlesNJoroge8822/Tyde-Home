from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from datetime import datetime

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///shop.db"
app.config["JWT_SECRET_KEY"] = "your_secret_key"


# GET User Profile
@app.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    return user_schema.jsonify(user)

# UPDATE User Profile
@app.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.json
    user.phone = data.get("phone", user.phone)
    user.address = data.get("address", user.address)

    db.session.commit()
    return jsonify({"message": "Profile updated successfully", "user": user_schema.dump(user)})

if __name__ == "__main__":
    app.run(debug=True)
