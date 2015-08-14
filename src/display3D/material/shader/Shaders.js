OMEGA.Omega3D.Shaders = OMEGA.Omega3D.Shaders || {};


/**
 *  Basic - Default shader
 *
 * @param isTextured
 * @returns {OMEGA.Omega3D.Shader}
 */
OMEGA.Omega3D.Shaders.Basic = function( isTextured, scene, color ){
    //OMEGA.Omega3D.Log(" >> ShaderBuilder: Creating 'Basic' shader");
    //OMEGA.Omega3D.Log("   -- Textured: " + isTextured);
    //OMEGA.Omega3D.Log("   -- Color: " + color);
    var texture, fragmentColor;
    isTextured = isTextured || false;
    if(isTextured) texture = "varying vec2 vTexCoord;";
    else texture = "";
    var vertex_source = OMEGA.Omega3D.Shaders.Components.Basic_Includes();
        vertex_source = vertex_source + texture;
        vertex_source = vertex_source + "void main(void){";
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
    fragment_source = fragment_source + OMEGA.Omega3D.Shaders.Components.Basic_Fragment_Includes();
        if( isTextured                     ){
            fragment_source = fragment_source + texture;
        }
        fragment_source = fragment_source + "void main(void){";
        fragment_source = fragment_source + "vec4 color = " + fragmentColor;
        fragment_source = fragment_source + OMEGA.Omega3D.Shaders.Components.Basic_Fragment_Logic("vec4(color.rgb, color.a)");
        fragment_source = fragment_source + "}";



    //lights
    var uniforms = OMEGA.Omega3D.Shaders.Components.StandardUniforms();
    if(scene != null){
        var injected = OMEGA.Omega3D.ShaderUtil.InjectGLSLForLights(vertex_source, fragment_source, uniforms, scene);
        uniforms = injected.uniforms;
        vertex_source =injected.vs;
        fragment_source =injected.fs;

        //fog
        if(scene.hasFog){
            injected = OMEGA.Omega3D.ShaderUtil.InjectGLSLForFog(vertex_source, fragment_source, uniforms,scene);
            uniforms = injected.uniforms;
            vertex_source =injected.vs;
            fragment_source =injected.fs;
        }
    }



    var fragmentOnlyUniforms = {};
    if(isTextured) fragmentOnlyUniforms["uSampler"] = { id:"uSampler", type: "sampler2D", glsl: "", value: null };
    return new OMEGA.Omega3D.Shader(vertex_source,fragment_source,  [OMEGA.Omega3D.Shaders.Components.StandardAttributes(),
                                                                     uniforms,
                                                                     {},
                                                                     fragmentOnlyUniforms]);
};

/**
 * SEM - Spherical Environment Mapping
 *
 * @param scene
 * @returns {OMEGA.Omega3D.Shader}
 * @constructor
 */
