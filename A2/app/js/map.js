mapboxgl.accessToken = "pk.eyJ1IjoidGVubmlzb24iLCJhIjoiY2tvcGs1d29tMGRjNzJwa2hzMTg4c3ZoNCJ9.8fGmMA313cd-nAdSZkLnqg";
let map = new mapboxgl.Map({
    container: 'map',
    //center: [144.9648731, -37.8182711],
    center: [106.68612163283439, 10.841443617030293],
    zoom: 16,
    style: 'mapbox://styles/mapbox/streets-v9'
});



let panTo = (lat, lng) => {
    map.panTo([lng, lat]);
}
map.on('click', (e) => {
    console.log(e.lngLat.lat);
    console.log(e.lngLat.lng);
    let marker = new mapboxgl.Marker();
    marker.setLngLat([e.lngLat.lng, e.lngLat.lat]);
    let popup = new mapboxgl.Popup({ offset: 45 });
    popup.setHTML(`${e.lngLat.lat}<br>: ${e.lngLat.lng}`);
    marker.setPopup(popup);
    marker.addTo(map);
    popup.addTo(map);
    document.getElementById("addDest").innerHTML = `${e.lngLat.lat}&nbsp;${e.lngLat.lng}`;
    panTo(e.lngLat.lat, e.lngLat.lng);
    //add route
    let newDestination = {
        latitude: e.lngLat.lat, 
        longitude: e.lngLat.lng
    };
    let Newroute = new route(lastDestination,newDestination);
    lastDestination = newDestination;
    let Newtrip = new trip();
    Newtrip.addRoute(Newroute);
    showPath();
})
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
        paint: { "line-color": "#888", "line-width": 6 }
    });
}

// fly to my location 
window.onload = function()
{
    let lastDestination = null;
    
    if (lastDestination == null)
    {
      localStorage.removeItem(BOOKING_DATA_KEY);
      navigator.geolocation.getCurrentPosition(success);
    }
}
function success(pos) {
    let lat = pos.coords.latitude;
    let lng = pos.coords.longitude;
    lastDestination = {
        latitude: lat, 
        longitude: lng
    };
    // updateLocalStorage()
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
    document.getElementById("currentDestination").innerHTML = `${pos.coords.latitude}&nbsp;${pos.coords.longitude}`;
}