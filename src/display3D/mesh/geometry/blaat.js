OMEGA.Omega3D.Geometry = OMEGA.Omega3D.Geometry || {};
OMEGA.Omega3D.Geometry.Triangle = function(scale){
    var vertices = new Array();
    var normals  = new Array();
    var uvs      = new Array();
    var indexes =  new Array();
    var faces   = new Array();
    scale = scale || 0.1;
    vertices = [
        0.0,  1.0* scale,  0.0,
            -1.0* scale, -1.0* scale,  0.0,
            1.0* scale, -1.0* scale,  0.0
    ];

    uvs = [
        1.0, 1.0,
        1.0, 0.0,
        0.0, 1.0,
    ];

    normals = [
        0, 0, 1,
        0, 0, 1,
        0, 0, 1
    ];

    indexes = [ 0, 1, 2 ];


    console.log("GEOMETRY : triangle created");

    return {
        GetVertices:function(){
            return vertices;
        },
        GetNormals:function(){
            return normals;
        },
        GetUVS:function(){
            return uvs;
        },
        GetIndexes:function(){
            return indexes;
        },
        GetFaces:function(){
            return faces;
        }
    }
};

OMEGA.Omega3D.Geometry.Square = function(scale){
    var vertices = new Array();
    var normals  = new Array();
    var uvs      = new Array();
    var indexes =  new Array();
    var faces   = new Array();
    scale = scale || 0.25;
    var halfScale = scale * 0.5;
    vertices = [
            -1.0 * halfScale,  1.0* halfScale,  0.0,
            -1.0 * halfScale, -1.0* halfScale,  0.0,
            1.0 * halfScale, -1.0* halfScale,  0.0,
            1.0 * halfScale,  1.0* halfScale,  0.0
    ];

    normals = [
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1
    ];

    uvs = [
        0.0, 0.0,
        1.0, 0.0,
        0.0, 1.0,
        1.0, 1.0
    ];

    indexes = [ 0, 1, 2, 0, 2, 3];

    console.log("GEOMETRY : square created");

    return {
        GetVertices:function(){
            return vertices;
        },
        GetNormals:function(){
            return normals;
        },
        GetUVS:function(){
            return uvs;
        },
        GetIndexes:function(){
            return indexes;
        },
        GetFaces:function(){
            return faces;
        }
    }
};

OMEGA.Omega3D.Geometry.Sphere = function( scale ){
    var vertices = new Array();
    var normals  = new Array();
    var uvs      = new Array();
    var indexes =  new Array();
    var faces   = new Array();
    var radius = scale || 0.1;

    var segH = 15;
    var segW = 15;

    var angle = 0;
    var angle2 = 0;


    for (var i = 0; i < segH; i++) {
        for ( var j = 0; j < segW; j++)
        {
            angle  = Math.PI * 2 / (segW - 1) * j;
            angle2 = Math.PI * i / (segH - 1) - Math.PI / 2;

            var xpos = Math.cos( angle  ) * radius * Math.cos( angle2 );
            var ypos = Math.sin( angle2 ) * radius;
            var zpos = Math.sin( angle  ) * radius * Math.cos( angle2 );

            vertices.push(  xpos );
            vertices.push(  ypos );
            vertices.push(  zpos );
            normals.push(   Math.cos( angle ) * Math.cos( angle2 ),
                Math.sin( angle2 ),
                    Math.sin( angle) * Math.cos( angle2) );

            uvs.push( j / (segW - 1), 1- i / (segH - 1) );
        }
    }

    /*INDEXES.*/
    for ( var i = 0; i < segH; i++) {
        for ( var j = 0; j < segW; j++) {
            if ( i < segH -1 && j < segW-1 ) {
                indexes.push( i * segW + j    , i * segW + j + 1     , (i + 1) * segW + j );
                indexes.push( i * segW + j + 1, (i + 1) *segW + j + 1, (i + 1) * segW + j );
            }
        }
    }
    console.log("GEOMETRY : sphere created");


    return {
        GetVertices:function(){
            return vertices;
        },
        GetNormals:function(){
            return normals;
        },
        GetUVS:function(){
            return uvs;
        },
        GetIndexes:function(){
            return indexes;
        },
        GetFaces:function(){
            return faces;
        }
    }
};

