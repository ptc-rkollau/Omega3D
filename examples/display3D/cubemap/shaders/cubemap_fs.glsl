precision mediump float;

uniform samplerCube uSampler;

varying vec3 vTexCoord;
varying vec3 vNormal;


void main(void){
      gl_FragColor = textureCube(uSampler, vTexCoord);
}