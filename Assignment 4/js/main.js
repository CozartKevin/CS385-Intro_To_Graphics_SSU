
var gl;
var render;

function init() {
    var canvas = document.getElementById("webgl-canvas");
    gl = canvas.getContext("webgl2");

    gl.viewport (0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    
    
   //Sun Size: 1.09
   //Earth Size: 0.01
   //Moon size: 0.0027
   // Earths Orbit : 1.5
   // moon orbit :  0.0175
   // Overall Diameter: 2.6102 * 2 = D
   var sun = new Sphere(60,36);
   var earth = new Sphere(60,36);
   var moon = new Sphere(60,36);


    //Sun Settings
    sun.radius = 2.09;
    sun.color = [0.970, 0.621, 0.165, 1];
    //Earth Settings
    earth.radius = 0.25;
    earth.distance = 5;
    earth.color = [0.247, 0.657, 0.950, 1];
    //Moon Settings
    moon.radius = 0.05;
    moon.distance = 0.5;
    moon.color = [0.860, 0.845, 0.826, 1];

    var t = 0.0;
    
        var axis = [1,0,0]; 


    // Add your sphere creation and configuration code here
    render = function(){
        var D = 2 * (earth.distance + moon.distance + moon.radius); 
        var zNear = 100;
        var zFar = zNear + D;
        var fovy, aspect;
        var sin = (D/2) / (zNear + (D/2));
        fovy = (2 * ((Math.asin(sin) * (180/Math.PI))));
        aspect = canvas.clientWidth/canvas.clientHeight;
        
        var V = translate(0, 0, -0.5*(zNear + zFar)); 
        var P = perspective(fovy, aspect, zNear, zFar);
        var S = scalem(sun.radius); 
        
        sun.P = P;
        earth.P = P;
        moon.P = P;


        // Update your motion variables here
        const HoursPerDay = 24; 
        const DaysPerYear = 365.25 /* days */ * HoursPerDay; 
        var year = t / DaysPerYear * 360; // in degrees 
        var day = t % HoursPerDay; 
      
          t = t + 1;
      

    
        
    
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
        // Add your rendering sequence here
        ms = new MatrixStack();
        var V = translate(0.0, 0.0, -0.5*(zNear + zFar));
        ms.load(V);
        ms.push();
        ms.scale(sun.radius);
        sun.MV = ms.current();
        sun.render();
        ms.pop();
        ms.push();
        ms.rotate(year, axis]);
        ms.translate(earth.distance, 0, 0);
        ms.push();
        ms.rotate(day, axis);
        ms.scale(earth.radius);
        earth.MV = ms.current();
        earth.render();
        ms.pop();
        ms.translate(moon.distance, 0, 0);
        ms.scale(moon.radius);
        moon.MV = ms.current();
        moon.render();
        ms.pop();
    
    
        
    };
    requestAnimationFrame(render);
}


window.onload = init;