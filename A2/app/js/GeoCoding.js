"use strict"
function getDestination() 
{
    let apiKey = "59e6e73ac63645e19d599650bfda46ae";
    let PLACENAME = document.getElementById("addDest").value;
    let url = "https://api.opencagedata.com/geocode/v1/json";
    let data = {
        q: PLACENAME,
        key: apiKey,
        jsonp: "add",
        limit : "1"
    };
    webServiceRequest(url, data);
}
function getInformation(lat,lng)
{
    let apiKey = "59e6e73ac63645e19d599650bfda46ae";
    let latlng = `${lat}+${lng}`;
    let url = "https://api.opencagedata.com/geocode/v1/json";
    let data = {
        q: latlng,
        key: apiKey,
        jsonp: "add",
        limit : "1"
    };
    webServiceRequest(url, data);
}
function add(data)
{
    let lat = data.results[0].geometry.lat;
    let lng = data.results[0].geometry.lng;
    if (FLAG == 0)
    {
        FLAG = 1;
        document.getElementById("currentDestination").innerHTML = `${lat}&nbsp;${lng}<br>${data.results[0].formatted}`;
        return;
    }
    let marker = new mapboxgl.Marker();
    marker.setLngLat([lng, lat]);
    let popup = new mapboxgl.Popup({ offset: 45 });
    popup.setHTML(`${lat}<br> ${lng} <br> ${data.results[0].formatted}`);
    marker.setPopup(popup);
    marker.addTo(map);
    popup.addTo(map);
    panTo(lat, lng);
    // add route
    let newDestination = {
        latitude: lat, 
        longitude: lng
    };
    let NewDate = document.getElementById("dateInput").value;
    let Newtime = document.getElementById("appt").value;
    let NewTaxi = document.getElementById("taxiType").value;
    let Newroute = new route(lastDestination,newDestination,data.results[0].formatted);
    lastDestination = newDestination;
    let Newtrip = new trip();
    Newtrip._time = Newtime;
    Newtrip._date = NewDate;
    Newtrip._taxi = NewTaxi;
    Newtrip.addRoute(Newroute);
    showPath();
    window.alert("New destination has been added !");
    displayCurrent(Newtrip._queue);
}