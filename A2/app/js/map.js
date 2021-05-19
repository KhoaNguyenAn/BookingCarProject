"use strict"
mapboxgl.accessToken = "pk.eyJ1IjoidGVubmlzb24iLCJhIjoiY2tvcGs1d29tMGRjNzJwa2hzMTg4c3ZoNCJ9.8fGmMA313cd-nAdSZkLnqg";
let map = new mapboxgl.Map({
    container: 'map',
    center: [144.9648731, -37.8182711],
    zoom: 16,
    style: 'mapbox://styles/mapbox/streets-v9'
});

let panTo = (lat, lng) => {
    map.panTo([lng, lat]);
}
map.on('click', (e) => {
    if (window.confirm("Do you want to choose this destination ?") === true) 
    {
    addNewDestination2(e.lngLat.lat,e.lngLat.lng);
    }
})
/*
 *@name showPath
 *@desc It is responsible for showing the path between the user's stops
*/
function showPath() {
    let object = {
        type: "geojson",
        data: {
            type: "Feature",
            properties: {},
            geometry: {
                type: "LineString",
                coordinates: []
            }
        }
    };
    let Newtrip = new trip();
    let data = getData(BOOKING_DATA_KEY);
    Newtrip.fromData(data);
    let Newroute = Newtrip._queue[0];
    object.data.geometry.coordinates.push([Newroute._start.longitude,Newroute._start.latitude]);
    object.data.geometry.coordinates.push([Newroute._end.longitude,Newroute._end.latitude]);
    for (let i = 1; i < Newtrip._queue.length; i++) 
    {
        let Newroute1 = Newtrip._queue[i];
        object.data.geometry.coordinates.push([Newroute1._end.longitude,Newroute1._end.latitude]);
    }
    if (map.getLayer('routes'))
    {
       map.removeLayer('routes');
       map.removeSource('data');
    }
    map.addSource('data', object);
    map.addLayer({
        id: "routes",
        type: "line",
        source: "data",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#888", "line-width": 8 }
    });
}
/*
    *@name liveClock
    *@desc show a live clock on the page
*/
function liveClock() 
{
    let Clock = new Date().toLocaleTimeString();
    document.getElementById("currentTime").innerHTML = Clock;
}

// fly to my location 
window.onload = function()
{
    setInterval(liveClock, 1000);
    let lastDestination = null;
    //localStorage.removeItem(ALL_BOOKING_KEY);
    if (lastDestination == null)
    {
      localStorage.removeItem(BOOKING_DATA_KEY);
      navigator.geolocation.getCurrentPosition(success);
    }

    let Newtrip = new trip();
    if (checkDataLocal(BOOKING_DATA_KEY) == true) 
    {
        let data = getData(BOOKING_DATA_KEY);
        Newtrip.fromData(data);
        displayCurrent(Newtrip._queue);
    }
}
let FLAG = 0;
/*
 *@name success
 *@desc It takes the position and separates it into lat and lgn and call the showPath function
 *@param pos
*/
let lastDestination= null;
function success(pos) {
    let lat = pos.coords.latitude;
    let lng = pos.coords.longitude;
    lastDestination = {
        latitude: lat, 
        longitude: lng
    };
    map.flyTo({
        center: [lng, lat]
    });
    let marker = new mapboxgl.Marker({ color: '#ea1a1a' });
    marker.setLngLat([pos.coords.longitude, pos.coords.latitude]);
    let popup = new mapboxgl.Popup({ offset: 45 });
    popup.setHTML(`<strong> My location </strong>`);
    marker.setPopup(popup);
    marker.addTo(map);
    popup.addTo(map);
    getInformation(lat,lng);
    //
}
/*
 *@name deleteLast
 *@desc It is responsible for deleting the last stops entered by the user and updating the map
*/
function deleteLast()
{
    let Newtrip = new trip();
    let data = getData(BOOKING_DATA_KEY);
    Newtrip.fromData(data);
    Newtrip._distance-= Newtrip._queue[Newtrip._queue.length-1].getDistance();
    Newtrip.removeDestination(Newtrip._queue.length-1);
    lastDestination = Newtrip._queue[Newtrip._queue.length-1]._end;
    updateStorage(BOOKING_DATA_KEY,Newtrip);
    showPath();
    displayCurrent(Newtrip._queue);
    calculate();
}