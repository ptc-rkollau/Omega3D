function Object3D( mesh, material ){
    this.id   = (++OMEGA.Omega3D.ObjectsCount).toString();
    this.name = "Object3d_" + this.id.toString();
    this.mayRender = true;
    this.next      = null;
    this.prev      = null;
    this.parentScene = null;
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
    if(this.mesh){
        this.mesh.CreateBuffers();
        this.mesh.CreateColorPickingBuffer(this.id);
    }
    this.parent = null;
    this.children = [];

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
        if(this.parent!=null)this.modelView = this.parent.GetMatrix();
        mat4.multiply(this.modelView, this.modelView, this.tMatrix);
        mat4.multiply(this.modelView, this.modelView, this.rMatrix);
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
       // mat4.identity(this.modelView);
    };

    this.SetScale = function( x, y, z ){
        this.scale = [x, y, z];
        mat4.identity(this.sMatrix);
        mat4.scale(this.sMatrix, this.sMatrix, this.scale);
    };


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

    this.GetChildByName = function( name ){
        for( var i = 0; i < this.children.length; i++){
            if(this.children[i].name == name ) return this.children[i];
        }
        return null;
    }



    this.SetParent = function( parent ){
        if(this.parent != null){
            this.parent.children.splice(this.parent.children.indexOf( this ), 1 );
        }
        this.parent = parent;
        this.parent.children.push(this);
    }



    this.Update = function(gl,camera){ };
    this.LateUpdate = function(gl,camera){ };
    this.UpdateMaterial = function( gl, camera,scene ){
        if(this.material == null)return;
        var program = this.material.GetShader().GetProgram();
        if(program == null)return;

        //update if scene has fog.
        if(scene.hasFog){
            gl.uniform3fv(program["uFogColor"], [scene.getColor().r, scene.getColor().g, scene.getColor().b ] );
            gl.uniform2fv(program["uFogDist" ], [scene.fogStart, scene.fogEnd] );
        }

        //update textures.
        if( this.material.GetTextures() != null ) {
            var t = this.material.GetTextures();
            var l = t.length;
            for (var j = 0; j < l; j++) if (t[j].needsUpdate)t[j].Update();
        }

        //set view matrix.
        if(program.uProjectionMatrix && camera != null ) gl.uniformMatrix4fv( program.uProjectionMatrix, false, camera.GetProjectionMatrix() );
        if(program.uViewMatrix       && camera != null ) gl.uniformMatrix4fv( program.uViewMatrix   , false,  camera.GetMatrix() );
        if(program.uInvViewMatrix    && camera != null ) gl.uniformMatrix4fv( program.uInvViewMatrix, false, camera.GetInverseMatrix() );

        //Set custom vars in material.
        for(var key in this.material.custom_uniforms){
            var u = this.material.custom_uniforms[key];
            if(u.type == "int" ) gl.uniform1i(program[key], u.value );
            else if(u.type == "float" ) gl.uniform1f(program[key], u.value );
            else if(u.type == "mat4" ) gl.uniformMatrix4fv(program[key],false, u.value );
            else if(u.type == "mat3" ) gl.uniformMatrix3fv(program[key],false, u.value );
            else if(u.type == "vec4" ) gl.uniform4fv(program[key], u.value );
            else if(u.type == "vec3" ) gl.uniform3fv(program[key], u.value );
            else if(u.type == "vec2" ) gl.uniform2fv(program[key], u.value );
        }
        //render final material.
        this.RenderMaterial(gl);
    };



    this.Render = function( scene, camera  ){
        var gl = scene.getGL();
        if(this.material != null) this.material.Enable();
        this.Update(gl,camera);
        if(scene.getLights().length > 0 && scene.lightsON ) this.RenderLight( scene );
        this.UpdateMaterial(gl, camera, scene);


        if(this instanceof LODObject3D) this.adjustLODLevel(camera);

        //Render self
        this.RenderObject(gl, camera );

        //disable material
        if(this.material != null)this.material.Disable();

        //Render children.
        for(var i = 0; i < this.children.length; i++){
            this.children[i].Render(scene, camera );
        }

        //reset position.
        this.PlaceBack();

        if(camera!=null) this.LateUpdate(gl,camera);
    };
    this.RenderObject = function( gl, camera ){
        if(this.material == null || this.mesh == null) return;

        var mat = this.material;
        var p   = mat.GetShader().GetProgram();
        if(p == null) return;

        //custom attributes.
        for( var key in mat.custom_attribs){
            gl.enableVertexAttribArray(p[key]);
            gl.bindBuffer( gl.ARRAY_BUFFER, mat.custom_attribs[key].value);
            gl.vertexAttribPointer( p[key],mat.custom_attribs[key].value.itemSize, gl.FLOAT, false, 0, 0 );
        };

        /* model matrix */
        gl.uniformMatrix4fv( p.uModelMatrix , false, this.GetMatrix() );

        /* normal matrix */
        var normalMatrix4 = mat4.create();
        var normalMatrix3 = mat3.create();
        if(camera != null){
            mat4.multiply(normalMatrix4, camera.GetMatrix(), this.GetMatrix() );
            mat3.fromMat4(normalMatrix3,normalMatrix4 );
            mat3.invert(normalMatrix3,normalMatrix3 );
            mat3.transpose(normalMatrix3,normalMatrix3);
        }
        gl.uniformMatrix3fv( p.uNormalMatrix, false, normalMatrix3 );


        //Bind combined buffer -> [ vertex, normal, uv, tangent, bitangent, barycentric ] = (3 + 3 + 2 + 3 + 3 + 3) * 4 bytes = 68 bytes
        gl.bindBuffer(gl.ARRAY_BUFFER, this.GetMesh().GetCombinedBuffer());

        /*vertices*/
        if(p.aVertexPos !=-1 ) {
            gl.enableVertexAttribArray(p.aVertexPos);
            gl.vertexAttribPointer(p.aVertexPos, 3, gl.FLOAT, false, 68, 0);
        }

        /*aVertexNormals*/
        if(p.aVertexNormal!=-1 ) {
            gl.enableVertexAttribArray(p.aVertexNormal);
            gl.vertexAttribPointer(p.aVertexNormal, 3, gl.FLOAT, false, 68, 12); // offset = 12 = 4 * 3
        }

        /*uvs*/
        if(p.aTextureCoord!=-1 ){
            gl.enableVertexAttribArray(p.aTextureCoord);
            gl.vertexAttribPointer( p.aTextureCoord,2, gl.FLOAT, false, 68, 24 ); // offset = 24 = 4 * 6
        }

        /*aTangents*/
        if(p.aVertexTangent !=-1) {
            gl.enableVertexAttribArray(p.aVertexTangent);
            gl.vertexAttribPointer(p.aVertexTangent, 3, gl.FLOAT, false, 68, 32); // offset = 24 = 4 * 8
        }

        /*aBitangents*/
        if(p.aVertexBitangent !=-1 ) {
            gl.enableVertexAttribArray(p.aVertexBitangent);
            gl.vertexAttribPointer(p.aVertexBitangent, 3, gl.FLOAT, false, 68, 44);  // offset = 24 = 4 * 11
        }

        /*aBaricentric*/
        if(p.aBaricentric !=-1 ) {
            gl.enableVertexAttribArray(p.aBaricentric);
            gl.vertexAttribPointer(p.aBaricentric, 3, gl.FLOAT, false, 68, 56);  // offset = 24 = 4 * 14
        }

        /*aPickingColor*/
        if(p.aPickingColor !=-1 &&  this.GetMesh().GetColorPickingBuffer() != undefined) {
            gl.enableVertexAttribArray(p.aPickingColor);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.GetMesh().GetColorPickingBuffer());
            gl.vertexAttribPointer(p.aPickingColor, this.GetMesh().GetColorPickingBuffer().itemSize, gl.FLOAT, false, 0, 0);
        }

        /*indices*/
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.GetMesh().GetIndexBuffer() );

        /* 4   DRAW OBJECT*/
        //gl.drawArrays( gl.TRIANGLES, 0, this.GetMesh().GetVertexBuffer().numItems);
        if( this.drawType == OMEGA.Omega3D.Object3D.DEFAULT        ) gl.drawElements( gl.TRIANGLES , this.GetMesh().GetIndexBuffer().numItems, gl.UNSIGNED_SHORT, this.GetMesh().GetIndexBuffer());
        else if(this.drawType == OMEGA.Omega3D.Object3D.WIREFRAME ) gl.drawElements( gl.LINE_STRIP, this.GetMesh().GetIndexBuffer().numItems, gl.UNSIGNED_SHORT,  this.GetMesh().GetIndexBuffer());
        else if(this.drawType == OMEGA.Omega3D.Object3D.POINTS    ) gl.drawArrays( gl.POINTS      , 0, this.GetMesh().GetVertexBuffer().numItems);
        else if(this.drawType == OMEGA.Omega3D.Object3D.TRIANGLES ){
            //  for(  var i = 0; i < current.GetMesh().GetGeometry().GetVertices().length; i+=3)
            gl.drawArrays( gl.TRIANGLES,0, this.GetMesh().GetGeometry().GetVertices().length/3);
        }

        //disable arrays.
        if(p.aVertexPos!=-1   )gl.disableVertexAttribArray(p.aVertexPos   );
        if(p.aTextureCoord!=-1)gl.disableVertexAttribArray(p.aTextureCoord);
        if(p.aVertexNormal!=-1)gl.disableVertexAttribArray(p.aVertexNormal);
        if(p.aTangent!=-1)gl.disableVertexAttribArray(p.aBitangent);
        if(p.aBitangent!=-1)gl.disableVertexAttribArray(p.aBitangent);
    };
    this.RenderMaterial = function( gl ){
        if(this.material == null)return;
        var p = this.material.GetShader().GetProgram();
        for(var key in this.material.uniforms){
            gl.uniform3fv( p[key], this.material.uniforms[key].value.apply(this.material, null));
        }
    };
    this.RenderLight = function( scene ){
        if(this.material == null)return;
        var gl = scene.getGL();
        var lights = scene.getLights();
        var p = this.material.GetShader().GetProgram();
        if(p == null)return;
        for( var index in lights){
            for(var key in lights[index].uniforms){
                gl.uniform3fv( p[key], lights[index].uniforms[key].value.apply( lights[index], null));
            }
        }
    };


    this.Clone = function(){
        var geom; var mat; var child;
        if( this.GetMesh() ) geom = this.GetMesh().GetGeometry();
        if( this.material  ) mat  = this.material.Clone();
        var obj = new Omega3D.Object3D(geom ? new Omega3D.Mesh(geom) : null, mat ? mat : null);
        obj.name = this.name + "_Clone_" + this.id;
        for(var  i = 0; i < this.children.length; i++){
            child = this.children[i].Clone();
            child.SetParent(obj);
        }
        return obj;
    }

    this.toString = function(){
        return "Object3D { id: " + this.id + ", name: " + this.name + "};"
    };

};
OMEGA.Omega3D.Object3D = Object3D;
OMEGA.Omega3D.Object3D.DEFAULT   = 0;
OMEGA.Omega3D.Object3D.POINTS    = 1;
OMEGA.Omega3D.Object3D.WIREFRAME = 2;
OMEGA.Omega3D.Object3D.TRIANGLES = 3;