function Camera(){
    Object3D.apply(this);

    var projectionMatrix = mat4.create();
    var laMatrix = mat4.create();

    this.GetProjectionMatrix = function(){
        mat4.perspective(projectionMatrix, 45, OMEGA.Omega3D.GL.viewPortWidth / OMEGA.Omega3D.GL.viewPortHeight,  0.1, 1000.0 );
        return projectionMatrix;
    };
    this.GetMatrix    = function(){
        mat4.identity(this.modelView);
        mat4.multiply(this.modelView, this.rMatrix, this.tMatrix);
        mat4.multiply(this.modelView, this.modelView, this.sMatrix);
        mat4.multiply(this.modelView, this.modelView, laMatrix);
        return this.modelView;
    };


    this.GetInverseMatrix = function(){
        var invViewMatrix = mat4.create();
        mat4.invert(invViewMatrix, this.GetMatrix() );
        mat4.transpose(invViewMatrix, invViewMatrix);
        return invViewMatrix;
    };

    this.update = function(){ };
    this.LookAt = function( x, y, z, position ){
        //if(position) this.position = position;
        mat4.identity(laMatrix);
        mat4.lookAt(laMatrix,position || this.position,[x,y,z],  [0,1,0]);
    };

};
Camera.prototype = new Object3D();
OMEGA.Omega3D.cameras = OMEGA.Omega3D.cameras || {};
OMEGA.Omega3D.cameras.Camera = Camera;


