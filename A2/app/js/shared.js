"use strict"
// keys for local storage
const BOOKING_DATA_KEY = "bookingData";
// route class
class route 
{
    constructor(start, end, fomarttedName) 
    {
        this._start = {latitude: start.latitude , longitude: start.longitude};
        this._end =   {latitude: end.latitude   , longitude: end.longitude};
        this._fomarttedName = fomarttedName;
    }
    get start() 
    {
        return this._start;
    }
    get end() 
    {
        return this._end;
    }
    getDistance() 
    {
        let R = 6371e3; // metres
        let delta1= this._start.latitude * Math.PI / 180; // φ, λ in radians
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
class trip 
{
    constructor(time, taxi, distance) 
    {
        this._queue = [];
        this._taxi = taxi;
        this._time = time;
        this._distance = distance;
    }
    get distance() 
    {
        return this._distance;
    }
    get taxi() 
    {
        return this._taxi;
    }
    get time() 
    {
        return this._time;
    }
    addRoute(route) 
    {
        let data = getData(BOOKING_DATA_KEY);
        if (data != null) this.fromData(data);
        this._queue.push(route);
        this._distance += route.getDistance();
        updateStorage(BOOKING_DATA_KEY, this);
    }
    changeTaxi(taxi) 
    {
        this._taxi = taxi
    }
    removeDestination(Index) 
    {
        this._queue.splice(Index, 1);
    }
    getData(data) 
    {
        this._start = data._start;
        this._stops = data._stops;
        this._end = data._end;
        this._distance = data._distance;
        this._taxi = data._taxi;
        this._time = data._time;
    }
    fromData (trip) 
    {
        this._distance = trip._distance;
        this._taxi = trip._taxi;
        this._time = trip._time;
        for (let i = 0; i < trip._queue.length; i++) 
        {
                let Newroute = new route(trip._queue[i]._start,trip._queue[i]._end,trip._queue[i]._fomarttedName);
                this._queue.push(Newroute);   
        }
    }
}


function checkDataLocal (key) 
{
    if (typeof(Storage) !== "undefined") 
    { 
        if (localStorage.getItem(key) !== null) 
        {
            return true;
        } 
        else 
        {
            return false;
        }
    } 
    else 
    { 
	    console.log("localStorage is not supported by current browser."); 
        return false;
    } 
}
function updateStorage (key, data) 
{
    let JSONdata = JSON.stringify(data);
    localStorage.setItem(key, JSONdata);
}
function getData (key) 
{
    let data = localStorage.getItem(key);
    try 
    {
        data = JSON.parse(data);
    } 
    catch 
    {
    
    } 
    finally 
    {
        return data;
    }
}

function markDone(index) 
{
    if (window.confirm("Do you want to delete this destination ?") === true) 
    {
        let Newtrip = new trip();
        let data = getData(BOOKING_DATA_KEY);
        Newtrip.fromData(data);
        Newtrip.removeDestination(index);
        updateStorage(BOOKING_DATA_KEY, Newtrip);
        displayCurrent(Newtrip._queue);
    }
}

function displayCurrent(data) 
{
    let output = "";
    output += `<ul class="mdl-list"> `;
    for (let i = 0; i < data.length; i++) 
    {
            output +=
                `<li class="mdl-list__item mdl-list__item--three-line">
            <span class="mdl-list__item-primary-content">
                <span>${data[i]._fomarttedName}</span>
            </span>
            <span class="mdl-list__item-secondary-content">
                <a class="mdl-list__item-secondary-action" onclick="view(${i})"><i
                        class="material-icons">info</i></a>
            </span>
            <span class="mdl-list__item-secondary-content">
                <a class="mdl-list__item-secondary-action" onclick="markDone(${i})"><i
                        class="material-icons">done</i></a>
            </span>
                 </li>`;
    }
    output += `</ul>`;
    document.getElementById("queueContent").innerHTML = output;
}
