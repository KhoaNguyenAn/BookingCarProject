"use strict"
// keys for local storage
const BOOKING_DATA_KEY = "bookingData";
// route class
class route {
    constructor(start, end) {
        this._start = start;
        this._end = end;
    }
    get start() {
        return this._start;
    }
    get end() {
        return this._end;
    }
    getDistance() {
        let R = 6371e3; // metres
        let φ1 = lat1 * Math.PI / 180; // φ, λ in radians
        let φ2 = lat2 * Math.PI / 180;
        let Δφ = (lat2 - lat1) * Math.PI / 180; // difference between φ, λ
        let Δλ = (lon2 - lon1) * Math.PI / 180;

        let a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        let d = R * c; // in metres
        return d;
    }
    fromData(data) {
        this._start = data._start;
        this._end = data._end;
    }
}