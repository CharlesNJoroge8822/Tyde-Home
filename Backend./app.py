from flask import Flask, send_from_directory, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os
from datetime import timedelta
from werkzeug.utils import secure_filename
from flask_cors import cross_origin

# Initialize extensions
db = SQLAlchemy()
mail = Mail()
migrate = Migrate()
jwt = JWTManager()
cors = CORS()

def create_app():
    app = Flask(__name__)
    
    # ================
    # App Configuration
    # ================
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-here')
    app.config['DEBUG'] = os.environ.get('DEBUG', 'False') == 'True'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'your-database-uri'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', app.config['SECRET_KEY'])
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
    app.config['JWT_TOKEN_LOCATION'] = ['headers']
    app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
    app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
    app.config['MAIL_USE_TLS'] = os.environ.get('MAIL_USE_TLS', 'True') == 'True'
    app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
    app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(__file__), 'static/uploads')
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB
    app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
    
    # ===================
    # Initialize Extensions
    # ===================
    cors.init_app(app, resources={r"/*": {"origins": "*"}})
    db.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)
    jwt.init_app(app)
    
    # ===================
    # Register Blueprints
    # ===================
    from auths.userAuth import auth_bp
    from views.user_routes import user_bp
    from views.product import product_bp
    from views.order_route import order_bp
    from views.messaging_routes import message_bp
    from views.orderItem_route import order_item_bp
    from views.productImage_route import product_image_bp
    from views.delivery import delivery_bp
    from views.ads_routes import ad_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(product_bp)
    app.register_blueprint(order_bp)
    app.register_blueprint(message_bp)
    app.register_blueprint(order_item_bp)
    app.register_blueprint(product_image_bp)
    app.register_blueprint(delivery_bp)
    app.register_blueprint(ad_bp)
    
    # ===================
    # Helper Functions
    # ===================
    def allowed_file(filename):
        return '.' in filename and \
            filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']
    
    # ===================
    # Routes
    # ===================
    @app.route('/static/uploads/<path:filename>')
    @cross_origin()
    def serve_image(filename):
        safe_filename = secure_filename(os.path.basename(filename))
        return send_from_directory(app.config['UPLOAD_FOLDER'], safe_filename)
    
    @app.route('/routes')
    def list_routes():
        import urllib
        output = []
        for rule in app.url_map.iter_rules():
            methods = ','.join(rule.methods)
            line = urllib.parse.unquote(f"{rule.endpoint:50s} {methods:20s} {rule}")
            output.append(line)
        return jsonify(sorted(output))
    
    # ===================
    # Error Handlers
    # ===================
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({'error': 'Resource not found'}), 404
    
    @app.errorhandler(500)
    def server_error(e):
        return jsonify({'error': 'Internal server error'}), 500
    
    return app

# Create the application
app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # required by Render
    app.run(host="0.0.0.0", port=port)

