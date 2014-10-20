function SphereGeometry( radius, segW, segH){
    Geometry.apply( this);
    var radius = radius || this.scale;
    var segH = segW || 15;
    var segW = segH || 15;
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

            this.vertices.push(  xpos );
            this.vertices.push(  ypos );
            this.vertices.push(  zpos );
            this.normals.push(  Math.cos( angle ) * Math.cos( angle2 ),
                                Math.sin( angle2 ),
                                Math.sin( angle) * Math.cos( angle2) );

            this.uvs.push( j / (segW - 1), 1- i / (segH - 1) );
        }
    }

    /*INDEXES.*/
    for ( var i = 0; i < segH; i++) {
        for ( var j = 0; j < segW; j++) {
            if ( i < segH -1 && j < segW-1 ) {
                this.indexes.push( i * segW + j    , i * segW + j + 1     , (i + 1) * segW + j );
                this.indexes.push( i * segW + j + 1, (i + 1) *segW + j + 1, (i + 1) * segW + j );
            }
        }
    }
    console.log("GEOMETRY : sphere created");
};
SphereGeometry.prototype = new Geometry();
OMEGA.Omega3D.Geometry.SphereGeometry = SphereGeometry;
