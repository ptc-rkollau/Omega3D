function Material( shader, textures) {
    this.materialID = "material_" + (++OMEGA.Omega3D.MaterialsCount);
    this.textures = textures || null;
    this.shader = shader || null;

    this.diffuse  = [1.0, 1.0, 1.0];
    this.ambient  = [1.0, 1.0, 1.0];
    this.specular = [1.0, 1.0, 1.0];

    this.GetTextures = function() {
        return this.textures;
    };
    this.SetTextures = function(textures) {
         this.textures = textures;
    };
    this.GetShader = function() {
        return this.shader;
    };
    this.SetShader = function( shader ) {
        this.shader = shader;
    };
    this.GetID = function() {
        return this.materialID;
    };

    this.Enable = function() {
        if (this.shader) this.shader.Enable();
        if (this.textures){

            for(var i = 0; i <  this.textures.length; i++) {
                this.textures[i].Enable(this.shader);
            }
        }
    };
    this.Disable = function() {
        if (this.shader) this.shader.Disable();
        if (this.textures){
            var l = this.textures.length;
            for(var i = 0; i < l; i++) {
                this.textures[i].Disable();
            }
        }
    };

    this.GetSpecular = function(){ return this.specular; };
    this.GetDiffuse = function(){ return this.diffuse; };
    this.GetAmbient = function(){ return this.ambient; };
    this.SetAmbient = function(r,g,b){
        this.ambient[0] = r; this.ambient[1] = g; this.ambient[2] = b;
    };

    this.SetDiffuse = function(r,g,b){
        this.diffuse[0] = r; this.diffuse[1] = g; this.diffuse[2] = b;
    };
    this.SetSpecular = function(r,g,b){
        this.specular[0] = r; this.specular[1] = g; this.specular[2] = b;
    };

    this.genUniforms = function(){
        //var uniforms = "";
       // uniforms += "uniform vec3 u" + this.id +"Specular;\n";
       // uniforms += "uniform vec3 u" + this.id +"Ambient;\n";
       // uniforms += "uniform vec3 u" + this.id +"Diffuse;\n";

        this.uniforms["uAmbient"]   = { type: "vec3", glsl: "uniform vec3 uAmbient;" , value: this.GetAmbient };
        this.uniforms["uDiffuse"]   = { type: "vec3", glsl: "uniform vec3 uDiffuse;" , value: this.GetDiffuse };
        this.uniforms["uSpecular"]  = { type: "vec3", glsl: "uniform vec3 uSpecular;", value: this.GetSpecular };

      //  return uniforms;
    };

    this.uniforms = {};
    this.genUniforms();


    this.Clone = function(){
        return new Omega3D.Material(this.shader.Clone(), this.textures);
    }
};
OMEGA.Omega3D.Material = Material;



