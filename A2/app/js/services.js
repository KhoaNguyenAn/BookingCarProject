/** 
@NAME : Team 081
@LASTMODIFIED : 20.5.2021
@ASSIGNMENT 2
@Filename : services.js
@description: This file is used to implement the webServiceRequest to be used by the geocoding
*/
"use strict"
/*
 *@name webServiceRequest
 *@desc It is responsible for creating the appropriate link to be used by the API using the parameter
 *@param url, data
*/
function webServiceRequest(url, data) {
    // Build URL parameters from data object.
    let params = "";
    // For each key in data object...
    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            if (params.length == 0) {
                // First parameter starts with '?'
                params += "?";
            }
            else {
                // Subsequent parameter separated by '&'
                params += "&";
            }

            let encodedKey = encodeURIComponent(key);
            let encodedValue = encodeURIComponent(data[key]);

            params += encodedKey + "=" + encodedValue;
        }
    }
    let script = document.createElement('script');
    script.src = url + params;
    document.body.appendChild(script);
}