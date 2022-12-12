// Global variables that then will be used as to define the URL for a POST of an API
var originStationUrl = "";
var destionationStationUrl = "";

// Function that validates the form
function validateOriginDestination() {
    
    // I save into variables each part of the form that I want to validate
    let x = document.forms["originDestinationForm"]["originStation"].value;
    let y = document.forms["originDestinationForm"]["destionationStation"].value;

    // Conditions that I want to validate
    if (isNaN(x) === false || isNaN(y) === false) {

    // When conditions are not met, I want the borders of the field to become red..
    document.forms.originDestinationForm.originStation.style.borderColor = "red";
    document.forms.originDestinationForm.destionationStation.style.borderColor = "red";

    // In the "span" part of the label, I want for a message to appear if validation is not passed
    document.getElementById('originDestinationFeedback').innerHTML="<b>*Please insert names and not numbers</b>";

    // I Return false so there is no submission (no refreshing)
    return false;
    }
 
    // If input is valited, we remove the red borders in fields and then define the input as "x" and "y" and execute a function that calls 
    document.forms.originDestinationForm.originStation.style.borderColor = "";
    document.forms.originDestinationForm.destionationStation.style.borderColor = "";
    document.getElementById('originDestinationFeedback').innerHTML="";

    originStationUrl = x;
    destionationStationUrl = y;

    getTimetables();

    return false;
}


function getTimetables() {

    // I now use the input as to define the origin station and destionation station
    var url = "https://rata.digitraffic.fi/api/v1/live-trains/station/"+originStationUrl+"/"+destionationStationUrl+"?include_nonstopping=false&limit=1";

    // Create AJAX object
    var xmlhttp = new XMLHttpRequest();

    // Specify the data / url to be fetched
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = function() {
            if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {

                    // I save here the response
                    var jsonObj = JSON.parse(xmlhttp.responseText);

                    // First part of the array is train information, which inside has another array of trains.
                    var train = jsonObj[0];

                    // In case the stations introduced are not correct
                    if (jsonObj.code === "TRAIN_NOT_FOUND") {
                        document.getElementById("errorResponse").innerHTML = jsonObj.errorMessage;
                    } else {

                    // I only bring the timetable of the first train of the array
                    var arraytimeTables = jsonObj[0].timeTableRows;

                    // I define the headers of the table
                    document.getElementById("chosenTrain").innerHTML = '<table class="styled-table-train"><thead><tr><th>Train Number</th><th>Departure Date</th><th>Operator</th><th>Line</th><th>Cancelled</th></tr></thead><tbody><tr><td>'+ train.trainNumber + '</td><td>'+ train.departureDate + '</td><td>'+ train.operatorShortCode + '</td><td>'+ train.commuterLineID + '</td><td>'+ train.cancelled + '</td></tr></tbody></table>';

                    var content, item, stationShortCode, stationUICCode, countryCode, type, trainStopping, commercialStop, commecialTrack, cancelled, scheduledTime, trainNumber;

                    // I loop as to create each row for the table
                    for (i = 0; i < jsonObj[0].timeTableRows.length; i++) {
   

                        stationShortCode = arraytimeTables[i].stationShortCode;
                        stationUICCode = arraytimeTables[i].stationUICCode;
                        countryCode = arraytimeTables[i].countryCode;
                        type = arraytimeTables[i].type;
                        trainStopping = arraytimeTables[i].trainStopping;
                        commercialStop = arraytimeTables[i].commercialStop;
                        commecialTrack = arraytimeTables[i].commecialTrack;
                        cancelled = arraytimeTables[i].cancelled;
                        scheduledTime = arraytimeTables[i].scheduledTime;
                        trainNumber = arraytimeTables[i].trainNumber;

                        item = '<tr><td>'+ stationShortCode + '</td><td>'+ stationUICCode + '</td><td>'+ countryCode + '</td><td>'+ type + '</td><td>'+ trainStopping + '</td>';
                        item += '<td>'+ commercialStop + '</td><td>'+ commecialTrack + '</td><td>'+ cancelled + '</td><td>'+ scheduledTime + '</td><td>'+ trainNumber + '</td></tr>';
                        content += item;
                    }

                    // I "clean" the screen in case there is another table
                    removeStations();

                    // I put the table on the screen
                    document.getElementById("tableSchedule").innerHTML = '<table class="styled-table"><thead><tr><th>Station</th><th>UI Codet</th><th>Country</th><th>Train type</th><th>Train stops at station</th><th>Commercial stop</th><th>Commercial track</th><th>Cancelled</th><th>Scheduled time</th><th>Trian number</th></tr></thead><tbody>'+content+'</tbody></table>';
        
                        }
                    }
            }

    }

function getStations(){

    // This one just brings all the codes for the stations
    var url = "https://rata.digitraffic.fi/api/v1/metadata/stations";

    // Create AJAX object
    var xmlhttp = new XMLHttpRequest();

    // Specify the data / url to be fetched
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = function() {
            if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {

                    // All the code is similar to previous function

                    var stations = JSON.parse(xmlhttp.responseText);

                    var content, stationShortCode, stationName, type, item;

                    for (i = 0; i < stations.length; i++) {
   
                        stationName = stations[i].stationName;
                        type = stations[i].type;
                        stationShortCode = stations[i].stationShortCode;
                    

                        item = '<tr><td>'+ stationName + '</td><td>'+ type + '</td><td>'+ stationShortCode + '</td></tr>';
                        content += item;
                    }

                    removeTableSchedule();
                    removeTableTrain();
                    document.getElementById("stationsTable").innerHTML = '<table class="styled-table"><thead><tr><th>Station name</th><th>Station type</th><th>Station short-code</th></tr></thead><tbody>'+content+'</tbody></table>';
        
                    }
            }

}

//Just some functions that "remove" the tables from the screen

function removeStations(){

    document.getElementById("stationsTable").innerHTML = '';

}

function removeTableSchedule(){

    document.getElementById("tableSchedule").innerHTML = '';

}

function removeTableTrain(){

    document.getElementById("chosenTrain").innerHTML = '';

}
