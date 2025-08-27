import os
from flask import Flask, request, send_file, redirect, url_for
from PIL import Image
from werkzeug.utils import secure_filename
import uuid

# --- Configuration ---
UPLOAD_FOLDER = "/tmp/image_uploads"  # A temporary folder to store uploads
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

# --- Create the Flask App ---
app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


# --- Helper Function ---
def allowed_file(filename):
    """Checks if the file extension is allowed."""
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# --- Main Route for Uploading ---
@app.route("/upload", methods=["POST"])
def upload_image():
    # 1. Check if a file was sent
    if "image" not in request.files:
        return "No image file found.", 400
    file = request.files["image"]

    # 2. Check if the file is valid
    if file.filename == "":
        return "No selected file.", 400
    if not file or not allowed_file(file.filename):
        return "Invalid file type. Please upload a PNG or JPG.", 400

    # 3. Securely save the original file
    original_filename = secure_filename(file.filename)
    # Use a unique ID to prevent filename conflicts
    unique_id = str(uuid.uuid4())
    temp_input_path = os.path.join(
        app.config["UPLOAD_FOLDER"], f"{unique_id}_{original_filename}"
    )
    file.save(temp_input_path)

    # 4. Process the image with Pillow
    try:
        with Image.open(temp_input_path) as img:
            # Get the raw image data without the EXIF info
            data = list(img.getdata())
            # Create a new image from the raw data
            img_without_exif = Image.new(img.mode, img.size)
            img_without_exif.putdata(data)

            # Save the cleaned image
            base, ext = os.path.splitext(original_filename)
            cleaned_filename = f"{base}_cleaned{ext}"
            temp_output_path = os.path.join(
                app.config["UPLOAD_FOLDER"], f"{unique_id}_{cleaned_filename}"
            )
            img_without_exif.save(temp_output_path)

    except Exception as e:
        # Clean up if something goes wrong
        os.remove(temp_input_path)
        return f"An error occurred during processing: {e}", 500

    # 5. Send the cleaned file for download and then delete both files
    try:
        return send_file(
            temp_output_path, as_attachment=True, download_name=cleaned_filename
        )
    finally:
        # This code runs after the file is sent
        os.remove(temp_input_path)
        os.remove(temp_output_path)


# --- Ensure the upload folder exists ---
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# --- Run the App (for testing) ---
if __name__ == "__main__":
    # This part is for direct testing.
    # In production, a proper WSGI server like Gunicorn will run the app.
    app.run(host="127.0.0.1", port=5000)
