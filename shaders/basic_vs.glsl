attribute vec2 aTextureCoord;
attribute vec3 aVertexPos;
attribute vec3 aVertexNormal;


uniform mat4 uModelMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

void main(void){
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPos, 1.0);
    vTexCoord = aTextureCoord;
    vNormal = aVertexNormal;
}