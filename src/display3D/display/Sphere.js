function Sphere(scale, material, segW, segH){
    Object3D.apply(this,[new Omega3D.Mesh( new Omega3D.Geometry.SphereGeometry(scale, segW, segH) ), material]);
};
Sphere.prototype = new Object3D();
OMEGA.Omega3D.Sphere = Sphere;
