function Mesh( geom ){
    this.combinedBuffer;
    this.vertexBuffer;
    this.normalBuffer;
    this.indexBuffer;
    this.uvBuffer;
    this.tangentBuffer;
    this.bitangentBuffer;
    this.colorPickingBuffer;
    this.geometry = geom;
    this.gl = OMEGA.Omega3D.GL;
    this.GetCombinedBuffer = function(){ return this.combinedBuffer;};
    this.GetVertexBuffer = function(){ return this.vertexBuffer;};
    this.GetUVBuffer     = function(){ return this.uvBuffer;    };
    this.GetIndexBuffer  = function(){ return this.indexBuffer; };
    this.GetNormalBuffer = function(){ return this.normalBuffer;};
    this.GetTangentBuffer = function(){ return this.tangentBuffer;};
    this.GetBitangentBuffer = function(){ return this.bitangentBuffer;};
    this.GetColorPickingBuffer = function(){ return this.colorPickingBuffer;};
    this.GetIndexCount   = function(){ return this.geometry.GetIndexes() / 3;};
    this.GetGeometry     = function(){ return this.geometry; };

    this.ApplyGeometry   = function(geom){
        this.geometry = geom;
        this.CreateBuffers();
    };
    this.CreateBuffers = function(){
        var combined = new Array();
        var vertices = this.geometry.GetVertices();
        var normals  = this.geometry.GetNormals();
        var uvs      = this.geometry.GetUVS();
        var tangents  = new Array();
        var bitangents = new Array();
        Geometry.ComputeTangentBasis(vertices, uvs, normals, tangents, bitangents);
        var uvCounter = 0; //because uv = 2 component vector.
        var baricentricX = 0, baricentricY = 1, baricentricZ = 0;
        for( var i = 0; i < vertices.length; i+=3){
            combined.push( vertices[i], vertices[i+1], vertices[i+2],
                           normals[i] , normals[i+1] , normals[i+2],
                           uvs[uvCounter], uvs[uvCounter+1],
                           tangents[i],tangents[i+1],tangents[i+2],
                           bitangents[i],bitangents[i+1],bitangents[i+2],
                           baricentricX, baricentricY,baricentricZ );
            if( baricentricY == 1 ){
                baricentricX = 0;baricentricY = 0;baricentricZ = 1;
            }else if( baricentricZ == 1 ){
                baricentricX = 1;baricentricY = 0;baricentricZ = 0;
            }else if( baricentricX == 1 ){
                baricentricX = 0;baricentricY = 1;baricentricZ = 0;
            }

            uvCounter+=2;
        }
        this.combinedBuffer = this.gl.createBuffer();
        this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.combinedBuffer );
        this.gl.bufferData( this.gl.ARRAY_BUFFER, new Float32Array( combined ), this.gl.STATIC_DRAW );




        /*VERTEX BUFFER*/
        //if( this.geometry.GetVertices().length > 0) {
        //    if(!this.vertexBuffer) this.vertexBuffer = this.gl.createBuffer();
        //    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        //    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.geometry.GetVertices()), this.gl.STATIC_DRAW);
        //    this.vertexBuffer.itemSize = 3;
        //    this.vertexBuffer.numItems = this.geometry.GetVertices().length / this.vertexBuffer.itemSize;
        //}
        //
        ///*NORMAL BUFFER*/
        //if( this.geometry.GetNormals().length > 0) {
        //    if(!this.normalBuffer) this.normalBuffer = this.gl.createBuffer();
        //    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
        //    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.geometry.GetNormals()), this.gl.STATIC_DRAW);
        //    this.normalBuffer.itemSize = 3;
        //    this.normalBuffer.numItems = this.geometry.GetNormals().length / 3;
        //}
        //
        ///*UV BUFFER*/
        //if( this.geometry.GetUVS().length > 0) {
        //    if(!this.uvBuffer) this.uvBuffer = this.gl.createBuffer();
        //    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.uvBuffer);
        //    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.geometry.GetUVS()), this.gl.STATIC_DRAW);
        //    this.uvBuffer.itemSize = 2;
        //    this.uvBuffer.numItems = this.geometry.GetUVS().length / this.uvBuffer.itemSize;
        //}


        /*INDEX BUFFER*/
        if( this.geometry.GetIndexes().length > 0) {
            if(!this.indexBuffer) this.indexBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.geometry.GetIndexes()), this.gl.STATIC_DRAW);
            this.indexBuffer.itemSize = 1;
            this.indexBuffer.numItems = this.geometry.GetIndexes().length;
        }




        /*TANGENT BUFFER*/
        //if( this.geometry.GetTangents().length > 0) {
        //    if(!this.tangentBuffer) this.tangentBuffer = this.gl.createBuffer();
        //    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.tangentBuffer);
        //    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.geometry.GetTangents()), this.gl.STATIC_DRAW);
        //    this.tangentBuffer.itemSize = 3;
        //    this.tangentBuffer.numItems = this.geometry.GetTangents().length / this.tangentBuffer.itemSize;
        //}
        //
        ///*BITANGENT BUFFER*/
        //if( this.geometry.GetBitangents().length > 0) {
        //    if(!this.bitangentBuffer) this.bitangentBuffer = this.gl.createBuffer();
        //    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bitangentBuffer);
        //    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.geometry.GetBitangents()), this.gl.STATIC_DRAW);
        //    this.bitangentBuffer.itemSize = 3;
        //    this.bitangentBuffer.numItems = this.geometry.GetBitangents().length / this.bitangentBuffer.itemSize;
        //}
    };
    this.CreateColorPickingBuffer = function( objectID ){
        if( parseFloat(objectID) > -1) {
            var colorData = new Array();
            var step = 1.0 / 255.0;
            var fID = parseFloat(objectID);
            var size = 255.0, r255 = 0, g255 = 0, b255 = 0;
            r255 = fID <= size ? fID : size;
            if(fID > (size * 1.0 )) g255 = fID - r255;        // bigger than: 255
            if(fID > (size * 2.0 )) b255 = fID - (r255+g255); // bigger than: 255 + 255


            for(var i = 0; i < this.geometry.GetVertices().length; i++){
                colorData.push(step * r255,step * g255, step * b255 );
            }
            if(!this.colorPickingBuffer) this.colorPickingBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorPickingBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colorData), this.gl.STATIC_DRAW);
            this.colorPickingBuffer.itemSize = 3;
            this.colorPickingBuffer.numItems = colorData.length / this.colorPickingBuffer.itemSize;
        }
    };
};
OMEGA.Omega3D.Mesh = Mesh;

