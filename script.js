/////////////////////
// Websocket Stuff //
/////////////////////
// Create WebSocket connection. Change username at the end for yours Case Sensitive
let theRun = new WebSocket('wss://fh76djw1t9.execute-api.eu-west-1.amazonaws.com/prod?username=GoobIsGabe');;
//Set this to your Streamerbot Websocket Server
let streamerBotSocket = new WebSocket("ws://127.0.0.1:8080/");

function connectTheRun() {

    theRun.onopen = function () {
        console.log('WebSocket connection established with The Run.');
    };

    theRun.onmessage = function (event) {
        console.log(`[message] Data received from server: ${event.data}`);
        //////////////////////////////////
        // Making Splits Show On Screen //
        //////////////////////////////////
        var json = JSON.parse(event.data);

        //If just started, don't show the split
        if (!json.run.currentSplitIndex == 0) {
            //Prepare split Lineup
            var listObject = document.createElement('li');
            var spanName = document.createElement('span');
            var spanDelta = document.createElement('span');
            var spanTime = document.createElement('span');
            spanName.id = 'name';
            spanTime.id = 'splitTime';
            listObject.id = 'listObject';
            listObject.className = 'split';
            // Checks if there is a name available to pull from
            if (json.run.hasOwnProperty('splits')) {
                //If the first split has available name & if index is over 0
                if (
                    json.run.splits[0].hasOwnProperty('name') &&
                    json.run.currentSplitIndex > 0
                ) {
                    //Sets data for attributes per split
                    listObject.id = json.run.currentSplitIndex - 1
                    spanName.className = json.run.splits[json.run.currentSplitIndex - 1].name;
                    spanName.innerHTML = json.run.splits[json.run.currentSplitIndex - 1].name;
                    console.log("Delta is " + json.run.delta);
                    console.log("Delta w/ Function is " + calculateDelta(json.run.delta));
                    spanDelta.innerHTML = calculateDelta(json.run.delta);
                    //Checks if behind or ahead and sets class
                    if (spanDelta.innerHTML.includes("-"))
                        spanDelta.className = "ahead"
                    else
                        spanDelta.className = "behind"
                    
                    //Converts to a better readable format
                    spanTime.innerHTML = msToMinsAndSeconds(json.run.currentTime);
                }
            }
            ///////////////////////////
            //Creates the DOM element//
            ///////////////////////////
            //Prepares the line
            listObject.appendChild(spanName);
            listObject.appendChild(spanDelta);
            listObject.append(' | ');
            listObject.appendChild(spanTime);
            //Adds the line to DOM
            document.getElementById('splits').appendChild(listObject);
        }
        //When just started
        else {
            //Perform Streamer Bot Actions 
            //Right Click Action Copy ID, name specific, and last id can be anything
            streamerBotSocket.send(JSON.stringify(
                {
                    "request": "DoAction",
                    "action": {
                        "id": "70bdd696-bb2f-4399-b924-838e79560911",
                        "name": "[Speedrunning] 一Effect Start Run (HTML)"
                    },
                    "id": "100"
                }
            ));
        }
        ///////////////////////////
        // Remove splits on Reset//
        ///////////////////////////
        if (json.run.hasReset) {
            console.log('You have reset');
            //Get all DOM elements by class name
            const splits = document.querySelectorAll('.split');

            //For each .split remove it
            splits.forEach((split) => {
                split.remove();
            })
            //Perform Streamer Bot Actions 
            //Right Click Action Copy ID, name specific, and last id can be anything
            streamerBotSocket.send(JSON.stringify(
                {
                    "request": "DoAction",
                    "action": {
                        "id": "9d2049f7-1afb-4b3e-bad2-848c3467f279",
                        "name": "[Speedrunning] 一Effect Reset Run (HTML)"
                    },
                    "id": "101"
                }
            ));
        }
    };

    theRun.onclose = function (event) {
        console.log('WebSocket connection closed with code ' + event.code + ': ' + event.reason);
    };

    // Set up the streamerBotSocket
    streamerBotSocket.addEventListener('open', () => {
        console.log('Connected to streamer bot');
    });

    streamerBotSocket.addEventListener('message', event => {
        console.log('Received streamer bot data:', event.data);
    });

    streamerBotSocket.addEventListener('close', event => {
        console.log(`Disconnected from streamer bot with code ${event.code}`);
    });
}

connectTheRun(); // Start initial connection

function calculateDelta(millis) {
    if (millis.toString().includes('-')) {
        var minutes = Math.floor(millis / 60000)
        var seconds = ((millis % 60000) / 1000).toFixed(2)
        return " " + minutes + ':' + (seconds) > 10 ? '0' : ' ' + seconds
    }
    else {
        var minutes = Math.floor(millis / 60000)
        var seconds = ((millis % 60000) / 1000).toFixed(2)
        if (millis < 60000) {
            return " +" + (Math.abs(seconds) < 10 ? '0' : '') + seconds
        }
        else {
            return " +" + minutes + ':' + (Math.abs(seconds) < 10 ? '0' : '') + seconds
        }
    }
}

function msToMinsAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000)
    var seconds = ((millis % 60000) / 1000).toFixed(2)
    return minutes + ':' + (Math.abs(seconds) < 10 ? '0' : '') + seconds
}

///////////////////////
// Getting WR and PB //
///////////////////////
// https://www.speedrun.com/the_site/thread/hf6r2 for info

// Edit these to your liking
let gameID = "k6qwoez6" //Sonic Frontiers
let categoryID = "9d8n33ld" //Any%
let yourName = "GoobIsGabe" // Your display name
let srcUserID = "0jmol5n8" // your ID https://www.speedrun.com/api/v1/users?lookup=[YourName]

async function getRecords() {
    let url = "https://www.speedrun.com/api/v1/leaderboards/" + gameID + "/category/" + categoryID;
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
    console.log(response.status); // 200
    console.log(response.statusText); // OK

    let data = await response.blob();
    console.log(data);
}

async function renderRecords() {
    let records = await getRecords();
    let html = '';

    // Collect all the fetch promises in an array
    const fetchPromises = records.data.runs.map(async record => {
        if (record.place == 1) {
            const response = await fetch('https://www.speedrun.com/api/v1/users/' + record.run.players[0].id);
            const { data } = await response.json();
            const wrHolderName = data.names.international;

            let wrTime = new Date(record.run.times.primary_t * 1000);
            let formattedTime = wrTime.toISOString().substr(11, 12);

            let htmlSegment = `<h2 class="card_title">World Record: ${formattedTime} by ${wrHolderName}</h2>
                            </div>`;
            html += htmlSegment;
        }
        if (record.run.players[0].id == srcUserID) {
            let pbTime = new Date(record.run.times.primary_t * 1000);
            formattedTime = pbTime.toISOString().substr(11, 12)

            let htmlSegment = `<div class="card card-1">
                            <h2 class="card_title">Personal Best: ${formattedTime}</h2>
                        `;
            html += htmlSegment;
        }
    });

    // Wait for all the fetch requests to resolve
    await Promise.all(fetchPromises);

    let container = document.querySelector('.showcase');
    container.innerHTML = html;
}

renderRecords();