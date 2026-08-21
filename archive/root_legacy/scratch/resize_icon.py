import sys
from PIL import Image

def resize_icon_content(img_path, scale=0.8):
    img = Image.open(img_path).convert("RGBA")
    w, h = img.size
    
    # Calculate new dimensions for the content
    new_w = int(w * scale)
    new_h = int(h * scale)
    
    # Resize the image content
    resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # Create a new transparent canvas of the original size
    canvas = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    
    # Paste the resized image in the center
    offset_x = (w - new_w) // 2
    offset_y = (h - new_h) // 2
    canvas.paste(resized, (offset_x, offset_y), resized)
    
    canvas.save(img_path, "PNG")
    print(f"Successfully scaled content of {img_path} to {scale*100}% and saved.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 resize_icon.py <image_path>")
        sys.exit(1)
    resize_icon_content(sys.argv[1])
