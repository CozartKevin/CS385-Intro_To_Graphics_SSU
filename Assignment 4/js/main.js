
var gl;
var render;

function init() {
    var canvas = document.getElementById("webgl-canvas");
    gl = canvas.getContext("webgl2");

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    
   //Sun Size: 1.09
   //Earth Size: 0.01
   //Moon size: 0.0027
   // Earths Orbit : 1.5
   // moon orbit :  0.0175
   // Overall Diameter: 2.6102 * 2 = D
   var sun = new Sphere;
   var earth = new Sphere;
   var moon = new Sphere;
    //Sun Settings
    sun.radius = 1.09;
    sun.color = (0.970, 0.621, 0.165, 1);
    //Earth Settings
    earth.radius = 0.01;
    earth.distance = 1.5;
    earth.color = (0.247, 0.657, 0.950, 1)
    //Moon Settings
    moon.radius = 0.0027;
    moon.distance = 0.0175;
    moon.color = (0.860, 0.845, 0.826, 1)

    sun.P = perspective(fovy, aspect, zNear, zFar);
    earth.P = perspective(fovy, aspect, zNear, zFar);
    moon.P = perspective(fovy, aspect, zNear, zFar);

    sun.MV =  scalem(sun.raidus, sun.radius, sun.raius)
    earth.MV = scalem(earth.radius, earth.radius, earth.radius);
    moon.MV = scalem(moon.radius, moon.radius, moon.radius);

    gl.viewport (0, 0, canvas.clientWidth, canvas.clientHeight);
    var D = 2 * (earth.distance + moon.distance + moon.radius) 
    var fovy, aspect, zNear, zFar; 
    var tan = (D/2) / zNear + (D/2);
    fovy = 2 * (1/tan);
    aspect = canvas.clientWidth/canvas.clientHeight;
    zNear = 1;
    zFar = zNear + D;

    // Add your sphere creation and configuration code here
    render = function(){
        var year = 0; 
        var day = 0;
        var axis = 0; 
    
        var D = 2 * (1.5 + 0.0175 + 0.0027) 
        var fovy, aspect, zNear, zFar; 
        var tan = (D/2) / zNear + (D/2);
        fovy = 2 * (1/tan);
        aspect = canvas.clientWidth/canvas.clientHeight;
        zNear = 1;
        zFar = zNear + D;
    
    
    
        if(day === 366){
           day = 0;
            time = 0.0;
            year++;
        }
    
    
        
        var eye = [0,0,-0.5*(zNear + zFar)]
        var look = [0,0,0];
        var up = [0,0,1];
       // var m = lookAt(eye, look, up);
    
    
        // Update your motion variables here
    
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
        
        ms = new MatrixStack();
    
        var V = translate(0.0, 0.0, -0.5*(zNear + zFar));
        ms.load(V);
        ms.push();
        ms.scale(sun.radius);
        sun.draw;
        ms.pop();
        ms.push();
        //ms.rotate(year, axis);
        ms.translate(earth.distance, 0, 0);
        ms.push();
       // ms.rotate(day, axis);
        ms.scale(earth.radius);
        earth.draw;
        ms.pop();
        ms.translate(moon.distance, 0, 0);
        ms.scale(moon.radius);
        moon.draw;
        ms.pop();
    
    
        // Add your rendering sequence here
    };
    requestAnimationFrame(render);
}



var year = 0; 
var day = 0;
var axis = 0; 
function render() {
 
    var canvas = document.getElementById("webgl-canvas");
    gl = canvas.getContext("webgl2");

    var D = 2 * (1.5 + 0.0175 + 0.0027) 
    var fovy, aspect, zNear, zFar; 
    var tan = (D/2) / zNear + (D/2);
    fovy = 2 * (1/tan);
    aspect = canvas.clientWidth/canvas.clientHeight;
    zNear = 1;
    zFar = zNear + D;



    if(day === 366){
       day = 0;
        time = 0.0;
        year++;
    }


    
    var eye = [0,0,-0.5*(zNear + zFar)]
    var look = [0,0,0];
    var up = [0,0,1];
   // var m = lookAt(eye, look, up);


    // Update your motion variables here

    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    
    ms = new MatrixStack();

    var V = translate(0.0, 0.0, -0.5*(zNear + zFar));
    ms.load(V);
    ms.push();
    ms.scale(sun.radius);
    sun.draw();
    ms.pop();
    ms.push();
    ms.rotate(year, axis);
    ms.translate(earth.distance, 0, 0);
    ms.push();
    ms.rotation(day, axis);
    ms.scale(earth.radius);
    earth.draw();
    ms.pop();
    ms.translate(moon.distance, 0, 0);
    ms.scale(moon.radius);
    moon.draw();
    ms.pop();


    // Add your rendering sequence here

    requestAnimationFrame(render);
}

window.onload = init;