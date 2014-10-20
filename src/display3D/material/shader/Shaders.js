OMEGA.Omega3D.Shaders = OMEGA.Omega3D.Shaders || {};

/**
 *  Basic Shader
 *
 * @param isTextured
 * @returns {{vs_src: string, fs_src: string}}
 */
OMEGA.Omega3D.Shaders.Basic = function( isTextured, color ){
    var texture, fragmentColor;
    isTextured = isTextured || false;
    if(isTextured) texture = "varying vec2 vTexCoord;";
    else texture = "";
    var vertex_source = OMEGA.Omega3D.Shaders.Components.Basic_Includes();
        vertex_source = vertex_source + texture;
        vertex_source = vertex_source + "void main(void){gl_PointSize = uPointSize;";
        vertex_source = vertex_source + OMEGA.Omega3D.Shaders.Components.Vertex_World_Conversion_V3("gl_Position", "aVertexPos");
        if(isTextured                      ) vertex_source = vertex_source + OMEGA.Omega3D.Shaders.Components.Basic_TextureCoords("vTexCoord");
        vertex_source = vertex_source + "}";


    if(isTextured){
        texture = "uniform sampler2D uSampler;"+
                  "varying vec2 vTexCoord;";
        fragmentColor = "texture2D(uSampler, vec2(vTexCoord.s, vTexCoord.t));";
    }
    else{
        if(color) fragmentColor = "vec4("+color[0]+","+ +color[1]+"," +  +color[2]+", 1.0);";
        else  fragmentColor = "vec4(0.8,0.4,0.0, 1.0);";
    }
    var fragment_source = OMEGA.Omega3D.Shaders.Components.Fragment_Precision_Mediump_Float();
        if( isTextured                     ) fragment_source = fragment_source + texture;
        fragment_source = fragment_source + "void main(void){";
        fragment_source = fragment_source + OMEGA.Omega3D.Shaders.Components.Basic_Fragment_Logic(fragmentColor);
        fragment_source = fragment_source + "}";

    var fragmentOnlyUniforms = {};
    if(isTextured) fragmentOnlyUniforms["uSampler"] = { id:"uSampler", type: "sampler2D", glsl: "", value: null };
    return new OMEGA.Omega3D.Shader(vertex_source,fragment_source,  [OMEGA.Omega3D.Shaders.Components.StandardAttributes(),
                                                                     OMEGA.Omega3D.Shaders.Components.StandardUniforms(),
                                                                     {},
                                                                     fragmentOnlyUniforms]);
};
OMEGA.Omega3D.Shaders.Diffuse = function( isTextured ){
    var texture, fragmentColor;
    isTextured = isTextured || false;
    if(isTextured) texture = "varying vec2 vTexCoord;";
    else texture = "";
    var vertex_source = OMEGA.Omega3D.Shaders.Components.Basic_Includes();
    if(OMEGA.Omega3D.LIGHTS.length > 0 ) vertex_source = vertex_source + OMEGA.Omega3D.Shaders.Components.Basic_Light_Varying();
    vertex_source = vertex_source + texture;
    vertex_source = vertex_source + "void main(void){gl_PointSize = uPointSize;";
    vertex_source = vertex_source + OMEGA.Omega3D.Shaders.Components.Vertex_World_Conversion_V3("gl_Position", "aVertexPos");
    if(isTextured                      ) vertex_source = vertex_source + OMEGA.Omega3D.Shaders.Components.Basic_TextureCoords("vTexCoord");
    if(OMEGA.Omega3D.LIGHTS.length > 0 ) vertex_source = vertex_source + OMEGA.Omega3D.Shaders.Components.Basic_Diffuse_Vertex_Logic();
    vertex_source = vertex_source + "}";


    if(isTextured){
        texture = "uniform sampler2D uSampler;"+
            "varying vec2 vTexCoord;";
        fragmentColor = "texture2D(uSampler, vec2(vTexCoord.s, vTexCoord.t));";
    }
    else{
        fragmentColor = "vec4(0.8, 0.4, 0.0, 1.0);";
    }
    var fragment_source = OMEGA.Omega3D.Shaders.Components.Fragment_Precision_Mediump_Float();
    if(OMEGA.Omega3D.LIGHTS.length > 0 ) fragment_source = fragment_source + OMEGA.Omega3D.Shaders.Components.Basic_Light_Includes() + OMEGA.Omega3D.Shaders.Components.Basic_Light_Varying();
    if( isTextured                     ) fragment_source = fragment_source + texture;
    fragment_source = fragment_source + "void main(void){";
    if(OMEGA.Omega3D.LIGHTS.length > 0 ) fragment_source = fragment_source + OMEGA.Omega3D.Shaders.Components.Basic_Diffuse_Fragment_Logic(fragmentColor);
    else                                 fragment_source = fragment_source + OMEGA.Omega3D.Shaders.Components.Basic_Fragment_Logic(fragmentColor);
    fragment_source = fragment_source + "}";

    var fragmentOnlyUniforms = {};
    if(isTextured) fragmentOnlyUniforms["uSampler"] = { id:"uSampler", type: "sampler2D", glsl: "", value: null };
    return new OMEGA.Omega3D.Shader(vertex_source,fragment_source,  [OMEGA.Omega3D.Shaders.Components.StandardAttributes(),
                                                                     OMEGA.Omega3D.Shaders.Components.StandardUniforms(),
                                                                     OMEGA.Omega3D.Shaders.Components.StandardLightUniforms(),
                                                                     fragmentOnlyUniforms]);
};
OMEGA.Omega3D.Shaders.Phong = function( isTextured ){
    var texture, fragmentColor;
    isTextured = isTextured || false;
    if(isTextured) texture = "varying vec2 vTexCoord;";
    else texture = "";
    var vertex_source = OMEGA.Omega3D.Shaders.Components.Basic_Includes();
    if(OMEGA.Omega3D.LIGHTS.length > 0 ) vertex_source = vertex_source + OMEGA.Omega3D.Shaders.Components.Basic_Light_Varying();
    vertex_source = vertex_source + texture;
    vertex_source = vertex_source + "void main(void){ gl_PointSize = uPointSize;";
    vertex_source = vertex_source + OMEGA.Omega3D.Shaders.Components.Vertex_World_Conversion_V3("gl_Position", "aVertexPos");
    if(isTextured                      ) vertex_source = vertex_source + OMEGA.Omega3D.Shaders.Components.Basic_TextureCoords("vTexCoord");
    if(OMEGA.Omega3D.LIGHTS.length > 0 ) vertex_source = vertex_source + OMEGA.Omega3D.Shaders.Components.Basic_Diffuse_Vertex_Logic();
    vertex_source = vertex_source + "}";


    if(isTextured){
        texture = "uniform sampler2D uSampler;"+
            "varying vec2 vTexCoord;";
        fragmentColor = "texture2D(uSampler, vec2(vTexCoord.s, vTexCoord.t));";
    }
    else{
        fragmentColor = "vec4(0.8, 0.4, 0.0, 1.0);";
    }
    var fragment_source = OMEGA.Omega3D.Shaders.Components.Fragment_Precision_Mediump_Float();
    if(OMEGA.Omega3D.LIGHTS.length > 0 ) fragment_source = fragment_source + OMEGA.Omega3D.Shaders.Components.Basic_Light_Includes() + OMEGA.Omega3D.Shaders.Components.Basic_Light_Varying();
    if( isTextured                     ) fragment_source = fragment_source + texture;
    fragment_source = fragment_source + "void main(void){";
    if(OMEGA.Omega3D.LIGHTS.length > 0 ) fragment_source = fragment_source + OMEGA.Omega3D.Shaders.Components.Basic_Phong_Fragment_Logic(fragmentColor);
    else                                 fragment_source = fragment_source + OMEGA.Omega3D.Shaders.Components.Basic_Fragment_Logic(fragmentColor);
    fragment_source = fragment_source + "}";


    var fragmentOnlyUniforms = {};
    if(isTextured) fragmentOnlyUniforms["uSampler"] = { id:"uSampler", type: "sampler2D", glsl: "", value: null };
    return new OMEGA.Omega3D.Shader(vertex_source,fragment_source,  [OMEGA.Omega3D.Shaders.Components.StandardAttributes(),
                                                                     OMEGA.Omega3D.Shaders.Components.StandardUniforms(),
                                                                     OMEGA.Omega3D.Shaders.Components.StandardLightUniforms(),
                                                                     fragmentOnlyUniforms]);
};


