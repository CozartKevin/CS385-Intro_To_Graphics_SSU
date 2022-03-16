

var gl;
var sun = undefined;

function init() {
    var canvas = document.getElementById("webgl-canvas");
    gl = canvas.getContext("webgl2");
    gl.viewport(0,0, canvas.clientWidth, canvas.clientHeight);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
     sun = new Sphere();

   
    // Add your sphere creation and configuration code here

    requestAnimationFrame(render);
}

function render() {
  var canvas = document.getElementById("webgl-canvas");
  gl = canvas.getContext("webgl2");
    // Update your motion variables here
    var zNear = 1; 
    var ZFar = 2000;
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    var aspect = canvas.clientWidth / canvas.ClientHeight
    // Add your rendering sequence here
    sun.MV = mult(scalem(10,10,10), translate(0.0, 0.0, -0.5 * (zNear + ZFar)) );
    sun.P = perspective(120, aspect, zNear, ZFar);
    sun.color = [1.0,0.0,1.0,1.0];
    sun.render();
    requestAnimationFrame(render);
}

window.onload = init;