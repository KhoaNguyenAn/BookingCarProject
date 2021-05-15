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
        let φ1 = this._start.latitude * Math.PI / 180; // φ, λ in radians
        let φ2 = this._end.latitude * Math.PI / 180;
        let Δφ = (this._end.latitude - this._start.latitude) * Math.PI / 180; // difference between φ, λ
        let Δλ = (this._end.longitude - this._start.longitude) * Math.PI / 180;

        let a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        let d = R * c; // in metres
        return d;
    }
    fromData(data) 
    {
        this._start = data._start;
        this._end = data._end;
    }
}
class trip 
{
    constructor(route, time, taxi) 
    {
        this._start = route.start;
        this._stops = [];
        this._end = route.end;
        this._distance = route.getDistance();
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
        if (route.start == this._end) 
        {
            this._stops.push(route.start);
            this._end = route.end;
            this._distance += route.getDistance();
        }
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
}
function checkIfDataExistsLocalStorage() 
{
    if (typeof (Storage) !== "undefined") 
    {
        let data = localStorage.getItem(BOOKING_DATA_KEY);
        console.log(data)
        if (data !== undefined) 
        {
            return true;
        }
        else 
        {
            return false;
        }
    }
}
function updateLocalStorage(data) 
{
    data = JSON.stringify(data);
    localStorage.setItem(BOOKING_DATA_KEY, data);
}
function getDataLocalStorage() 
{
    let data = localStorage.getItem(BOOKING_DATA_KEY);
    data = JSON.parse(data);
    return data;
}