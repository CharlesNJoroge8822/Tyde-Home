from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
import jwt
import datetime
from functools import wraps
from models import User

auth_bp = Blueprint('auth', __name__)
# check
# Configuration (you should move this to config.py)
SECRET_KEY = "your-secret-key-here"  # Change this to a strong secret key in production

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
            
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
            
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
            
        return f(current_user, *args, **kwargs)
        
    return decorated

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['name', 'email', 'password']
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({'message': f'{field} is required!'}), 400
    
    # Check if user already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already registered!'}), 409
    
    try:
        # Create new user
        new_user = User(
            name=data['name'],
            email=data['email'],
            password=generate_password_hash(data['password']),
            phone=data.get('phone'),
            address=data.get('address')
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        # Generate token
        token = jwt.encode({
            'user_id': new_user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30)
        }, SECRET_KEY, algorithm='HS256')

        
        return jsonify({
            'message': 'User registered successfully!',
            'user': new_user.to_dict(),
            'token': token
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Email and password are required!'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Invalid credentials!'}), 401
    
    # Create token
    token_bytes = jwt.encode({
        'sub': user.id,
        'user_id': user.id,
        'is_admin': user.is_admin,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30),
        'type': 'access'
    }, SECRET_KEY, algorithm="HS256")
    
    # Ensure token is string (works for both PyJWT v1.x and v2.x)
    token = token_bytes.decode('utf-8') if isinstance(token_bytes, bytes) else token_bytes
    
    return jsonify({
        'message': 'Logged in successfully!',
        'token': token,  # Now guaranteed to be a string
        'user': {
            'id': user.id,
            'email': user.email,
            'name': user.name,
            'is_admin': user.is_admin
        }
    }), 200
    
    
@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    return jsonify(current_user.to_dict()), 200

@auth_bp.route('/update-profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    data = request.get_json()
    
    try:
        if 'phone' in data:
            current_user.phone = data['phone']
        if 'address' in data:
            current_user.address = data['address']
            
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully!',
            'user': current_user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@auth_bp.route("/verify-token", methods=["GET"])
@jwt_required()
def verify_token():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"valid": False}), 401

    return jsonify({
        "valid": True,
        "user": {
            "email": user.email,
            "is_admin": user.is_admin
        }
    }), 200



@auth_bp.route("/check", methods=["GET"])
@jwt_required()
def check_auth():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    user_data = {
        "email": user.email,
        "name": user.name,
        "is_admin": user.is_admin
    }

    return jsonify({"user": user_data}), 200
