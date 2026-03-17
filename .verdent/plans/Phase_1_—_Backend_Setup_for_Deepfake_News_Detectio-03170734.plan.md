## Objective

Set up the backend scaffolding: FastAPI app with a health check endpoint, dependency file, temp upload folder, gitignore, and an empty frontend placeholder.

---

## Steps

### Step 1 — Create `backend/main.py`

- **File:** `C:\Users\dkuma\Desktop\Atharva Project\backend\main.py`
- Create a FastAPI application instance
- Add a single `GET /health` route returning `{"status": "ok"}`

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
def health_check():
    return {"status": "ok"}
```

### Step 2 — Create `backend/requirements.txt`

- **File:** `C:\Users\dkuma\Desktop\Atharva Project\backend\requirements.txt`
- Contents (one package per line):
  - `fastapi`
  - `uvicorn`
  - `python-multipart`
  - `Pillow`
  - `opencv-python`
  - `transformers`
  - `torch`
  - `torchvision`

### Step 3 — Create empty `backend/temp_uploads/` folder

- **File:** `C:\Users\dkuma\Desktop\Atharva Project\backend\temp_uploads\.gitkeep`
- Create a `.gitkeep` file inside `temp_uploads/` so Git tracks the empty directory

### Step 4 — Create `.gitignore` at project root

- **File:** `C:\Users\dkuma\Desktop\Atharva Project\.gitignore`
- Add `backend/temp_uploads/*` with an exception for `.gitkeep`:
  ```
  backend/temp_uploads/*
  !backend/temp_uploads/.gitkeep
  ```
- Also include standard Python ignores (`__pycache__/`, `*.pyc`, `.env`, `venv/`) and Node ignores (`node_modules/`) since later phases will add a frontend

### Step 5 — Create empty `frontend/` folder placeholder

- **File:** `C:\Users\dkuma\Desktop\Atharva Project\frontend\.gitkeep`
- Create a `.gitkeep` so the empty directory is tracked

---

## Files Created (5 total)

| # | File | Purpose |
|---|------|---------|
| 1 | `backend/main.py` | FastAPI app with `GET /health` |
| 2 | `backend/requirements.txt` | Python dependencies |
| 3 | `backend/temp_uploads/.gitkeep` | Preserves empty temp folder in Git |
| 4 | `.gitignore` | Excludes temp uploads + standard ignores |
| 5 | `frontend/.gitkeep` | Empty frontend placeholder |

---

## Verification

| Check | How |
|-------|-----|
| Files exist | Confirm all 5 files are created in the correct locations |
| Health endpoint | Run `uvicorn main:app --reload` inside `backend/`, then `GET http://localhost:8000/health` returns `{"status":"ok"}` |
| Gitignore works | `git status` should not show `temp_uploads/` contents (except `.gitkeep`) |

---

## Step-to-Target Traceability

| Step | Targets | Verification |
|------|---------|--------------|
| 1 | `backend/main.py` | Health endpoint returns `{"status":"ok"}` |
| 2 | `backend/requirements.txt` | File contains all 8 packages |
| 3 | `backend/temp_uploads/.gitkeep` | Directory exists and is tracked |
| 4 | `.gitignore` | Temp upload contents excluded from Git |
| 5 | `frontend/.gitkeep` | Directory exists and is tracked |
