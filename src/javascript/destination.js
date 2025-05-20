function plusFcn(id){
    let nr = document.getElementById(id).innerText;
    if(nr < 3){
        nr++;
        document.getElementById(id).innerText = nr;
    }
    else{
        document.getElementById(id).innerText = "3";
    }
    total();
}

function minusFcn(id){
    let nr = document.getElementById(id).innerText;
    if(nr > 0){
        nr--;
        document.getElementById(id).innerText = nr;
    }
    else{
        document.getElementById(id).innerText = "0";
    }
    total();
}

function total() {
    let sum = 200 * document.getElementById("adult_nr").innerText + 150 * document.getElementById("child_nr").innerText
    document.getElementById("total").value = sum + " lei";
}

// Initialize the map centered on Venice
const map = L.map('map').setView([45.4408, 12.3155], 13); // Venice coords

// Add tile layer (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Create a marker at Venice, not draggable by default
const marker = L.marker([45.4408, 12.3155], { draggable: false }).addTo(map);

// On marker click, make it draggable
marker.on('click', function () {
    const isDraggable = marker.dragging.enabled();
    marker.dragging[isDraggable ? 'disable' : 'enable']();
    marker.bindPopup(isDraggable ? 'Drag disabled' : 'Drag enabled').openPopup();
});

let thumbsUpCount = 0;
let thumbsDownCount = 0;

const thumbsUpBtn = document.getElementById('thumbsUpBtn');
const thumbsDownBtn = document.getElementById('thumbsDownBtn');
const thumbsUpPercent = document.getElementById('thumbsUpPercent');
const thumbsDownPercent = document.getElementById('thumbsDownPercent');
const totalVotes = document.getElementById('totalVotes');

function updatePercentages() {
    const total = thumbsUpCount + thumbsDownCount;
    const upPercent = total === 0 ? 0 : Math.round((thumbsUpCount / total) * 100);
    const downPercent = total === 0 ? 0 : 100 - upPercent;

    thumbsUpPercent.textContent = `${upPercent}%`;
    thumbsDownPercent.textContent = `${downPercent}%`;
    totalVotes.textContent = `Total ratings: ${total}`;
}

thumbsUpBtn.addEventListener('click', () => {
    thumbsUpCount++;
    updatePercentages();
});

thumbsDownBtn.addEventListener('click', () => {
    thumbsDownCount++;
    updatePercentages();
});