/**
 *  Cubemap Shader
 *
 * @returns {{vs_src: string, fs_src: string}}
 */
OMEGA.Omega3D.Shaders.CubeMap = function(){
    var vertex_source =
        OMEGA.Omega3D.Shaders.Components.Basic_Includes() +
        "varying vec3 vTexCoord;"+
        "void main(void){"+
            OMEGA.Omega3D.Shaders.Components.Vertex_World_Conversion_V3("gl_Position", "aVertexPos") +
            "vTexCoord = (vec4(aVertexPos, 0.0)).xyz;"+
        "}";


    var fragment_source =
        OMEGA.Omega3D.Shaders.Components.Fragment_Precision_Mediump_Float()+
        "uniform samplerCube uSampler;"+
        "varying vec3 vTexCoord;"+
        "void main(void){"+
             "gl_FragColor = textureCube(uSampler, vTexCoord);"+
        "}";

    var fragmentOnlyUniforms = {};
    fragmentOnlyUniforms["uSampler"] = { id:"uSampler", type: "sampler2D", glsl: "", value: null };
    return new OMEGA.Omega3D.Shader(vertex_source,fragment_source,  [OMEGA.Omega3D.Shaders.Components.StandardAttributes(),
                                                                     OMEGA.Omega3D.Shaders.Components.StandardUniforms(),
                                                                     {},
                                                                     fragmentOnlyUniforms]);
};

