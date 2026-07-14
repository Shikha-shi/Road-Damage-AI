from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import numpy as np
import cv2

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = YOLO(
    "../training/runs/detect/road_damage_model/weights/best.pt"
)

@app.post("/detect/image")
async def detect_image(
    file: UploadFile = File(...)
):
    contents = await file.read()

    npimg = np.frombuffer(
        contents,
        np.uint8
    )

    img = cv2.imdecode(
        npimg,
        cv2.IMREAD_COLOR
    )

   # cv2.imwrite("debug_received.jpg", img)

    results = model(img,conf=0.05)

    # Debug output
    print("Detections found:")
    for r in results:
        print("Boxes:", len(r.boxes))
    detections = []

    for r in results:
        for box in r.boxes:

            x1, y1, x2, y2 = box.xyxy[0]

            conf = float(box.conf[0])

            cls = int(box.cls[0])

            label = model.names[cls]

            detections.append({
                "x1": int(x1),
                "y1": int(y1),
                "x2": int(x2),
                "y2": int(y2),
                "label": label,
                "confidence": conf
            })

    return {
        "detections": detections
    }