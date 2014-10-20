function StencilPass(renderer, scene, camera, stencil_data  ){
    RenderPass.apply(this, [renderer, scene, camera]);
    var stencilData  = stencil_data.stencilData;
    var contentData = stencil_data.contentData;
    this.render = function(){
        this.cam.update();
        this.scene.update();

        this.gl.enable( this.gl.STENCIL_TEST );


        this.renderer.viewPort(this.scene);
        this.renderer.SetStencilParams(this.scene,
                                       stencilData.stencilFuncData,
                                       stencilData.stencilOpData,
                                       stencilData.stencilMask,
                                       stencilData.depthMask );

        this.renderer.renderScene( this.scene, this.cam );

        this.renderer.SetStencilParams(this.scene,
                                        contentData.stencilFuncData,
                                        contentData.stencilOpData,
                                        contentData.stencilMask,
                                        contentData.depthMask );
    };
};
StencilPass.prototype = new RenderPass();
OMEGA.Omega3D.StencilPass = StencilPass;