/**
 *  Post Processing Flat Shader.
 *
 * @returns {OMEGA.Omega3D.Shader}
 * @constructor
 */
OMEGA.Omega3D.Shaders.PostProcessing = function( ){
    var vertex_source =
        OMEGA.Omega3D.Shaders.Components.Basic_Includes_Post_Processing() +
        "varying float vTime;" +
        "varying vec2 vTexCoord;" +
        "void main(void){"+
        "vec4 pos = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPos.xyz, 1.0);" +
        "gl_Position = pos;" +
        "vTexCoord = aTextureCoord;" +
        "vTime = uTime;" +

        "}";


    var fragment_source =
        OMEGA.Omega3D.Shaders.Components.Fragment_Precision_Mediump_Float() +
        "uniform sampler2D uSampler;"+
        "varying float vTime;" +
        "varying vec2 vTexCoord;"+

        "float rand(vec2 co){" +
            "return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);" +
        "}"+
        "float rand1(float co){" +
            "return fract(sin(dot(co ,78.233)) * 43758.5453);" +
        "}"+

        "void main(void){"+
        "vec4 color = texture2D(uSampler, vec2(vTexCoord.s, vTexCoord.t));" +
        "float check = rand1(vTime);"+
        "if(check <= 0.005 ){ gl_FragColor = vec4(0.25, 0.25, 0.25, 1.0) + rand(vec2(vTime* 10.0, rand(vTexCoord))); }" +
        "else if(check > 0.005 && check <= 0.015){ gl_FragColor = color + rand(vec2(vTime* 10.0, rand(vTexCoord))); }" +
        "else if(check > 0.015 ){ gl_FragColor = color ; }" +
        "}";
    return new OMEGA.Omega3D.PostProcessingShader(vertex_source,fragment_source);
};

OMEGA.Omega3D.Shaders.Morph = function( ){
    var vertex_source =

        OMEGA.Omega3D.Shaders.Components.Basic_Includes_Post_Processing() +
        OMEGA.Omega3D.Shaders.Components.Noise3D();
        if(OMEGA.Omega3D.LIGHTS.length > 0 ) vertex_source = vertex_source + OMEGA.Omega3D.Shaders.Components.Basic_Light_Varying();
        vertex_source = vertex_source +
        "varying float noise;" +
        "float turbulence( vec3 p ) {" +
            "float t = -0.5;" +
            "for (float f = 1.0 ; f <= 10.0 ; f++){" +
                "float power = pow( 2.0, f );" +
                "t += abs( pnoise( vec3( power * p ), vec3( 10.0, 10.0, 10.0 ) ) / power );" +
            "}" +
            " return t;" +
        "}" +




        "varying float vTime;" +
        "varying vec2 vTexCoord;" +
        "varying vec3 vVertexNormal;" +
        "void main(void){"+
            "vec4 pos = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPos.xy, 0.0, 1.0);" +
            "noise = 10.0 *  -.10 * turbulence(.5*aVertexNormal + uTime * 0.025);"+ //
            "float b = 5.0 * pnoise(0.05 * aVertexPos, vec3(100.0) );" +
            "float displacement = - 1.5 * noise + b;" +
            "vec3 newPos = aVertexPos + aVertexNormal * displacement;" +
            "vVertexNormal = abs(aVertexNormal * displacement);"+

            "gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix *vec4(newPos, 1.0);" +
            "vTexCoord = aTextureCoord;" +
            "vTime = uTime;";
           if(OMEGA.Omega3D.LIGHTS.length > 0 ) vertex_source = vertex_source + OMEGA.Omega3D.Shaders.Components.Basic_Diffuse_Vertex_Logic();
        vertex_source = vertex_source + "}";


    var fragment_source =
        OMEGA.Omega3D.Shaders.Components.Fragment_Precision_Mediump_Float();
        if(OMEGA.Omega3D.LIGHTS.length > 0 ) fragment_source = fragment_source + OMEGA.Omega3D.Shaders.Components.Basic_Light_Includes() + OMEGA.Omega3D.Shaders.Components.Basic_Light_Varying();
        fragment_source = fragment_source +
        "uniform sampler2D uSampler;"+
        "varying float vTime;" +
        "varying vec2 vTexCoord;"+
        "varying float noise;" +
        "void main(void){" +
        "float n = noise;" +
        "if(noise < 0.05)n = 0.05;" +
        "if(noise > 0.4)n = 0.4;" +
        "float ypos = 1.0-1.3*n;" +
        "if(ypos < 0.0) ypos = 0.0;" +
        "vec2 tPos = vec2(0, ypos*1.7);";
            var fragmentColor = "texture2D(uSampler, tPos);";
             if(OMEGA.Omega3D.LIGHTS.length > 0 ) fragment_source = fragment_source + OMEGA.Omega3D.Shaders.Components.Basic_Phong_Fragment_Logic(fragmentColor);
             else                                 fragment_source = fragment_source + OMEGA.Omega3D.Shaders.Components.Basic_Fragment_Logic(fragmentColor);
        fragment_source = fragment_source + "}";
    return new OMEGA.Omega3D.PostProcessingShader(vertex_source,fragment_source);
};

