# Deepfake News Detection Platform

> An AI-powered application designed to analyze media and detect deepfake content in images and videos.

This project utilizes a FastAPI backend running a PyTorch-based HuggingFace model (`dima806/deepfake_vs_real_image_detection` or equivalent variant) to classify media as 'Real' or 'Fake' alongside a confidence score. Video analysis is handled by extracting and processing frames using OpenCV. The interactive user interface is built with React and Vite.

## Quick Start (Windows)

If you are on Windows, you can launch both the backend and frontend simultaneously using the provided batch script:

1. Double-click `start.bat` in the root directory.
2. The script will open two terminal windows (one for the backend, one for the frontend).
3. After a few seconds, it will automatically open your browser to [http://localhost:5173](http://localhost:5173).

## Manual Running Instructions

### Backend
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:5173](http://localhost:5173) in your browser.
