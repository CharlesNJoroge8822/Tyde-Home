from flask import Blueprint, request, jsonify
from models import db, Message, User  # Assuming you have a User model
from datetime import datetime

message_bp = Blueprint('messages', __name__)

@message_bp.route('/messages', methods=['POST'])
def create_message():
    data = request.get_json()
    
    required_fields = ['sender_id', 'recipient_id', 'content']
    if not all(field in data for field in required_fields):
        return jsonify({"error": f"Missing required fields: {', '.join(required_fields)}"}), 400
    
    try:
        message = Message(
            sender_id=data['sender_id'],
            recipient_id=data['recipient_id'],
            content=data['content'],
            is_read=False  # Add read status
        )
        
        db.session.add(message)
        db.session.commit()
        
        return jsonify(message.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@message_bp.route('/conversation/<int:user1_id>/<int:user2_id>', methods=['GET'])
def get_conversation(user1_id, user2_id):
    try:
        # Mark messages as read when fetched
        Message.query.filter(
            (Message.sender_id == user2_id) & 
            (Message.recipient_id == user1_id) &
            (Message.is_read == False)
        ).update({'is_read': True})
        db.session.commit()
        
        messages = Message.query.filter(
            ((Message.sender_id == user1_id) & 
             (Message.recipient_id == user2_id)) |
            ((Message.sender_id == user2_id) & 
             (Message.recipient_id == user1_id))
        ).order_by(Message.created_at.asc()).all()
        
        # Include sender names in response
        messages_data = []
        for msg in messages:
            sender = User.query.get(msg.sender_id)
            msg_data = msg.to_dict()
            msg_data['sender_name'] = sender.name
            messages_data.append(msg_data)
        
        return jsonify(messages_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@message_bp.route('/conversations/<int:user_id>', methods=['GET'])
def get_user_conversations(user_id):
    try:
        # Get all messages involving this user
        user_messages = Message.query.filter(
            (Message.sender_id == user_id) | 
            (Message.recipient_id == user_id)
        ).all()
        
        # Organize conversations by the other user
        conversations_map = {}
        
        for msg in user_messages:
            # Determine the other user in the conversation
            other_user_id = msg.recipient_id if msg.sender_id == user_id else msg.sender_id
            
            # Initialize conversation if not exists
            if other_user_id not in conversations_map:
                other_user = User.query.get(other_user_id)
                conversations_map[other_user_id] = {
                    'other_user_id': other_user_id,
                    'other_user_name': other_user.name,
                    'last_message': '',
                    'last_message_time': '',
                    'unread_count': 0,
                    'messages': []
                }
            
            # Add message to conversation
            conversations_map[other_user_id]['messages'].append(msg)
        
        # Process each conversation to get required data
        result = []
        for conv in conversations_map.values():
            # Sort messages by date (newest first)
            conv['messages'].sort(key=lambda x: x.created_at, reverse=True)
            
            # Get last message
            if conv['messages']:
                last_msg = conv['messages'][0]
                conv['last_message'] = last_msg.content
                conv['last_message_time'] = last_msg.created_at.isoformat()
            
            # Count unread messages
            conv['unread_count'] = sum(
                1 for msg in conv['messages'] 
                if msg.sender_id != user_id and not msg.is_read
            )
            
            # Add to result without the full messages list
            result.append({
                'other_user_id': conv['other_user_id'],
                'other_user_name': conv['other_user_name'],
                'last_message': conv['last_message'],
                'last_message_time': conv['last_message_time'],
                'unread_count': conv['unread_count']
            })
        
        # Sort conversations by last message time (newest first)
        result.sort(key=lambda x: x['last_message_time'], reverse=True)
        
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@message_bp.route('/messages/<int:message_id>/read', methods=['PUT'])
def mark_as_read(message_id):
    try:
        message = Message.query.get_or_404(message_id)
        message.is_read = True
        db.session.commit()
        return jsonify({"message": "Message marked as read"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@message_bp.route('/messages/<int:message_id>', methods=['DELETE'])
def delete_message(message_id):
    try:
        message = Message.query.get_or_404(message_id)
        db.session.delete(message)
        db.session.commit()
        return jsonify({"message": "Message deleted successfully"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    

@message_bp.route('/get_admin_id', methods=['GET'])
def get_admin_id():
    try:
        # Find the first admin user (adjust query as needed)
        admin = User.query.filter_by(is_admin=True).first()
        if not admin:
            return jsonify({"error": "No admin user found"}), 404
            
        return jsonify({"admin_id": admin.id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500