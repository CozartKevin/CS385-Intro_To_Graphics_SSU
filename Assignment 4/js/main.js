


var gl;

function init() {
    var canvas = document.getElementById("webgl-canvas");
    gl = canvas.getContext("webgl2");

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    var sun, earth, moon = new Sphere;
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


 
   //Sun Size: 1.09
   //Earth Size: 0.01
   //Moon size: 0.0027
   // Earths Orbit :
   // moon orbit :  
   // Overall Diameter: 

    // Add your sphere creation and configuration code here

    requestAnimationFrame(render);
}

function render() {

    

    // Update your motion variables here

    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    
    ms = new MatrixStack();

    var V = translate(0.0, 0.0, -0.5*(near + far));
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