OMEGA.Omega3D.Shaders.SEM = function( scene ){
   // OMEGA.Omega3D.Log(" >> ShaderBuilder: Creating 'Spherical Environment Mapping' shader");

    var vertex_source = OMEGA.Omega3D.Shaders.Components.Basic_Includes();
    vertex_source += "varying vec3 e;";
    vertex_source += "varying vec3 n;";
    vertex_source += "void main(void){";
    vertex_source += "e = normalize( vec3( uViewMatrix * uModelMatrix * vec4(aVertexPos.xyz, 1.0) ) );";
    vertex_source += "n = normalize( uNormalMatrix * aVertexNormal );";
    vertex_source += OMEGA.Omega3D.Shaders.Components.Vertex_World_Conversion_V3("gl_Position", "aVertexPos");
    vertex_source += "}";





    var fragment_source = OMEGA.Omega3D.Shaders.Components.Fragment_Precision_Mediump_Float();
    fragment_source = fragment_source + OMEGA.Omega3D.Shaders.Components.Basic_Fragment_Includes();
    fragment_source += "uniform sampler2D uSampler;";
    fragment_source += "varying vec3 e;";
    fragment_source += "varying vec3 n;";
    fragment_source += "void main(void){";
    fragment_source += "vec3 r = reflect( e, n );";
    fragment_source += "float m = 2.0 * sqrt( pow( r.x, 2.0) + pow( r.y, 2.0) + pow( r.z + 1.0, 2.0) );";
    fragment_source += "vec2 vN = r.xy / m + 0.5;";
    fragment_source += "vec4 color = texture2D(uSampler, vN);";
    fragment_source += OMEGA.Omega3D.Shaders.Components.Basic_Fragment_Logic("vec4(color.rgb, color.a)");
    fragment_source += "}";


    var uniforms = OMEGA.Omega3D.Shaders.Components.StandardUniforms();
    var injected = OMEGA.Omega3D.ShaderUtil.InjectGLSLForLights(vertex_source, fragment_source, uniforms, scene);
    uniforms = injected.uniforms;
    vertex_source =injected.vs;
    fragment_source =injected.fs;

    var fragmentOnlyUniforms = {};
    fragmentOnlyUniforms["uSampler"] = { id:"uSampler", type: "sampler2D", glsl: "", value: null };
    return new OMEGA.Omega3D.Shader(vertex_source,fragment_source,  [OMEGA.Omega3D.Shaders.Components.StandardAttributes(),
        uniforms,
        {},
        fragmentOnlyUniforms]);
};



/**
 * SM - Shadow Mapping
 *
 * @param scene
 * @returns {OMEGA.Omega3D.Shader}
 * @constructor
 */
OMEGA.Omega3D.Shaders.SM = function( scene  ){
   // OMEGA.Omega3D.Log(" >> ShaderBuilder: Creating 'Shadow Mapping' shader");

    var vertex_source = OMEGA.Omega3D.Shaders.Components.Basic_Includes();
    vertex_source += "uniform mat4 uLightM;";
    vertex_source += "varying vec2 vTexCoord;";
    vertex_source += "varying vec4 vertexPosLight;";

    vertex_source += "void main(void){";
    vertex_source += "mat4 mvp       = uProjectionMatrix * uViewMatrix * uModelMatrix;";
    vertex_source += "mat4 mvp_light = uProjectionMatrix * uLightM * uModelMatrix;";
    vertex_source += "vec4 pos       = mvp * vec4(aVertexPos.xyz, 1.0);";
    vertex_source += "vertexPosLight = mvp_light * vec4(aVertexPos.xyz, 1.0);";
    vertex_source += "gl_Position    = pos;";
    vertex_source += "vTexCoord      = aTextureCoord;";
    vertex_source += "}";


    var fragment_source = OMEGA.Omega3D.Shaders.Components.Fragment_Precision_Mediump_Float();
    fragment_source = fragment_source + OMEGA.Omega3D.Shaders.Components.Basic_Fragment_Includes();
    fragment_source += "uniform sampler2D uSampler;";
    fragment_source += "uniform sampler2D uShadowMap;";
    fragment_source += "varying vec2 vTexCoord;";
    fragment_source += "varying vec4 vertexPosLight;";

    fragment_source += "void main(void){";
    fragment_source += "vec3 nLightPos   = (vertexPosLight.xyz / vertexPosLight.w) / 2.0 + 0.5;";
    fragment_source += "vec4 depth       = texture2D(uShadowMap, vec2(nLightPos.xy));";
    fragment_source += "vec4 texture     = texture2D(uSampler, vec2(vTexCoord.st));";
    fragment_source += "float visibility = (nLightPos.z > (depth.r + 0.0001)) ? 0.7 : 1.0;";
    fragment_source += "vec4 color       = vec4( texture.rgb*visibility, 1.0);";
    fragment_source += OMEGA.Omega3D.Shaders.Components.Basic_Fragment_Logic("vec4(color.rgb, color.a)");
    fragment_source += "}";


    var uniforms = OMEGA.Omega3D.Shaders.Components.StandardUniforms();
    var injected = OMEGA.Omega3D.ShaderUtil.InjectGLSLForLights(vertex_source, fragment_source, uniforms, scene);
    uniforms = injected.uniforms;
    vertex_source =injected.vs;
    fragment_source =injected.fs;

    var fragmentOnlyUniforms = {};
    fragmentOnlyUniforms["uSampler"]   = { id:"uSampler"  , type: "sampler2D", glsl: "", value: null };
    fragmentOnlyUniforms["uShadowMap"] = { id:"uShadowMap", type: "sampler2D", glsl: "", value: null };

    var custom_uniforms = {};
    custom_uniforms["uLightM"] = { type:"mat4", glsl: "", value: "" };
    return new OMEGA.Omega3D.Shader(vertex_source,fragment_source,  [OMEGA.Omega3D.Shaders.Components.StandardAttributes(),
                                                                    uniforms,
                                                                    custom_uniforms,
                                                                    fragmentOnlyUniforms]);
};

