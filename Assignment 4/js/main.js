
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
   var sun = new Sphere();
   var earth = new Sphere();
   var moon = new Sphere();


    //Sun Settings
    sun.radius = 109;
    sun.color = [0.970, 0.621, 0.165, 1];
    //Earth Settings
    earth.radius = 1;
    earth.distance = 1000;
    earth.color = [0.247, 0.657, 0.950, 1];
    //Moon Settings
    moon.radius = 0.27;
    moon.distance = 15;
    moon.color = [0.860, 0.845, 0.826, 1];

  
    
   

    // Add your sphere creation and configuration code here
    render = function(){
        var year = 100; 
        var day = 0;
        var axis = [1,1,0]; 
    
        var radius = 200;


        var D = 2 * (earth.distance + moon.distance + moon.radius); 
        var fovy, aspect, zNear, zFar; 
        var sin = (D/2) / (zNear + (D/2));
        fovy = (2 * (Math.asin()));
        aspect = canvas.clientWidth/canvas.clientHeight;
        zNear = 1;
        zFar = zNear + D;
        var V = translate(0, 0, -0.5*(zNear + zFar)); 
        var P = perspective(fovy, aspect, zNear, zFar);
        var S = scalem(sun.radius); 
        var t = 0.0;

      
    

        sun.P = P;
        sun.MV =  mult(V,S);
        sun.render();

        const HoursPerDay = 24; 
        const HoursPerYear = 365.25 /* days */ * HoursPerDay; 
      // Render the Earth next 
        var day = t / HoursPerYear * 360; // in degrees 
        var hour = t % HoursPerDay; 
        var earthPos = translate(0.0, 0.0, earth.distance); 
        var earthDay = rotate(day, [0, 1, 0]); 
        var earthHour = rotate(hour, [0, 1, 0]); 
        S = scalem(earth.radius); 
        earth.P = P; 
        // Earth's transforms: V * R * T * R * S 
        earth.MV = mult( 
                     mult( 
                       mult( 
                         // rotate to day of year 
                         mult(V, earthDay), 
                       earthPos), // move to orbit 
                     earthHour), // rotate planet 
                   S); // scale to size 
        earth.render(); 

        var moonPos = translate(0.0, 0.0, moon.distance); 
        S = scalem(moon.radius); 
        moon.P = P; 
        // Moon's transforms: V * R * T * R * T * S 
        moon.MV = mult( 
                    mult( 
                      mult( 
                        mult( 
                          // rotate to day of year 
                          mult(V, earthDay), 
                        earthPos), // move to orbit 
                      earthHour), // rotate planet 
                    moonPos), // move to Moon's orbit 
                  S); // scale to size 
        moon.render(); 

    
    
    

    
        
      
    
        // Update your motion variables here
    
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
        
        ms = new MatrixStack();
        var V = translate(0.0, 0.0, -0.5*(zNear + zFar));
        
        ms.scale(sun.radius, sun.radius, sun.radius);
        

        sun.render();
        ms.pop();
        ms.push();
        ms.rotate(year, axis);
        ms.translate(earth.distance, 0, 0);
        ms.push();
        ms.rotate(day, axis);
        ms.scale(earth.radius);
        earth.render();
        ms.pop();
        ms.translate(moon.distance, 0, 0);
        ms.scale(moon.radius);
        moon.render();
        ms.pop();
    
    
        // Add your rendering sequence here
    };
    requestAnimationFrame(render);
}


window.onload = init;