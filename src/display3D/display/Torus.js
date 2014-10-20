function Torus(scale, material){
    Object3D.apply(this,[new Omega3D.Mesh( new Omega3D.Geometry.TorusGeometry(scale, scale/4*2) ), material]);
};
Torus.prototype = new Object3D();
OMEGA.Omega3D.Torus = Torus;