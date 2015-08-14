attribute vec2 aTextureCoord;
attribute vec3 aVertexPos;
attribute vec3 aVertexNormal;

uniform mat4 uModelMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

varying vec2 vTexCoord;
varying vec3 vNormal;

varying vec3 vLightWeighting;

void main(void){
    gl_PointSize = 1.;
    vec4 temp = uViewMatrix * uModelMatrix * vec4(aVertexPos, 1.0);
    vec4 temp1 = uViewMatrix * uModelMatrix * vec4(aVertexNormal, 1.0);
    gl_Position   = uProjectionMatrix * temp;
    vTexCoord = aTextureCoord;
    vNormal = aVertexNormal;

    vec3 uAmbientColor= vec3( 0.5,0.5,0.5);
    vec3 uLightingDirection= vec3( 0.1, 0.0, 0.0);
    vec3 uLightColor = vec3( 1, 1, 1);
    vec3 uPointLightingLocation = vec3(0, 0, 0);

    vec3 lightDirection = normalize(uPointLightingLocation - temp.xyz);
    vec4 transformedNormal = uProjectionMatrix * temp1;
    float directionalLightWeighting = max(dot(transformedNormal.xyz, lightDirection), 0.0);
    vLightWeighting = uAmbientColor + uLightColor * directionalLightWeighting;
}