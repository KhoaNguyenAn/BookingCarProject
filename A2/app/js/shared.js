"use strict"
// keys for local storage
const BOOKING_DATA_KEY = "bookingData";
const ALL_BOOKING_KEY = "allbookingData";
// route class
class route {
    constructor(start, end, fomarttedName) {
        this._start = { latitude: start.latitude, longitude: start.longitude };
        this._end = { latitude: end.latitude, longitude: end.longitude };
        this._fomarttedName = fomarttedName;
    }
    get start() {
        return this._start;
    }
    get end() {
        return this._end;
    }
    getDistance() {
        let R = 6371; // metres
        let delta1 = this._start.latitude * Math.PI / 180; // φ, λ in radians
        let delta2 = this._end.latitude * Math.PI / 180;
        let deltaDifference = (this._end.latitude - this._start.latitude) * Math.PI / 180; // difference between φ, λ
        let lambdaDiff = (this._end.longitude - this._start.longitude) * Math.PI / 180;

        let a = Math.sin(deltaDifference / 2) * Math.sin(deltaDifference / 2) +
            Math.cos(delta1) * Math.cos(delta2) *
            Math.sin(lambdaDiff / 2) * Math.sin(lambdaDiff / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        let d = R * c; // in metres
        return d;
    }
}
class trip {
    constructor(time, taxi, date) {
        this._queue = [];
        this._taxi = taxi;
        this._time = time;
        this._date = date;
        this._distance = 0;
        this._fare = 0;
    }
    get distance() {
        return this._distance;
    }
    get taxi() {
        return this._taxi;
    }
    get time() {
        return this._time;
    }
    get date() {
        return this._date;
    }
    get fare()
    {
        return this._fare;
    }
    addRoute(route) {
        let data = getData(BOOKING_DATA_KEY);
        if (data != null) this.fromData(data);
        this._queue.push(route);
        this._distance += route.getDistance();
        updateStorage(BOOKING_DATA_KEY, this);
    }
    changeTaxi(taxi) {
        this._taxi = taxi
    }
    removeDestination(Index) {
        this._queue.splice(Index, 1);
    }
    getData(data) {
        this._start = data._start;
        this._stops = data._stops;
        this._end = data._end;
        this._distance = data._distance;
        this._taxi = data._taxi;
        this._time = data._time;
    }
    fromData(trip) {
        this._distance = trip._distance;
        this._taxi = trip._taxi;
        this._time = trip._time;
        this._date = trip._date;
        this._fare = trip._fare;
        for (let i = 0; i < trip._queue.length; i++) {
            let Newroute = new route(trip._queue[i]._start, trip._queue[i]._end, trip._queue[i]._fomarttedName);
            this._queue.push(Newroute);
        }
    }
}

class allBookings {
    constructor(date) {
        this._arrayTrip = [];
    }
    addTrip(trip) {
        let data = getData(ALL_BOOKING_KEY);
        if (data != null) this.fromData(data);
        this._arrayTrip.push(trip);
        updateStorage(ALL_BOOKING_KEY, this);
        // localStorage.removeItem(BOOKING_DATA_KEY);
    }
    fromData(allBookings) {
        for (let i = 0; i < allBookings._arrayTrip.length; i++) {
            let oneBooking = new trip();
            let data = getData(BOOKING_DATA_KEY);
            oneBooking.fromData(data);
            this._arrayTrip.push(oneBooking);
        }
    }
}
function sortBooking() 
{
    let todayDate = new Date().toLocaleDateString();
    //let output = new allBookings();
    let output = getData(ALL_BOOKING_KEY);
    //if (data != null) output.fromData(data);
    let outputSchedule = "";
    let outputpast = "";
    for (let i = 0; i < output._arrayTrip.length; i++)
    {
        outputSchedule+= "<tr>";
        let sizeTrip = output._arrayTrip[i]._queue.length - 1;
        if (todayDate <= output._arrayTrip[i]._date) 
            {
                outputSchedule +=
                    `
                    <td>${output._arrayTrip[i]._date}</td>
                    <td>${output._arrayTrip[i]._queue[0]._fomarttedName}</td>
                    <td>${output._arrayTrip[i]._queue[sizeTrip]._fomarttedName}</td>
                    <td>${output._arrayTrip[i]._queue.length}</td>
                    <td>${output._arrayTrip[i]._distance}</td>
                    <td>${output._arrayTrip[i]._fare}</td>
                `
            } else {
                outputpast +=
                    `
                    <td>${output._arrayTrip[i]._date}</td>
                    <td>${output._arrayTrip[i]._queue[0]._fomarttedName}</td>
                    <td>${output._arrayTrip[i]._queue[sizeTrip]._fomarttedName}</td>
                    <td>${output._arrayTrip[i]._distance}</td>
                    <td>${output._arrayTrip[i]._fare}</td>
                    <td>${i}</td>
                    `
            }
        outputSchedule+= "</tr>";
    }
    //console.log(outputSchedule);
    if (outputSchedule != "")document.getElementById("scheduledBooking").innerHTML = outputSchedule;
    if (outputpast != "")document.getElementById("pastBooking").innerHTML = outputpast;
}

function checkDataLocal(key) {
    if (typeof (Storage) !== "undefined") {
        if (localStorage.getItem(key) !== null) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        console.log("localStorage is not supported by current browser.");
        return false;
    }
}
function updateStorage(key, data) {
    let JSONdata = JSON.stringify(data);
    localStorage.setItem(key, JSONdata);
}
function getData(key) {
    let data = localStorage.getItem(key);
    try {
        data = JSON.parse(data);
    }
    catch
    {

    }
    finally {
        return data;
    }
}

function deleteBooking() {
    if (window.confirm("Do you want to delete this booking ?") === true) {
        location.reload();
    }
}

function displayCurrent(data) {
    let output = "";
    let Newtrip = new trip();
    let data1 = getData(BOOKING_DATA_KEY);
    Newtrip.fromData(data1);
    output += `<p> Time: ${Newtrip.time} <br> Date: ${Newtrip.date} <br> Taxi type: ${Newtrip.taxi} </p> `;
    output += `<ul class="mdl-list"> `;
    for (let i = 0; i < data.length; i++) {
        output +=
            `<li class="mdl-list__item mdl-list__item--three-line">
            <span class="mdl-list__item-primary-content">
                <span>${i + 1}:${data[i]._fomarttedName}</span>
            </span>
                 </li>`;
    }
    output += `</ul>`;
    document.getElementById("queueContent").innerHTML = output;
}

function home() {
    window.location.href = "index.html";
}
function confirmTrip()
{
    if (window.confirm("Do you want to make this booking ?") === true) 
    {
        let allBook = new allBookings();
        let data = getData(ALL_BOOKING_KEY);
        if (data != null) allBook.fromData(data);
        let Newtrip = new trip();
        let data1 = getData(BOOKING_DATA_KEY);
        Newtrip.fromData(data1);
        allBook.addTrip(Newtrip);
        updateStorage(ALL_BOOKING_KEY,allBook);
        window.location.href = "view.html";
    }
    else
    {
        location.reload();
    }
}

function showView()
{
    let Newtrip = new trip();
    let data = getData(BOOKING_DATA_KEY);
    Newtrip.fromData(data);
    let sizeTrip = Newtrip._queue.length - 1;
    document.getElementById("bookingDate").innerHTML = `${Newtrip.date} `;
    document.getElementById("pickup").innerHTML = `${Newtrip._queue[0]._fomarttedName}`;
    document.getElementById("finalDest").innerHTML = `${Newtrip._queue[sizeTrip]._fomarttedName}`;
    document.getElementById("numStops").innerHTML = `${Newtrip._queue.length}`;
    document.getElementById("totalDist").innerHTML = `${Newtrip._distance}`;
    document.getElementById("fare").innerHTML = `${Newtrip._fare}`;
    document.getElementById("taxiType").innerHTML = `${Newtrip.date}`;
}
