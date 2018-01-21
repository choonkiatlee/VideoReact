Webcam.set({
  width: 320,
  height: 240,
  image_format: 'jpeg',
  jpeg_quality: 90
});
Webcam.attach('#my_camera');


setInterval(function(){
    Webcam.snap(function(data_uri) {
        // display results in page
        document.getElementById('selfie').innerHTML = 
        '<img src="'+data_uri+'"/>';
        
        var canvas = document.getElementById("trans_canvas");
        var img = new Image;
        img.src = data_uri;
        context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        img.onload = function(){
            context.drawImage(img, 0, 0);
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
            console.log(file);
            $.ajax({
                 url: "https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize?",
                 beforeSend: function (xhrObj) {
                 xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
                 xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","1ac2d460350c470aaf911e9d4dcabcbe");
                 },
                 type: "POST",
                 data: file,
                 processData: false
                 })
                 .done(function (response) {
                    console.log("Success :)");
                    console.log(response[0]);
                    console.log(response[0].faceRectangle);
                    context.beginPath();
                    context.lineWidth="6";
                    context.strokeStyle="red";
                    context.rect(response[0].faceRectangle.left,
                                response[0].faceRectangle.top,
                                response[0].faceRectangle.width,
                                response[0].faceRectangle.height);
                    context.stroke();
                    
                 })
                 .fail(function (error) {
                    console.log("Failure :(");
             });
        }
    });
}, 5000);