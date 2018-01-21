var happy = [];
var angry = [];
var contempt = [];
var disgust = [];
var fear = [];
var neutral = [];
var sadness = [];
var surprise = [];
var overall_data = [];


var myChart;

var dynamic_plot_on = false;



document.addEventListener('DOMContentLoaded', () => {

    var video_component = document.getElementById("videoElement");

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

    var plot_dynamic_btn = document.getElementById("plot_dynamic_btn");
    plot_dynamic_btn.addEventListener("click",()=>{dynamicPlot()});
    
    var save_file_btn = document.getElementById("save_file_btn");
    save_file_btn.addEventListener("click",()=>{saveAsTextFile(json_data);});

    var reset_btn = document.getElementById("reset_btn");
    reset_btn.addEventListener("click",()=>{resetData();});
    
    // Create a canvas element
    var canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 400;
    
    // Get the drawing context
    var ctx = canvas.getContext('2d');

    //Draw Initial Chart Display
    initialDisplay();
    
    
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
                
                //Only push data if timestamps are not equal
                var last_val = 0;
                if (overall_data.length != 0){
                    last_val = overall_data[overall_data.length-1];
                }

                if(last_val != timestamp){
                    overall_data.push([timestamp,response[0].scores]);

                    angry.push(response[0].scores.anger);
                    happy.push(response[0].scores.happiness);
                    contempt.push(response[0].scores.contempt);
                    disgust.push(response[0].scores.disgust);
                    fear.push(response[0].scores.fear);
                    neutral.push(response[0].scores.neutral);
                    sadness.push(response[0].scores.sadness);
                    surprise.push(response[0].scores.surprise);

                    if (dynamic_plot_on){

                        if (overall_data.length == 2){
                            console.log("Hello");
                            displayData();
                        }
                        else if (overall_data.length > 2){
    
                            if ((overall_data.length -1) > myChart.data.datasets[0].data.length || (overall_data.length -1) > myChart.data.labels.length ){
                                displayData();
                            }
                            else{
                                var next_time = myChart.data.labels[myChart.data.labels.length-1] + myChart.data.labels[1]-myChart.data.labels[0];
                                console.log(next_time);

                                myChart.data.labels.push(next_time);
        
                                myChart.data.datasets[0].data.push(response[0].scores.anger);
                                myChart.data.datasets[1].data.push(response[0].scores.happiness);
                                myChart.data.datasets[2].data.push(response[0].scores.contempt);
                                myChart.data.datasets[3].data.push(response[0].scores.disgust);
                                myChart.data.datasets[4].data.push(response[0].scores.fear);
                                myChart.data.datasets[5].data.push(response[0].scores.neutral);
                                myChart.data.datasets[6].data.push(response[0].scores.sadness);
                                myChart.data.datasets[7].data.push(response[0].scores.surprise);
        
                                myChart.update();
                            }

                            
    
                        }
    
                    }

                    console.log(myChart.data.labels);
                    console.log(overall_data.length);

                    
                }

                //console.log(overall_data);
                json_data = overall_data;
                
            })
            .fail(function (error) {
            console.log("Failure :(");
        });
    
    }

    function dynamicPlot(){
        dynamic_plot_on = !dynamic_plot_on;
    }
    
    chrome.runtime.onConnect.addListener(function(port) {
        console.assert(port.name == "connection");
        port.onMessage.addListener(function(msg) {
          if (msg.command == "Take Picture"){
            postEmotionResult(port,msg.time);
          }        
        });
    });
    
    function makeTimeLabel(dataLength,interval,start_time){
        timeArray = [];
        for (i=0; i<= dataLength; i++){
            timeArray.push(start_time+i*interval);
        }
        return timeArray
    }
    

    function displayData(){

        if (overall_data.length >=2){
            var avg_time_interval = 0;

            for (var i = 1; i < overall_data.length; i++){
                
                current_time_interval = overall_data[i][0] = overall_data[i-1][0];
                avg_time_interval = (avg_time_interval*(i) + current_time_interval)/(i);
                console.log(current_time_interval);
            }

            myChart.data.labels = makeTimeLabel(overall_data.length,avg_time_interval,overall_data[0][0]);
            console.log(makeTimeLabel(overall_data.length,avg_time_interval,overall_data[0][0]));

            myChart.data.datasets[0].data = angry;
            myChart.data.datasets[1].data = happy;
            myChart.data.datasets[2].data = contempt;
            myChart.data.datasets[3].data = disgust;
            myChart.data.datasets[4].data = fear;
            myChart.data.datasets[5].data = neutral;
            myChart.data.datasets[6].data = sadness;
            myChart.data.datasets[7].data = surprise;

            myChart.update();
        }

    }

    function resetData(){
        myChart.data.labels = [];
        myChart.data.datasets.forEach((dataset) => {
            dataset.data = [];
        });

        overall_data = [];
        angry = [];
        happy = [];
        contempt = [];
        disgust = [];
        fear = [];
        neutral = [];
        sadness = [];
        surprise = [];

        myChart.update();
    }

    



    
    function initialDisplay(){        
        
        var config = {
            type: 'line',
            data: {
                //labels: makeTimeLabel(overall_data.length,avg_time_interval,true),
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
    
        var chart_ctx = document.getElementById("myChart").getContext("2d");
        myChart = new Chart(chart_ctx, config);
    }
});