OMEGA.Omega3D.Shaders.ColorPicking = function(){
   // OMEGA.Omega3D.Log(" >> ShaderBuilder: Creating 'ColorPicking' shader");

    var vertex_source = OMEGA.Omega3D.Shaders.Components.Basic_Includes();
    vertex_source = vertex_source + "varying vec3 vPickingColor;";
    vertex_source = vertex_source + "void main(void){";
    vertex_source = vertex_source + "vPickingColor = aPickingColor;";
    vertex_source = vertex_source + OMEGA.Omega3D.Shaders.Components.Vertex_World_Conversion_V3("gl_Position", "aVertexPos");
    vertex_source = vertex_source + "}";

    var fragment_source = OMEGA.Omega3D.Shaders.Components.Fragment_Precision_Mediump_Float();
    fragment_source = fragment_source + "varying vec3 vPickingColor;";
    fragment_source = fragment_source + "void main(void){";
    fragment_source = fragment_source + "vec4 color = vec4(vPickingColor.r,0, 0, 1.0);";
    fragment_source = fragment_source + OMEGA.Omega3D.Shaders.Components.Basic_Fragment_Logic("vec4(color.rgb, color.a)");
    fragment_source = fragment_source + "}";

    var uniforms = OMEGA.Omega3D.Shaders.Components.StandardUniforms();
    var fragmentOnlyUniforms = {};

    return new OMEGA.Omega3D.Shader(vertex_source,fragment_source,  [OMEGA.Omega3D.Shaders.Components.StandardAttributes(),
        uniforms,
        {},
        fragmentOnlyUniforms]);
};













//===================================================================================
// PostProcessing
//===================================================================================

OMEGA.Omega3D.Shaders.PostProcessing = function( isTextured, scene, color ){
    //OMEGA.Omega3D.Log(" >> ShaderBuilder: Creating 'Basic PostProcessing' shader");
    //OMEGA.Omega3D.Log("   -- Textured: " + isTextured);
    //OMEGA.Omega3D.Log("   -- Color: " + color);
    var texture, fragmentColor;
    isTextured = isTextured || false;
    if(isTextured) texture = "varying vec2 vTexCoord;";
    else texture = "";
    var vertex_source = OMEGA.Omega3D.Shaders.Components.Basic_Includes();
    vertex_source = vertex_source + texture;
    vertex_source = vertex_source + "void main(void){";
    vertex_source = vertex_source + OMEGA.Omega3D.Shaders.Components.Vertex_ScreenSpace_Conversion_V3("gl_Position", "aVertexPos");
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
    if( isTextured                     ){
        fragment_source = fragment_source + OMEGA.Omega3D.Shaders.Components.Basic_Fragment_Includes();
        fragment_source = fragment_source + texture;
    }
    fragment_source = fragment_source + "void main(void){";
    fragment_source = fragment_source + "vec4 color = "+fragmentColor;
    fragment_source = fragment_source + OMEGA.Omega3D.Shaders.Components.Basic_Fragment_Logic("vec4(color.rgb, color.a)");
    fragment_source = fragment_source + "}";


    var uniforms = OMEGA.Omega3D.Shaders.Components.StandardUniforms();

    var fragmentOnlyUniforms = {};
    if(isTextured) fragmentOnlyUniforms["uSampler"] = { id:"uSampler", type: "sampler2D", glsl: "", value: null };
    return new OMEGA.Omega3D.Shader(vertex_source,fragment_source,  [OMEGA.Omega3D.Shaders.Components.StandardAttributes(),
        uniforms,
        {},
        fragmentOnlyUniforms]);
};


