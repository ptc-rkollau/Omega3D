function PostProcessingPass(renderer, screen_quad, in_shader, out_texture){
    RenderPass.apply(this, [renderer, screen_quad.parentScene, null]);

    //console.log(screen_quad.parentScene.GetGL());
    this.out_texture = out_texture;
    this.in_shader = in_shader;
    this.screen_quad = screen_quad;

    this.render = function(){
        this.screen_quad.parentScene.update();


        this.screen_quad.GetMaterial().SetShader( this.in_shader );
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.out_texture.GetFrameBuffer());

        this.renderer.viewPort( this.scene, 0, 0, this.out_texture.GetFrameBuffer().width ,this.out_texture.GetFrameBuffer().height );
        this.renderer.renderScene( this.scene, null );

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.out_texture.Disable();
        this.screen_quad.GetMaterial().SetTextures( [this.out_texture] );

    };
};
PostProcessingPass.prototype = new RenderPass();
OMEGA.Omega3D.PostProcessingPass = PostProcessingPass;
