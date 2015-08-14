function Geometry(){
    this.vertices  = new Array();
    this.normals   = new Array();
    this.uvs       = new Array();
    this.tangents   = new Array();
    this.bitangents = new Array();
    this.vertices_raw  = new Array();
    this.normals_raw    = new Array();
    this.uvs_raw        = new Array();
    this.tangents_raw    = new Array();
    this.bitangents_raw  = new Array();
    this.indexes   = new Array();
    this.faces     = new Array();

    this.scale    = 1.0;

    this.SetVertices = function(value){ this.vertices=value; };
    this.SetNormals  = function(value){ this.normals=value;  };
    this.SetUVS      = function(value){ this.uvs=value;      };
    this.SetIndexes  = function(value){ this.indexes=value;  };
    this.SetFaces    = function(value){ this.faces=value;    };
    this.SetTangents   = function(value){ this.tangents =value; };
    this.SetBitangents = function(value){this.bitangents = value; };


    this.GetVertices   = function(){ return this.vertices; };
    this.GetNormals    = function(){ return this.normals;  };
    this.GetUVS        = function(){ return this.uvs;      };
    this.GetTangents   = function(){ return this.tangents; };
    this.GetBitangents = function(){ return this.bitangents; };
    this.GetIndexes    = function(){ return this.indexes;  };
    this.GetFaces      = function(){ return this.faces;    };

    this.GetLengthBetweenPoints = function( a, b ){
        var dx = b.x - a.x;
        var dy = b.y - a.y;
        var dz = b.z - a.z;
        var len = dx*dx+dy*dy+dz*dz;
        return Math.sqrt(len);
    };
};
Geometry.ComputeIndices = function(segmentsW, segmentsH,  out_indices ){
    for ( var i = 0; i < segmentsH; i++) {
        for ( var j = 0; j < segmentsW; j++) {
            if ( i < segmentsH -1 && j < segmentsW-1 ) {
                out_indices.push( i * segmentsW + j    , i * segmentsW + j + 1     , (i + 1) * segmentsW + j );
                out_indices.push( i * segmentsW + j + 1, (i + 1) *segmentsW + j + 1, (i + 1) * segmentsW + j );
            }
        }
    }
};
//Geometry.IndexVBO = function( in_vertices, in_uvs, in_normals, in_tangents, in_bitangents,out_indices, out_vertices, out_uvs, out_normals, out_tangents, out_bitangents){
//    for( var i = 0; i < in_vertices.length; i++){
//        var index;
//        var found = Geometry.GetSimularVertexIndex(in_vertices[i], in_uvs[i], in_normals[i], out_vertices, out_uvs, out_normals, index );
//        if(found){
//            out_indices.push(index);
//            out_tangents[index].add( in_tangents[i] );
//            out_bitangents[index].add( in_bitangents[i] );
//        }else{
//            out_vertices.push(in_vertices[i] );
//            out_uvs.push(in_uvs[i] );
//            out_normals.push(in_normals[i] );
//            out_tangents.push(in_tangents[i] );
//            out_bitangents.push(in_bitangents[i] );
//            out_indices.push( out_vertices.length - 1);
//        }
//    }
//};
//Geometry.GetSimularVertexIndex = function( in_vertex)
Geometry.ComputeTangentBasis = function( vertices, uvs, normals, tangents_out, bitangents_out){
    var totalAmountPerVerticeStep = 9;
    for( var i = 0; i < vertices.length; i+=totalAmountPerVerticeStep){
        var pointA = new Vector3( vertices[i+0],  vertices[i+1],  vertices[i+2]);
        var pointB = new Vector3( vertices[i+3],  vertices[i+4],  vertices[i+5]);
        var pointC = new Vector3( vertices[i+6],  vertices[i+7],  vertices[i+8]);

        var uvA = new Vector2(uvs[i+0],uvs[i+1],uvs[i+2] );
        var uvB = new Vector2(uvs[i+3],uvs[i+4],uvs[i+5] );
        var uvC = new Vector2(uvs[i+6],uvs[i+7],uvs[i+8] );

        var deltaPos1 = Vector3.Subtract(pointB, pointA);
        var deltaPos2 = Vector3.Subtract(pointC, pointA);

        var deltaUV1 = Vector2.Subtract(uvB, uvA);
        var deltaUV2 = Vector2.Subtract(uvC, uvA);

        var r = 1.0 / (deltaUV1.x * deltaUV2.y - deltaUV1.y * deltaUV2.x);
        var tangent = Vector3.MultiplyByValue(
                                Vector2.Subtract(
                                    Vector3.MultiplyByValue(deltaPos1,deltaUV2.y),
                                    Vector3.MultiplyByValue(deltaPos2,deltaUV1.y)
                                ),r);

        var bitangent = Vector3.MultiplyByValue(
                                Vector3.Subtract(
                                    Vector3.MultiplyByValue(deltaPos2,deltaUV1.x),
                                    Vector3.MultiplyByValue(deltaPos1,deltaUV2.x)
                                ),r);

        tangents_out.push( tangent );
        tangents_out.push( tangent );
        tangents_out.push( tangent );


        bitangents_out.push( bitangent);
        bitangents_out.push( bitangent);
        bitangents_out.push( bitangent);
    }
};
Geometry.ComputeFaces = function( vertices, indices, faces_out){
    for(var i=0;i< indices.length;i+=9){
        var v1 = { x: vertices[indices[i]], y: vertices[indices[i+1]], z: vertices[indices[i+2]] };
        var v2 = { x: vertices[indices[i + 3]], y: vertices[indices[i+4]], z: vertices[indices[i+5]] };
        var v3 = { x: vertices[indices[i + 6]], y: vertices[indices[i+7]], z: vertices[indices[i+8]] };
        faces_out.push( { a:v1, b:v2, c:v3 } );
    }
};
OMEGA.Omega3D.Geometry = Geometry;