const liveInfo = document.getElementById("liveInfo");

function drawBoxes(ctx, detections){

  detections.forEach(det => {
    if(det.confidence < 0.6) return;

    ctx.strokeStyle = "#00ff88";
    ctx.lineWidth = 3;

    ctx.strokeRect(
      det.x1,
      det.y1,
      det.x2 - det.x1,
      det.y2 - det.y1
    );

    ctx.fillStyle = "#00ff88";

    ctx.fillRect(
      det.x1,
      det.y1 - 30,
      140,
      30
    );

    ctx.fillStyle = "#000";

    ctx.font = "14px Poppins";

    ctx.fillText(
      `${det.label} ${(det.confidence * 100).toFixed(1)}%`,
      det.x1 + 5,
      det.y1 - 10
    );

  });

}

function formatDetectionInfo(detections){


  if(detections.length === 0){
    return "No defects detected.";
  }

  let html = "";

  detections.forEach(d => {

    html += `
      <div style="margin-bottom:10px;">
        <b>${d.label}</b>
        <br>
        Confidence:
        ${(d.confidence * 100).toFixed(1)}%
      </div>
    `;

  });

  return html;

}
async function detectImage() {

  const fileInput = document.getElementById("imageUpload");

  if (!fileInput.files.length) {
    alert("Please select an image.");
    return;
  }

  // Stop and hide live camera
  const liveVideo = document.getElementById("liveVideo");
  const aiCanvas = document.getElementById("aiCanvas");

  if (liveVideo.srcObject) {
    liveVideo.srcObject.getTracks().forEach(track => track.stop());
  }

  liveVideo.style.display = "none";
  aiCanvas.style.display = "none";
  document.getElementById("resultImage").style.display = "block";

  const file = fileInput.files[0];

  // Show uploaded image
  const resultImage =
    document.getElementById("resultImage");

  resultImage.src = URL.createObjectURL(file);
  resultImage.style.display = "block";

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    "http://127.0.0.1:8000/detect/image",
    {
      method: "POST",
      body: formData
    }
  );

  const data = await response.json();

  console.log(data);

  liveInfo.innerHTML =
    formatDetectionInfo(data.detections);

  updateStats(data.detections);
}
    