OMEGA.Omega3D.Shaders.PP_ColorMultiply = function(val){
    //OMEGA.Omega3D.Log(" >> ShaderBuilder: Creating 'Basic PostProcessing' shader");
    var texture, fragmentColor;

    texture = "varying vec2 vTexCoord;";
    var vertex_source = OMEGA.Omega3D.Shaders.Components.Basic_Includes();
    vertex_source = vertex_source + texture;
    vertex_source = vertex_source + "void main(void){";
    vertex_source = vertex_source + OMEGA.Omega3D.Shaders.Components.Vertex_ScreenSpace_Conversion_V3("gl_Position", "aVertexPos");
    vertex_source = vertex_source + OMEGA.Omega3D.Shaders.Components.Basic_TextureCoords("vTexCoord");
    vertex_source = vertex_source + "}";



   texture = "uniform sampler2D uSampler;"+
             "varying vec2 vTexCoord;";


    var fragment_source = OMEGA.Omega3D.Shaders.Components.Fragment_Precision_Mediump_Float();
    fragment_source = fragment_source + OMEGA.Omega3D.Shaders.Components.Basic_Fragment_Includes();
    fragment_source = fragment_source + texture;
    fragment_source = fragment_source + "void main(void){";
    fragment_source = fragment_source + "vec4 color = texture2D(uSampler, vec2(vTexCoord.s, vTexCoord.t));";
    fragment_source = fragment_source + OMEGA.Omega3D.Shaders.Components.Basic_Fragment_Logic("vec4(color.rgb*"+val+", color.a)");
    fragment_source = fragment_source + "}";


    var uniforms = OMEGA.Omega3D.Shaders.Components.StandardUniforms();

    var fragmentOnlyUniforms = {};
    fragmentOnlyUniforms["uSampler"] = { id:"uSampler", type: "sampler2D", glsl: "", value: null };
    return new OMEGA.Omega3D.Shader(vertex_source,fragment_source,  [OMEGA.Omega3D.Shaders.Components.StandardAttributes(),
        uniforms,
        {},
        fragmentOnlyUniforms]);
};
OMEGA.Omega3D.Shaders.PP_Blur = function(amount){
   // OMEGA.Omega3D.Log(" >> ShaderBuilder: Creating 'Basic PostProcessing' shader");
    var texture, fragmentColor;

    texture = "varying vec2 vTexCoord;";
    var vertex_source = OMEGA.Omega3D.Shaders.Components.Basic_Includes();
    vertex_source = vertex_source + texture;
    vertex_source = vertex_source + "void main(void){";
    vertex_source = vertex_source + OMEGA.Omega3D.Shaders.Components.Vertex_ScreenSpace_Conversion_V3("gl_Position", "aVertexPos");
    vertex_source = vertex_source + OMEGA.Omega3D.Shaders.Components.Basic_TextureCoords("vTexCoord");
    vertex_source = vertex_source + "}";



    texture = "uniform sampler2D uSampler;"+
    "varying vec2 vTexCoord;";


    var fragment_source = OMEGA.Omega3D.Shaders.Components.Fragment_Precision_Mediump_Float();
    fragment_source = fragment_source + OMEGA.Omega3D.Shaders.Components.Basic_Fragment_Includes();
    fragment_source = fragment_source + texture;
    fragment_source = fragment_source + "void main(void){";
    fragment_source = fragment_source + "vec4 sum = vec4(0.0);";
    fragment_source = fragment_source + "vec2 tc = vTexCoord;";
    fragment_source = fragment_source + "float radius ="+amount+";";
    fragment_source = fragment_source + "float resolution = 1024.0;";
    fragment_source = fragment_source + "float blur = radius / resolution;";
    fragment_source = fragment_source + "float hstep = 0.5;";
    fragment_source = fragment_source + "float vstep = 0.5;";

    fragment_source = fragment_source + "sum += texture2D(uSampler, vec2(tc.x - 4.0*blur*hstep, tc.y - 4.0*blur*vstep)) * 0.0162162162;";
    fragment_source = fragment_source + "sum += texture2D(uSampler, vec2(tc.x - 3.0*blur*hstep, tc.y - 3.0*blur*vstep)) * 0.0540540541;";
    fragment_source = fragment_source + "sum += texture2D(uSampler, vec2(tc.x - 2.0*blur*hstep, tc.y - 2.0*blur*vstep)) * 0.1216216216;";
    fragment_source = fragment_source + "sum += texture2D(uSampler, vec2(tc.x - 1.0*blur*hstep, tc.y - 1.0*blur*vstep)) * 0.1945945946;";

    fragment_source = fragment_source + "sum += texture2D(uSampler, vec2(tc.x, tc.y)) * 0.2270270270;";

    fragment_source = fragment_source + "sum += texture2D(uSampler, vec2(tc.x + 1.0*blur*hstep, tc.y + 1.0*blur*vstep)) * 0.1945945946;";
    fragment_source = fragment_source + "sum += texture2D(uSampler, vec2(tc.x + 2.0*blur*hstep, tc.y + 2.0*blur*vstep)) * 0.1216216216;";
    fragment_source = fragment_source + "sum += texture2D(uSampler, vec2(tc.x + 3.0*blur*hstep, tc.y + 3.0*blur*vstep)) * 0.0540540541;";
    fragment_source = fragment_source + "sum += texture2D(uSampler, vec2(tc.x + 4.0*blur*hstep, tc.y + 4.0*blur*vstep)) * 0.0162162162;";







    fragment_source = fragment_source + "vec4 color = texture2D(uSampler, vec2(vTexCoord.s, vTexCoord.t));";
    fragment_source = fragment_source + OMEGA.Omega3D.Shaders.Components.Basic_Fragment_Logic("vec4(color.rgb * sum.rgb, color.a)");
    fragment_source = fragment_source + "}";


    var uniforms = OMEGA.Omega3D.Shaders.Components.StandardUniforms();

    var fragmentOnlyUniforms = {};
    fragmentOnlyUniforms["uSampler"] = { id:"uSampler", type: "sampler2D", glsl: "", value: null };
    return new OMEGA.Omega3D.Shader(vertex_source,fragment_source,  [OMEGA.Omega3D.Shaders.Components.StandardAttributes(),
        uniforms,
        {},
        fragmentOnlyUniforms]);
};
OMEGA.Omega3D.Shaders.PP_Bloom = function(amount){
    //OMEGA.Omega3D.Log(" >> ShaderBuilder: Creating 'Basic PostProcessing' shader");
    var texture, fragmentColor;

    texture = "varying vec2 vTexCoord;";
    var vertex_source = OMEGA.Omega3D.Shaders.Components.Basic_Includes();
    vertex_source = vertex_source + texture;
    vertex_source = vertex_source + "void main(void){";
    vertex_source = vertex_source + OMEGA.Omega3D.Shaders.Components.Vertex_ScreenSpace_Conversion_V3("gl_Position", "aVertexPos");
    vertex_source = vertex_source + OMEGA.Omega3D.Shaders.Components.Basic_TextureCoords("vTexCoord");
    vertex_source = vertex_source + "}";



    texture = "uniform sampler2D uSampler;"+
    "varying vec2 vTexCoord;";


    amount = amount == null ? "3" : amount;
    var fragment_source = OMEGA.Omega3D.Shaders.Components.Fragment_Precision_Mediump_Float();
    fragment_source = fragment_source + OMEGA.Omega3D.Shaders.Components.Basic_Fragment_Includes();
    fragment_source = fragment_source + texture;
    fragment_source = fragment_source + "void main(void){";
    fragment_source = fragment_source + "vec4 sum = vec4(0.0);";
    fragment_source = fragment_source + "vec2 tc = vTexCoord;";
    fragment_source = fragment_source + "int amount = 5;";
    fragment_source = fragment_source + "for( int i= -"+amount+" ;i < "+amount+"; i++){";
        fragment_source = fragment_source + "for ( int j = -"+amount+"; j < "+amount+"; j++){";
            fragment_source = fragment_source + "sum += texture2D(uSampler, tc + vec2(j, i)*0.004) * 0.25;";
        fragment_source = fragment_source + "}";
    fragment_source = fragment_source + "}";
    fragment_source = fragment_source + "if (texture2D(uSampler, tc).r < 0.3){";
    fragment_source = fragment_source + "gl_FragColor = sum*sum*0.012 + texture2D(uSampler, tc);";
    fragment_source = fragment_source + "}else{";

    fragment_source = fragment_source + "if (texture2D(uSampler, tc).r < 0.5){";

    fragment_source = fragment_source + "gl_FragColor = sum*sum*0.009 + texture2D(uSampler, tc);";
    fragment_source = fragment_source + "}else{";
    fragment_source = fragment_source + "gl_FragColor = sum*sum*0.0075 + texture2D(uSampler, tc);";
    fragment_source = fragment_source + "}}}";



    var uniforms = OMEGA.Omega3D.Shaders.Components.StandardUniforms();

    var fragmentOnlyUniforms = {};
    fragmentOnlyUniforms["uSampler"] = { id:"uSampler", type: "sampler2D", glsl: "", value: null };
    return new OMEGA.Omega3D.Shader(vertex_source,fragment_source,  [OMEGA.Omega3D.Shaders.Components.StandardAttributes(),
        uniforms,
        {},
        fragmentOnlyUniforms]);
};
















