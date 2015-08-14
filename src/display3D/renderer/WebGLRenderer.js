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
        if(OMEGA.Omega3D.AVAILABLE)renderChain.Render();
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

    this.RenderPostProcessing = function( scene, camera ){


    }

    this.renderScene = function( scene, camera ){
        if(debug) console.log("Renderer.Render START");
        this.clear(scene.getColor());
        scene.getGL().clearDepth(1.0);

        for(var i = 0; i < scene.children.length; i++){
            scene.children[i].Render(scene, camera );
        }
        if(debug) OMEGA.Omega3D.Log("Renderer.Render END");
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
