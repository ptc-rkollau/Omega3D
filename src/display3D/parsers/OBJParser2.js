function OBJParser2( debug ){
    var LINE_FEED = String.fromCharCode(10);
    var SPACE     = String.fromCharCode(32);
    var SLASH    = "/";
    var VERTEX    = "v";
    var NORMAL    = "vn";
    var UV        = "vt";
    var INDEX_DATA = "f";
    var vertexDataIsZXY = false;
    var scale = 1.0;
    var mirrorUv = true;
    var faceIndex = 0;
    var firstTimeG = true;
    this.debug = debug || false;


    var temp_vertices = new Array(), temp_normals = new Array(), temp_uvs = new Array(), temp_colors = new Array();
    var vertices = new Array(), normals = new Array(), uvs = new Array(), colors = new Array(), indexes = new Array();
    var objects = new Array();

    this.GetObjects = function() { return objects;  };
    this.GetVertices = function(){ return vertices; };
    this.GetNormals  = function(){ return normals;  };
    this.GetUVS      = function(){ return uvs;      };
    this.GetIndexes  = function(){ return indexes;  };

    this.ParseToObject3D = function( file_path, scale_factor, material ){
        objects  = new Array();
        this.parseFile(file_path, scale_factor);

        var root;
        if( this.GetObjects().length == 1){
            var obj = this.GetObjects()[0];
            var obj_geom = new Omega3D.Geometry();
            obj_geom.SetVertices( obj.vertices );
            obj_geom.SetNormals( obj.normals );
            obj_geom.SetUVS( obj.UVS );
            obj_geom.SetIndexes(obj.indexes );

            var obj_mesh = new Omega3D.Mesh( obj_geom )
            root = new Omega3D.Object3D( obj_mesh, material.Clone() );
            root.name = obj.name;
        }else{
            root = new Omega3D.Object3D();
            for(var i = 0; i < this.GetObjects().length; i++){
                var obj      = this.GetObjects()[i];
                var obj_geom = new Omega3D.Geometry();
                obj_geom.SetVertices( obj.vertices );
                obj_geom.SetNormals( obj.normals );
                obj_geom.SetUVS( obj.UVS );
                obj_geom.SetIndexes(obj.indexes );

                var obj_mesh = new Omega3D.Mesh( obj_geom )
                var object = new Omega3D.Object3D( obj_mesh, material.Clone()  );
                object.name = obj.name;
                object.SetParent(root);
            }
        }
        temp_vertices = new Array();
        temp_normals  = new Array();
        temp_uvs      = new Array();
        temp_colors   = new Array();
        this.reset();
        return root;
    };


    this.parseFile = function( file_path, scale_factor ){
        var self = this; var currentObject;
        var xmlhttp = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');
        xmlhttp.open ("GET", file_path, false);
        xmlhttp.onreadystatechange = function(e){
            scale = scale_factor;
            var obj_content = xmlhttp.responseText;
            var lines       = obj_content.split(LINE_FEED);
            lines.push(null); //end of feed.

            var index = 0; var line;
            var sp = new OMEGA.Utils.StringParser();

            while((line= lines[index++]) != null){
                sp.Init(line);
                var cmd = sp.GetFirstWord();
                var space_index = line.indexOf(' ');
                var data;
                if(sp.words.length > 0 ) data = sp.words.slice(1);

              //  console.log( sp.words );
                switch(cmd){
                    case '#':
                        continue;
                    case 'mtllib':
                        //do mtl stuff!
                        //console.log("MTL: "+ data);
                        continue;
                    case 'o':
                    case 'g':

                        var str = data[0];
                        if(str.charCodeAt(str.length-1) == 13 ) str = str.substr(0, str.length-1);
                        if(str == 'default' || firstTimeG == true){
                            if(currentObject != null){
                                currentObject.vertices = self.GetVertices();
                                currentObject.normals  = self.GetNormals();
                                currentObject.UVS      = self.GetUVS();
                                currentObject.indexes  = self.GetIndexes();
                                if(self.debug)self.debugObject(currentObject);
                                self.reset();
                            }
                            var object  = {};
                            objects.push( object );
                            currentObject = object;
                            firstTimeG = false;
                            continue;
                        }else{
                            currentObject.name = line.substr( space_index+1, line.length -(space_index+1) );
                            firstTimeG = true;
                        }
                        continue;
                    case 'v':
                        if(!currentObject){
                            var object  = {};
                            objects.push( object );
                            currentObject = object;
                        }
                        self.parseVertex(data);
                        continue;
                    case 'vn':
                        self.parseNormal(data);
                        continue;
                    case 'vt':
                        self.parseUV(data);
                        break;
                    case 'usemtl':
                        if(currentObject != null) currentObject.mtl = sp.words[1];
                        continue;
                    case 'f':
                        self.parseIndex(data);
                        continue;
                }
            }
            if(currentObject != null){
                currentObject.vertices = self.GetVertices();
                currentObject.normals  = self.GetNormals();
                currentObject.UVS      = self.GetUVS();
                currentObject.indexes  = self.GetIndexes();
                if(self.debug)self.debugObject(currentObject);
                self.reset();
            }
        }
        xmlhttp.send (null);
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

    this.reset = function(){
        vertices = new Array();
        normals  = new Array();
        uvs      = new Array();
        colors   = new Array();
        indexes  = new Array();
       // objects  = new Array();
        faceIndex = 0;
    };

    this.debugObject = function(object){
        console.log("OBJECT   : " + object.name  );
        console.log("VERTEXES : " + object.vertices.length / 3 );
        console.log("NORMALS  : " + object.normals.length / 3 );
        console.log("UV       : " + object.UVS.length / 2 );
        console.log("INDEXES  : " + object.indexes.length  );
    }
};
OMEGA.Omega3D.parsers = OMEGA.Omega3D.parsers || {};
OMEGA.Omega3D.parsers.OBJParser2 = OBJParser2;

