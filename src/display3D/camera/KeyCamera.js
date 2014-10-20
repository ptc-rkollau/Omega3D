OMEGA.Omega3D.cameras = OMEGA.Omega3D.cameras || {};
OMEGA.Omega3D.cameras.KeyCamera = function(){
    this.m = mat4.create();
    mat4.identity(this.m);
    this.speed = 0.01;
    this.drag = 0.01;
    this.pos = new Vector3D(0,0,0);
    this.vel = new Vector3D(0,0,0);
    this.acc = new Vector3D(0,0,0);
    this.currentlyPressedKeys = {};
    document.onkeydown = this.HandleKeyDown;
    document.onkeyup   = this.HandleKeyUp;
};
OMEGA.Omega3D.cameras.KeyCamera.prototype.GetMatrix = function(){
    return this.m;
};
OMEGA.Omega3D.cameras.KeyCamera.prototype.update = function(){
    this.handleKeys();
    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;
    this.vel.z += this.acc.z;


    this.vel.x *= this.drag;
    this.vel.y *= this.drag;
    this.vel.z *= this.drag;




    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.pos.z += this.vel.z;

    this.acc.x = this.acc.y = this.acc.z = 0;
    this.vel.x = this.vel.y = this.vel.z = 0;

    this.Translate( this.pos.x, this.pos.y, this.pos.z);
};

OMEGA.Omega3D.cameras.KeyCamera.prototype.Translate = function( x, y, z ){
    mat4.translate( this.m, this.m, [x, y, z] );
};
OMEGA.Omega3D.cameras.KeyCamera.prototype.RotateX = function(value){
    mat4.rotate( this.m, this.m, value, [1.0, 0.0, 0.0] );
};
OMEGA.Omega3D.cameras.KeyCamera.prototype.RotateY = function(value){
    mat4.rotate( this.m, this.m, value, [0.0, 1.0, 0.0] );
};
OMEGA.Omega3D.cameras.KeyCamera.prototype.RotateZ = function(value){
    mat4.rotate( this.m, this.m, value, [0.0, 0.0, 1.0] );
};
OMEGA.Omega3D.cameras.KeyCamera.prototype.Rotate = function(x, y, z){
    this.RotateX(x);this.RotateY(y);this.RotateZ(z);
};

OMEGA.Omega3D.cameras.KeyCamera.prototype.HandleKeyDown = function(e){
    this.currentlyPressedKeys[e.keyCode] = true;
};
OMEGA.Omega3D.cameras.KeyCamera.prototype.HandleKeyUp = function(e) {
    this.currentlyPressedKeys[e.keyCode] = false;
};
OMEGA.Omega3D.cameras.KeyCamera.prototype.HandleKeys = function(){
    if (this.currentlyPressedKeys[38] || this.currentlyPressedKeys[87]) {
        this.vel.z = 0;
        this.acc.z = this.speed;
    }
    if (this.currentlyPressedKeys[40] || this.currentlyPressedKeys[83]) {
        this.vel.z = 0;
        this.acc.z = -this.speed;
    }
    if (this.currentlyPressedKeys[39] || this.currentlyPressedKeys[68]) {
        this.vel.x = 0;
        this.acc.x = -this.speed;
    }
    if (this.currentlyPressedKeys[37] || this.currentlyPressedKeys[65]) {
        this.vel.x = 0;
        this.acc.x = this.speed;
    }
};