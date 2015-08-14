function IcosaGeometry(w, h ){
    Geometry.apply(this);

    this.vertices.push( -w, 0.0, h );
    this.vertices.push(  w, 0.0, h );
    this.vertices.push( -w, 0.0,-h );
    this.vertices.push(  w, 0.0,-h );

    this.vertices.push(  0.0, h, w );
    this.vertices.push(  0.0, h,-w );
    this.vertices.push(  0.0,-h, w );
    this.vertices.push(  0.0,-h,-w );

    this.vertices.push(  h, w, 0.0 );
    this.vertices.push( -h, w, 0.0 );
    this.vertices.push(  h,-w, 0.0 );
    this.vertices.push( -h,-w, 0.0 );


    this.indexes.push( 1, 4, 0);
    this.indexes.push( 4, 9, 0);
    this.indexes.push( 4, 5, 9);
    this.indexes.push( 8, 5, 4);
    this.indexes.push( 1, 8, 4);

    this.indexes.push( 1, 10, 8);
    this.indexes.push(10,  3, 8);
    this.indexes.push( 8,  3, 5);
    this.indexes.push( 3,  2, 5);
    this.indexes.push( 3,  7, 2);

    this.indexes.push( 3,  10, 7);
    this.indexes.push( 10,  6, 7);
    this.indexes.push( 6,  11, 7);
    this.indexes.push( 6,  0, 11);
    this.indexes.push( 6,  1,  0);

    this.indexes.push( 10,  1,  6);
    this.indexes.push( 11,  0,  9);
    this.indexes.push(  2, 11,  9);
    this.indexes.push(  5,  2,  9);
    this.indexes.push( 11,  2,  7);


    for(var i = 0; i < this.vertices.length; i++){
        this.normals.push(this.vertices[i]);
    }

    OMEGA.Omega3D.Log("GEOMETRY : icosahedron created");

}
IcosaGeometry.prototype = new Geometry();
OMEGA.Omega3D.Geometry.IcosaGeometry = IcosaGeometry;