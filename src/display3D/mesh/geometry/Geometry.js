function Geometry(){
    this.vertices = new Array();
    this.normals  = new Array();
    this.uvs      = new Array();
    this.indexes  = new Array();
    this.faces    = new Array();
    this.scale    = 1.0;

    this.SetVertices = function(value){ this.vertices=value; };
    this.SetNormals  = function(value){ this.normals=value;  };
    this.SetUVS      = function(value){ this.uvs=value;      };
    this.SetIndexes  = function(value){ this.indexes=value;  };
    this.SetFaces    = function(value){ this.faces=value;    };

    this.GetVertices = function(){ return this.vertices; };
    this.GetNormals  = function(){ return this.normals;  };
    this.GetUVS      = function(){ return this.uvs;      };
    this.GetIndexes  = function(){ return this.indexes;  };
    this.GetFaces    = function(){ return this.faces;    };
};
OMEGA.Omega3D.Geometry = Geometry;