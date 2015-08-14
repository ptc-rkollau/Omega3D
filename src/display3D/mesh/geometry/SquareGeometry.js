function SquareGeometry(width, height,segW, segH){
    Geometry.apply( this );
    var halfScaleW = width || 1.0 ;
    var halfScaleH = height || 1.0 ;
    var segW = segW || 150;
    var segH = segH || 150;
    var stepW = width*2 / (segW-1);
    var stepH = height*2 / (segH-1)  ;

    for( var i = 0; i < segH; i++){
        for( var j = 0; j < segW; j++){
            var xpos =  -halfScaleW + (j * stepW);
            var ypos = -halfScaleH + (i * stepH);
            var zpos =  0.0;

            this.vertices.push( xpos, ypos, zpos);

            this.normals.push( 0 );
            this.normals.push( 0 );
            this.normals.push( 1 );

            this.uvs.push( j / (segW - 1));
            this.uvs.push( i / (segH - 1));

            if (i < segH-1 && j < segW-1) {

                this.indexes.push(i * segW + j);
                this.indexes.push(i * segW + j + 1);
                this.indexes.push((i+1) * segW + j);

                this.indexes.push(i * segW + j + 1);
                this.indexes.push((i+1) * segW + j + 1);
                this.indexes.push((i+1) * segW + j);
            }
        }
    }
    /*TANGENTS, BITANGENTS */
  //  Geometry.ComputeTangentBasis( this.vertices, this.uvs, this.normals, this.tangents, this.bitangents);

//    this.vertices = [
//            -1.0 * halfScaleW,  1.0* halfScaleH,  0.0,
//            -1.0 * halfScaleW, -1.0* halfScaleH,  0.0,
//            1.0 * halfScaleW, -1.0* halfScaleH,  0.0,
//            1.0 * halfScaleW,  1.0* halfScaleH,  0.0
//    ];
//    this.normals = [
//        0, 0, 1,
//        0, 0, 1,
//        0, 0, 1,
//        0, 0, 1
//    ];
//    this.uvs = [
//        0, 1,
//        0, 0,
//        1, 0,
//        1, 1
//    ];
//    this.indexes = [ 0, 1, 2, 0, 2, 3];
    OMEGA.Omega3D.Log("GEOMETRY : square created");
};
SquareGeometry.prototype = new Geometry();
OMEGA.Omega3D.Geometry.SquareGeometry = SquareGeometry;

