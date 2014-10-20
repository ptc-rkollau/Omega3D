function WebGLRenderer( debugRender ){

    var projectionMatrix = null;
    var modelViewMatrix  = null;

    var rp_head = null;var rp_tail = null;
    var renderChain = null;
    this.passes    = new Array();
    this.materials = null;
    this.objects   = null;
    this.list      = null;
    var debug      = debugRender || false;

    this.autoClear = true;
    this.CLEAR_COLOR_BIT = true;
    this.CLEAR_DEPTH_BIT = true;
    this.CLEAR_STENCIL_BIT = true;


    __construct = function(){
        projectionMatrix = mat4.create();
        this.materials = new Array();
        this.objects   = new Array();
        this.list      = new Array();

        window.requestAnimFrame = (function(){
            return  (window.requestAnimationFrame       ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                window.oRequestAnimationFrame      ||
                window.msRequestAnimationFrame     ||
                function(  callback ){
                    window.setTimeout(callback, 1000 / 60);
                });
        })();
    }();

    this.clear = function(color){
        var flagC = this.CLEAR_COLOR_BIT   ? OMEGA.Omega3D.GL.COLOR_BUFFER_BIT   : 0;
        var flagD = this.CLEAR_DEPTH_BIT   ? OMEGA.Omega3D.GL.DEPTH_BUFFER_BIT   : 0;
        var flagS = this.CLEAR_STENCIL_BIT ? OMEGA.Omega3D.GL.STENCIL_BUFFER_BIT : 0;
        var color = color || {r:0,g:0,b:0, a:1.0};
        OMEGA.Omega3D.GL.clearColor( color.r, color.g, color.b, color.a );
        OMEGA.Omega3D.GL.clear(flagC | flagD | flagS );
    };

    this.viewPort = function(scene, x, y, w, h ){
        var gl = scene.getGL();
        gl.viewport( x || 0, y || 0, w || gl.viewPortWidth,h || gl.viewPortHeight);
    };

    this.SetStencilParams = function(scene, stencilFuncParams, stencilOpParams, stencilMask, depthMask){
        var gl = scene.getGL();
        if(stencilFuncParams) gl.stencilFunc(stencilFuncParams[0], stencilFuncParams[1], stencilFuncParams[2]); // Set any stencil to 1
        if(stencilOpParams) gl.stencilOp(stencilOpParams[0], stencilOpParams[1], stencilOpParams[2]);
        gl.stencilMask(stencilMask); // Write to stencil buffer
        gl.depthMask(depthMask); // Don't write to depth buffer
        //gl.clear(gl.STENCIL_BUFFER_BIT); // Clear stencil buffer (0 by default)
    };




    this.addRenderPass = function( pass ){
        this.passes.push( pass );
        if(!rp_head){
            rp_head = pass;
            rp_tail = rp_head;
        }else{
            pass.prev = rp_tail;
            rp_tail.next = pass;
            rp_tail = pass;
        }
    };
    this.SetRenderChain = function( chain ){
        renderChain = chain;
    }


    this.render = function(){
        renderChain.Render();
    };

    this.renderSceneToStencil = function(scene, camera){
        camera.update();
        this.materials = scene.materials;
        this.objects   = scene.objects;
        this.list      = scene.list;


        var gl = scene.getGL();
        gl.enable( gl.STENCIL_TEST );

        var color = scene.getColor();




        gl.disable( gl.STENCIL_TEST );
    };

    this.renderScene = function( scene, camera ){
        if(debug) console.log("Renderer.Render START");
        if(this.autoClear) this.clear(scene.getColor());
        var gl = scene.getGL();
        this.materials = scene.materials;
        this.objects   = scene.objects;
        this.list      = scene.list;

        for( var i = 0; i < this.materials.length; i++){
            var id  = this.materials[i].id;
            var mat = this.materials[i].material;

            if(!this.objects[id]) continue;
            if(debug){
                 console.log( "Current Material ID :  " + id
                            + "\nAmount Objects for this material: " + this.objects[id].length );
            }

            var t = mat.GetTextures(); var l = t.length;
            for( var j = 0; j < l; j++) if(t[j].needsUpdate)t[j].Update();
            mat.Enable();

            if(mat.GetShader().GetProgram().uProjectionMatrix) gl.uniformMatrix4fv( mat.GetShader().GetProgram().uProjectionMatrix, false, camera.GetProjectionMatrix() );
            if(mat.GetShader().GetProgram().uViewMatrix      ) gl.uniformMatrix4fv( mat.GetShader().GetProgram().uViewMatrix   , false,  camera.GetMatrix() );
            if(mat.GetShader().GetProgram().uInvViewMatrix   ) gl.uniformMatrix4fv( mat.GetShader().GetProgram().uInvViewMatrix, false, camera.GetInverseMatrix() );

            for(var key in mat.custom_uniforms){
                var u = mat.custom_uniforms[key];
                if(u.type == "int" ) gl.uniform1i(mat.GetShader().GetProgram()[key], u.value );
                else if(u.type == "float" ) gl.uniform1f(mat.GetShader().GetProgram()[key], u.value );
                else if(u.type == "mat4" ) gl.uniformMatrix4fv(mat.GetShader().GetProgram()[key],false, u.value );
                else if(u.type == "mat3" ) gl.uniformMatrix3fv(mat.GetShader().GetProgram()[key],false, u.value );
                else if(u.type == "vec4" ) gl.uniform4fv(mat.GetShader().GetProgram()[key], u.value );
                else if(u.type == "vec3" ) gl.uniform3fv(mat.GetShader().GetProgram()[key], u.value );
                else if(u.type == "vec2" ) gl.uniform2fv(mat.GetShader().GetProgram()[key], u.value );
            }

            if(scene.getLights().length > 0 ) renderLight( scene, mat );

            var current = this.list[id].head;
            while(current){
                if(current.mayRender) {
                    renderObject(gl, current, mat, camera);
                    if (debug) console.log("-  Current object: " + current);
                }
                current = current.next;
            }
            mat.Disable();

        }
        if(debug) console.log("Renderer.Render END");
        mat4.identity(camera.GetMatrix());
    };

    var renderObject = function( gl, current, mat, camera ){
        var p = mat.GetShader().GetProgram();

        /* model matrix */
        gl.uniformMatrix4fv( p.uModelMatrix , false, current.GetMatrix() );

        /* normal matrix */
        var normalMatrix = mat4.create();
        mat4.multiply(normalMatrix, current.GetMatrix(), camera.GetMatrix() );
        mat4.invert(normalMatrix,normalMatrix );
        mat4.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix4fv( p.uNormalMatrix, false, normalMatrix );
        gl.uniform1f(p.uPointSize, parseFloat(OMEGA.Omega3D.PointSize) );



        /*vertices*/
        gl.enableVertexAttribArray(p.aVertexPos);
        gl.bindBuffer( gl.ARRAY_BUFFER, current.GetMesh().GetVertexBuffer() );
        gl.vertexAttribPointer( p.aVertexPos, current.GetMesh().GetVertexBuffer().itemSize, gl.FLOAT, false, 0, 0 );

        /*uvs*/
        if(p.aTextureCoord!=-1){
            gl.enableVertexAttribArray(p.aTextureCoord);
            gl.bindBuffer( gl.ARRAY_BUFFER, current.GetMesh().GetUVBuffer());
            gl.vertexAttribPointer( p.aTextureCoord,current.GetMesh().GetUVBuffer().itemSize, gl.FLOAT, false, 0, 0 );
        }

        /*aVertexNormals*/
        if(p.aVertexNormal!=-1 &&  current.GetMesh().GetNormalBuffer() != undefined) {
            gl.enableVertexAttribArray(p.aVertexNormal);
            gl.bindBuffer(gl.ARRAY_BUFFER, current.GetMesh().GetNormalBuffer());
            gl.vertexAttribPointer(p.aVertexNormal, current.GetMesh().GetNormalBuffer().itemSize, gl.FLOAT, false, 0, 0);
        }

        /*indices*/
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, current.GetMesh().GetIndexBuffer() );

        /* 4   DRAW OBJECT*/
       //gl.drawArrays( gl.TRIANGLES, 0, current.GetMesh().GetVertexBuffer().numItems);
        if(current.drawType == OMEGA.Omega3D.Object3D.DEFAULT        ) gl.drawElements( gl.TRIANGLES , current.GetMesh().GetIndexBuffer().numItems, gl.UNSIGNED_SHORT,  current.GetMesh().GetIndexBuffer());
        else if(current.drawType == OMEGA.Omega3D.Object3D.WIREFRAME ) gl.drawElements( gl.LINE_STRIP, current.GetMesh().GetIndexBuffer().numItems, gl.UNSIGNED_SHORT, current.GetMesh().GetGeometry().GetVertices()/3);
        else if(current.drawType == OMEGA.Omega3D.Object3D.POINTS    ) gl.drawArrays( gl.POINTS      , 0, current.GetMesh().GetVertexBuffer().numItems);

        //disable arrays.
        if(p.aVertexPos!=-1   )gl.disableVertexAttribArray(p.aVertexPos   );
        if(p.aTextureCoord!=-1)gl.disableVertexAttribArray(p.aTextureCoord);
        if(p.aVertexNormal!=-1)gl.disableVertexAttribArray(p.aVertexNormal);

        //reset position.
        current.PlaceBack();
    };
    var renderLight = function( scene, mat ){
        var gl = scene.getGL();
        var l = scene.getLights()[0];

        var p = mat.GetShader().GetProgram();
        p.uLightPosition  = gl.getUniformLocation(p, "uLightPosition");
        p.uLightDirection = gl.getUniformLocation(p, "uLightDirection");
        p.uAmbientColor   = gl.getUniformLocation(p, "uAmbientColor" );
        p.uDiffuseColor   = gl.getUniformLocation(p, "uDiffuseColor" );
        p.uSpecularColor  = gl.getUniformLocation(p, "uSpecularColor");



        if( p.uLightPosition !=-1 ) gl.uniform3fv( p.uLightPosition, l.position      );
        if( p.uLightDirection!=-1 ) gl.uniform3fv( p.uAmbientColor , l.ambientColor  );
        if( p.uAmbientColor  !=-1 ) gl.uniform3fv( p.uAmbientColor , l.ambientColor  );
        if( p.uDiffuseColor  !=-1 ) gl.uniform3fv( p.uDiffuseColor , l.diffuseColor  );
        if( p.uSpecularColor !=-1 ) gl.uniform3fv( p.uSpecularColor, l.specularColor );
    };
    var contains = function(a, obj) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] === obj) {
                return true;
            }
        }
        return false;
    };
}
OMEGA.Omega3D.WebGLRenderer = WebGLRenderer;
