import cv2
from PIL import Image


def extract_frames(video_path: str, num_frames: int = 10) -> list:
    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    if total_frames <= 0:
        cap.release()
        return []

    if total_frames < num_frames:
        num_frames = total_frames

    indices = [int(i * (total_frames - 1) / (num_frames - 1)) for i in range(num_frames)] if num_frames > 1 else [0]

    frames = []
    for idx in indices:
        cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
        ret, frame = cap.read()
        if ret:
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            frames.append(Image.fromarray(rgb))

    cap.release()
    return frames


def aggregate_results(frame_results: list) -> dict:
    real_scores = [r["confidence"] for r in frame_results if r["label"] == "Real"]
    fake_scores = [r["confidence"] for r in frame_results if r["label"] == "Fake"]

    avg_real = sum(real_scores) / len(real_scores) if real_scores else 0.0
    avg_fake = sum(fake_scores) / len(fake_scores) if fake_scores else 0.0

    if avg_real >= avg_fake:
        label = "Real"
        confidence = avg_real
    else:
        label = "Fake"
        confidence = avg_fake

    return {
        "label": label,
        "confidence": round(confidence, 4),
        "frames_analyzed": len(frame_results),
    }
