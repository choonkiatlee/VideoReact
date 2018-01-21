//document.getElementById("text").textContent = "Hello";  



var video_component = document.getElementById("videoElement");

var overall_data = [];

function handleVideo(stream) {
video_component.src = window.URL.createObjectURL(stream);
}

function videoError(e) {
    // do something
}

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
if (navigator.getUserMedia) {       
  navigator.getUserMedia({ video: true }, handleVideo, videoError);
}



var button = document.createElement("button");
button.setAttribute("type" , "button");
//button.setAttribute("onclick", "displayData");
button.setAttribute("innerHTML", "Click Me");
button.setAttribute("style","width=50px;");

button.addEventListener("click",()=>{displayData();});

//document.getElementById("button_div").appendChild(button);

// Create a canvas element
var canvas = document.createElement('canvas');
canvas.width = 500;
canvas.height = 400;

// Get the drawing context
var ctx = canvas.getContext('2d');

//window.setTimeout(getImg,500);

function postEmotionResult(port,timestamp){
    ctx.drawImage(video_component, 0, 0, canvas.width, canvas.height);
    //document.getElementById("canvas_div").appendChild(canvas);
    //console.log(canvas.toDataURL());

    var dataURL = canvas.toDataURL();
    var blobBin = atob(dataURL.split(',')[1]);
    var array = [];
    for(var i = 0; i < blobBin.length; i++) {
            array.push(blobBin.charCodeAt(i));
    }
    var file=new Blob([new Uint8Array(array)], {type: 'image/png'});
    var formdata = new FormData();
    formdata.append("ze_filename", file);
    file = formdata.get("ze_filename");
    //console.log(file);

    $.ajax({
        url: "https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize?",
        //url: 'https://hookb.in/ZRQWyaVP',
        beforeSend: function (xhrObj) {
        xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
        xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","9b739742ca8a43758d41b369f2b91669");
        },
        type: "POST",
        data: file,
        processData: false
        })
        .done(function (response) {
            //port.postMessage({"response": "Done", data: response[0].scores, time: timestamp});
            //console.log(response[0].scores);
            overall_data.push([timestamp,response[0].scores]);
            //overall_data.push([timestamp,"hello"]);
            console.log(overall_data);
            //port.postMessage({"response":"Done"});
        })
        .fail(function (error) {
        console.log("Failure :(");
    });

}

chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name == "connection");
    port.onMessage.addListener(function(msg) {
      if (msg.command == "Take Picture"){
        postEmotionResult(port,msg.time);
        //var result = getImg();
          //console.log(result);
      }

        //port.postMessage({response: "Done", data: "Happy"});
        
    });
});


function displayData(){

    var happy = [];

    for (var i = 0; i < overall_data.length; i++){
        happy.push({x:overall_data[i][0],y:overall_data[i][1].happiness});
    }

    console.log(happy);

    var config = {
        type: 'line',
        data: {
            datasets: [{
                label: "Happy",
                backgroundColor: window.chartColors.red,
                borderColor: window.chartColors.red,
                fill: false,
                data: [{x:5,y:10},{x:10,y:5},{x:10,y:30}]//happy
            }]
        },
        options: {
            responsive: true,
            title:{
                display:true,
                text:'Chart.js Line Chart'
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'time'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Normalised Values'
                    }
                }]
            }
        }

    };

    var ctx = document.getElementById("canvas_chart").getContext("2d");
    window.myLine = new Chart(ctx, config);
}








/*
var img = new Image;
img.src = canvas.toDataURL();
ctx = canvas.getContext('2d');
ctx.clearRect(0, 0, canvas.width, canvas.height);
img.onload = function(){
    ctx.drawImage(img, 0, 0);
    
};


*/





/*if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` since we only want video now
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        video_component.src = window.URL.createObjectURL(stream);
        video_component.play();
    });
}
*/
/*
makeblob = function (dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        var parts = dataURL.split(',');
        var contentType = parts[0].split(':')[1];
        var raw = decodeURIComponent(parts[1]);
        return new Blob([raw], { type: contentType });
    }
    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
}

function readBody(xhr) {
    var data;
    if (!xhr.responseType || xhr.responseType === "text") {
        data = xhr.responseText;
    } else if (xhr.responseType === "document") {
        data = xhr.responseXML;
    } else {
        data = xhr.response;
    }
    return data;
}

var url = "https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize?";
url = "https://hookb.in/vaP3JxoB";
var xhr = new XMLHttpRequest();

xhr.onreadystatechange = function() {//Call a function when the state changes.
    if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
        console.log("Hello");
        console.log(JSON.stringify(readBody(xhr)));
        console.log(xhr.getAllResponseHeaders());
    }
    
}

xhr.open("POST", url, true);

//xhr.setRequestHeader("Content-Type","application/json");
xhr.setRequestHeader("Content-Type","application/octet-stream");
xhr.setRequestHeader("Ocp-Apim-Subscription-Key","9b739742ca8a43758d41b369f2b91669");

var blob = makeblob(canvas.toDataURL());

var byteString = atob(canvas.toDataURL().split(";base64,")[1]);

xhr.send(blob);

*/


/*
$(function() {
    // No query string parameters for this API call.
    var params = { };

    $.ajax({
        // NOTE: You must use the same location in your REST call as you used to obtain your subscription keys.
        //   For example, if you obtained your subscription keys from westcentralus, replace "westus" in the 
        //   URL below with "westcentralus".
        url: "https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize?" + $.param(params),
        beforeSend: function(xhrObj){
            // Request headers, also supports "application/octet-stream"
            //xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader("Content-Type","application/octet-stream");

            // NOTE: Replace the "Ocp-Apim-Subscription-Key" value with a valid subscription key.
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","9b739742ca8a43758d41b369f2b91669");
        },
        type: "POST",
        // Request body
        data: makeblob(canvas.toDataURL())//ctx.getImageData(0, 0, canvas.width, canvas.height).data,
    }).done(function(data) {
        document.getElementById("hello").textContent = data;
        // Get face rectangle dimensions
        var faceRectangle = data[0].faceRectangle;
        var faceRectangleList = $('#faceRectangle');

        // Append to DOM
        for (var prop in faceRectangle) {
            faceRectangleList.append("<li> " + prop + ": " + faceRectangle[prop] + "</li>");
        }

        // Get emotion confidence scores
        var scores = data[0].scores;
        var scoresList = $('#scores');

        // Append to DOM
        for(var prop in scores) {
            scoresList.append("<li> " + prop + ": " + scores[prop] + "</li>")
        }
    }).fail(function(err) {
        alert("Error: " + JSON.stringify(err));
    });
});

*/