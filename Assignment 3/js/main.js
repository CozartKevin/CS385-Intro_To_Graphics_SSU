

function init()
{
	var canvas = document.getElementById("webgl-canvas");
	var P;

	gl = canvas.getContext("webgl2");
	gl.clearColor(0.0,0.0,0.0, 1.0);
//	gl.enable(gl.CULL_FACE);
//	gl.cullFace(gl.BACK);
//	gl.clearDepth(1.0);
//	gl.enable(gl.DEPTH_TEST);
	cube = new Cube(gl, 6);

	requestAnimationFrame(render);

}

function resize(){
	var canvas = document.getElementById("webgl-canvas");
	var P;
	var fovy = 60;
	var zNear = 1;
	var zFar = 1500;
	
	gl.viewport(0,0, gl.canvas.width, gl.canvas.height);
	aspect = gl.canvas.width/gl.canvas.height;
	P = perspective(fovy, aspect, zNear, zFar);
	requestAnimationFrame(render);

}
window.onresize = resize;

function render()
{
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	cube.render();

	requestAnimationFrame(render);

}
	window.onload = init;