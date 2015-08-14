function RenderPass(renderer, scene, camera ){
   Pass.apply(this);
   //if(!renderer||!scene||!camera){
   //    //if(!renderer) OMEGA.Omega3D.Log(" *** RENDERPASS WARNING: plz make sure you passed a renderer to the renderpass!");
   //   // if(!scene)    OMEGA.Omega3D.Log(" *** RENDERPASS WARNING: plz make sure you passed a scene to the renderpass!");
   //   // if(!camera)   OMEGA.Omega3D.Log(" *** RENDERPASS WARNING: plz make sure you passed a camera to the renderpass!");
   //    return;
   //}
   this.renderer = renderer;
   this.scene = scene;
   this.cam   = camera;
   this.gl    = scene!=null ? scene.getGL() : null;
   this.color = scene!=null ? scene.getColor():null;

   this.render = function(){
       this.cam.update();
       this.scene.update();

       this.gl.enable( this.gl.DEPTH_TEST );
       this.gl.cullFace(this.gl.BACK);


       this.renderer.viewPort(this.scene);
       this.renderer.renderScene( this.scene, this.cam );

       this.gl.disable( this.gl.DEPTH_TEST );
   };
};
RenderPass.prototype = new Pass();
OMEGA.Omega3D.RenderPass = RenderPass;