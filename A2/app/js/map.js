mapboxgl.accessToken = "pk.eyJ1IjoidGVubmlzb24iLCJhIjoiY2tvcGs1d29tMGRjNzJwa2hzMTg4c3ZoNCJ9.8fGmMA313cd-nAdSZkLnqg";
let map = new mapboxgl.Map({
    container: 'map',
    //center: [144.9648731, -37.8182711],
    center: [106.68612163283439, 10.841443617030293],
    zoom: 16,
    style: 'mapbox://styles/mapbox/streets-v9'
});
// TODO: complete the getData function
function getData() {
    // TODO: retrieve the user input for the city name from HTML
    let cityRef = document.getElementById("city");
    let city = cityRef.value;
    // TODO: define the data to pass for the query string to the web service request function
    //       You will need to pass along the token as well as the callback
    //       See: https://aqicn.org/json-api/doc/#api-City_Feed-GetCityFeed
    let data = {
        token: WAQI_TOKEN,
        callback: "showData"
    };
    // TODO: Make the actual web service request to the URL https://api.waqi.info/feed/:city
    //       You need to replace the :city placeholder with the actual city name from the user input
    webServiceRequest(`https://api.waqi.info/feed/${city}/`, data);
}
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
    document.getElementById("addDes").innerHTML = `${e.lngLat.lat}&nbsp;${e.lngLat.lng}`;
    panTo(e.lngLat.lat, e.lngLat.lng);

    // add route
    let newDestination = {
        latitude: e.lngLat.lat, 
        longitude: e.lngLat.lng
    };
    let route = new route(lastDestination,newDestination);
    lastDestination = newDestination;
    let trip = new trip();
    trip.addRoute(route);
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
    let trip = new trip();
    let data = getData(BOOKING_DATA_KEY);
    trip.fromData(data);
    let route = trip._queue[0];
    object.data.geometry.coordinates.push([route._start.longitude,route._start.latitude]);
    object.data.geometry.coordinates.push([route._end.longitude,route._end.latitude]);
    for (let i = 1; i < trip._queue.length; i++) 
    {
        let route = trip._queue[i];
        object.data.geometry.coordinates.push([route._end.longitude,route._end.latitude]);
    }
    map.addLayer({
        id: "routes",
        type: "line",
        source: object,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#888", "line-width": 6 }
    });
}

// fly to my location 
window.onload = function()
{
    let lastDestination = null;
    if (lastDestination == null)
     navigator.geolocation.getCurrentPosition(success);
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