function CubeMapMaterial( textures, scene ){
    Material.apply(this, [ new OMEGA.Omega3D.Shaders.CubeMap(scene),textures]);
}
CubeMapMaterial.prototype = new Material();
OMEGA.Omega3D.CubeMapMaterial = CubeMapMaterial;
