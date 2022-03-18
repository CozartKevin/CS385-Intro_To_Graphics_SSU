//
//  --- Disk.js ---
//
//  Create a planar (2D) disk geometric object.  The disk is centered at the
//    origin, with an outer radius of one, and an user-specified inner radius.
//    If the inner radius is zero, then a filled circle is rendered, otherwise
//    an annulus is drawn.  The tessellation of the disk is controlled by a 
//    a variable named "slices", which controls how many points around the
//    perimeter are computed.
//
//  The Disk object includes the following "external" variables (i.e., they
//    can have their values set in JavaScript code external to this file):
//
//    * PointMode -(boolean) setting this to true will render the sphere as a 
//                  collection of points, as compared to triangles.
//                  Default: false
//    * MV - (mat4) the model-view transformation.  This is defined in the
//           vertex shader.  Default: the 4x4 identity matrix
//    * P - (mat4) the projection transformation.  This is also defined in the
//          vertex shader.  Default: the 4x4 identity matrix
//    * color - (ve4) a color defined in the fragment shader.
//              Default value: (0, 0, 0, 1)


function Disk( slices, innerRadius, vertexShader, fragmentShader ) { 
    let i, j;  // loop counters

    let program = initShaders(gl,
        vertexShader || "vertex-shader",
        fragmentShader || "fragment-shader");

    // Set the computational parameters of the disk
    let nSlices = slices || 20; // Default number of slices
    let dTheta = 2.0 * Math.PI / nSlices;

    // Specify how we'll render the disk.  If the inner radius (innerRadius)
    //   is zero, we're basically rendering a filled circle, so we can use a
    //   triangle fan.  If the inner radius is greater than zero, we're
    //   rendering an annulus, which is drawn using a triangle strip.
    let topology = undefined;

    let positions = [];
    // Generate the coordinates for the vertices of the disk.
    if (innerRadius == 0.0) {
        // The disk is a filled circle, so we can render it using a 
        //   triangle fan.  First, we push the coordinate of the
        //   shared vertex of all of the fan triangles.
        positions.push(0.0, 0.0);

        for (i = 0; i <= nSlices; ++i) {
            let theta = i * dTheta;
            let x = Math.cos(theta);
            let y = Math.sin(theta);

            positions.push(x, y);
        }

        topology = gl.TRIANGLE_FAN;
    }
    else {
        for (i = 0; i <= nSlices; ++i) {
            let theta = i * dTheta;
            let x = Math.cos(theta);
            let y = Math.sin(theta);

            positions.push(innerRadius * x, innerRadius * y);
            positions.push(x, y);
        }

        topology = gl.TRIANGLE_STRIP;
    }
    
    positions.numComponents = 2;

    // Configure our WebGL vertex buffer
    positions.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positions.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions),
        gl.STATIC_DRAW);
    
    // Set up our aPosition vertex shader attribute
    var aPosition = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPosition);

    // Initialize our externally viewable variables
    this.PointMode = false;
    
    var P = gl.getUniformLocation(program, "P");
    if (P) { this.P = mat4(); }

    var MV = gl.getUniformLocation(program, "MV");
    if (MV) { this.MV = mat4(); }

    var color = gl.getUniformLocation(program, "color");
    if (color) { this.color = vec4(); }

    // Define our render() function
    this.render = function () {
        gl.useProgram(program);

        gl.bindBuffer(gl.ARRAY_BUFFER, positions.buffer);
        gl.vertexAttribPointer(aPosition, positions.numComponents,
            gl.FLOAT, gl.FALSE, 0, 0);

        if (P) { gl.uniformMatrix4fv(P, false, flatten(this.P)); }
        if (MV) { gl.uniformMatrix4fv(MV, false, flatten(this.MV)); }
        if (color) { gl.uniform4fv(color, flatten(this.color)); }

        if (this.PointMode) { topology = gl.POINTS; }
        
        const count = positions.length / positions.numComponents;

        gl.drawArrays(topology, 0, count);
    };
};