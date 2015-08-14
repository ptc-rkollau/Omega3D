function CylinderGeometry(length, radius, segW, segH){
    Geometry.apply( this );
    var l = radius || this.scale* 0.25;
    var r = length || this.scale;

    var segW     = segW || 15;
    var segH     = segH || 10;
    var xPos, yPos, zPos;
    var angle,angle2;

    var temp_verts, temp_uvs, temp_normals, temp_tan, temp_bitan;
    temp_verts = new Array();temp_uvs = new Array();temp_normals = new Array();
    temp_tan = new Array();temp_bitan = new Array();
    for (var i = 0; i < segH; i++) {
        for (var j = 0; j < segW; j++) {

            angle  = (Math.PI * 2 / (segW - 1) * j);
            angle2 = (Math.PI * i / (segH - 1) - Math.PI / 2);


            xPos = Math.cos(angle) * l;
            yPos = i * (r/segH) - (r/2);
            zPos = Math.sin(angle) * l;



            var vec    = new Vector3( xPos, yPos, zPos );
            var uv     = new Vector2(j / (segW - 1), i / (segH - 1) );
            var normal = new Vector3( Math.cos( angle ),0,Math.sin( angle));
            temp_verts.push( vec );
            temp_normals.push( normal );
            temp_uvs.push( uv );
        }
    }


    /*TANGENTS, BITANGENTS */
    OMEGA.Omega3D.VBOUtil.ComputeTangentBasis( temp_verts, temp_uvs, temp_normals,  //in
                                               temp_tan, temp_bitan);               //out

    OMEGA.Omega3D.VBOUtil.IndexTB( temp_verts, temp_uvs, temp_normals, temp_tan, temp_bitan,                                      //in
                                   this.vertices_raw, this.uvs_raw, this.normals_raw,this.tangents_raw, this.bitangents_raw  );   //out

    OMEGA.Omega3D.VBOUtil.FlattenMeshDataTB( temp_verts, temp_uvs, temp_normals, temp_tan,temp_bitan,                //in
                                              this.vertices,this.uvs, this.normals, this.tangents, this.bitangents ); //out

    /*INDEXES.*/
    OMEGA.Omega3D.VBOUtil.ComputeIndices( segW, segH, this.indexes );


    /* FACES */
    Geometry.ComputeFaces( this.vertices, this.indexes, this.faces );

    OMEGA.Omega3D.Log("GEOMETRY : cillinder created");
};
CylinderGeometry.prototype = new Geometry();
OMEGA.Omega3D.Geometry.CylinderGeometry = CylinderGeometry;
