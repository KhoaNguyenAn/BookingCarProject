"use strict"

const SUVFARE = 3.50;
const VANFARE = 6.00;
const MINIBUSFARE = 10.00;
const DISTANCEFARE = 1.622;
const FLAGRATE = 4.20;
const COMMERCIALLEVY = 1.10;
let tempCost;
let distanceCost;
function calculate()
{
    let finalCost = 0;
    let Newtrip = new trip();
    let data = getData(BOOKING_DATA_KEY);
    Newtrip.fromData(data);

    let distanceTravelled = Newtrip.distance;
    let vehicleSelected = Newtrip.taxi;
    let timeSelected = Newtrip.time;

    //Distance fare
    distanceCost = distanceTravelled * DISTANCEFARE;

    //Check vehicle type
    if (vehicleSelected == "sedan") {
        tempCost = COMMERCIALLEVY + distanceCost;
    }
    else if (vehicleSelected == "suv") {
        tempCost = COMMERCIALLEVY + distanceCost + SUVFARE;
    }
    else if (vehicleSelected == "van") {
        tempCost = COMMERCIALLEVY + distanceCost + VANFARE;
    }
    else{
        tempCost = COMMERCIALLEVY + distanceCost + MINIBUSFARE;
    }

    // Night levy: 20% surcharge between 5pm and 9am
    if (timeSelected >= "17:00" || timeSelected<="09:00" ) {
        finalCost = tempCost *1.2;
    }
    else{
        finalCost = tempCost;
    }
    Newtrip._fare = finalCost;
    updateStorage(BOOKING_DATA_KEY,Newtrip);
    //Display
    document.getElementById("fare").innerHTML = `<p> ${finalCost} </p>`;
    document.getElementById("vehicle").innerHTML = `<p> ${vehicleSelected} </p>`;
    document.getElementById("totalDist").innerHTML = `<p> ${distanceTravelled} </p>`;
}








