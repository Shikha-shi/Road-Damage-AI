const liveVideo = document.getElementById("liveVideo");
const aiCanvas = document.getElementById("aiCanvas");
const ctx = aiCanvas.getContext("2d");

let isMirrored = false;
let lastFrameTime = performance.now();

/* ==========================
   FPS COUNTER
========================== */

function updateFPS() {

    const now = performance.now();

    const fps = Math.round(
        1000 / (now - lastFrameTime)
    );

    lastFrameTime = now;

    const fpsElement =
        document.getElementById("fpsCounter");

    if (fpsElement) {
        fpsElement.innerText = fps;
    }
}

/* ==========================
   CAMERA MIRROR
========================== */

function toggleMirror() {

    isMirrored = !isMirrored;

    const transform =
        isMirrored ? "scaleX(-1)" : "none";

    liveVideo.style.transform = transform;
    aiCanvas.style.transform = transform;
}

/* ==========================
   START CAMERA
========================== */

navigator.mediaDevices.getUserMedia({
    video: {
        facingMode: "environment"
    }
})
.then(stream => {

    liveVideo.srcObject = stream;

    liveVideo.onloadedmetadata = () => {

        aiCanvas.width = liveVideo.videoWidth;
        aiCanvas.height = liveVideo.videoHeight;

        startDetection();
    };
})
.catch(err => {

    console.error(
        "Camera Error:",
        err
    );

    alert(
        "Unable to access camera."
    );
});

/* ==========================
   YOLO DETECTION LOOP
========================== */

async function startDetection() {

    const tmpCanvas =
        document.createElement("canvas");

    const tmpCtx =
        tmpCanvas.getContext("2d");

    while (true) {

        if (
            liveVideo.videoWidth === 0 ||
            liveVideo.videoHeight === 0
        ) {

            await new Promise(
                resolve =>
                    setTimeout(resolve, 100)
            );

            continue;
        }

        tmpCanvas.width =
            liveVideo.videoWidth;

        tmpCanvas.height =
            liveVideo.videoHeight;

        tmpCtx.drawImage(
            liveVideo,
            0,
            0
        );

        const blob =
            await new Promise(resolve =>
                tmpCanvas.toBlob(
                    resolve,
                    "image/jpeg",
                    0.8
                )
            );

        if (!blob) continue;

        const fd = new FormData();

        fd.append(
            "file",
            blob,
            "frame.jpg"
        );

        try {

            document.getElementById(
                "loadingBox"
            ).style.display = "block";

            const res = await fetch(
                "http://127.0.0.1:8000/detect/image",
                {
                    method: "POST",
                    body: fd
                }
            );

            const data =
                await res.json();

            updateFPS();

            ctx.clearRect(
                0,
                0,
                aiCanvas.width,
                aiCanvas.height
            );

            if (
                data.detections &&
                data.detections.length > 0
            ) {

                drawBoxes(
                    ctx,
                    data.detections
                );

                updateStats(
                    data.detections
                );

                liveInfo.innerHTML =
                    formatDetectionInfo(
                        data.detections
                    );
            }
            else {

                liveInfo.innerHTML =
                    "No defects detected.";

                updateStats([]);
            }

            document.getElementById(
                "loadingBox"
            ).style.display = "none";

        }
        catch (err) {

            console.error(
                "Backend Error:",
                err
            );

            document.getElementById(
                "loadingBox"
            ).style.display = "none";
        }

        await new Promise(
            resolve =>
                setTimeout(resolve, 250)
        );
    }
}