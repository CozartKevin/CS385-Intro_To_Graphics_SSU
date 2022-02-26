

function Cube( gl, vertexShaderId, fragmentShaderId ) {

    // Initialize the shader pipeline for this object using either shader ids
    //   declared in the application's HTML header, or use the default names.
    //
    var vertShdr = vertexShaderId || "Cube-vertex-shader";
    var fragShdr = fragmentShaderId || "Cube-fragment-shader";

    this.program = initShaders(gl, vertShdr, fragShdr);
   
    if ( this.program < 0 ) {
        alert( "Error: Cube shader pipeline failed to compile.\n\n" +
            "\tvertex shader id:  \t" + vertShdr + "\n" +
            "\tfragment shader id:\t" + fragShdr + "\n" );
        return; 
    }
   
    this.uniforms = {
            MV : gl.getUniformLocation(this.program, "MV"),
            P : gl.getUniformLocation(this.program, "P")
        };

    this.P = mat4();
    this.MV = mat4();

    this.count = 8;

    //List of verticies that make up the 8 points of the cube
    //cube Vertice Location Array
     var cVLA = {
        values : new Float32Array([
       -1.0,  1.0,  1.0,   //vertex 0 | Front-Top-Left
        1.0,  1.0,  1.0,   //vertex 1 | Front-Top-Right
       -1.0, -1.0,  1.0,   //vertex 2 | Front-Bottom-Left
        1.0, -1.0,  1.0,   //vertex 3 | Front-Bottom-Right
       -1.0,  1.0, -1.0,   //vertex 4 | Back-Top-Left
        1.0,  1.0, -1.0,   //vertex 5 | Back-Top-Right
       -1.0, -1.0, -1.0,   //vertex 6 | Back-Bottom-Left
        1.0, -1.0, -1.0    //vertex 7 | Back-Bottom-Right
        ])
    };


    
    //Triangle Strip Draw Order Array
    //Order of Vector elements based on Figure 2: Triangulating a cube for one sequential strip.
    // URL: http://www.cs.umd.edu/gvil/papers/av_ts.pdf 
    var tSDOA = {
       values: new Uint16Array([
              0, 1, 2, 3, 7, 1, 5, 0, 4, 2, 6, 7, 4, 5
    ])
    };

    this.cVLA = { numComponents : 3 };
    this.tSDOA = { count : tSDOA.values.length };
    
 
    const faceColors = [
        [1.0,  1.0,  1.0,  1.0],    // Front face: white
        [1.0,  0.0,  0.0,  1.0],    // Back face: red
        [0.0,  1.0,  0.0,  1.0],    // Top face: green
        [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
        [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
        [1.0,  0.0,  1.0,  1.0],    // Left face: purple
      ];
    
      // Convert the array of colors into a table for all the vertices.
    
      var colors = [];
    
      for (var j = 0; j < faceColors.length; ++j) {
        const c = faceColors[j];
    
        // Repeat each color four times for the four vertices of the face
        colors = colors.concat(c, c, c, c);
      }
    
      const colorBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

      



    this.cVLA.buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, this.cVLA.buffer);
    gl.bufferData( gl.ARRAY_BUFFER, cVLA.values, gl.STATIC_DRAW );

    this.tSDOA.buffer = gl.createBuffer();
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.tSDOA.buffer );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, tSDOA.values, gl.STATIC_DRAW );

    this.cVLA.attributeLoc = gl.getAttribLocation( this.program, "aPosition" );
    gl.enableVertexAttribArray( this.cVLA.attributeLoc );


    this.render = function () {
        gl.useProgram( this.program );
      
       gl.uniformMatrix4fv(this.uniforms.MV, false, flatten(this.MV));
        gl.uniformMatrix4fv(this.uniforms.P, false, flatten(this.P));


        gl.bindBuffer( gl.ARRAY_BUFFER, this.cVLA.buffer );
        gl.vertexAttribPointer( this.cVLA.attributeLoc, this.cVLA.numComponents, gl.FLOAT, gl.FALSE,  0, 0 );
 
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.tSDOA.buffer );

        // Draw the Cube
      gl.drawElements(gl.TRIANGLE_STRIP, this.tSDOA.count, gl.UNSIGNED_SHORT, 0);
      // Known Good Vert Test gl.drawElements(gl.Line_Strip, this.tSDOA.count, gl.UNSIGNED_SHORT, 0);
    
    }
   




};
