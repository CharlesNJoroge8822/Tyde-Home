from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import validates
from app import db
from datetime import datetime, timedelta

# Association table for wishlist
class Wishlist(db.Model):
    __tablename__ = "wishlist"
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("product.id"), nullable=False)
    
    user = db.relationship("User", back_populates="wishlist_items")
    product = db.relationship("Product", back_populates="wishlisted_by")
    
    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "product_id": self.product_id
        }

class User(db.Model):
    __tablename__ = "user"
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(20), nullable=True)  # Added for delivery contact
    address = db.Column(db.String(255), nullable=True)  # Added for delivery
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    orders = db.relationship("Order", back_populates="user", lazy="dynamic")
    wishlist_items = db.relationship("Wishlist", back_populates="user", lazy="dynamic")
    messages_sent = db.relationship("Message", foreign_keys="Message.sender_id", back_populates="sender")
    messages_received = db.relationship("Message", foreign_keys="Message.recipient_id", back_populates="recipient")

    @validates("password")
    def validate_password(self, key, password):
        if len(password) < 8:
            raise ValueError("Password must be at least 8 characters")
        return password
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "address": self.address,
            "is_admin": self.is_admin,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class ProductImage(db.Model):
    __tablename__ = "product_images"
    
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    image_url = db.Column(db.String(255), nullable=False)
    is_primary = db.Column(db.Boolean, default=False)
    position = db.Column(db.Integer)
    
    product = db.relationship("Product", back_populates="images")
    
    def to_dict(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "image_url": self.image_url,
            "is_primary": self.is_primary,
            "position": self.position
        }

class Product(db.Model):
    __tablename__ = "product"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, default=0)
    sku = db.Column(db.String(50), unique=True, nullable=True)
    category = db.Column(db.String(50), nullable=True)  # Added for related products
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    images = db.relationship("ProductImage", back_populates="product", 
                           cascade="all, delete-orphan", order_by="ProductImage.position")
    wishlisted_by = db.relationship("Wishlist", back_populates="product")
    order_items = db.relationship("OrderItem", back_populates="product")

    @property
    def primary_image(self):
        primary = next((img for img in self.images if img.is_primary), None)
        return primary.image_url if primary else (self.images[0].image_url if self.images else None)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "stock": self.stock,
            "sku": self.sku,
            "category": self.category,
            "images": [image.to_dict() for image in self.images],
            "primary_image": self.primary_image,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class OrderItem(db.Model):
    __tablename__ = "order_items"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("order.id"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("product.id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price_at_purchase = db.Column(db.Float, nullable=False)  # Snapshot of price
    
    order = db.relationship("Order", back_populates="order_items")
    product = db.relationship("Product", back_populates="order_items")

    def to_dict(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "product_id": self.product_id,
            "quantity": self.quantity,
            "price_at_purchase": self.price_at_purchase,
            "product": self.product.to_dict()
        }
class Order(db.Model):
    __tablename__ = "order"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default="pending")  # pending, processing, shipped, delivered, cancelled, returned
    payment_status = db.Column(db.String(50), default="pending")  # pending, paid, failed, refunded
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    estimated_delivery = db.Column(db.DateTime, default=lambda: datetime.utcnow() + timedelta(days=3))
    
    user = db.relationship("User", back_populates="orders")
    order_items = db.relationship("OrderItem", back_populates="order", lazy=True)
    delivery_updates = db.relationship("DeliveryUpdate", back_populates="order", lazy=True)
    deliveries = db.relationship("Delivery", back_populates="order", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "total_amount": self.total_amount,
            "status": self.status,
            "payment_status": self.payment_status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "estimated_delivery": self.estimated_delivery.isoformat() if self.estimated_delivery else None,
            "order_items": [item.to_dict() for item in self.order_items],
            "delivery_updates": [update.to_dict() for update in self.delivery_updates],
            "user": self.user.to_dict() if self.user else None
        }

class DeliveryUpdate(db.Model):
    __tablename__ = "delivery_updates"
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("order.id"), nullable=False)
    status = db.Column(db.String(50), nullable=False)  # Processing, Shipped, Out for Delivery, Delivered
    notes = db.Column(db.String(255), nullable=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_by = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)  # Admin who updated
    
    order = db.relationship("Order", back_populates="delivery_updates")
    admin = db.relationship("User")

    def to_dict(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "status": self.status,
            "notes": self.notes,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "updated_by": self.admin.name if self.admin else None
        }

class Message(db.Model):
    __tablename__ = "messages"
    
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    recipient_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_read = db.Column(db.Boolean, default=False)
    
    # Relationships
    sender = db.relationship("User", foreign_keys=[sender_id], back_populates="messages_sent")
    recipient = db.relationship("User", foreign_keys=[recipient_id], back_populates="messages_received")

    def to_dict(self):
        return {
            "id": self.id,
            "sender_id": self.sender_id,
            "recipient_id": self.recipient_id,
            "content": self.content,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "is_read": self.is_read,
            "sender_name": self.sender.name if self.sender else None,
            "recipient_name": self.recipient.name if self.recipient else None
        }

class Delivery(db.Model):
    __tablename__ = "deliveries"
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("order.id"), nullable=False)  # Fixed to match Order's __tablename__
    delivery_status = db.Column(db.String(50), nullable=False, default="processing")
    estimated_delivery = db.Column(db.DateTime, nullable=True)
    actual_delivery = db.Column(db.DateTime, nullable=True)
    carrier = db.Column(db.String(100), nullable=True)
    tracking_number = db.Column(db.String(100), unique=True, nullable=True)
    tracking_url = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship with Order (corrected)
    order = db.relationship("Order", back_populates="deliveries")  # Add this

    def to_dict(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "delivery_status": self.delivery_status,
            "estimated_delivery": self.estimated_delivery.isoformat() if self.estimated_delivery else None,
            "actual_delivery": self.actual_delivery.isoformat() if self.actual_delivery else None,
            "carrier": self.carrier,
            "tracking_number": self.tracking_number,
            "tracking_url": self.tracking_url,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }


class Ad(db.Model):
    __tablename__ = 'ads'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    image_url = db.Column(db.String(255), nullable=False)
    position = db.Column(db.String(50), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    start_date = db.Column(db.DateTime, default=datetime.utcnow)
    end_date = db.Column(db.DateTime, nullable=False)
    click_count = db.Column(db.Integer, default=0)
    impression_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    product = db.relationship('Product', backref='ads')
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'product_id': self.product_id,
            'image_url': f"http://127.0.0.1:5000{self.image_url}" if self.image_url else None,
            'position': self.position,
            'is_active': self.is_active,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'click_count': self.click_count,
            'impression_count': self.impression_count,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'product': self.product.to_dict() if self.product else None
        }