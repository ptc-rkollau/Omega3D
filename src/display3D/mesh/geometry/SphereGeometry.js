function SphereGeometry( radius, segW, segH){
    Geometry.apply( this);
    if(radius) this.scale = radius;
    var radius = radius || this.scale;

    segH = segH || 15;
    segW = segW || 15;
    var angle = 0;
    var angle2 = 0;

    var temp_verts, temp_uvs, temp_normals, temp_tan, temp_bitan;
    temp_verts = new Array();temp_uvs = new Array();temp_normals = new Array();
    temp_tan = new Array();temp_bitan = new Array();
    for (var i = 0; i < segH; i++) {
        for ( var j = 0; j < segW; j++){
            angle  = Math.PI * 2 / (segW - 1) * j;
            angle2 = Math.PI * i / (segH - 1) - Math.PI / 2;

            var xpos = Math.cos( angle  ) * radius * Math.cos( angle2 );
            var ypos = Math.sin( angle2 ) * radius;
            var zpos = Math.sin( angle  ) * radius * Math.cos( angle2 );

            var vec    = new Vector3( xpos, ypos, zpos );
            var uv     = new Vector2(j / (segW - 1), 1- i / (segH - 1) );
            var normal = new Vector3( Math.cos( angle ) * Math.cos( angle2 ),
                                      Math.sin( angle2 ),
                                      Math.sin( angle) * Math.cos( angle2) );

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

    OMEGA.Omega3D.Log("GEOMETRY : sphere created");
};
SphereGeometry.prototype = new Geometry();
OMEGA.Omega3D.Geometry.SphereGeometry = SphereGeometry;
