from google.cloud import vision
def annotate(image_path):
    client = vision.ImageAnnotatorClient()
    print("Annotating image")
