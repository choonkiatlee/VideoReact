document.addEventListener('DOMContentLoaded', () => {

    var video_component = document.getElementById("videoElement");

    console.log(video_component);

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

    function saveAsTextFile (data){
        var textFileAsBlob = new Blob([JSON.stringify(data)], {type:'text/plain'});
        var fileNameToSaveAs = "output_file";
          var downloadLink = document.createElement("a");
        downloadLink.download = fileNameToSaveAs;
        downloadLink.innerHTML = "Download File";
        if (window.webkitURL != null)
        {
            // Chrome allows the link to be clicked
            // without actually adding it to the DOM.
            downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
        }
        else
        {
            // Firefox requires the link to be added to the DOM
            // before it can be clicked.
            downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
            downloadLink.onclick = destroyClickedElement;
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);
        }
    
        downloadLink.click();
    }
    
    
    var json_data;

    var plot_all_btn = document.getElementById("plot_all_btn");
    plot_all_btn.addEventListener("click",()=>{displayData()});
    
    var save_file_btn = document.getElementById("save_file_btn");
    save_file_btn.addEventListener("click",()=>{saveAsTextFile(json_data);});
    
    // Create a canvas element
    var canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 400;
    
    // Get the drawing context
    var ctx = canvas.getContext('2d');
    
    
    function postEmotionResult(port,timestamp){
        ctx.drawImage(video_component, 0, 0, canvas.width, canvas.height);
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
    
        $.ajax({
            url: "https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize?",
            beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","9b739742ca8a43758d41b369f2b91669");
            },
            type: "POST",
            data: file,
            processData: false
            })
            .done(function (response) {
    
                overall_data.push([timestamp,response[0].scores]);
                console.log(overall_data);
                json_data = overall_data;
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
          }        
        });
    });
    
    function makeTimeLabel(dataLength,interval,isforward){
        timeArray = [];
        for (i=0; i<= dataLength; i++){
                if (i % interval === 0){
                  timeArray.push(i);
                } else {
                  timeArray.push('');
                }
        }
      
        if (isforward === false){
          timeArrayNegative = timeArray.map(
            (x) => (x === '')?'':x*-1
          );
          return timeArrayNegative.reverse();
      
        } else {
          return timeArray
        }
    }
    
    
    function displayData(){
    
        var happy = [];
        var angry = [];
        var contempt = [];
        var disgust = [];
        var fear = [];
        var neutral = [];
        var sadness = [];
        var surprise = [];
        var avg_time_interval = 0;
    
        for (var i = 0; i < overall_data.length; i++){
            angry.push(overall_data[i][1].angriness);
            happy.push(overall_data[i][1].happiness);
            contempt.push(overall_data[i][1].contempt);
            disgust.push(overall_data[i][1].disgust);
            fear.push(overall_data[i][1].fear);
            neutral.push(overall_data[i][1].neutral);
            sadness.push(overall_data[i][1].sadness);
            surprise.push(overall_data[i][1].surprise);
            avg_time_interval = (avg_time_interval*i + overall_data[i][0])/(i+1);
        }
        
        
        var config = {
            type: 'line',
            data: {
                labels: makeTimeLabel(overall_data.length,avg_time_interval,true),
                datasets: [{
                    label: "Angriness",
                    borderColor: window.chartColors.red,
                    fill: false,
                    data: angry
                },{
                    label: "Happiness",
                    borderColor: '#e27fef',
                    fill: false,
                    data: happy
                },{
                    label: "Contempt",
                    borderColor: '#5cb85c',
                    fill: false,
                    data: contempt
                },{
                    label: "Disgust",
                    borderColor: "#9500cb",
                    fill: false,
                    data: disgust
                },{
                    label: "Fear",
                    borderColor:  "#4794ff",
                    fill: false,
                    data: fear
                },{
                    label: "Neutral",
                    borderColor: "#003b8f",
                    fill: false,
                    data: neutral
                },{
                    label: "Sadness",
                    borderColor: "#0052C2",
                    fill: false,
                    data: sadness
                },{
                    label: "Surprise",
                    borderColor: "#f0ad4e",
                    fill: false,
                    data: surprise
                },
            ]
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
                        },
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
    
        var ctx = document.getElementById("myChart").getContext("2d");
        window.myLine = new Chart(ctx, config);
    }
    
    

});

