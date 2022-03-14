//
//  MatrixStack.js
//

function MatrixStack() {
    let stack = [ mat4() ];
    
    this.current = function()  { return stack[0]; };
    this.push = function() { stack.unshift( stack[0] ); };
    this.pop = function() { stack.shift(); };
    this.load = function(m) { stack[0] = m; };
    this.mult = function(m) { stack[0] = mult( stack[0], m ); };
    this.loadIdentity = function() { stack[0] = mat4(); };
    
    this.rotate = function (angle, axis) { 
        stack[0] = mult( stack[0], rotate(angle, axis) );
    };

    this.scale = function(x, y, z) {
        y = y || x;
        z = z || x;
        stack[0] = mult( stack[0], scalem(x, y, z) );
    };
    
    this.translate = function(x, y, z) {
        stack[0] = mult( stack[0], translate(x, y, z) ); 
    };
};