function ShadowMapMaterial( textures, scene, depthCam ){
    Material.apply(this, [new OMEGA.Omega3D.Shaders.SM(scene), textures ]);
    this.shadowMapTexture = new ShadowMapTexture(1024, 1024, textures.length);
    this.textures.push(this.shadowMapTexture );

    this.custom_uniforms = {};
    this.custom_uniforms["uLightM"] = { type:"mat4", glsl: "", value: depthCam.GetMatrix() };
}
ShadowMapMaterial.prototype = new Material();
OMEGA.Omega3D.ShadowMapMaterial = ShadowMapMaterial;