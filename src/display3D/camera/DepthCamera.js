function DepthCamera( light ){
    Camera.apply(this);
    this.light = light;

    this.size = 5.0;
    this.GetProjectionMatrix = function(){
        mat4.ortho(this.projectionMatrix,-this.size,this.size,-this.size, this.size,-this.size,this.size*2);
        return this.projectionMatrix;
    };
//    this.GetMatrix    = function(){
//        mat4.identity(this.modelView);
//        mat4.lookAt( this.modelView, this.light.GetPosition(),[0,0,0],[0,1,0]);
//        return this.modelView;
//    };
   // this.SetPosition(l.GetPosition());
    this.LookAt(0, 0, 0, this.light.GetPosition());
}
DepthCamera.prototype = new Camera();
OMEGA.Omega3D.cameras = OMEGA.Omega3D.cameras || {};
OMEGA.Omega3D.cameras.DepthCamera = DepthCamera;