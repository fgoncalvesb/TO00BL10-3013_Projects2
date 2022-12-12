var originStationUrl = "";
var destionationStationUrl = "";

function validateOriginDestination() {
    
    // I save into variables each part of the form that I want to validate
    let x = document.forms["originDestinationForm"]["originStation"].value;
    let y = document.forms["originDestinationForm"]["destionationStation"].value;

    //console.log(x);
    //console.log(y);
    //console.log(isNaN(x));

    // Conditions that I want to validate
    if (isNaN(x) === false || isNaN(y) === false) {

    // When conditions are not met, I want the borders of the field to become red, to select the text and focus on the field.
    document.forms.originDestinationForm.originStation.style.borderColor = "red";
    document.forms.originDestinationForm.destionationStation.style.borderColor = "red";
    //document.forms.insertTaskForm.newTask.select();  
    //document.forms.insertTaskForm.newTask.focus(); 

    // In the "span" part of the label, I want for a message to appear if validation is not passed
    document.getElementById('originDestinationFeedback').innerHTML="<b>*Please insert names and not numbers</b>";

    // I Return false so there is no submission (no refreshing)
    return false;
    }

    document.forms.originDestinationForm.originStation.style.borderColor = "";
    document.forms.originDestinationForm.destionationStation.style.borderColor = "";
    document.getElementById('originDestinationFeedback').innerHTML="";

    originStationUrl = x;
    destionationStationUrl = y;

    loadJSONFile();

    return false;
}


function loadJSONFile() {

    var url = "https://rata.digitraffic.fi/api/v1/live-trains/station/"+originStationUrl+"/"+destionationStationUrl+"?include_nonstopping=false&limit=1";

    //ml tna

    // Create AJAX object
    var xmlhttp = new XMLHttpRequest();

    // Specify the data / url to be fetched
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = function() {
            if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {

 // find myDiv and insert results there
                    //document.getElementById("testAnswer").innerHTML = xmlhttp.responseText;

                    var jsonObj = JSON.parse(xmlhttp.responseText);
                    //document.getElementById("test1").innerHTML = jsonObj.code;
                    //document.getElementById("test2").innerHTML = jsonObj[0].timeTableRows[0].stationShortCode;

                    var train = jsonObj[0];

                    if (jsonObj.code === "TRAIN_NOT_FOUND") {
                        document.getElementById("errorResponse").innerHTML = jsonObj.errorMessage;
                    } else {

                    var arraytimeTables = jsonObj[0].timeTableRows;

                    document.getElementById("chosenTrain").innerHTML = '<table class="styled-table-train"><thead><tr><th>Train Number</th><th>Departure Date</th><th>Operator</th><th>Line</th><th>Cancelled</th></tr></thead><tbody><tr><td>'+ train.trainNumber + '</td><td>'+ train.departureDate + '</td><td>'+ train.operatorShortCode + '</td><td>'+ train.commuterLineID + '</td><td>'+ train.cancelled + '</td></tr></tbody></table>';

                    var content, item, stationShortCode, stationUICCode, countryCode, type, trainStopping, commercialStop, commecialTrack, cancelled, scheduledTime, trainNumber;

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

                    removeStations();
                    document.getElementById("tableSchedule").innerHTML = '<table class="styled-table"><thead><tr><th>Station</th><th>UI Codet</th><th>Country</th><th>Train type</th><th>Train stops at station</th><th>Commercial stop</th><th>Commercial track</th><th>Cancelled</th><th>Scheduled time</th><th>Trian number</th></tr></thead><tbody>'+content+'</tbody></table>';
        
                        }
                    }
            }

    }

function getStations(){

    var url = "https://rata.digitraffic.fi/api/v1/metadata/stations";

    // Create AJAX object
    var xmlhttp = new XMLHttpRequest();

    // Specify the data / url to be fetched
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = function() {
            if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {

                     // find myDiv and insert results there

                    var stations = JSON.parse(xmlhttp.responseText);

                    var content, stationShortCode, stationName, type, item;

                    for (i = 0; i < stations.length; i++) {
   
                        stationName = stations[i].stationName;
                        type = stations[i].type;
                        stationShortCode = stations[i].stationShortCode;
                    

                        item = '<tr><td>'+ stationName + '</td><td>'+ type + '</td><td>'+ stationShortCode + '</td></tr>';
                        content += item;
                    }
                    // Finally we place the contents in a div
                    removeTableSchedule();
                    removeTableTrain();
                    document.getElementById("stationsTable").innerHTML = '<table class="styled-table"><thead><tr><th>Station name</th><th>Station type</th><th>Station short-code</th></tr></thead><tbody>'+content+'</tbody></table>';
        
                    }
            }

}

function removeStations(){

    document.getElementById("stationsTable").innerHTML = '';

}

function removeTableSchedule(){

    document.getElementById("tableSchedule").innerHTML = '';

}

function removeTableTrain(){

    document.getElementById("chosenTrain").innerHTML = '';

}