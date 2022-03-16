

var gl;


function init() {
    var canvas = document.getElementById("webgl-canvas");
    gl = canvas.getContext("webgl2");
    gl.viewport(0,0, gl.canvas.clientWidth, gl.canvas.clientHeight);
    gl.clearColor(0.0,0.0,0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);

     sun = new Sphere();
     sun.radius = 10; 
    // Add your sphere creation and configuration code here

    requestAnimationFrame(render);
}

function render() {
  
    // Update your motion variables here
 
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    aspect = gl.canvas.clientWidth / gl.canvas.ClientHeight
    var zNear = 1; 
    var ZFar = 2000;
    // Add your rendering sequence here
    
     sun.MV = mult(scalem(sun.radius, sun.radius, sun.radius), translate(0.0, 0.0, -0.5 * (zNear + ZFar)));
     sun.P = perspective(120, aspect, zNear, ZFar);
     sun.color = vec4([1.0,0.0,1.0,1.0]);
     sun.render();

   

    requestAnimationFrame(render);
}

window.onload = init;