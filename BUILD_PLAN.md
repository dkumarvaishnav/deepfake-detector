# Deepfake News Detection — Build Plan

> Stack decided, scoped for local demo first, deployment-ready structure.

---

## Stack Decisions

| Layer | Choice | Reason |
|---|---|---|
| Backend | FastAPI | Async, faster than Flask, auto API docs |
| Frontend | React + Vite | Lightweight, fast dev server |
| AI Model | `dima806/deepfake_vs_real_image_detection` (HuggingFace) | EfficientNet-based, strong on image deepfake classification |
| Video Processing | OpenCV | Frame extraction |
| Communication | REST API | Simple, clean |
| Deployment (later) | Render (backend) + Vercel (frontend) | Free tier, easy CI/CD |

---

## Project Folder Structure

```
deepfake-detector/
├── backend/
│   ├── main.py                  # FastAPI app + all routes
│   ├── model.py                 # HuggingFace model loading + inference
│   ├── video_processor.py       # Frame extraction + result aggregation
│   ├── requirements.txt
│   └── temp_uploads/            # Temp storage, auto-cleared after each request
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Root component, manages state transitions
│   │   └── components/
│   │       ├── UploadSection.jsx
│   │       ├── ProcessingScreen.jsx
│   │       └── ResultCard.jsx
│   ├── package.json
│   └── vite.config.js           # Dev proxy to backend
├── prd.md                       # Client PRD (do not modify)
├── BUILD_PLAN.md                # This file
└── README.md                    # Local run instructions
```

---

## Phase-by-Phase Build Plan

---

### Phase 1 — Backend Setup

**Goal:** Get FastAPI running with a health check.

**Cursor Prompt:**
> Create a FastAPI backend in the `backend/` folder. Set up `main.py` with a basic health check route `GET /health` that returns `{ "status": "ok" }`. Create a `requirements.txt` with the following packages: `fastapi`, `uvicorn`, `python-multipart`, `Pillow`, `opencv-python`, `transformers`, `torch`, `torchvision`. Create an empty `temp_uploads/` folder inside `backend/` and add it to `.gitignore`.

**Verify:** Run `uvicorn main:app --reload` inside `backend/`. Hit `http://localhost:8000/health` — should return `{ "status": "ok" }`.

---

### Phase 2 — Model Integration

**Goal:** Load the HuggingFace deepfake detection model and expose a prediction function.

**Cursor Prompt:**
> In `backend/model.py`, load the HuggingFace model `dima806/deepfake_vs_real_image_detection` using the `transformers` pipeline with task `image-classification`. Write a function `predict_image(image: PIL.Image) -> dict` that returns `{ "label": "Real" or "Fake", "confidence": float }`. The model should be loaded once at module level (not per request). Add a print statement `"Model loaded successfully"` after loading so we know it's ready.

**Note:** First run will download ~100MB of model weights. This is cached locally after that.

---

### Phase 3 — Video Frame Extraction

**Goal:** Extract key frames from video and aggregate frame-level predictions into one result.

**Cursor Prompt:**
> In `backend/video_processor.py`, write two functions using OpenCV:
> 1. `extract_frames(video_path: str, num_frames: int = 10) -> list` — evenly samples `num_frames` frames across the video duration and returns them as PIL Images.
> 2. `aggregate_results(frame_results: list) -> dict` — takes a list of `{ "label": str, "confidence": float }` dicts, averages the confidence scores, and returns a single final result with the majority label and average confidence.

---

### Phase 4 — API Endpoints

**Goal:** Wire up upload + analysis endpoints for both image and video.

**Cursor Prompt:**
> In `backend/main.py`, create two POST endpoints:
>
> - `POST /analyze/image` — accepts an uploaded image file (JPG/PNG), saves it to `temp_uploads/`, runs `predict_image()` from `model.py`, deletes the temp file, returns the result.
> - `POST /analyze/video` — accepts an uploaded video file (MP4/MOV), saves it to `temp_uploads/`, runs `extract_frames()` then `predict_image()` on each frame, runs `aggregate_results()`, deletes the temp file, returns the final result.
>
> Add validation:
> - Allowed image types: JPG, PNG. Max size: 10MB.
> - Allowed video types: MP4, MOV. Max size: 100MB.
>
> Add CORS middleware to allow all requests from `http://localhost:5173`.

---

### Phase 5 — React Frontend

**Goal:** Build the full user-facing interface with three screens.

**Cursor Prompt:**
> Create a React + Vite project in the `frontend/` folder. Build the following:
>
> **`UploadSection.jsx`**
> - Drag and drop area + click to browse
> - Accepts JPG, PNG, MP4, MOV only
> - Shows selected filename after upload
> - "Analyze Media" button that triggers analysis
>
> **`ProcessingScreen.jsx`**
> - Animated loading spinner or pulse
> - Text: "Analyzing media... This may take a moment."
>
> **`ResultCard.jsx`**
> - Shows ✅ Real or 🚨 Deepfake Detected as the headline
> - Confidence score displayed as both a percentage number and a visual progress bar
> - Small disclaimer at the bottom: "This result is AI-generated and may not be 100% accurate."
> - "Analyze Another" button that resets back to the upload screen
>
> **`App.jsx`**
> - Manages three states: `upload`, `processing`, `result`
> - On submit, determines if file is image or video, calls the correct backend endpoint (`/analyze/image` or `/analyze/video`)
> - Passes result data to `ResultCard`

---

### Phase 6 — Integration & Local Run Setup

**Goal:** Make sure everything runs together cleanly with one command each.

**Cursor Prompt:**
> Do the following:
> 1. In `frontend/vite.config.js`, add a dev server proxy so any request to `/analyze` is forwarded to `http://localhost:8000`.
> 2. Create a `README.md` in the project root with these exact run instructions:
>
> ```
> ## Running Locally
>
> ### Backend
> cd backend
> pip install -r requirements.txt
> uvicorn main:app --reload
>
> ### Frontend
> cd frontend
> npm install
> npm run dev
>
> Open http://localhost:5173 in your browser.
> ```

---

## Important Notes for Development

- **Model first-load is slow** — HuggingFace downloads weights on first run (~100MB). Cached after that. Don't panic if startup takes time.
- **Model expects faces** — if an image has no visible face, the result may be unreliable. Acceptable at demo stage.
- **Temp files** — always deleted after each request in the backend. Nothing is stored permanently.
- **CORS** — only `localhost:5173` is whitelisted. If you change the frontend port, update the backend CORS config too.

---

## Deployment Plan (When Ready)

| Service | What goes there | Cost |
|---|---|---|
| Render | FastAPI backend | Free tier |
| Vercel | React frontend | Free tier |

When you're ready to deploy, the codebase needs zero restructuring — it's already set up correctly.

---

## Phases Checklist

- [ ] Phase 1 — Backend running, health check passing
- [ ] Phase 2 — Model loading, `predict_image()` working
- [ ] Phase 3 — Frame extraction + aggregation working
- [ ] Phase 4 — Both API endpoints tested (Postman or curl)
- [ ] Phase 5 — Frontend screens built and state transitions working
- [ ] Phase 6 — Full local integration working end to end
