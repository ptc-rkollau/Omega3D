function Cube(scale, material){
    Object3D.apply(this,[new Omega3D.Mesh( new Omega3D.Geometry.CubeGeometry(scale) ), material]);
};
Cube.prototype = new Object3D();
OMEGA.Omega3D.Cube = Cube;
