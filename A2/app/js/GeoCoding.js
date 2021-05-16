"use strict"
let apiKey = "pk.eyJ1IjoidGVubmlzb24iLCJhIjoiY2tvcGs1d29tMGRjNzJwa2hzMTg4c3ZoNCJ9.8fGmMA313cd-nAdSZkLnqg";
let url = "https://api.opencagedata.com/geocode/v1/json";
let data = {
    q: "PLACENAME",
    key: apiKey,
    jsonp: "showData"
};
webServiceRequest(url,data);
function showData(data)
{
    console.log(data);
}