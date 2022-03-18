
var gl;
var render;
var t = 0.0;
var axis = [0,1,0];
var year = 0;

function init() {
    var canvas = document.getElementById("webgl-canvas");
    gl = canvas.getContext("webgl2");

    gl.viewport (0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
  
    
   var sun = new Sphere(120,72);
   var earth = new Sphere(120,72);
   var moon = new Sphere(60,36);
   var saturn = new Sphere(120, 72);
   var earthOrbitTrajectory = new Disk(120, 0.97);
   var moonOrbitTrajectory = new Disk(120, 0.92);
   var saturnRings = new Disk(120, 0.98);
   var saturnOrbitTrajectory = new Disk(120, 0.99);

   earthOrbitTrajectory.color = [0.654, 0.812, 0.860, 1];
   earthOrbitTrajectory.PointMode = false;
   moonOrbitTrajectory.color = [0.636, 0.636, 0.636, 1];
   moonOrbitTrajectory.PointMode = false;
   saturnOrbitTrajectory.color = [0.679, 0.690, 0.30, 1]
   saturnOrbitTrajectory.PointMode = false;
   saturnRings.color = [0.887, 0.900, 0.117, 0.5];

    //Sun Settings
    sun.radius = 2.09;
    sun.color = [0.970, 0.621, 0.165, 0.75];
    //Earth Settings
    earth.radius = 0.35;
    earth.distance = 5;
    earth.color = [0.247, 0.657, 0.950, 0.8];
    //Moon Settings
    moon.radius = 0.15;
    moon.distance = 0.55;
    moon.color = [0.860, 0.845, 0.826, 0.9];

    saturn.radius = 0.5;
    saturn.distance = 20;
    saturn.color = [0.641, 0.650, 0.0845, 0.9];

    // Add your sphere creation and configuration code here
    render = function(){
        var D = 2 * (saturn.distance + 3 /* account for 7 rings of saturn*/); 
        var zNear = 100;
        var zFar = zNear + D;
        var fovy, aspect;
        var sin = (D/2) / (zNear + (D/2));
        fovy = (2 * ((Math.asin(sin) * (180/Math.PI))));
        aspect = canvas.clientWidth/canvas.clientHeight;
        
        var V = mult(translate(0, 0, -0.5*(zNear + zFar)), rotateX(-20)); 
        var P = perspective(fovy, aspect, zNear, zFar);
        var S = scalem(sun.radius); 
        
        sun.P = P;
        earth.P = P;
        moon.P = P;
        saturn.P = P; 
        earthOrbitTrajectory.P = P;
        moonOrbitTrajectory.P = P;
        saturnOrbitTrajectory.P = P;
        saturnRings.P = P;

        // Update your motion variables here
        const HoursPerDay = 24; 
        const DaysPerYear = 365.25 /* days */ * HoursPerDay; 
    
        var day = t / DaysPerYear * 360; // in degrees 
        var hour = t % HoursPerDay; 
      
          t = t + 5;
      if(day === 366){
        day = 0;
        year++;
      }
       
    
        
    
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
        // Add your rendering sequence here
        ms = new MatrixStack();
      
        ms.load(V);
        ms.push();
        ms.scale(sun.radius);
        sun.MV = ms.current();
        sun.render();
        ms.pop();
        ms.push();
        ms.rotate(90, [1,0,0]);
        ms.scale(earth.distance);
        earthOrbitTrajectory.MV = ms.current();
        earthOrbitTrajectory.render();
        ms.pop();
        ms.push();
        ms.rotate(day, axis);
        ms.translate(earth.distance, 0, 0);
        ms.push();
        ms.rotate(hour, axis);
        ms.scale(earth.radius);
        earth.MV = ms.current();
        earth.render();
        ms.pop();
        ms.push();
        ms.rotate(90, [1,0,0]);
        ms.scale(moon.distance);
        moonOrbitTrajectory.MV = ms.current();
        moonOrbitTrajectory.render();
        ms.pop();
        ms.push();
        ms.rotate((2 * day), axis);
        ms.translate(moon.distance, 0, 0);
        ms.scale(moon.radius);
        moon.MV = ms.current();
        moon.render();
        ms.pop();
        ms.pop();
        ms.push();
        ms.rotate(90, [1,0,0]);
        ms.scale(saturn.distance);
        saturnOrbitTrajectory.MV = ms.current();
        saturnOrbitTrajectory.render();
        ms.pop();
        ms.push();
        ms.rotate( 2 * day, axis);
        ms.translate(-saturn.distance, 0, 0);    
        saturn.MV = ms.current();
        saturn.render();
        ms.rotate(270, [1,0,0]);
        
        ms.scale(saturn.radius * 2.5)
        saturnRings.MV = ms.current();
        saturnRings.render();
        for (let i = 0; i < 7; i++){
          if(i == 3){
            ms.scale(1.25);
          }else{
        ms.scale(1.09);
          }
        saturnRings.MV = ms.current();
        saturnRings.render();
        }
       
        ms.pop();
      
      
    
        requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
    
}


window.onload = init;