function CubeGeometry(size){
    Geometry.apply( this );
    var halfScale = size || this.scale;
    this.vertices = [
        /* Front face*/
            -1.0*halfScale, -1.0*halfScale,  1.0*halfScale,
            1.0*halfScale, -1.0*halfScale,  1.0*halfScale,
            1.0*halfScale,  1.0*halfScale,  1.0*halfScale,
            -1.0*halfScale,  1.0*halfScale,  1.0*halfScale,

        /* Back face*/
            -1.0*halfScale, -1.0*halfScale, -1.0*halfScale,
            -1.0*halfScale,  1.0*halfScale, -1.0*halfScale,
            1.0*halfScale,  1.0*halfScale, -1.0*halfScale,
            1.0*halfScale, -1.0*halfScale, -1.0*halfScale,

        /* Top face*/
            -1.0*halfScale,  1.0*halfScale, -1.0*halfScale,
            -1.0*halfScale,  1.0*halfScale,  1.0*halfScale,
            1.0*halfScale,  1.0*halfScale,  1.0*halfScale,
            1.0*halfScale,  1.0*halfScale, -1.0*halfScale,

        /* Bottom face*/
            -1.0*halfScale, -1.0*halfScale, -1.0*halfScale,
            1.0*halfScale, -1.0*halfScale, -1.0*halfScale,
            1.0*halfScale, -1.0*halfScale,  1.0*halfScale,
            -1.0*halfScale, -1.0*halfScale,  1.0*halfScale,

        /* Right face*/
            1.0*halfScale, -1.0*halfScale, -1.0*halfScale,
            1.0*halfScale,  1.0*halfScale, -1.0*halfScale,
            1.0*halfScale,  1.0*halfScale,  1.0*halfScale,
            1.0*halfScale, -1.0*halfScale,  1.0*halfScale,

        /* Left face*/
            -1.0*halfScale, -1.0*halfScale, -1.0*halfScale,
            -1.0*halfScale, -1.0*halfScale,  1.0*halfScale,
            -1.0*halfScale,  1.0*halfScale,  1.0*halfScale,
            -1.0*halfScale,  1.0*halfScale, -1.0*halfScale
    ];

    this.normals = [
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,

        0, 1,  0,
        0, 1,  0,
        0, 1,  0,
        0, 1,  0,

        0,-1,  0,
        0,-1,  0,
        0,-1,  0,
        0,-1,  0,

        1,0,  0,
        1,0,  0,
        1,0,  0,
        1,0,  0,

        -1,0,  0,
        -1,0,  0,
        -1,0,  0,
        -1,0,  0
    ];


    this.indexes = [
        0, 1, 2,      0, 2, 3,    /* Front face */
        4, 5, 6,      4, 6, 7,    /* Back face */
        8, 9, 10,     8, 10, 11,  /* Top face */
        12, 13, 14,   12, 14, 15, /* Bottom face */
        16, 17, 18,   16, 18, 19, /* Right face */
        20, 21, 22,   20, 22, 23  /* Left face */
    ];

    this.uvs = [
        /* Front face */
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        /* Back face */
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        /* Top face */
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,

        /* Bottom face */
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,

        /* Right face */
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        /* Left face */
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0
    ];

    console.log("GEOMETRY : cube created");

};
CubeGeometry.prototype = new Geometry();
OMEGA.Omega3D.Geometry.CubeGeometry = CubeGeometry;

