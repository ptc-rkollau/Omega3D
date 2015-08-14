precision mediump float;

uniform mat4 uViewMatrix;
uniform samplerCube uSampler;

varying vec3 vNormal;
varying vec2 vTexCoord;
varying vec3 vLightWeighting;

void main(void){

      vec4 textureColor = textureCube(uSampler,vec3(1, 0, 0) );
      gl_FragColor = vec4(textureColor.rgb * vLightWeighting, textureColor.a);
}