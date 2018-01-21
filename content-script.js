console.log("Hello");

document.addEventListener('DOMContentLoaded', () => {

    var player = document.getElementById("videoElement");

    console.log(player);

    // Create a canvas element
    var canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 400;

    // Get the drawing context
    var ctx = canvas.getContext('2d');

});



//ctx.drawImage(player, 0, 0, canvas.width, canvas.height);
//document.getElementById("canvas_div").appendChild(canvas);

/*

window.setTimeout(getImg,500);

function getImg(){
    ctx.drawImage(player, 0, 0, canvas.width, canvas.height);
    document.getElementById("canvas_div").appendChild(canvas);
}

*/