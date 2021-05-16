"use strict"
// keys for local storage
const BOOKING_DATA_KEY = "bookingData";
// route class
class route 
{
    constructor(start, end) 
    {
        this._start = {latitude: start.latitude , longitude: start.longitude};
        this._end =   {latitude: end.latitude   , longitude: end.longitude};
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
    constructor(time, taxi) 
    {
        this._queue = [];
        this._taxi = taxi;
        this._time = time;
    }
    get start() 
    {
        return this._start;
    }
    get stops() 
    {
        return this._stops;
    }
    get end() 
    {
        return this._end;
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
        this.fromData(data);
        this._queue.push(route);
        this._distance += route.getDistance();
        updateStorage(BOOKING_DATA_KEY, this);
    }
    changeTaxi(taxi) 
    {
        this._taxi = taxi
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
                let route = new route(trip._queue[i]);
                this._queue.push(route);   
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

function updateDayTime() 
{
  let date= new Date();
  let timeNowRef= document.getElementById("timeNow");
  timeNowRef.innerText=date.toLocaleTimeString();
}

let intervalHandle="";
window.onload = function () 
{
  intervalHandle= setInterval(updateDayTime,1000);
}
