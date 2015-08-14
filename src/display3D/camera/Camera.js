function Camera(){
    Object3D.apply(this);

    this.projectionMatrix = mat4.create();
    this.laMatrix = mat4.create();

    this.near = 0.1;
    this.far  = 1000.0;

    this.x = this.y = this.z = 0;
    this.lookX = this.lookY = this.lookZ = 0;

    this.GetProjectionMatrix = function(){
        mat4.perspective(this.projectionMatrix,45, OMEGA.Omega3D.GL.viewPortWidth / OMEGA.Omega3D.GL.viewPortHeight,  this.near, this.far );
        return this.projectionMatrix;
    };
    this.GetMatrix    = function(){
        mat4.identity(this.modelView);
        mat4.multiply(this.modelView, this.rMatrix, this.tMatrix);
        mat4.multiply(this.modelView, this.modelView, this.sMatrix);
        mat4.multiply(this.modelView, this.modelView, this.laMatrix);
        return this.modelView;
    };


    this.GetInverseMatrix = function(){
        var invViewMatrix = mat4.create();
        mat4.invert(invViewMatrix, this.GetMatrix() );
        mat4.transpose(invViewMatrix, invViewMatrix);
        return invViewMatrix;
    };

    this.update = function(){ this.LookAt(this.lookX, this.lookY, this.lookZ, [this.x, this.y, this.z]); };
    this.LookAt = function( x, y, z, position ){
        this.lookX =x; this.lookY =y;this.lookZ =z;
        this.x =position[0]; this.y = position[1]; this.z = position[2];
        mat4.identity(this.laMatrix);
        mat4.lookAt(this.laMatrix,position || this.position,[this.lookX,this.lookY,this.lookZ],  [0,-1,0]);
    };

};
Camera.prototype = new Object3D();
OMEGA.Omega3D.cameras = OMEGA.Omega3D.cameras || {};
OMEGA.Omega3D.cameras.Camera = Camera;


