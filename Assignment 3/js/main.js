var angle = 0; 

function init()
{
	var canvas = document.getElementById("webgl-canvas");
	var P;
	
	gl = canvas.getContext("webgl2");
	gl.clearColor(0.0,0.0,0.0, 1.0);
//	gl.enable(gl.CULL_FACE);
//	gl.cullFace(gl.BACK);
	gl.clearDepth(1.0);
	gl.enable(gl.DEPTH_TEST);
	cube = new Cube(gl);
	
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
	var s = scalem(0.5, 0.5, 0.5); 
	var r = rotate((angle += 1), [1, 1, 1]); 
	cube.MV = mult(r,s);

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	cube.render();
	
	requestAnimationFrame(render);

}
	window.onload = init;