OMEGA.Omega3D.Shaders.CubemapReflection = function( ) {
    var vertex_source =
        "attribute vec2 aTextureCoord;"+
        "attribute vec3 aVertexPos;"+
        "attribute vec3 aVertexNormal;"+


        "uniform float uPointSize;"+

        "uniform mat4 uModelMatrix;"+
        "uniform mat4 uProjectionMatrix;"+
        "uniform mat4 uViewMatrix;"+
        "uniform mat4 uInvViewMatrix;"+
        "uniform mat4 uNormalMatrix;"+

        "varying vec3 vTexCoord;" +
        "void main(void){"+
        "   vec4 vEyeNormal = uNormalMatrix * vec4(aVertexNormal, 0.0);"+
        "   vec4 vVert4 = uViewMatrix * uModelMatrix * vec4(aVertexPos, 1.0);"+
        "   vec3 vEyeVertex = normalize(vVert4.xyz/vVert4.w);"+
        "   vec4 vCoords = vec4(reflect(vEyeVertex.xyz, vEyeNormal.xyz), 1.0);"+
        "   vCoords = uInvViewMatrix * vCoords;"+
        "   vTexCoord.xyz = normalize(vCoords.xyz);"+
        "   gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix *vec4(aVertexPos, 1.0);" +
        "}";
    var fragment_source =
        OMEGA.Omega3D.Shaders.Components.Fragment_Precision_Mediump_Float() +
        "varying vec3 vTexCoord;" +
        "uniform samplerCube uSampler;"+
        "void main(void){"+
        "   gl_FragColor = textureCube(uSampler, vTexCoord);"+
        "}";
    var fragmentOnlyUniforms = {};
    fragmentOnlyUniforms["uSampler"] = { id:"uSampler", type: "sampler2D", glsl: "", value: null };
    return new OMEGA.Omega3D.Shader(vertex_source,fragment_source,  [OMEGA.Omega3D.Shaders.Components.StandardAttributes(),
                                                                     OMEGA.Omega3D.Shaders.Components.StandardUniforms(),
                                                                     {},
                                                                     fragmentOnlyUniforms]);
}


/**
 *  Post Processing Kernel Shader.
 *
 * @returns {OMEGA.Omega3D.Shader}
 * @constructor
 */
