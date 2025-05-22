// ADULTI
function plusFcn() {
    const span = document.getElementById("nr");
    let value = parseInt(span.textContent);
    span.textContent = value + 1;
}

function minusFcn() {
    const span = document.getElementById("nr");
    let value = parseInt(span.textContent);
    if (value > 0) {
        span.textContent = value - 1;
    }
}

// COPII
function plusChildren() {
    const span = document.getElementById("nrChildren");
    let value = parseInt(span.textContent);
    span.textContent = value + 1;
}

function minusChildren() {
    const span = document.getElementById("nrChildren");
    let value = parseInt(span.textContent);
    if (value > 0) {
        span.textContent = value - 1;
    }
}

// CAMERE
function plusRooms() {
    const span = document.getElementById("nrRooms");
    let value = parseInt(span.textContent);
    span.textContent = value + 1;
}

function minusRooms() {
    const span = document.getElementById("nrRooms");
    let value = parseInt(span.textContent);
    if (value > 1) { // minim 1 cameră
        span.textContent = value - 1;
    }
}
