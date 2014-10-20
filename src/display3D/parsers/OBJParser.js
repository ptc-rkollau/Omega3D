function OBJParser(){
    var LINE_FEED = String.fromCharCode(10);
    var SPACE     = String.fromCharCode(32);
    var SLASH    = "/";
    var VERTEX    = "v";
    var NORMAL    = "vn";
    var UV        = "vt";
    var INDEX_DATA = "f";
    var vertexDataIsZXY = false;
    var scale = 1.0;
    var mirrorUv = false;
    var faceIndex = 0;


    var temp_vertices = new Array(), temp_normals = new Array(), temp_uvs = new Array(), temp_colors = new Array();
    var vertices = new Array(), normals = new Array(), uvs = new Array(), colors = new Array(), indexes = new Array();


    this.GetVertices = function(){ return vertices; };
    this.GetNormals  = function(){ return normals;  };
    this.GetUVS      = function(){ return uvs;      };
    this.GetIndexes  = function(){ return indexes;  };

    this.ParseToObject3D = function( file_path, scale_factor, material ){
        this.parseFile(file_path, scale_factor);
        var obj_geom = new Omega3D.Geometry();
        obj_geom.SetVertices( this.GetVertices() );
        obj_geom.SetNormals( this.GetNormals() );
        obj_geom.SetUVS( this.GetUVS() );
        obj_geom.SetIndexes( this.GetIndexes() );

        var obj_mesh = new Omega3D.Mesh( obj_geom )
        var object = new Omega3D.Object3D( obj_mesh, material );
        reset();
        return object;
    };
    this.ParseToMesh = function( file_path, scale_factor ){
        this.parseFile(file_path, scale_factor);
        var obj_geom = new Omega3D.Geometry();
        obj_geom.SetVertices( this.GetVertices() );
        obj_geom.SetNormals( this.GetNormals() );
        obj_geom.SetUVS( this.GetUVS() );
        obj_geom.SetIndexes( this.GetIndexes() );

        var obj_mesh = new Omega3D.Mesh( obj_geom )
        reset();
        return obj_mesh;
    };

    this.parseFile = function( file_path, scale_factor ){
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open ("GET", file_path, false);
        xmlhttp.send ();

        scale = scale_factor;var obj_content = xmlhttp.responseText;
        var lines       = obj_content.split(LINE_FEED);
        var loop        = lines.length;
        for(var i = 0; i< loop;i++){
            this.parseLine(lines[i]);
        };



        console.log(file_path + " has been parsed, some info:");
        console.log("VERTEXES : " + vertices.length / 3 );
        console.log("NORMALS  : " + normals.length / 3 );
        console.log("UV       : " + uvs.length / 2 );
        console.log("INDEXES  : " + indexes.length  );

    };
    this.parseLine = function(line){
        var words = line.split(SPACE);
        var data;
        if(words.length > 0 ) data = words.slice(1);
        else return;


        var firstWord = words[0];
        switch( firstWord){
            case VERTEX:
                this.parseVertex(data);
                break;
            case NORMAL:
                this.parseNormal(data);
                break;
            case UV:
                this.parseUV(data);
                break;
            case INDEX_DATA:
                this.parseIndex(data);
                break;
        }
    };

    this.parseVertex = function(data){
        if(data[0] == '' || data[0]==' ') data = data.slice(1);
        if(vertexDataIsZXY){
            temp_vertices.push( parseFloat(data[1]) * scale );
            temp_vertices.push( parseFloat(data[2]) * scale );
            temp_vertices.push( parseFloat(data[0]) * scale );
        }else{
            var loop = data.length;
            if(loop>3)loop = 3;
            for(var i = 0; i<loop;++i){
                var element = data[i];
                temp_colors.push( Math.random());
                temp_vertices.push( parseFloat(element) * scale);
            }
            temp_colors.push(1.0);
        };

    };
    this.parseNormal = function(data) {
        if (data[0] == '' || data[0] == ' ') data = data.slice(1);
        var loop = data.length;
        if (loop > 3) loop = 3;
        for (var i= 0; i < loop;++i){
            var element = data[i];
            if (element != null) // handle 3dsmax extra spaces
                temp_normals.push(parseFloat(element));
        };
    };
    this.parseUV = function(data){
        if ((data[0] == '') || (data[0] == ' ')) data = data.slice(1); // delete blanks
        var loop = data.length;
        if (loop > 2) loop = 2;
        for (var i = 0; i < loop; ++i){
            var element = data[i];
            temp_uvs.push(Number(element));
        };
    };
    this.parseIndex = function(data){
        var triplet;
        var subdata;
        var vertexIndex;
        var uvIndex;
        var normalIndex;
        var index;

        // Process elements.
        var i;
        var loop = data.length;
        var starthere = 0;
        while (data[starthere] == '' || data[starthere] == ' ')
            starthere++; // ignore blanks
        loop = starthere + 3;

        // loop through each element and grab values stored earlier
        // elements come as vertexIndex/uvIndex/normalIndex
        for(i = starthere; i < loop; ++i)
        {
            triplet = data[i];
            subdata = triplet.split(SLASH);

            vertexIndex = parseInt(subdata[0]) - 1;
            uvIndex     = parseInt(subdata[1]) - 1;
            normalIndex = parseInt(subdata[2]) - 1;
            // sanity check
            if(vertexIndex < 0) vertexIndex = 0;
            if(uvIndex < 0) uvIndex = 0;
            if(normalIndex < 0) normalIndex = 0;

            // Extract from parse raw data to mesh raw data.
            // Vertex (x,y,z)
            index = 3*vertexIndex;
            vertices.push(temp_vertices[index + 0], temp_vertices[index + 1], temp_vertices[index + 2]);

            // Color (vertex r,g,b,a)
           // if (_randomVertexColors)
                colors.push(Math.random(), Math.random(), Math.random(), 1);
            //else
            //    _rawColorsBuffer.push(1, 1, 1, 1); // pure white
            // Normals (nx,ny,nz) - *if* included in the file
            if (temp_normals.length){
                index = 3*normalIndex;
                normals.push(temp_normals[index + 0],temp_normals[index + 1], temp_normals[index + 2]);
            }
            // Texture coordinates (u,v)
            index = 2 * uvIndex;
            if (mirrorUv) uvs.push(temp_uvs[index+0], 1-temp_uvs[index+1]);
            else uvs.push(1-temp_uvs[index+0],1-temp_uvs[index+1]);
        }
        // Create index buffer - one entry for each polygon
        indexes.push(faceIndex+0,faceIndex+1,faceIndex+2);
        faceIndex += 3;
    };

    var reset = function(){
        vertices = new Array();
        normals  = new Array();
        uvs      = new Array();
        colors      = new Array();
        indexes      = new Array();

        temp_vertices = new Array();
        temp_normals  = new Array();
        temp_uvs      = new Array();
        temp_colors      = new Array();
        faceIndex = 0;
    }
};
OMEGA.Omega3D.parsers = OMEGA.Omega3D.parsers || {};
OMEGA.Omega3D.parsers.OBJParser = OBJParser;
