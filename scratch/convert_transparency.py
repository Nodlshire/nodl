import sys
from PIL import Image

def convert_neon_transparency(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    
    new_data = []
    for r, g, b, a in data:
        # Calculate maximum brightness of the RGB channels
        max_val = max(r, g, b)
        
        if max_val == 0:
            new_data.append((0, 0, 0, 0))
        else:
            # Set alpha equal to the maximum brightness
            new_alpha = max_val
            
            # Re-scale RGB to compensate for the alpha channel reduction
            new_r = int(min(255, (r * 255) / new_alpha))
            new_g = int(min(255, (g * 255) / new_alpha))
            new_b = int(min(255, (b * 255) / new_alpha))
            
            new_data.append((new_r, new_g, new_b, new_alpha))
            
    img.putdata(new_data)
    img.save(output_path, "PNG")
    print(f"Successfully processed {input_path} and saved to {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 convert_transparency.py <input_path> <output_path>")
        sys.exit(1)
    convert_neon_transparency(sys.argv[1], sys.argv[2])
