function CubeGeometry(width, height, depth){
    Geometry.apply( this );
    var halfScaleW = width/2  || this.scale;
    var halfScaleH = height/2 || halfScaleW || this.scale;
    var halfScaleD = depth/2  || halfScaleW || this.scale;
    this.vertices = [
        /* Front face*/
            -1.0*halfScaleW, -1.0*halfScaleH,  1.0*halfScaleD,
            1.0*halfScaleW, -1.0*halfScaleH,  1.0*halfScaleD,
            1.0*halfScaleW,  1.0*halfScaleH,  1.0*halfScaleD,
            -1.0*halfScaleW,  1.0*halfScaleH,  1.0*halfScaleD,

        /* Back face*/
            -1.0*halfScaleW, -1.0*halfScaleH, -1.0*halfScaleD,
            -1.0*halfScaleW,  1.0*halfScaleH, -1.0*halfScaleD,
            1.0*halfScaleW,  1.0*halfScaleH, -1.0*halfScaleD,
            1.0*halfScaleW, -1.0*halfScaleH, -1.0*halfScaleD,

        /* Top face*/
            -1.0*halfScaleW,  1.0*halfScaleH, -1.0*halfScaleD,
            -1.0*halfScaleW,  1.0*halfScaleH,  1.0*halfScaleD,
            1.0*halfScaleW,  1.0*halfScaleH,  1.0*halfScaleD,
            1.0*halfScaleW,  1.0*halfScaleH, -1.0*halfScaleD,

        /* Bottom face*/
            -1.0*halfScaleW, -1.0*halfScaleH, -1.0*halfScaleD,
            1.0*halfScaleW, -1.0*halfScaleH, -1.0*halfScaleD,
            1.0*halfScaleW, -1.0*halfScaleH,  1.0*halfScaleD,
            -1.0*halfScaleW, -1.0*halfScaleH,  1.0*halfScaleD,

        /* Right face*/
            1.0*halfScaleW, -1.0*halfScaleH, -1.0*halfScaleD,
            1.0*halfScaleW,  1.0*halfScaleH, -1.0*halfScaleD,
            1.0*halfScaleW,  1.0*halfScaleH,  1.0*halfScaleD,
            1.0*halfScaleW, -1.0*halfScaleH,  1.0*halfScaleD,

        /* Left face*/
            -1.0*halfScaleW, -1.0*halfScaleH, -1.0*halfScaleD,
            -1.0*halfScaleW, -1.0*halfScaleH,  1.0*halfScaleD,
            -1.0*halfScaleW,  1.0*halfScaleH,  1.0*halfScaleD,
            -1.0*halfScaleW,  1.0*halfScaleH, -1.0*halfScaleD
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
    /*TANGENTS, BITANGENTS */
   // OMEGA.Omega3D.VBOUtil.ComputeTangentBasis( this.vertices, this.uvs, this.normals, this.tangents, this.bitangents);
    OMEGA.Omega3D.Log("GEOMETRY : cube created");

};
CubeGeometry.prototype = new Geometry();
OMEGA.Omega3D.Geometry.CubeGeometry = CubeGeometry;

