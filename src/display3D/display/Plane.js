function Plane(width, height, material){
    Object3D.apply(this,[new Omega3D.Mesh( new Omega3D.Geometry.SquareGeometry(width, height) ), material]);
};
Plane.prototype = new Object3D();
OMEGA.Omega3D.Plane = Plane;