//Deprecated
//TODO: static lights
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
    if( isTextured                     ){
        fragment_source = fragment_source + OMEGA.Omega3D.Shaders.Components.Basic_Fragment_Includes();
        fragment_source = fragment_source + texture;
    }
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
//Deprecated
//TODO: static lights

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
    if( isTextured                     ){
        fragment_source = fragment_source + OMEGA.Omega3D.Shaders.Components.Basic_Fragment_Includes();
        fragment_source = fragment_source + texture;
    }
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
OMEGA.Omega3D.Shaders.CubeMap = function(scene){
    var vertex_source =
        OMEGA.Omega3D.Shaders.Components.Basic_Includes() +
        "varying vec3 vTexCoord;"+
        "void main(void){"+
            OMEGA.Omega3D.Shaders.Components.Vertex_View_Conversion_V3("gl_Position", "aVertexPos") +
            "vTexCoord = (vec4(aVertexPos, 0.0)).xyz;"+
        "}";


    var fragment_source =
        OMEGA.Omega3D.Shaders.Components.Fragment_Precision_Mediump_Float()+
        OMEGA.Omega3D.Shaders.Components.Basic_Fragment_Includes() +
        "uniform samplerCube uSampler;"+
        "varying vec3 vTexCoord;"+
        "void main(void){"+
             "gl_FragColor = textureCube(uSampler, vTexCoord);"+
        "}";


    var uniforms = OMEGA.Omega3D.Shaders.Components.StandardUniforms();
    //var injected = OMEGA.Omega3D.ShaderUtil.InjectGLSLForLights(vertex_source, fragment_source, uniforms, scene);
    //uniforms = injected.uniforms;
    //vertex_source =injected.vs;
    //fragment_source =injected.fs;


    var fragmentOnlyUniforms = {};
    fragmentOnlyUniforms["uSampler"] = { id:"uSampler", type: "sampler2D", glsl: "", value: null };
    return new OMEGA.Omega3D.Shader(vertex_source,fragment_source,  [OMEGA.Omega3D.Shaders.Components.StandardAttributes(),
                                                                     uniforms,
                                                                     {},
                                                                     fragmentOnlyUniforms]);
};

