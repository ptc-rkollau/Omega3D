function CylinderGeometry(length, radius, segW, segH){
    Geometry.apply( this );
    var l = radius || this.scale* 0.25;
    var r = length || this.scale;

    var segW     = segW || 15;
    var segH     = segH || 10;
    var xPos, yPos, zPos;
    var angle,angle2;
    for (var i = 0; i < segH; i++) {
        for (var j = 0; j < segW; j++) {

            angle  = (Math.PI * 2 / (segW - 1) * j);
            angle2 = (Math.PI * i / (segH - 1) - Math.PI / 2);


            xPos = Math.cos(angle) * l;
            yPos = i * (r/segH) - (r/2);
            zPos = Math.sin(angle) * l;


            this.vertices.push(xPos );
            this.vertices.push(yPos );
            this.vertices.push(zPos);

            this.normals.push( Math.cos(angle) );
            this.normals.push( 0 );
            this.normals.push(  Math.sin(angle) );

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
    console.log("GEOMETRY : cillinder created");
};
CylinderGeometry.prototype = new Geometry();
OMEGA.Omega3D.Geometry.CylinderGeometry = CylinderGeometry;
