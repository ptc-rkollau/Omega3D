function Material( shader, textures) {
    this.materialID = "material_" + (++OMEGA.Omega3D.MaterialsCount);
    this.textures = textures;
    this.shader = shader;

    this.GetTextures = function() {
        return this.textures;
    };
    this.GetShader = function() {
        return this.shader;
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
};
OMEGA.Omega3D.Material = Material;