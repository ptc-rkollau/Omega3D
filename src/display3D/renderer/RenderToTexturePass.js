function RenderToTexturePass(renderer,scene, camera, texture){
    RenderPass.apply(this, [renderer, scene, camera]);
    this.texture = texture;

    this.render = function(){
        this.cam.update();
        this.scene.update();

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.texture.GetFrameBuffer());

        this.gl.enable( this.gl.DEPTH_TEST );
        this.renderer.viewPort( this.scene, 0, 0, this.texture.GetFrameBuffer().width ,this.texture.GetFrameBuffer().height );
        this.renderer.renderScene( this.scene, this.cam );
        this.gl.disable( this.gl.DEPTH_TEST );
        this.texture.GenerateMipmap();

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    };
};
RenderToTexturePass.prototype = new RenderPass();
OMEGA.Omega3D.RenderToTexturePass = RenderToTexturePass;
