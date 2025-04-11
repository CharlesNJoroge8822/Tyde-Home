from flask import request, Blueprint, jsonify, current_app
from models import Ad, Product, db
from datetime import datetime, timedelta
from werkzeug.utils import secure_filename
import os
import base64

ad_bp = Blueprint("ads", __name__, url_prefix="/ads")

# Constants
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
AD_POSITIONS = ['homepage_banner', 'product_sidebar', 'checkout_footer']

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_IMAGE_EXTENSIONS

# Create Ad
@ad_bp.route("/", methods=["POST"])
def create_ad():
    try:
        # Initialize variables
        data = {}
        files = None
        image_url = None

        # Handle both JSON and form-data
        if request.content_type.startswith('multipart/form-data'):
            data = request.form.to_dict()
            files = request.files
        else:
            data = request.get_json()

        # Validate required fields
        required_fields = ['title', 'product_id', 'position']
        if not all(field in data for field in required_fields):
            return jsonify({"error": f"Missing required fields: {', '.join(required_fields)}"}), 400

        # Validate product exists
        product = Product.query.get(data['product_id'])
        if not product:
            return jsonify({"error": "Product not found"}), 404

        # Validate position
        if data['position'] not in AD_POSITIONS:
            return jsonify({
                "error": "Invalid ad position",
                "valid_positions": AD_POSITIONS
            }), 400

        # Handle image upload - supports file upload, URL, or base64
        if files and 'image_file' in files:
            # Handle file upload
            file = files['image_file']
            if file and allowed_file(file.filename):
                filename = secure_filename(f"ad_{datetime.now().timestamp()}_{file.filename}")
                upload_folder = os.path.join(current_app.root_path, current_app.config['UPLOAD_FOLDER'], 'ads')
                os.makedirs(upload_folder, exist_ok=True)
                filepath = os.path.join(upload_folder, filename)
                file.save(filepath)
                image_url = f"/uploads/ads/{filename}"
        elif 'image_url' in data:
            # Handle URL or base64
            if data['image_url'].startswith('data:image'):
                # Process base64 image
                import base64
                header, encoded = data['image_url'].split(",", 1)
                file_ext = header.split("/")[1].split(";")[0]
                filename = secure_filename(f"ad_{datetime.now().timestamp()}.{file_ext}")
                upload_folder = os.path.join(current_app.root_path, current_app.config['UPLOAD_FOLDER'], 'ads')
                os.makedirs(upload_folder, exist_ok=True)
                filepath = os.path.join(upload_folder, filename)
                
                with open(filepath, "wb") as f:
                    f.write(base64.b64decode(encoded))
                image_url = f"/uploads/ads/{filename}"
            else:
                # Regular URL
                image_url = data['image_url']
        else:
            return jsonify({"error": "Either image_file or image_url is required"}), 400

        # Parse dates
        start_date = datetime.strptime(data.get('start_date'), "%Y-%m-%d") if 'start_date' in data else datetime.utcnow()
        end_date = datetime.strptime(data.get('end_date'), "%Y-%m-%d") if 'end_date' in data else start_date + timedelta(days=30)

        # Create ad
        new_ad = Ad(
            title=data['title'],
            description=data.get('description', ''),
            product_id=data['product_id'],
            image_url=image_url,
            position=data['position'],
            is_active=bool(data.get('is_active', True)),
            start_date=start_date,
            end_date=end_date,
            click_count=0,
            impression_count=0
        )

        db.session.add(new_ad)
        db.session.commit()

        return jsonify({
            "message": "Ad created successfully",
            "ad": new_ad.to_dict(),
            "product": product.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error creating ad: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
# Get All Ads (Admin View - no filters)
@ad_bp.route("/admin", methods=["GET"])
def get_all_ads_admin():
    try:
        ads = Ad.query.order_by(Ad.position).all()
        return jsonify([ad.to_dict() for ad in ads]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get Active Ads (Public View - with date/status filters)
@ad_bp.route("/", methods=["GET"])
def get_active_ads():
    try:
        position = request.args.get('position')
        limit = request.args.get('limit', type=int)
        now = datetime.utcnow()
        
        query = Ad.query.filter(
            Ad.is_active == True,
            Ad.start_date <= now,
            Ad.end_date >= now
        )
        
        if position:
            if position not in AD_POSITIONS:
                return jsonify({
                    "error": "Invalid position",
                    "valid_positions": AD_POSITIONS
                }), 400
            query = query.filter(Ad.position == position)
        
        if limit:
            query = query.limit(limit)
            
        ads = query.order_by(Ad.position).all()
        
        # Increment impression count
        for ad in ads:
            ad.impression_count += 1
        db.session.commit()
        
        return jsonify([ad.to_dict() for ad in ads]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Get Ad Details
@ad_bp.route("/<int:ad_id>", methods=["GET"])
def get_ad(ad_id):
    try:
        ad = Ad.query.get_or_404(ad_id)
        ad.impression_count += 1
        db.session.commit()
        return jsonify(ad.to_dict()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 404

# Update Ad
@ad_bp.route("/<int:ad_id>", methods=["PUT"])
def update_ad(ad_id):
    try:
        ad = Ad.query.get_or_404(ad_id)
        
        # Handle both form-data and JSON requests
        if request.files:
            data = request.form.to_dict()
            files = request.files
        else:
            data = request.get_json()
            files = None

        # Handle image update
        if files and 'image_file' in files:
            file = files['image_file']
            if file and allowed_file(file.filename):
                # Remove old image if exists
                if ad.image_url and ad.image_url.startswith('/uploads/ads/'):
                    try:
                        old_file = os.path.join(current_app.root_path, ad.image_url[1:])
                        if os.path.exists(old_file):
                            os.remove(old_file)
                    except:
                        pass
                
                # Save new image
                filename = secure_filename(f"ad_{datetime.now().timestamp()}_{file.filename}")
                upload_folder = os.path.join(current_app.root_path, current_app.config['UPLOAD_FOLDER'], 'ads')
                os.makedirs(upload_folder, exist_ok=True)
                filepath = os.path.join(upload_folder, filename)
                file.save(filepath)
                ad.image_url = f"/uploads/ads/{filename}"
        elif 'image_url' in data:
            ad.image_url = data['image_url']

        # Update other fields
        if 'title' in data:
            ad.title = data['title']
        if 'description' in data:
            ad.description = data['description']
        if 'position' in data:
            if data['position'] not in AD_POSITIONS:
                return jsonify({
                    "error": "Invalid position",
                    "valid_positions": AD_POSITIONS
                }), 400
            ad.position = data['position']
        if 'is_active' in data:
            is_active_value = data['is_active']
        if isinstance(is_active_value, str):
            ad.is_active = is_active_value.lower() == 'true'
        else:
            ad.is_active = bool(is_active_value)

        if 'start_date' in data:
            ad.start_date = datetime.fromisoformat(data['start_date'])
        if 'end_date' in data:
            ad.end_date = datetime.fromisoformat(data['end_date'])
        if 'product_id' in data:
            Product.query.get_or_404(data['product_id'])
            ad.product_id = data['product_id']

        db.session.commit()
        
        return jsonify({
            "message": "Ad updated successfully",
            "ad": ad.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Record Ad Click
@ad_bp.route("/<int:ad_id>/click", methods=["POST"])
def record_click(ad_id):
    try:
        ad = Ad.query.get_or_404(ad_id)
        ad.click_count += 1
        db.session.commit()
        product = Product.query.get_or_404(ad.product_id)
        return jsonify({
            "message": "Click recorded",
            "redirect_url": f"/products/{product.id}",
            "product": product.to_dict()
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Delete Ad
@ad_bp.route("/<int:ad_id>", methods=["DELETE"])
def delete_ad(ad_id):
    try:
        ad = Ad.query.get_or_404(ad_id)
        
        # Delete associated image file
        if ad.image_url and ad.image_url.startswith('/uploads/ads/'):
            try:
                file_path = os.path.join(current_app.root_path, ad.image_url[1:])
                if os.path.exists(file_path):
                    os.remove(file_path)
            except Exception as e:
                print(f"Error deleting image: {str(e)}")
        
        db.session.delete(ad)
        db.session.commit()
        
        return jsonify({"message": "Ad deleted successfully"}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
    

# !fetch ads to show in items ...
@ad_bp.route('/ads', methods=['GET'])
def get_all_ads():
    try:
        ads = Ad.query.limit(10).all()  # 
        return jsonify([ad.to_dict() for ad in ads])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@ad_bp.route('/random', methods=['GET'])
def get_random_ads():
    try:
        limit = request.args.get('limit', default=3, type=int)
        position = request.args.get('position')
        now = datetime.utcnow()
        
        query = Ad.query.filter(
            Ad.is_active == True,
            Ad.start_date <= now, 
            Ad.end_date >= now
        )
        
        if position:
            if position not in AD_POSITIONS:
                return jsonify({
                    "error": "Invalid position", 
                    "valid_positions": AD_POSITIONS
                }), 400
            query = query.filter(Ad.position == position)
            
        ads = query.order_by(db.func.random()).limit(limit).all()
        
        if not ads:
            return jsonify([]), 200
            
        return jsonify([ad.to_dict() for ad in ads]), 200
        
    except Exception as e:
        current_app.logger.error(f"Error fetching random ads: {str(e)}")
        return jsonify({"error": str(e)}), 500



@ad_bp.route('/ads/<int:ad_id>', methods=['GET'])
def get_single_ad(ad_id):
    try:
        ad = Ad.query.get_or_404(ad_id)
        return jsonify(ad.to_dict())
    except Exception as e:
        return jsonify({"error": str(e)}), 404
