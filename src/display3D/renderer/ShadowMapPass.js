function ShadowMapPass(renderer,scene, camera, texture){
    RenderPass.apply(this, [renderer, scene, camera]);
    this.texture = texture;


    var tex = new Omega3D.BasicTexture();
    var sha = new Omega3D.Shaders.Basic(false,scene01);
    this.dummyMat =  new Omega3D.Material(sha, [tex]);

    this.swapMaterialsForBasic = function(){
        var children = this.scene.children;
        for( var i = 0; i < children.length; i++){

        }
    };

    this.render = function(){
        this.cam.update();
        this.scene.update();

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.texture.GetFrameBuffer());

        this.gl.enable( this.gl.DEPTH_TEST );
        this.gl.cullFace(this.gl.FRONT);
        this.renderer.viewPort( this.scene, 0, 0, this.texture.GetFrameBuffer().width ,this.texture.GetFrameBuffer().height );
        this.renderer.renderScene( this.scene, this.cam );
        this.gl.disable( this.gl.DEPTH_TEST );
        this.gl.cullFace(this.gl.BACK);
        //this.texture.GenerateMipmap();

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    };
};
ShadowMapPass.prototype = new RenderPass();
OMEGA.Omega3D.ShadowMapPass = ShadowMapPass;