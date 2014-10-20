function RenderPass(renderer, scene, camera ){
   Pass.apply(this);
   if(!renderer||!scene||!camera)return;
   this.renderer = renderer;
   this.scene = scene;
   this.cam   = camera;
   this.gl    = scene.getGL();
   this.color = scene.getColor();

   this.render = function(){
       this.cam.update();
       this.scene.update();

       this.gl.enable( this.gl.DEPTH_TEST );

       this.renderer.viewPort(this.scene);
       this.renderer.renderScene( this.scene, this.cam );

       this.gl.disable( this.gl.DEPTH_TEST );
   };
};
RenderPass.prototype = new Pass();
OMEGA.Omega3D.RenderPass = RenderPass;