function MultiMaterial(shader, textures) {
    Material.apply(this, [shader, textures ? textures.length > 0 ? textures[0] : null : null]);

    this.textures = textures;

    this.GetTexture = function() {
        return this.textures[0];
    };
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
MultiMaterial.prototype = new Material();
OMEGA.Omega3D.MultiMaterial = MultiMaterial;
