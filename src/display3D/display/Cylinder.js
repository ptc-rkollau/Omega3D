function Cylinder(scale, material){
    Object3D.apply(this,[new Omega3D.Mesh( new Omega3D.Geometry.CylinderGeometry(scale, scale/4) ), material]);
};
Cylinder.prototype = new Object3D();
OMEGA.Omega3D.Cylinder = Cylinder;
