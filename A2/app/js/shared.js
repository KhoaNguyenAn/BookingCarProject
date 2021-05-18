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
        this._taxiCode = "";
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
    get taxiCode()
    {
        return this._taxiCode;
    }
    addRoute(route) {
        let data = getData(BOOKING_DATA_KEY);
        if (data != null) this.fromData(data);
        this._queue.push(route);
        this._distance += route.getDistance();
        updateStorage(BOOKING_DATA_KEY, this);
    }
    changeTaxi(taxi) {
        this._taxi = taxi;
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
        this._taxiCode = trip._taxiCode;
        //this._taxiCode = trip._taxiCode;
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
        this._arrayTrip.push(trip);
        // localStorage.removeItem(BOOKING_DATA_KEY);
    }
    removeTrip(Index) {
        this._arrayTrip.splice(Index, 1);
    }
    fromData(allBooking)
    {
        for (let i = 0; i < allBooking._arrayTrip.length; i++)
        {
            this._arrayTrip.push(allBooking._arrayTrip[i]);
        }
    }
}

function reverse(s){
    return s.split("").reverse().join("");
}
function compare(s1,s2)
{
    // s1: todayDate
    // s2: datetrip
    // return true when s1 <= s2
    let tmp = 0;
    let day1 ="";
    let day2 ="";
    let month1 ="";
    let month2 ="";
    let year1 ="";
    let year2 ="";
    for (let j = 0; j < s1.length; j++)
    {
        if (s1[j] == "/") 
        {
            tmp++;
            continue;
        }
        if (tmp == 0) day1+= s1[j];
        if (tmp == 1) month1+= s1[j];
        if (tmp == 2) year1+= s1[j]; 
    }
    tmp = 0;
    for (let j = 0; j < s2.length; j++)
    {
        if (s2[j] == "-") 
        {
            tmp++;
            continue;
        }
        if (tmp == 0) year2+= s2[j];
        if (tmp == 1) month2+= s2[j];
        if (tmp == 2) day2+= s2[j];
    }
    day1 = parseInt(day1);
    day2 = parseInt(day2);
    month1 = parseInt(month1);
    month2 = parseInt(month2);
    year1 = parseInt(year1);
    year2 = parseInt(year2);
    if (year1 > year2) return false;
    if (year1 < year2) return true;
    if (month1 > month2) return false;
    if (month1 < month2) return true;
    if (day1 < day2) return true;
    return false;
}
function sortBooking() 
{
    //     </table>
    let displayGrid = `
                        <h4> <strong> Booking History </strong> </h4>
                        <table>
                        <tr>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Pick up place</th>
                            <th>Final destination</th>
                            <th>Stops</th>
                            <th>Distance (km)</th>
                            <th>Fare ($)</th>
                            <th>Transport</th>
                        </tr> `;
    let todayDate = new Date().toLocaleDateString();
    let output = getData(ALL_BOOKING_KEY);
    
    let outputSchedule = "";
    let outputpast = "";
    let cnt1 = 0;
    let cnt2 = 0;
    for (let i = 0; i < output._arrayTrip.length; i++)
    {
        let sizeTrip = output._arrayTrip[i]._queue.length - 1;
        if (compare(todayDate,output._arrayTrip[i]._date) == true) 
            {
                cnt1++;
                outputSchedule += "<tr>";
                outputSchedule +="<td> <strong>Current Booking </strong></td>";
                outputSchedule +=
                    `
                    <td>${output._arrayTrip[i]._date}</td>
                    <td>${output._arrayTrip[i]._queue[0]._fomarttedName}</td>
                    <td>${output._arrayTrip[i]._queue[sizeTrip]._fomarttedName}</td>
                    <td>${output._arrayTrip[i]._queue.length}</td>
                    <td>${output._arrayTrip[i]._distance.toFixed(2)}</td>
                    <td>${output._arrayTrip[i]._fare.toFixed(2)}</td>
                    <td>${output._arrayTrip[i]._taxi.toUpperCase()} (${output._arrayTrip[i]._taxiCode})</td>
                `
                outputSchedule+= "</tr>";
            } else {
                cnt2++;
                outputpast += "<tr>";
                outputpast +="<td> Past Booking </td>";
                outputpast +=
                    `
                    <td>${output._arrayTrip[i]._date}</td>
                    <td>${output._arrayTrip[i]._queue[0]._fomarttedName}</td>
                    <td>${output._arrayTrip[i]._queue[sizeTrip]._fomarttedName}</td>
                    <td>${output._arrayTrip[i]._queue.length}</td>
                    <td>${output._arrayTrip[i]._distance.toFixed(2)}</td>
                    <td>${output._arrayTrip[i]._fare.toFixed(2)}</td>
                    <td>${output._arrayTrip[i]._taxi.toUpperCase()} (${output._arrayTrip[i]._taxiCode})</td>
                    `
                outputpast+= "</tr>";
            }
    }
    if (cnt1 != 0) displayGrid += outputSchedule;
    if (cnt2 != 0) displayGrid += outputpast;
    displayGrid += `</table>`;
    document.getElementById("scheduledBooking").innerHTML = displayGrid;
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
    output += `<p> Time: ${Newtrip.time} <br> Date: ${Newtrip.date}</p> `;
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
    if (getData(BOOKING_DATA_KEY) != null)
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
        window.alert("Can NOT make a book!");
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
    document.getElementById("totalDist").innerHTML = `${Newtrip._distance.toFixed(2)}`;
    document.getElementById("fare").innerHTML = `${Newtrip._fare.toFixed(2)}`;
    document.getElementById("taxiType").innerHTML = `${Newtrip.taxi.toUpperCase()} (${Newtrip.taxiCode})`;
}
function deleteView()
{
     if (window.confirm("Do you want to delete this booking ?") === true)
     {
        localStorage.removeItem(BOOKING_DATA_KEY);
        let data = getData(ALL_BOOKING_KEY);
        let allBook = new allBookings();
        if (data != null) allBook.fromData(data);
        allBook.removeTrip(allBook._arrayTrip.length-1);
        updateStorage(ALL_BOOKING_KEY,allBook);
        window.location.href = "index.html";
     }
}

function changeTaxi()
{
    let Newtrip = new trip()
    let data = getData(BOOKING_DATA_KEY);
    Newtrip.fromData(data);
    let Newtaxi = document.getElementById("taxiType1").value;
    for (let i = 0; i < taxiList.length; i++)
      {
          let taxiCodeOld = getData("taxicode");
          if (taxiList[i].type == Newtaxi && (taxiList[i].available == true || taxiList[i].rego == taxiCodeOld))
          {
              Newtrip._taxi = Newtaxi;
              Newtrip._taxiCode = taxiList[i].rego;
              updateStorage(BOOKING_DATA_KEY,Newtrip);
              updateStorage("taxicode",taxiList[i].rego);
              taxiList[i].available = false;
              let data1 = getData(ALL_BOOKING_KEY);
              data1._arrayTrip[data1._arrayTrip.length-1]._taxi = Newtaxi;
              data1._arrayTrip[data1._arrayTrip.length-1]._taxiCode = taxiList[i].rego;
              updateStorage(ALL_BOOKING_KEY,data1);
              window.alert("Successful change !");
              return;
          }
      }
      window.alert("there is NO available taxi for your booking, please try again! ");
      return;
}