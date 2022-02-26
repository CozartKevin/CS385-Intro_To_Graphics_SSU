var angle = 0; 
var fovy = 90;
var zNear = 10;
var zFar = 50;


function init()
{
	var canvas = document.getElementById("webgl-canvas");
	var P;
	gl = canvas.getContext("webgl2");
	gl.viewport(0,0, gl.canvas.width, gl.canvas.height);
	aspect = gl.canvas.width/gl.canvas.height;
	P = perspective(fovy, aspect, zNear, zFar);
	gl.clearColor(0.0,0.0,0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.CULL_FACE);
	gl.cullFace(gl.BACK);
	gl.clearDepth(1.0);
	gl.enable(gl.DEPTH_TEST);
	cube = new Cube(gl);
	

	requestAnimationFrame(render);

}

function resize(){
	

	
}
window.onresize = resize;

function render()
{	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	aspect = gl.canvas.width/gl.canvas.height;
	var p = perspective(fovy, aspect, zNear, zFar);
	var s = scalem(0.5, 0.5, 0.5); 
	var r = rotate((angle += 0.3), [1, 1, 1]); 
	//cube.P = vec4(p);
	cube.MV = mult(r,s);
	

	
	cube.render();
	
	requestAnimationFrame(render);

}
	window.onload = init;