OMEGA.Omega3D.Shaders.PostProcessingKernel = function( kernel ){
    var vertex_source =
        OMEGA.Omega3D.Shaders.Components.Basic_Includes_Post_Processing() +
        "varying vec2 vTexCoord;" +
        "void main(void){"+
            "vec4 pos = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPos.xy, 0.0, 1.0);" +
            "gl_Position = pos;" +
             "vTexCoord = aTextureCoord;" +
        "}";


    var fragment_source =
        OMEGA.Omega3D.Shaders.Components.Fragment_Precision_Mediump_Float()+
        "uniform float uKernel[9];" +
        "uniform sampler2D uSampler;"+
        "varying vec2 vTexCoord;"+
        "void main(void){"+
        "vec4 color = texture2D(uSampler, vec2(vTexCoord.s, vTexCoord.t));" +
        "vec2 onePixel = vec2(1.0, 1.0) / vec2(512, 512);" +
        "vec4 colorSum =" +
        "texture2D(uSampler, vTexCoord + onePixel * vec2(-1, -1)) * uKernel[1] + " +
        "texture2D(uSampler, vTexCoord + onePixel * vec2( 0, -1)) * uKernel[1] + " +
        "texture2D(uSampler, vTexCoord + onePixel * vec2( 1, -1)) * uKernel[2] + " +
        "texture2D(uSampler, vTexCoord + onePixel * vec2(-1,  0)) * uKernel[3] + " +
        "texture2D(uSampler, vTexCoord + onePixel * vec2( 0,  0)) * uKernel[4] + " +
        "texture2D(uSampler, vTexCoord + onePixel * vec2( 1,  0)) * uKernel[5] + " +
        "texture2D(uSampler, vTexCoord + onePixel * vec2(-1,  1)) * uKernel[6] + " +
        "texture2D(uSampler, vTexCoord + onePixel * vec2( 0,  1)) * uKernel[7] + " +
        "texture2D(uSampler, vTexCoord + onePixel * vec2( 1,  1)) * uKernel[8];" ;



        var str = "float kernelWeight = uKernel[0] + uKernel[1] + uKernel[2] + uKernel[3] + uKernel[4] + uKernel[5] + uKernel[6] +uKernel[7] +uKernel[8];" +
                  "if(kernelWeight <= 0.0){"+
                    "kernelWeight = 1.0;"+
                  "}";
        fragment_source = fragment_source + str;


        fragment_source = fragment_source  +
        "gl_FragColor = vec4((colorSum / kernelWeight).rgb, 1);" +
        "}";
    return new OMEGA.Omega3D.PostProcessingKernelShader(vertex_source,fragment_source, kernel);
};
OMEGA.Omega3D.Shaders.PostProcessingKernel.Kernels = {
    normal: [
        0, 0, 0,
        0, 1, 0,
        0, 0, 0
    ],
    gaussianBlur: [
        0.045, 0.122, 0.045,
        0.122, 0.332, 0.122,
        0.045, 0.122, 0.045
    ],
    gaussianBlur2: [
        1, 2, 1,
        2, 4, 2,
        1, 2, 1
    ],
    gaussianBlur3: [
        0, 1, 0,
        1, 1, 1,
        0, 1, 0
    ],
    gaussianBlur4: [
        0, 16, 0,
        16, 0, 16,
        0, 16, 0
    ],
    unsharpen: [
        -1, -1, -1,
        -1,  9, -1,
        -1, -1, -1
    ],
    sharpness: [
        0,-1, 0,
        -1, 5,-1,
        0,-1, 0
    ],
    sharpen: [
        0, -1, 0,
        -1, 16, -1,
        0, -1, 0
    ],
    edgeDetect: [
        -0.125, -0.125, -0.125,
        -0.125,  1,     -0.125,
        -0.125, -0.125, -0.125
    ],
    edgeDetect2: [
        -1, -1, -1,
        -1,  8, -1,
        -1, -1, -1
    ],
    edgeDetect3: [
        -5, 0, 0,
        0, 0, 0,
        0, 0, 5
    ],
    edgeDetect4: [
        -1, -1, -1,
        0,  0,  0,
        1,  1,  1
    ],
    edgeDetect5: [
        -1, -1, -1,
        2,  2,  2,
        -1, -1, -1
    ],
    edgeDetect6: [
        -5, -5, -5,
        -5, 39, -5,
        -5, -5, -5
    ],
    sobelHorizontal: [
        1,  2,  1,
        0,  0,  0,
        -1, -2, -1
    ],
    sobelVertical: [
        1,  0, -1,
        2,  0, -2,
        1,  0, -1
    ],
    previtHorizontal: [
        1,  1,  1,
        0,  0,  0,
        -1, -1, -1
    ],
    previtVertical: [
        1,  0, -1,
        1,  0, -1,
        1,  0, -1
    ],
    boxBlur: [
        0.111, 0.111, 0.111,
        0.111, 0.111, 0.111,
        0.111, 0.111, 0.111
    ],
    robbieBlur: [
        0, 0, 0,
        0, 12, 0,
        0, 0, 0
    ],
    triangleBlur: [
        0.0625, 0.125, 0.0625,
        0.125,  0.25,  0.125,
        0.0625, 0.125, 0.0625
    ],
    emboss: [
        -2, -1,  0,
        -1,  1,  1,
         0,  1,  2
    ]
};

