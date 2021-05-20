/** 
@NAME : Team 081
@LASTMODIFIED : 20.5.2021
@ASSIGNMENT 2
@Filename : map2.js
@description: This file is used to display the functionality of the map in the view.html page
*/
"use strict"
mapboxgl.accessToken = "pk.eyJ1IjoidGVubmlzb24iLCJhIjoiY2tvcGs1d29tMGRjNzJwa2hzMTg4c3ZoNCJ9.8fGmMA313cd-nAdSZkLnqg";
let map = new mapboxgl.Map({
    container: 'map',
    center: [144.9648731, -37.8182711],
    zoom: 15,
    style: 'mapbox://styles/mapbox/streets-v11'
});

let panTo = (lat, lng) => {
    map.panTo([lng, lat]);
}
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
    object.data.geometry.coordinates.push([Newroute._start.longitude, Newroute._start.latitude]);
    object.data.geometry.coordinates.push([Newroute._end.longitude, Newroute._end.latitude]);
    //
    if (true) {
        let marker = new mapboxgl.Marker({ color: '#ea1a1a' });
        marker.setLngLat([Newroute._start.longitude, Newroute._start.latitude]);
        let popup = new mapboxgl.Popup({ offset: 45 });
        popup.setHTML(`<strong> Pick up place </strong>`);
        marker.setPopup(popup);
        marker.addTo(map);
        popup.addTo(map);
    }
    ///
    let lat = null;
    let lng = null;
    for (let i = 1; i < Newtrip._queue.length; i++) {
        let Newroute1 = Newtrip._queue[i];
        object.data.geometry.coordinates.push([Newroute1._end.longitude, Newroute1._end.latitude]);
        if (i == Newtrip._queue.length - 1) break;
        let lat = Newtrip._queue[i]._end.latitude;
        let lng = Newtrip._queue[i]._end.longitude;
        let marker = new mapboxgl.Marker();
        marker.setLngLat([lng, lat]);
        let popup = new mapboxgl.Popup({ offset: 45 });
        popup.setHTML(`Stop`);
        marker.setPopup(popup);
        marker.addTo(map);
        popup.addTo(map);

    }

    map.addSource('data', object);
    map.addLayer({
        id: "routes",
        type: "line",
        source: "data",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#888", "line-width": 8 }
    });

    // finaldes
    lat = Newtrip._queue[Newtrip._queue.length - 1]._end.latitude;
    lng = Newtrip._queue[Newtrip._queue.length - 1]._end.longitude;
    let marker = new mapboxgl.Marker();
    marker.setLngLat([lng, lat]);
    let popup = new mapboxgl.Popup({ offset: 45 });
    popup.setHTML(`<strong>Final Destination: </strong><br>${lat}<br> ${lng} <br> ${Newtrip._queue[Newtrip._queue.length - 1]._fomarttedName}`);
    marker.setPopup(popup);
    marker.addTo(map);
    popup.addTo(map);
    panTo(lat, lng);
}

// fly to my location 
window.onload = function () {
    navigator.geolocation.getCurrentPosition(success);
}
let FLAG = 0;
let lastDestination = null;
/*
 *@name success
 *@desc It takes the position and separates it into lat and lgn and call the showPath function
 *@param pos
*/
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
    showPath();
}