OMEGA.Omega3D.Geometry.Cube = function(scale){
    var vertices = new Array();
    var normals  = new Array();
    var uvs      = new Array();
    var indexes =  new Array();
    var faces   = new Array();

    scale = scale || 0.1;

    var halfScale = scale;
    vertices = [
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

    normals = [
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


    indexes = [
        0, 1, 2,      0, 2, 3,    /* Front face */
        4, 5, 6,      4, 6, 7,    /* Back face */
        8, 9, 10,     8, 10, 11,  /* Top face */
        12, 13, 14,   12, 14, 15, /* Bottom face */
        16, 17, 18,   16, 18, 19, /* Right face */
        20, 21, 22,   20, 22, 23  /* Left face */
    ];

    uvs = [
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


    return {
        GetVertices:function(){
            return vertices;
        },
        GetNormals:function(){
            return normals;
        },
        GetUVS:function(){
            return uvs;
        },
        GetIndexes:function(){
            return indexes;
        },
        GetFaces:function(){
            return faces;
        }
    }
};

OMEGA.Omega3D.Geometry.Cillinder = function( length, radius ){
    var vertices = new Array();
    var normals  = new Array();
    var uvs      = new Array();
    var indexes =  new Array();
    var faces   = new Array();
    var l = length || 0.25;
    var r = radius || 0.05;

    var segW     = 50;
    var segH     = 50;
    var height = 0.5;
    var xPos, yPos, zPos;
    var angle,angle2;

    for (var i = 0; i < segH; i++) {
        for (var j = 0; j < segW; j++) {

            angle  = (Math.PI * 2 / (segW - 1) * j);
            angle2 = (Math.PI * i / (segH - 1) - Math.PI / 2);


            xPos = Math.cos(angle) * r;
            yPos = i * (l/segH) - (l/2);
            zPos = Math.sin(angle) * r;


            vertices.push(xPos );
            vertices.push(yPos );
            vertices.push(zPos);

            normals.push( Math.cos(angle) );
            normals.push( 0 );
            normals.push(  Math.sin(angle) );

            uvs.push( j / (segW - 1));
            uvs.push( i / (segH - 1));

            if (i < segH-1 && j < segW-1) {

                indexes.push(i * segW + j);
                indexes.push(i * segW + j + 1);
                indexes.push((i+1) * segW + j);

                indexes.push(i * segW + j + 1);
                indexes.push((i+1) * segW + j + 1);
                indexes.push((i+1) * segW + j);
            }

        }
    }
    console.log("GEOMETRY : cillinder created");


    return {
        GetVertices:function(){
            return vertices;
        },
        GetNormals:function(){
            return normals;
        },
        GetUVS:function(){
            return uvs;
        },
        GetIndexes:function(){
            return indexes;
        },
        GetFaces:function(){
            return faces;
        }
    }
};

OMEGA.Omega3D.Geometry.Torus = function( scale ){
    var vertices = new Array();
    var normals  = new Array();
    var uvs      = new Array();
    var indexes =  new Array();
    var faces   = new Array();

    var segW     = 55;
    var segH     = 55;
    var t_radius  = scale || 0.1;
    var c_radius = t_radius/2;
    var xPos, yPos, zPos, xNorm, yNorm, zNorm;
    var outerAngle = 0;
    var innerAngle = 0;

    for (var i = 0; i < segW; i++) {
        outerAngle = (((Math.PI *2) / (segW-1)) * i);
        for (var j = 0; j < segH; j++) {
            innerAngle =  (((Math.PI *2) / (segH-1)) * j);

            xPos = (Math.cos(outerAngle) * (Math.cos(innerAngle) * c_radius + t_radius));
            yPos = (Math.sin(outerAngle) * (Math.cos(innerAngle) * c_radius + t_radius));
            zPos = (Math.sin(innerAngle) *  c_radius);

            xNorm = (Math.cos(outerAngle) * Math.cos(innerAngle));
            yNorm = (Math.sin(outerAngle) * Math.cos(innerAngle));
            zNorm = (Math.sin(innerAngle));

            vertices.push(xPos );
            vertices.push(yPos );
            vertices.push(zPos);

            normals.push( xNorm );
            normals.push( yNorm );
            normals.push( zNorm );

            uvs.push( j / (segH - 1));
            uvs.push( i / (segW - 1));




            if (i < segW-1 && j < segH-1) {

                indexes.push(i * segH + j);
                indexes.push(i * segH + j + 1);
                indexes.push((i+1) * segH + j);

                indexes.push(i * segH + j + 1);
                indexes.push((i+1) * segH + j + 1);
                indexes.push((i+1) * segH + j);
            }

        }
    }

    for(var i=0;i<indexes.length;i+=9){
        var v1 = { x: vertices[indexes[i]], y: vertices[indexes[i+1]], z: vertices[indexes[i+2]] };
        var v2 = { x: vertices[indexes[i + 3]], y: vertices[indexes[i+4]], z: vertices[indexes[i+5]] };
        var v3 = { x: vertices[indexes[i + 6]], y: vertices[indexes[i+7]], z: vertices[indexes[i+8]] };
        faces.push( { a:v1, b:v2, c:v3 } );

    }

    console.log("GEOMETRY : torus created");


    return {
        GetVertices:function(){
            return vertices;
        },
        GetNormals:function(){
            return normals;
        },
        GetUVS:function(){
            return uvs;
        },
        GetIndexes:function(){
            return indexes;
        },
        GetFaces:function(){
            return faces;
        }
    }
};
