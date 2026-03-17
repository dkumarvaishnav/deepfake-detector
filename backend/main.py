import os
import uuid

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

from model import predict_image
from video_processor import aggregate_results, extract_frames

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "temp_uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png"}
ALLOWED_VIDEO_TYPES = {"video/mp4", "video/quicktime"}
MAX_IMAGE_SIZE = 10 * 1024 * 1024
MAX_VIDEO_SIZE = 100 * 1024 * 1024


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/analyze/image")
async def analyze_image(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Only JPG and PNG images are allowed.")

    contents = await file.read()
    if len(contents) > MAX_IMAGE_SIZE:
        raise HTTPException(status_code=400, detail="Image file size exceeds 10MB limit.")

    filename = f"{uuid.uuid4()}{os.path.splitext(file.filename or '')[1]}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    try:
        with open(filepath, "wb") as f:
            f.write(contents)
        image = Image.open(filepath).convert("RGB")
        result = predict_image(image)
    finally:
        if os.path.exists(filepath):
            os.remove(filepath)

    return result


@app.post("/analyze/video")
async def analyze_video(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_VIDEO_TYPES:
        raise HTTPException(status_code=400, detail="Only MP4 and MOV videos are allowed.")

    contents = await file.read()
    if len(contents) > MAX_VIDEO_SIZE:
        raise HTTPException(status_code=400, detail="Video file size exceeds 100MB limit.")

    filename = f"{uuid.uuid4()}{os.path.splitext(file.filename or '')[1]}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    try:
        with open(filepath, "wb") as f:
            f.write(contents)
        frames = extract_frames(filepath)
        frame_results = [predict_image(frame) for frame in frames]
        result = aggregate_results(frame_results)
    finally:
        if os.path.exists(filepath):
            os.remove(filepath)

    return result
