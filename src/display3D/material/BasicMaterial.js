function BasicMaterial( textures, scene, color ){
    Material.apply(this, [new OMEGA.Omega3D.Shaders.Basic(textures.length>0, scene,color ? color : [1.0, 1.0, 1.0]),textures]);
}
BasicMaterial.prototype = new Material();
OMEGA.Omega3D.BasicMaterial = BasicMaterial;
