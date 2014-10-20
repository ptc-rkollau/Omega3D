function ColladaParser(){
    var vertices = new Array(), normals = new Array(), uvs = new Array(), indexes = new Array();

    this.GetVertices = function(){ return vertices; };
    this.GetNormals  = function(){ return normals;  };
    this.GetUVS      = function(){ return uvs;      };
    this.GetIndexes  = function(){ return indexes;  };

   this.parseFile = function( file_path ){
       var xmlhttp = new XMLHttpRequest();
       xmlhttp.open ("GET", file_path, false);
       xmlhttp.send ();
       var content = xmlhttp.responseText;

       if (window.DOMParser)
       {
           parser=new DOMParser();
           xmlDoc=parser.parseFromString(content,"text/xml");
       }
       else // Internet Explorer
       {
           xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
           xmlDoc.async=false;
           xmlDoc.loadXML(content);
       }
       return xmlDoc;
   };

    this.parseScene = function( file_path ){
        var xmlDoc = this.parseFile(file_path);
        var geometries = xmlDoc.getElementsByTagName("geometry");
        var transforms = xmlDoc.getElementsByTagName("visual_scene")[0].getElementsByTagName("node");
        var objects = new Array();
        var matrixes= new Array();
        for( var i = 0; i < geometries.length; i++){
            var o = this.parseToObject3DFromXMLNode( geometries[i]);
            objects[o.id] =o;
        }
        console.log(objects);
        for( var i = 0; i < transforms.length; i++){
            var mat = transforms[i].childNodes[1].childNodes[0].nodeValue;
            var temp_mat = mat.split(" ");
            var tmat = new Array();
            for(var j = 0; j < temp_mat.length; j++){
                tmat.push(parseFloat(temp_mat[j]));
            }
            mat = mat4.clone(tmat);
            var instance = transforms[i].childNodes[3];
            var instance_id = transforms[i].childNodes[3].attributes.url.value.substr(1);
            if(instance.nodeName == "instance_geometry"){
               matrixes.push(mat);
               objects[instance_id].SetMatrix(mat);
            }else if(instance.nodeName == "instance_camera"){

            }else if(instance.nodeName == "instance_light"){

            }

        }

        return {objects:objects, matrixes:matrixes};
    };

    this.parseToObject3DFromXMLNode = function ( data ){
        var id   = data.attributes[0].value;
        var name = data.attributes[1].value;
        var mesh = data.getElementsByTagName("mesh")[0];

        //vertices.
        vertices = mesh.childNodes[1].childNodes[1].childNodes[0].nodeValue;
        var temp_vertices = vertices.split(" ");
        vertices = new Array();
        for( var j = 0; j < temp_vertices.length;j++){
            vertices.push(parseFloat(temp_vertices[j]));
        }

        normals  = mesh.childNodes[3].childNodes[1].childNodes[0].nodeValue;
        var temp_normals = normals.split(" ");
        normals = new Array();
        for( var j = 0; j < temp_normals.length;j++){
            normals.push(parseFloat(temp_normals[j]));
        }

        //indexes.
        indexes = mesh.childNodes[7].childNodes[7].childNodes[0].nodeValue;
        var temp_indices = indexes.split(" ");
        indexes = new Array();
        for( var j = 0; j < temp_indices.length;j+=2){
            indexes.push(parseInt(temp_indices[j]));
        }


        var obj_geom = new Omega3D.Geometry();
        obj_geom.SetVertices( vertices );
        obj_geom.SetNormals( normals );
        obj_geom.SetUVS( new Array() );
        obj_geom.SetIndexes( indexes );

        var obj_mesh = new Omega3D.Mesh( obj_geom )
        var object = new Omega3D.Object3D( obj_mesh, new Omega3D.Material( new Omega3D.Shaders.Phong(false), new Omega3D.BasicTexture) );
        object.name = name;
        object.id = id;
        return object;
    }
};
OMEGA.Omega3D.parsers = OMEGA.Omega3D.parsers || {};
OMEGA.Omega3D.parsers.ColladaParser = ColladaParser;