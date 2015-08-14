function TriangleGeometry(scale){
    Geometry.apply( this, arguments );
    this.vertices = [
            0.0,  1.0* this.scale,  0.0,
            -1.0* this.scale, -1.0* this.scale,  0.0,
            1.0* this.scale, -1.0* this.scale,  0.0
    ];
    this.uvs = [
        0.98, 0.98,
        0.60, 0.0,
        0.0, 0.60
    ];
    this.normals = [
        0, 0, 1,
        0, 0, 1,
        0, 0, 1
    ];
    this.indexes = [ 0, 1, 2 ];

    /*TANGENTS, BITANGENTS */
    Geometry.ComputeTangentBasis( this.vertices, this.uvs, this.normals, this.tangents, this.bitangents);

    OMEGA.Omega3D.Log("GEOMETRY : triangle created");
};
TriangleGeometry.prototype = new Geometry();
OMEGA.Omega3D.Geometry.TriangleGeometry = TriangleGeometry;

