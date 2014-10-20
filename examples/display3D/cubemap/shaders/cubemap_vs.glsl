attribute vec2 aTextureCoord;
attribute vec3 aVertexPos;
attribute vec3 aVertexNormal;


uniform mat4 uModelMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;


varying vec2 sTexCoord;
varying vec3 vTexCoord;
varying vec3 vNormal;


void main(void){
    vec4 pos = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPos, 1.0);
    vec4 norm = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexNormal, aVertexNormal.z);
    gl_Position = pos;
    sTexCoord = aTextureCoord;
    vNormal   = aVertexNormal;



    vTexCoord = (vec4(aVertexPos, 0.0)).xyz;
}