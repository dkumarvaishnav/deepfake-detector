from transformers import ViTForImageClassification, ViTImageProcessor
from PIL import Image
import torch

processor = ViTImageProcessor.from_pretrained("prithivMLmods/Deep-Fake-Detector-v2-Model")
model = ViTForImageClassification.from_pretrained("prithivMLmods/Deep-Fake-Detector-v2-Model")
print("Model loaded successfully")


def predict_image(image: Image.Image) -> dict:
    inputs = processor(images=image, return_tensors="pt")
    with torch.no_grad():
        outputs = model(**inputs)
    logits = outputs.logits
    predicted_class = torch.argmax(logits, dim=1).item()
    label = model.config.id2label[predicted_class]
    confidence = torch.softmax(logits, dim=1).max().item()
    normalized_label = "Fake" if "deepfake" in label.lower() or "fake" in label.lower() else "Real"
    return {"label": normalized_label, "confidence": round(confidence, 4)}
