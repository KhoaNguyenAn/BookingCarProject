/** 
@NAME : Team 081
@LASTMODIFIED : 20.5.2021
@ASSIGNMENT 2
@Filename : checkAddDes.js
@description: This file is used to implement the making of bookings (check if taxi is available and add destination and if all the required info has been input by the user)
*/
"use strict"
/*
 *@name addNewDestination
 *@desc It is responsible for adding a new booking
*/
function addNewDestination() {
    //get input values
    let NewDestination = document.getElementById("addDest").value;
    let NewDate = document.getElementById("dateInput").value;
    let Newtime = document.getElementById("appt").value;
    let Newtaxi = document.getElementById("taxiType").value;
    //check if input is blank
    if (NewDestination.length == 0) {
        window.alert("Please enter Destination !");
        return;
    }
    if (NewDate.length == 0) {
        window.alert("Please enter Date !");
        return;
    }
    if (Newtime.length == 0) {

        window.alert("Please enter Time !");
        return;
    }
    if (Newtaxi.length == 0) {

        window.alert("Please choose your Taxi !");
        return;
    }
    //if all inputs are valid, add desination to list
    let check = checkTaxi(Newtaxi);
    if (check != false) {
        updateStorage("taxicode", check);
        getDestination();
    }
    else {
        window.alert("there is NO available taxi for your booking, please try again! ");
        return;
    }
}
/*
*@name addNewDestination2
*@param lat, lgn
*@desc It is responsible for adding a new booking
*/
function addNewDestination2(lat, lng) {
    //get input values
    let NewDate = document.getElementById("dateInput").value;
    let Newtime = document.getElementById("appt").value;
    let Newtaxi = document.getElementById("taxiType").value;

    //check if input is blank
    if (NewDate.length == 0) {
        window.alert("Please enter Date !");
        return;
    }
    if (Newtime.length == 0) {
        window.alert("Please enter Time !");
        return;
    }
    if (Newtaxi.length == 0) {
        window.alert("Please choose your Taxi type !");
        return;
    }
    //if all inputs are valid, add destination to list
    //getInformation(lat,lng);

    let check = checkTaxi(Newtaxi);
    if (check != false) {
        updateStorage("taxicode", check);
        getInformation(lat, lng);
    }
    else {
        window.alert("there is NO available taxi for your booking, please try again! ");
        return;
    }
}
/*
 *@name checkTaxi
 *@desc It is responsible for checking if the taxi is available
 *@param taxi
*/
function checkTaxi(taxi) {
    for (let i = 0; i < taxiList.length; i++) {
        let taxiCodeOld = getData("taxicode");
        if (taxiList[i].type == taxi && (taxiList[i].available == true || taxiList[i].rego == taxiCodeOld)) {
            updateStorage("taxicode", taxiList[i].rego);
            taxiList[i].available = false;
            return taxiList[i].rego;
        }
    }
    return false;
}