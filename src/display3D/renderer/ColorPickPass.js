function ColorPickPass(renderer, scene, camera ){
    RenderPass.apply(this, [renderer, scene, camera]);
    this.texture = new Omega3D.FrameBufferTexture();
    this.pickingShader = new OMEGA.Omega3D.Shaders.ColorPicking();
    this.buffer  = new Uint8Array(4);
    var mousePos = {x:0, y:0};
    var store = {};
    scene.selectedObject = null;
    this.render = function(){
        this.cam.update();
        this.scene.update();
        store["sceneColor"] = scene.getColor();
        scene.setColor( 1, 1, 1);
        scene.lightsON = false;
        this.swapShadersPicking(scene);

        var x = this.texture.GetFrameBuffer().width / canvas.width;
        var y = this.texture.GetFrameBuffer().height / canvas.height;



        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.texture.GetFrameBuffer());

        this.gl.enable( this.gl.DEPTH_TEST );
        this.renderer.viewPort( this.scene, 0, 0, this.texture.GetFrameBuffer().width ,this.texture.GetFrameBuffer().height );
        this.renderer.renderScene( this.scene, this.cam );
        this.gl.disable( this.gl.DEPTH_TEST );


        this.gl.readPixels(Math.floor(x*mousePos.x), this.texture.GetFrameBuffer().height - Math.floor(y*mousePos.y), 1, 1, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.buffer);
        var id = this.buffer[0]+this.buffer[1]+this.buffer[2];
        scene.selectedObject =  this.searchChild(scene, id)

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.swapShadersNotPicking(scene);
        scene.lightsON = true;
        scene.setColor( store["sceneColor"].r, store["sceneColor"].g, store["sceneColor"].b);
        store = {};
    };

    this.searchChild = function( parent, id ){
        var child = null;
        for( var  i = 0 ; i < parent.children.length; i++){
            if(parseFloat(parent.children[i].id) == id ) child = parent.children[i];
            else if( parent.children[i].children.length > 0) child = this.searchChild(parent.children[i], id  );
            if(child!=null)break;
        }
        return child;
    }
    this.swapShadersPicking = function(parent){
        var child = null;
        for( var  i = 0 ; i < parent.children.length; i++){
            child = parent.children[i];
            if(child.GetMaterial() != null){
                if(child.GetMaterial().GetShader() != this.pickingShader)
                    store[child.id] = child.GetMaterial().GetShader();
                child.GetMaterial().SetShader(this.pickingShader);
            }
            if( parent.children[i].children.length > 0){
             //  if(parent instanceof OMEGA.Omega3D.Scene ) console.log( i + " -- > PARENT : " + typeof(parent) + " __ " + parent.children.length);
                this.swapShadersPicking(parent.children[i] );
            }
        }
    };
    this.swapShadersNotPicking = function(parent){
        var child = null;
        for( var  i = 0 ; i < parent.children.length; i++){
            child = parent.children[i];
            if(child.GetMaterial() != null && store[child.id] != null){
                child.GetMaterial().SetShader(store[child.id]);
            }
            if( parent.children[i].children.length > 0) this.swapShadersNotPicking(parent.children[i] );
        }
    };
    var canvas = document.getElementById("omega");
    document.onmousemove = function(evt){
        var rect = canvas.getBoundingClientRect();
        mousePos.x = evt.clientX - rect.left;
        mousePos.y = evt.clientY - rect.top;
    };
};
ColorPickPass.prototype = new Pass();
OMEGA.Omega3D.ColorPickPass = ColorPickPass;
