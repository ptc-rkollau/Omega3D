OMEGA.Omega3D.Light = function(ambientColor,diffuseColor,specularColor){
    this.position      = [0.0, 0.0, 0.0];
    this.direction     = [0.0, 0.0, 0.0];
    this.ambientColor  = ambientColor  || [0.25, 0.25, 0.25];
    this.diffuseColor  = diffuseColor  || [0.7, 0.7, 0.7];
    this.specularColor = specularColor || [1.0, 1.0, 1.0];
    OMEGA.Omega3D.LIGHTS.push( this );
};
OMEGA.Omega3D.Light.prototype.SetPosition = function(x,y,z){
    this.position[0] = x; this.position[1] = y; this.position[2] = z;
};
OMEGA.Omega3D.Light.prototype.SetDirection = function(x,y,z){
    this.direction[0] = x; this.direction[1] = y; this.direction[2] = z;
};
OMEGA.Omega3D.Light.prototype.SetAmbientColor = function(r,g,b){
    this.ambientColor[0] = r; this.ambientColor[1] = g; this.ambientColor[2] = b;
};
OMEGA.Omega3D.Light.prototype.SetDiffuseColor = function(r,g,b){
    this.diffuseColor[0] = r; this.diffuseColor[1] = g; this.diffuseColor[2] = b;
};
OMEGA.Omega3D.Light.prototype.SetSpecularColor = function(r,g,b){
    this.specularColor[0] = r; this.specularColor[1] = g; this.specularColor[2] = b;
};


