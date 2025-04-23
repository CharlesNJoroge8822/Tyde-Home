from flask import Blueprint, request, jsonify
from models import db, Message, User
from datetime import datetime
from sqlalchemy import and_, or_
from flask_mail import Message as MailMessage
from extensions import mail
from flask_jwt_extended import jwt_required, get_jwt_identity

message_bp = Blueprint('messages', __name__)


def send_email_notification(recipient_email, sender_name, message_content):
    try:
        msg = MailMessage(
            subject=f"New message from {sender_name}",
            recipients=[recipient_email],
            body=f"You have received a new message:\n\n{message_content}\n\nPlease log in to your account to respond.",
            sender="noreply@yourdomain.com"
        )
        mail.send(msg)
    except Exception as e:
        print(f"Failed to send email notification: {str(e)}")


# -------------------- CREATE MESSAGE --------------------
@message_bp.route('/messages', methods=['POST'])
@jwt_required()
def create_message():
    """Create a new message between user and admin"""
    data = request.get_json()
    required_fields = ['recipient_id', 'content']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        current_user_id = get_jwt_identity()
        recipient_id = data['recipient_id']

        sender = User.query.get(current_user_id)
        recipient = User.query.get(recipient_id)

        if not sender or not recipient:
            return jsonify({"error": "Invalid user ID(s)"}), 400

        if not (sender.is_admin or recipient.is_admin):
            return jsonify({"error": "Messages must involve an admin"}), 400

        message = Message(
            sender_id=current_user_id,
            recipient_id=recipient_id,
            content=data['content'],
            is_read=False,
            created_at=datetime.utcnow()
        )

        db.session.add(message)
        db.session.commit()

        return jsonify({
            "id": message.id,
            "sender_id": sender.id,
            "sender_name": sender.name,
            "recipient_id": recipient.id,
            "recipient_name": recipient.name,
            "content": message.content,
            "is_read": message.is_read,
            "created_at": message.created_at.isoformat(),
            "is_admin": sender.is_admin
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to create message: {str(e)}"}), 500


# -------------------- GET ALL ADMINS --------------------
@message_bp.route('/messages/admins', methods=['GET'])
@jwt_required()
def get_admins():
    """Get all admin users for messaging"""
    try:
        admins = User.query.filter_by(is_admin=True).all()
        return jsonify([{
            "id": admin.id,
            "name": admin.name,
            "email": admin.email
        } for admin in admins])
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------- USER CONVERSATIONS OVERVIEW --------------------
@message_bp.route('/messages/conversations', methods=['GET'])
@jwt_required()
def get_user_conversations():
    """Get all conversations for current user with last message and unread count"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        admins = User.query.filter_by(is_admin=True).all()
        conversations = []

        for admin in admins:
            last_msg = Message.query.filter(
                or_(
                    and_(Message.sender_id == current_user_id, Message.recipient_id == admin.id),
                    and_(Message.sender_id == admin.id, Message.recipient_id == current_user_id)
                )
            ).order_by(Message.created_at.desc()).first()

            if last_msg:
                unread_count = Message.query.filter(
                    and_(
                        Message.sender_id == admin.id,
                        Message.recipient_id == current_user_id,
                        Message.is_read == False
                    )
                ).count()

                conversations.append({
                    "admin_id": admin.id,
                    "admin_name": admin.name,
                    "last_message": last_msg.content,
                    "last_message_time": last_msg.created_at.isoformat(),
                    "unread_count": unread_count
                })

        return jsonify(sorted(conversations, key=lambda x: x["last_message_time"], reverse=True))

    except Exception as e:
        return jsonify({"error": f"Failed to fetch conversations: {str(e)}"}), 500


# -------------------- USER FULL CONVO WITH ADMIN --------------------
@message_bp.route('/messages/conversation/<int:admin_id>', methods=['GET'])
@jwt_required()
def get_conversation(admin_id):
    """Get conversation between current user and specific admin"""
    try:
        current_user_id = get_jwt_identity()
        admin = User.query.get(admin_id)

        if not admin or not admin.is_admin:
            return jsonify({"error": "Admin not found"}), 404

        messages = Message.query.filter(
            or_(
                and_(Message.sender_id == current_user_id, Message.recipient_id == admin_id),
                and_(Message.sender_id == admin_id, Message.recipient_id == current_user_id)
            )
        ).order_by(Message.created_at.asc()).all()

        # Mark received messages as read
        Message.query.filter(
            and_(
                Message.sender_id == admin_id,
                Message.recipient_id == current_user_id,
                Message.is_read == False
            )
        ).update({'is_read': True})
        db.session.commit()

        return jsonify([{
            "id": msg.id,
            "sender_id": msg.sender_id,
            "sender_name": User.query.get(msg.sender_id).name,
            "content": msg.content,
            "is_read": msg.is_read,
            "created_at": msg.created_at.isoformat(),
            "is_admin": msg.sender_id == admin_id
        } for msg in messages])

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to fetch conversation: {str(e)}"}), 500


# -------------------- ADMIN: VIEW ALL CONVERSATIONS --------------------
@message_bp.route('/admin/conversations', methods=['GET'])
@jwt_required()
def get_admin_conversations():
    """Get all conversations for admins with users"""
    try:
        admin_ids = [admin.id for admin in User.query.filter_by(is_admin=True).all()]
        user_ids = db.session.query(Message.sender_id).filter(
            ~Message.sender_id.in_(admin_ids)
        ).distinct().union(
            db.session.query(Message.recipient_id).filter(
                ~Message.recipient_id.in_(admin_ids)
            ).distinct()
        ).all()

        conversations = []
        for (user_id,) in user_ids:
            user = User.query.get(user_id)
            if not user:
                continue

            last_msg = Message.query.filter(
                or_(
                    and_(Message.sender_id == user_id, Message.recipient_id.in_(admin_ids)),
                    and_(Message.sender_id.in_(admin_ids), Message.recipient_id == user_id)
                )
            ).order_by(Message.created_at.desc()).first()

            unread_count = Message.query.filter(
                and_(
                    Message.sender_id == user_id,
                    Message.recipient_id.in_(admin_ids),
                    Message.is_read == False
                )
            ).count()

            if last_msg:
                conversations.append({
                    "user_id": user.id,
                    "user_name": user.name,
                    "user_email": user.email,
                    "last_message": last_msg.content,
                    "last_message_time": last_msg.created_at.isoformat(),
                    "unread_count": unread_count,
                    "admin_id": last_msg.sender_id if last_msg.sender_id in admin_ids else last_msg.recipient_id
                })

        conversations.sort(key=lambda x: x["last_message_time"], reverse=True)
        return jsonify(conversations)

    except Exception as e:
        return jsonify({"error": f"Failed to fetch admin conversations: {str(e)}"}), 500


# -------------------- MARK MESSAGE AS READ --------------------
@message_bp.route('/messages/<int:message_id>/read', methods=['PUT'])
@jwt_required()
def mark_as_read(message_id):
    """Mark a message as read"""
    try:
        message = Message.query.get_or_404(message_id)
        message.is_read = True
        db.session.commit()
        return jsonify({"success": True})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# -------------------- DELETE MESSAGE --------------------
@message_bp.route('/messages/<int:message_id>', methods=['DELETE'])
@jwt_required()
def delete_message(message_id):
    """Delete a message"""
    try:
        message = Message.query.get_or_404(message_id)
        db.session.delete(message)
        db.session.commit()
        return jsonify({"success": True})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# -------------------- SEND EMAIL + STORE MESSAGE --------------------
@message_bp.route('/send-email', methods=['POST'])
def send_email():
    """Handle email and scroll submissions"""
    data = request.get_json()

    try:
        sender_email = data.get('email')
        sender_name = data.get('name')
        subject = data.get('subject', 'Formal Scroll Inquiry' if data.get('is_scroll') else 'Website Inquiry')
        message_content = data.get('message')

        admin = User.query.filter_by(is_admin=True).first()
        if admin:
            msg = MailMessage(
                subject=f"{subject} from {sender_name}",
                recipients=[admin.email],
                body=f"From: {sender_name} <{sender_email}>\n\n{message_content}",
                sender="noreply@yourdomain.com"
            )
            mail.send(msg)

        if 'user_id' in data:
            message = Message(
                sender_id=data['user_id'],
                recipient_id=admin.id,
                content=message_content,
                is_read=False,
                created_at=datetime.utcnow()
            )
            db.session.add(message)
            db.session.commit()

        return jsonify({"success": True}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to send message: {str(e)}"}), 500




@message_bp.route('/messages/admin/conversation/<int:user_id>', methods=['GET'])
@jwt_required()
def get_admin_user_conversation(user_id):
    """Admin gets conversation with a specific user"""
    try:
        current_user_id = get_jwt_identity()
        admin = User.query.get(current_user_id)
        user = User.query.get(user_id)

        if not admin or not admin.is_admin:
            return jsonify({"error": "Only admins can access this endpoint"}), 403
        if not user:
            return jsonify({"error": "User not found"}), 404

        messages = Message.query.filter(
            or_(
                and_(Message.sender_id == current_user_id, Message.recipient_id == user_id),
                and_(Message.sender_id == user_id, Message.recipient_id == current_user_id)
            )
        ).order_by(Message.created_at.asc()).all()

        # Mark messages sent by user to admin as read
        Message.query.filter(
            and_(
                Message.sender_id == user_id,
                Message.recipient_id == current_user_id,
                Message.is_read == False
            )
        ).update({'is_read': True})
        db.session.commit()

        return jsonify([{
            "id": msg.id,
            "sender_id": msg.sender_id,
            "sender_name": User.query.get(msg.sender_id).name,
            "content": msg.content,
            "is_read": msg.is_read,
            "created_at": msg.created_at.isoformat(),
            "is_admin": msg.sender_id == current_user_id
        } for msg in messages])

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to fetch conversation: {str(e)}"}), 500
