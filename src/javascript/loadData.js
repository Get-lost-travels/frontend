import { destinationData } from "./destinationData.js";

//window.addEventListener("DOMContentLoaded", function () {
    document.getElementById("tour-title").textContent = destinationData[0].title;
   document.getElementById("tour-motto").textContent = destinationData[0].motto;
    document.getElementById("tour-image").src = destinationData[0].image;
    document.getElementById("tour-description").textContent = destinationData[0].description;
    document.getElementById("tour-duration").textContent = destinationData[0].duration;
    document.getElementById("tour-languages").textContent = destinationData[0].languages.join(", ");
    document.getElementById("tour-price-adult").textContent = `Adult: ${destinationData[0].prices.adult} lei`;
    document.getElementById("tour-price-child").textContent = `Child: ${destinationData[0].prices.child} lei`;
//});