function TorusGeometry( radius, tube_radius, segW, segH ){
    Geometry.apply( this );

    var segW     = segW || 40;
    var segH     = segH || 50;
    var t_radius  = radius || this.scale;
    var c_radius  = tube_radius || t_radius/2;
    var xPos, yPos, zPos, xNorm, yNorm, zNorm;
    var outerAngle = 0;
    var innerAngle = 0;
    for (var i = 0; i < segW; i++) {
        outerAngle = (((Math.PI *2) / (segW-1)) * i);
        for (var j = 0; j < segH; j++) {
            innerAngle =  (((Math.PI *2) / (segH-1)) * j);

            xPos = (Math.cos(outerAngle) * (Math.cos(innerAngle) * c_radius - t_radius));
            yPos = (Math.sin(outerAngle) * (Math.cos(innerAngle) * c_radius- t_radius));
            zPos = (Math.sin(innerAngle) *  c_radius);


            xNorm = (Math.cos(outerAngle ) * Math.cos(innerAngle ));
            yNorm = (Math.sin(outerAngle ) * Math.cos(innerAngle));
            zNorm = (Math.sin(innerAngle  ));

            this.vertices.push(xPos );
            this.vertices.push(yPos );
            this.vertices.push(zPos);

            this.normals.push( xNorm );
            this.normals.push( yNorm );
            this.normals.push( zNorm );

            this.uvs.push( j / (segH - 1));
            this.uvs.push( i / (segW - 1));

            if (i < segW-1 && j < segH-1) {

                this.indexes.push(i * segH + j);
                this.indexes.push(i * segH + j + 1);
                this.indexes.push((i+1) * segH + j);

                this.indexes.push(i * segH + j + 1);
                this.indexes.push((i+1) * segH + j + 1);
                this.indexes.push((i+1) * segH + j);
            }

        }
    }
    for(var i=0;i< this.indexes.length;i+=9){
        var v1 = { x: this.vertices[this.indexes[i]], y: this.vertices[this.indexes[i+1]], z: this.vertices[this.indexes[i+2]] };
        var v2 = { x: this.vertices[this.indexes[i + 3]], y: this.vertices[this.indexes[i+4]], z: this.vertices[this.indexes[i+5]] };
        var v3 = { x: this.vertices[this.indexes[i + 6]], y: this.vertices[this.indexes[i+7]], z: this.vertices[this.indexes[i+8]] };
        this.faces.push( { a:v1, b:v2, c:v3 } );

    }
    console.log("GEOMETRY : torus created");
};
TorusGeometry.prototype = new Geometry();
OMEGA.Omega3D.Geometry.TorusGeometry = TorusGeometry;