/**
 *  Post Processing Flat Shader.
 *
 * @returns {OMEGA.Omega3D.Shader}
 * @constructor
 */
/*OMEGA.Omega3D.Shaders.PostProcessing = function( ){
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
        "gl_FragColor = color;" +
//        "float check = rand1(vTime);"+
//        "if(check <= 0.005 ){ gl_FragColor = vec4(0.25, 0.25, 0.25, 1.0) + rand(vec2(vTime* 10.0, rand(vTexCoord))); }" +
//        "else if(check > 0.005 && check <= 0.015){ gl_FragColor = color + rand(vec2(vTime* 10.0, rand(vTexCoord))); }" +
//        "else if(check > 0.015 ){ gl_FragColor = color ; }" +
        "}";
    var fragmentOnlyUniforms = {};
    fragmentOnlyUniforms["uSampler"] = { id:"uSampler", type: "sampler2D", glsl: "", value: null };
    return new OMEGA.Omega3D.Shader(vertex_source,fragment_source,  [OMEGA.Omega3D.Shaders.Components.StandardAttributes(),
        OMEGA.Omega3D.Shaders.Components.StandardUniforms(),
        {},
        fragmentOnlyUniforms]);
};*/

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
        OMEGA.Omega3D.Shaders.Components.Fragment_Precision_Mediump_Float() +
        OMEGA.Omega3D.Shaders.Components.Basic_Fragment_Includes();
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
    var fragmentOnlyUniforms = {};
    fragmentOnlyUniforms["uSampler"] = { id:"uSampler", type: "sampler2D", glsl: "", value: null };
    return new OMEGA.Omega3D.Shader(vertex_source,fragment_source,  [OMEGA.Omega3D.Shaders.Components.StandardAttributes(),
        OMEGA.Omega3D.Shaders.Components.StandardUniforms(),
        {},
        fragmentOnlyUniforms]);
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
        "uniform mat3 uNormalMatrix;"+

        "varying vec3 vTexCoord;" +
        "void main(void){"+
        "   vec3 vEyeNormal = uNormalMatrix * aVertexNormal;"+
        "   vec4 vVert4 = uViewMatrix * uModelMatrix * vec4(aVertexPos, 1.0);"+
        "   vec3 vEyeVertex = normalize(vVert4.xyz/vVert4.w);"+
        "   vec4 vCoords = vec4(reflect(vEyeVertex.xyz, vEyeNormal.xyz), 1.0);"+
        "   vCoords = uInvViewMatrix * vCoords;"+
        "   vTexCoord.xyz = normalize(vCoords.xyz);"+
        "   gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix *vec4(aVertexPos, 1.0);" +
        "}";
    var fragment_source =
        OMEGA.Omega3D.Shaders.Components.Fragment_Precision_Mediump_Float() +
        OMEGA.Omega3D.Shaders.Components.Basic_Fragment_Includes() +
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
        OMEGA.Omega3D.Shaders.Components.Basic_Fragment_Includes() +
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

