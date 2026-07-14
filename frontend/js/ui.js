function updateStats(detections){

  let potholes = 0;
  let cracks = 0;
  let debris = 0;

  detections.forEach(d => {

    const label = d.label.toLowerCase();

    if(label === "pothole"){
      potholes++;
    }

    else if(
      label.includes("crack") ||
      label === "alligator" ||
      label === "ravelling" ||
      label === "rutting" ||
      label === "striping"
    ){
      cracks++;
    }

  });

  document.getElementById("potholeCount").innerText = potholes;
  document.getElementById("crackCount").innerText = cracks;
  document.getElementById("debrisCount").innerText = debris;

  const total = potholes + cracks;

  const status = document.getElementById("roadStatus");

  if(total === 0){

    status.className = "road-status safe";
    status.innerHTML = "🟢 ROAD SAFE";

  }
  else if(total <= 3){

    status.className = "road-status moderate";
    status.innerHTML = "🟡 MODERATE DAMAGE";

  }
  else{

    status.className = "road-status danger";
    status.innerHTML = "🔴 DANGEROUS ROAD";

  }

}