function FreeCamera(){
    Camera.apply(this);

    this.speed = 0.1;
    this.drag  = 0.1;
    this.mass  = 1;
    this.force = 0;
    this.pos = new Vector3D(0,0,0);
    this.vel = new Vector3D(0,0,0);
    this.rot = new Vector3D(0,0,0);
    this.rotF = new Vector3D(0,0,0);
    this.acc = new Vector3D(0,0,0);
    this.rot_acc = new Vector3D(0,0,0);

    this.enabled = true;
    this.listener = null;

    this.dirX, this.dirY, this.dirZ;

    this.SetListener = function(l){ this.listener = l;};
    this.GetListener = function(){ return this.listener;};
    this.SetSpeed = function(value){ this.speed = value;};
    this.update = function(){
        if(!this.listener || !this.enabled )return;
        this.HandleKeys();

        this.dirX  = Math.cos(this.rot.y+ Math.PI/2);
        this.dirZ  = Math.sin(this.rot.y+ Math.PI/2);
        this.dirY  = Math.sin(this.rot.x);
        this.vel.z = this.force * this.dirZ;
        this.vel.x = this.force * this.dirX;
        this.vel.y = this.force * this.dirY;
        this.pos.z += this.vel.z;
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        this.force *= this.drag;

        this.SetRotation( this.rot.x, this.rot.y, 0);
        this.SetPosition( this.pos.x,this.pos.y, this.pos.z );

    };



    this.HandleKeys = function(){

        if ( this.listener.currentlyPressedKeys[87]) {
            this.vel.z = 0;
            this.force += this.speed;
        }

        if ( this.listener.currentlyPressedKeys[83]) {
            this.vel.z = 0;
            this.force += -this.speed;
        }
        if (this.listener.currentlyPressedKeys[39] || this.listener.currentlyPressedKeys[68]|| this.listener.currentlyPressedKeys[102]) {

            this.rotF.y = 0.05;
            this.rot.y += this.rotF.y;
        }
        if (this.listener.currentlyPressedKeys[37] || this.listener.currentlyPressedKeys[65] || this.listener.currentlyPressedKeys[100]) {

            this.rotF.y = -0.05;
            this.rot.y += this.rotF.y;
        }

        if (this.listener.currentlyPressedKeys[38] ||this.listener.currentlyPressedKeys[104]) {

            this.rotF.x = -0.05;
            this.rot.x += this.rotF.x;
        }
        if (this.listener.currentlyPressedKeys[40] ||this.listener.currentlyPressedKeys[98]) {

            this.rotF.x = 0.05;
            this.rot.x += this.rotF.x;
        }

        //strafe L/R
        if ( this.listener.currentlyPressedKeys[90]) { // Z
            this.vel.x = 0;
            this.acc.x += this.speed;
        }
        if ( this.listener.currentlyPressedKeys[67]) { // C
            this.vel.x = 0;
            this.acc.x -= this.speed;
        }

        //strafe U/D
        if ( this.listener.currentlyPressedKeys[81]) { // Z
            this.vel.y = 0;
            this.acc.y += this.speed;
        }
        if ( this.listener.currentlyPressedKeys[69]) { // C
            this.vel.y = 0;
            this.acc.y -= this.speed;
        }
    };

    this.Enable = function(){
        if(this.enabled) return;
        if(this.listener) this.listener.Enable();
        this.enabled = true;
    };
    this.Disable = function(){
        if(!this.enabled)return;
        if(this.listener) this.listener.Disable();
        this.enabled = false;

    };

    this.Enable();
};
FreeCamera.prototype = new Camera();
OMEGA.Omega3D.cameras = OMEGA.Omega3D.cameras || {};
OMEGA.Omega3D.cameras.FreeCamera = FreeCamera;



