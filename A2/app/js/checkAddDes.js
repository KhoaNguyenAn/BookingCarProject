"use strict"
function addNewDestination()
{
    //get input values
    let NewDestination = document.getElementById("addDest").value;
    let NewDate = document.getElementById("dateInput").value;
    let Newtime = document.getElementById("appt").value;
    let Newtaxi = document.getElementById("taxiType").value;
    //check if input is blank
    if (NewDestination.length == 0) 
    {
        //document.getElementById("addDest_msg").innerHTML = "Please enter Destination !";
        window.alert("Please enter Destination !");
        return;
    }
    if (NewDate.length == 0) 
    {
        //document.getElementById("date_msg").innerHTML = "Please enter Date !";
        window.alert("Please enter Date !");
        return;
    }
    if (Newtime.length == 0)
    {
        //document.getElementById("appt_msg").innerHTML = "Please enter Time !";
        window.alert("Please enter Time !");
        return;
    }
    if (Newtaxi.length == 0)
    {
        //document.getElementById("appt_msg").innerHTML = "Please enter Time !";
        window.alert("Please choose your Taxi !");
        return;
    }
    //if all inputs are valid, add student to queue
    getDestination();
 }
 function addNewDestination2(lat ,lng)
{
    //get input values
    let NewDestination = document.getElementById("addDest").value;
    let NewDate = document.getElementById("dateInput").value;
    let Newtime = document.getElementById("appt").value;
    let Newtaxi = document.getElementById("taxiType").value;

    //check if input is blank
    if (NewDate.length == 0) 
    {
        //document.getElementById("date_msg").innerHTML = "Please enter Date !";
        window.alert("Please enter Date !");
        return;
    }
    if (Newtime.length == 0)
    {
        //document.getElementById("appt_msg").innerHTML = "Please enter Time !";
        window.alert("Please enter Time !");
        return;
    }
    if (Newtaxi.length == 0)
    {
        //document.getElementById("appt_msg").innerHTML = "Please enter Time !";
        window.alert("Please choose your Taxi !");
        return;
    }
    //if all inputs are valid, add student to queue
    getInformation(lat,lng);
 }