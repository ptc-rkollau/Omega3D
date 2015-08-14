function CustomMesh( geom ){
    Mesh.apply(this, [geom]);

    this.CreateBuffers = function(){
        /*VERTEX BUFFER*/
        if( this.geometry.GetVertices().length > 0) {
            if(!this.vertexBuffer) this.vertexBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.geometry.GetVertices()), this.gl.STATIC_DRAW);
            this.vertexBuffer.itemSize = 3;
            this.vertexBuffer.numItems = this.geometry.GetVertices().length / this.vertexBuffer.itemSize;
        }

        /*NORMAL BUFFER*/
        if( this.geometry.GetNormals().length > 0) {
            if(!this.normalBuffer) this.normalBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.geometry.GetNormals()), this.gl.STATIC_DRAW);
            this.normalBuffer.itemSize = 3;
            this.normalBuffer.numItems = this.geometry.GetNormals().length / 3;
        }


        /*INDEX BUFFER*/
        if( this.geometry.GetIndexes().length > 0) {
            if(!this.indexBuffer) this.indexBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.geometry.GetIndexes()), this.gl.STATIC_DRAW);
            this.indexBuffer.itemSize = 1;
            this.indexBuffer.numItems = this.geometry.GetIndexes().length;
        }


        /*UV BUFFER*/
        if( this.geometry.GetUVS().length > 0) {
            if(!this.uvBuffer) this.uvBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.uvBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.geometry.GetUVS()), this.gl.STATIC_DRAW);
            this.uvBuffer.itemSize = 2;
            this.uvBuffer.numItems = this.geometry.GetUVS().length / this.uvBuffer.itemSize;
        }

        /*TANGENT BUFFER*/
        if( this.geometry.GetTangents().length > 0) {
            if(!this.tangentBuffer) this.tangentBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.tangentBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.geometry.GetTangents()), this.gl.STATIC_DRAW);
            this.tangentBuffer.itemSize = 3;
            this.tangentBuffer.numItems = this.geometry.GetTangents().length / this.tangentBuffer.itemSize;
        }

        /*BITANGENT BUFFER*/
        if( this.geometry.GetBitangents().length > 0) {
            if(!this.bitangentBuffer) this.bitangentBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bitangentBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.geometry.GetBitangents()), this.gl.STATIC_DRAW);
            this.bitangentBuffer.itemSize = 3;
            this.bitangentBuffer.numItems = this.geometry.GetBitangents().length / this.bitangentBuffer.itemSize;
        }
    };

};
CustomMesh.prototype = new Mesh();
OMEGA.Omega3D.CustomMesh = CustomMesh;
