# Road Damage Detection AI 🚧

An AI-based system that detects **potholes and different types of road damage** using YOLOv8 and displays the results through a web dashboard.

## Features

* 🕳️ Pothole and crack detection
* 📷 Image upload & analysis
* 🎥 Live camera detection
* 📦 Bounding boxes & confidence scores
* 📊 Road damage statistics

## Tech Stack

* **AI:** Python, YOLOv8, OpenCV, PyTorch
* **Backend:** FastAPI, Uvicorn
* **Frontend:** HTML, CSS, JavaScript

## Workflow

```text
Image/Camera → Frontend → FastAPI → YOLOv8 → Detection Results → Dashboard
```

## Road Damage Classes

Pothole, Alligator Crack, Edge Cracking, Lateral Crack, Longitudinal Crack, Ravelling, Rutting, Striping.

## Run Backend

```bash
cd backend
source .venv/bin/activate
uvicorn main:app --reload
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

## Project Goal

To provide an automated and real-time solution for **detecting, analyzing, and visualizing road damage** using computer vision.
