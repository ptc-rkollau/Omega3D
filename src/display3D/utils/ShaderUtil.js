OMEGA.Omega3D.ShaderUtil = OMEGA.Omega3D.ShaderUtil || {};
OMEGA.Omega3D.ShaderUtil.InjectGLSLForLights = function(vs, fs, uniforms, scene ){
    var lights = scene.getLights();
    if(lights==null) return { vs: vs, fs:fs, uniforms:uniforms};
    var vs_lightSource = "";
    var fs_lightSource = "";



    if(lights.length == 0) return { vs: vs, fs:fs, uniforms:uniforms};
    for( var index in lights ){

        //get light vertex and fragment shader components.
        vs_lightSource += lights[index].vs;
        fs_lightSource += lights[index].fs;

        //add light uniforms to standard uniforms.
        for( var key in lights[index].uniforms ){
            uniforms[key] =  lights[index].uniforms[key];
        }
    }

    //first we inject uniforms and methods at start of page.
    var start = vs.indexOf("void main");
    start = start < 0 ? 0 : start;
    vs = vs.splice(start, 0, vs_lightSource );//vs_lightSource + vs;

    //second we modify the main function so that our light calculations are called.
    var header = vs.match(/(void main\(\)|void main\(void\))(\{|\s\{)?/g);
    var modHeader = header;
    modHeader = modHeader + "vTNormal  = uNormalMatrix * aVertexNormal;vViewMatrix = uViewMatrix;";



    var tick = true;
    for(var index in lights){
        if(lights[index].type == OMEGA.Omega3D.POINT_LIGHT ) {
            if(tick){
                modHeader = modHeader + "vMVVertexPos = uViewMatrix * uModelMatrix * vec4(aVertexPos.xyz, 1.0);";
                tick = false;
            }//modHeader = modHeader + "vLightWeight += light" + index + "(injctd_tNormal);";
        }else{// modHeader = modHeader + "vLightWeight += light" + index + "(injctd_tNormal);";
         }
    }
    vs = vs.replace(/(void main\(\)|void main\(void\))(\{|\s\{)?/g, modHeader);

    //third we inject the fragment source.
    fs = fs.splice(fs.indexOf("void main"),0, fs_lightSource);//fs_lightSource + fs;

    //adjust main for light methods.
    header = fs.match(/(void main\(\)|void main\(void\))(\{|\s\{)?/g);
    modHeader = header;
    modHeader = modHeader + "vec3 vLightWeight = vec3(0, 0, 0);";
    for(var index in lights) {
        modHeader = modHeader + "vLightWeight += light" + index + "();";
    }
    fs = fs.replace(/(void main\(\)|void main\(void\))(\{|\s\{)?/g, modHeader);


    //fourth modify the gl fragColor.sd
    //TODO: find smarter way to do this instead of forcing gl_FragColor = vec4(color.rgb, color.a); template.
    var footer = fs.match(/gl_FragColor.+;/g);
    var modFooter = "color = vec4( vLightWeight.rgb * color.rgb, color.a);"+
                    "gl_FragColor = color;";
    fs = fs.replace(/gl_FragColor.+;/g, modFooter );

    //OMEGA.Omega3D.Log(" >> ShaderUtil: Injected " + lights.length + " lights into Shader.");

    return { vs: vs, fs:fs, uniforms:uniforms};
};

OMEGA.Omega3D.ShaderUtil.InjectGLSLForFog = function(vs, fs, uniforms, scene ){

    var fog_uniforms = "uniform vec3 uFogColor;"+
                       "uniform vec2 uFogDist;";

    uniforms["uFogColor"] = { id:"uFogColor", type: "vec3", glsl: "uniform vec3 uFogColor;", value: [scene.getColor().r, scene.getColor().g, scene.getColor().b ] };
    uniforms["uFogDist" ] = { id:"uFogDist" , type: "vec2", glsl: "uniform vec3 uFogDist;" , value: [scene.getColor().r, scene.getColor().g, scene.getColor().b ] };

    var fog_varying ="varying vec3 vColor;"+
                      "varying float vDist;";

    //first we inject uniforms and methods at start of page.
    var start = vs.indexOf("void main");
    start = start < 0 ? 0 : start;
    vs = vs.splice(start, 0, fog_varying );//vs_lightSource + vs;

    //second we modify the main function so that our light calculations are called.
    var header = vs.match(/(void main\(\)|void main\(void\))(\{|\s\{)?/g);
    var modHeader = header;
    modHeader = modHeader + "vDist  = distance(uModelMatrix*vec4(aVertexPos, 1.0), vec4(0, -0.5, -1, 1.0));";
    vs = vs.replace(/(void main\(\)|void main\(void\))(\{|\s\{)?/g, modHeader);


    //third we inject the fragment source.
    fs = fs.splice(fs.indexOf("void main"),0, fog_uniforms + fog_varying);//fs_lightSource + fs;

    //adjust main for light methods.
    header = fs.match(/(void main\(\)|void main\(void\))(\{|\s\{)?/g);
    modHeader = header;
    modHeader = modHeader + "vec3 fogColor = vec3("+scene.getColor().r+","+scene.getColor().g+","+scene.getColor().b+");";
    modHeader = modHeader + "vec2 fogDist  = vec2("+scene.fogStart+","+scene.fogEnd+");";
    modHeader = modHeader + "float fogFactor = clamp((uFogDist.y - vDist)/(uFogDist.y - uFogDist.x), 0.0, 1.0);";
    fs = fs.replace(/(void main\(\)|void main\(void\))(\{|\s\{)?/g, modHeader);


    //fourth modify the gl fragColor.sd
    //TODO: find smarter way to do this instead of forcing gl_FragColor = vec4(color.rgb, color.a); template.
    var footer = fs.match(/gl_FragColor.+;/g);
    var modFooter = "color = vec4(mix(uFogColor, vec3(color), fogFactor), color.a);"+
                    "gl_FragColor = color;";
    fs = fs.replace(/gl_FragColor.+;/g, modFooter );

    return { vs: vs, fs:fs, uniforms:uniforms};
};


