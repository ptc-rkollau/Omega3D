function Mesh( geom ){
    this.vertexBuffer;
    this.normalBuffer;
    this.indexBuffer;
    this.uvBuffer;
    this.geometry = geom;
    this.gl = OMEGA.Omega3D.GL;
    this.GetVertexBuffer = function(){ return this.vertexBuffer;};
    this.GetUVBuffer     = function(){ return this.uvBuffer;    };
    this.GetIndexBuffer  = function(){ return this.indexBuffer; };
    this.GetNormalBuffer = function(){ return this.normalBuffer;};
    this.GetIndexCount   = function(){ return this.geometry.GetIndexes() / 3;};
    this.GetGeometry     = function(){ return this.geometry; };

    this.ApplyGeometry   = function(geom){
        this.geometry = geom;
        this.CreateBuffers();
    };
    this.CreateBuffers = function(){
        /*VERTEX BUFFER*/
        this.vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.vertexBuffer );
        this.gl.bufferData( this.gl.ARRAY_BUFFER, new Float32Array( this.geometry.GetVertices()), this.gl.STATIC_DRAW );
        this.vertexBuffer.itemSize = 3;
        this.vertexBuffer.numItems = this.geometry.GetVertices().length / this.vertexBuffer.itemSize;

        /*NORMAL BUFFER*/
        if( this.geometry.GetNormals().length > 0) {
            this.normalBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.geometry.GetNormals()), this.gl.STATIC_DRAW);
            this.normalBuffer.itemSize = 3;
            this.normalBuffer.numItems = this.geometry.GetNormals().length / 3;
        }


        /*INDEX BUFFER*/
        this.indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer( this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer );
        this.gl.bufferData( this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( this.geometry.GetIndexes() ), this.gl.STATIC_DRAW  );
        this.indexBuffer.itemSize = 1;
        this.indexBuffer.numItems = this.geometry.GetIndexes().length;


        /*UV BUFFER*/
        this.uvBuffer = this.gl.createBuffer();
        this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.uvBuffer );
        this.gl.bufferData( this.gl.ARRAY_BUFFER, new Float32Array( this.geometry.GetUVS()), this.gl.STATIC_DRAW );
        this.uvBuffer.itemSize = 2;
        this.uvBuffer.numItems = this.geometry.GetUVS().length / this.uvBuffer.itemSize;
    };
};
OMEGA.Omega3D.Mesh = Mesh;

