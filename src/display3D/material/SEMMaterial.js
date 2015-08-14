function SEMMaterial( textures, scene){
    Material.apply(this, [new Omega3D.Shaders.SEM(scene),textures]);
}
SEMMaterial.prototype = new Material();
OMEGA.Omega3D.SEMMaterial = SEMMaterial;
