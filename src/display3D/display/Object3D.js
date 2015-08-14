function Object3D( mesh, material ){
    this.id   = (++OMEGA.Omega3D.ObjectsCount).toString();
    this.name = "Object3d_" + this.id.toString();
    this.mayRender = true;
    this.next      = null;
    this.prev      = null;
    this.position = [0, 0, 0];
    this.rotation = [0, 0, 0];
    this.scale    = [1, 1, 1];
    this.sMatrix   = mat4.create();
    this.tMatrix   = mat4.create();
    this.rMatrix   = mat4.create();
    this.modelView = mat4.create();
    mat4.identity(this.modelView);

    this.mesh     = mesh;
    this.material = material;
    this.drawType =  OMEGA.Omega3D.Object3D.DEFAULT;
    if(this.mesh) this.mesh.CreateBuffers();

    this.SetName      = function(value){this.name = value;};
    this.SetMesh      = function(value){ this.mesh = value;      };
    this.SetMaterial  = function(value){ this.material= value;  };
    this.SetMatrix    = function(m){this.modelView = m; };

    this.GetPosition  = function(){ return this.position;  };
    this.GetRotation  = function(){ return this.rotation;  };
    this.GetMesh      = function(){ return this.mesh;      };
    this.GetMaterial  = function(){ return this.material;  };
    this.GetMatrix    = function(){
        mat4.identity(this.modelView);
        mat4.multiply(this.modelView, this.tMatrix, this.rMatrix);
        mat4.multiply(this.modelView, this.modelView, this.sMatrix);
        return this.modelView;
    };
    this.GetName      = function(){return this.name;};
    this.GetID        = function(){return this.id;};

    this.Identity = function(){
        this.position = [0, 0, 0];
        this.rotation = [0, 0, 0];
        this.scale    = [1, 1, 1];
        this.SetScale( this.scale[0], this.scale[1], this.scale[2] );
        this.SetPosition( this.position[0], this.position[1], this.position[2] );
        this.SetRotation( this.rotation[0],this.rotation[1],this.rotation[2] );
        mat4.identity(this.modelView);
    };

    this.PlaceBack = function(){
        this.SetScale( this.scale[0], this.scale[1], this.scale[2] );
        this.SetPosition( this.position[0], this.position[1], this.position[2] );
        this.SetRotation( this.rotation[0],this.rotation[1],this.rotation[2] );
    };

    this.SetScale = function( x, y, z ){
        this.scale = [x, y, z];
        mat4.identity(this.sMatrix);
        mat4.scale(this.sMatrix, this.sMatrix, this.scale);
    }


    this.SetPosition = function( x, y, z ){
        this.position = [x, y, z];

        mat4.identity(this.tMatrix);
        mat4.translate(this.tMatrix, this.tMatrix, this.position );
    };
    this.Translate = function( x, y, z ){
        this.position[0] += x;
        this.position[1] += y;
        this.position[2] += z;

        mat4.identity(this.tMatrix);
        mat4.translate( this.tMatrix, this.tMatrix, this.position );
    };


    this.SetRotation = function( x, y, z ){
        mat4.identity(this.rMatrix);
        this.rotation = [x,y,z];
        mat4.rotate( this.rMatrix, this.rMatrix, this.rotation[0], [1.0, 0.0, 0.0] );
        mat4.rotate( this.rMatrix, this.rMatrix, this.rotation[1], [0.0, 1.0, 0.0] );
        mat4.rotate( this.rMatrix, this.rMatrix, this.rotation[2], [0.0, 0.0, 1.0] );
    };
    this.Rotate = function( x, y, z ){
        mat4.identity(this.rMatrix);
        this.RotateX(x);this.RotateY(y);this.RotateZ(z);
    };

    this.RotateX = function( value ){
        this.rotation[0] += value;
        mat4.rotate( this.rMatrix, this.rMatrix, this.rotation[0], [1.0, 0.0, 0.0] );
    };
    this.RotateY = function( value ){
        this.rotation[1] += value;
        mat4.rotate( this.rMatrix, this.rMatrix, this.rotation[1], [0.0, 1.0, 0.0] );
    };
    this.RotateZ = function( value ){
        this.rotation[2] += value;
        mat4.rotate( this.rMatrix, this.rMatrix, this.rotation[2], [0.0, 0.0, 1.0] );
    };

    this.Update     = function(gl,camera){ };
    this.LateUpdate = function(gl,camera){ };


    this.toString = function(){
        return "Object3D { id: " + this.id + ", name: " + this.name + "};"
    };

};
OMEGA.Omega3D.Object3D = Object3D;
OMEGA.Omega3D.Object3D.DEFAULT   = 0;
OMEGA.Omega3D.Object3D.POINTS    = 1;
OMEGA.Omega3D.Object3D.WIREFRAME = 2;