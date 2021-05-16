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
function add(data)
{
    let lat = data.results[0].geometry.lat;
    let lng = data.results[0].geometry.lng;
    let marker = new mapboxgl.Marker();
    marker.setLngLat([lng, lat]);
    let popup = new mapboxgl.Popup({ offset: 45 });
    popup.setHTML(`${lat}<br>: ${lng}`);
    marker.setPopup(popup);
    marker.addTo(map);
    popup.addTo(map);
    document.getElementById("addDest").innerHTML = `${lat}&nbsp;${lng}`;
    panTo(lat, lng);
    // add route
    // let newDestination = {
    //     latitude: lat, 
    //     longitude: lng
    // };
    // let route = new route(lastDestination,newDestination);
    // lastDestination = newDestination;
    // let trip = new trip();
    // trip.addRoute(route);
}