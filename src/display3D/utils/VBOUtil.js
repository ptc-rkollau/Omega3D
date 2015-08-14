OMEGA.Omega3D.VBOUtil = OMEGA.Omega3D.VBOUtil || {};
OMEGA.Omega3D.VBOUtil.GetSimularVertexIndex = function( in_vertex, in_uv, in_normal, out_verts, out_uvs, out_normals, result){
    var len = out_verts.length;
    for( var i = 0; i < len; i++){
        if( in_vertex.x == out_verts[i].x &&
            in_vertex.y == out_verts[i].y &&
            in_vertex.z == out_verts[i].z &&
            in_uv.x == out_uvs[i].x &&
            in_uv.y == out_uvs[i].y &&
            in_normal.x == out_normals[i].x &&
            in_normal.y == out_normals[i].y &&
            in_normal.z == out_normals[i].z ){
            result = i;
            return true;
        }
    }
    return false;
};
OMEGA.Omega3D.VBOUtil.IndexTB = function( in_vertices, in_uvs, in_normals, in_tangents, in_bitangents, out_vertices, out_uvs, out_normals, out_tangents, out_bitangents){
    for( var i = 0; i < in_vertices.length; i++){
        var index = -1;
        var found = OMEGA.Omega3D.VBOUtil.GetSimularVertexIndex(in_vertices[i], in_uvs[i], in_normals[i], out_vertices, out_uvs, out_normals, index );
        if(found){
            //out_indices.push(index);
            out_tangents[index].add( in_tangents[i] );
            out_bitangents[index].add( in_bitangents[i] );
        }else{
            out_vertices.push(in_vertices[i] );
            out_uvs.push(in_uvs[i] );
            out_normals.push(in_normals[i] );
            out_tangents.push(in_tangents[i] );
            out_bitangents.push(in_bitangents[i] );
          //  out_indices.push( out_vertices.length - 1);
        }
    }
};
OMEGA.Omega3D.VBOUtil.ComputeIndices = function(segmentsW, segmentsH,  out_indices ){
    for ( var i = 0; i < segmentsH; i++) {
        for ( var j = 0; j < segmentsW; j++) {
            if ( i < segmentsH -1 && j < segmentsW-1 ) {
                out_indices.push( i * segmentsW + j    , i * segmentsW + j + 1     , (i + 1) * segmentsW + j );
                out_indices.push( i * segmentsW + j + 1, (i + 1) *segmentsW + j + 1, (i + 1) * segmentsW + j );
            }
        }
    }
};
OMEGA.Omega3D.VBOUtil.FlattenMeshDataTB = function( in_vertices, in_uvs, in_normals, in_tangents, in_bitangents,out_vertices, out_uvs, out_normals, out_tangents, out_bitangents){
    for( var i = 0; i < in_vertices.length; i++) {
        out_vertices.push( in_vertices[i].x, in_vertices[i].y, in_vertices[i].z );
        out_uvs.push( in_uvs[i].x, in_uvs[i].y );
        out_normals.push( in_normals[i].x, in_normals[i].y, in_normals[i].z );
        out_tangents.push( in_tangents[i].x, in_tangents[i].y, in_tangents[i].z );
        out_bitangents.push( in_bitangents[i].x, in_bitangents[i].y, in_bitangents[i].z );
    }
};
OMEGA.Omega3D.VBOUtil.ComputeTangentBasis = function( vertices, uvs, normals, tangents_out, bitangents_out){
    var totalAmountPerVerticeStep = 3;
    for( var i = 0; i < vertices.length; i+=totalAmountPerVerticeStep){
        var vec0 = vertices[i+0];
        var vec1 = vertices[i+1];
        var vec2 = vertices[i+2];
        if(vec0 == null || vec1 == null || vec2 == null) break;

        var uv0 = uvs[i+0];
        var uv1 = uvs[i+1];
        var uv2 = uvs[i+2];



        var deltaPos1 = Vector3.Subtract(vec1, vec0);
        var deltaPos2 = Vector3.Subtract(vec2, vec0);


        var deltaUV1 = Vector2.Subtract(uv1, uv0);
        var deltaUV2 = Vector2.Subtract(uv2, uv0);

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

