function ShaderMaterial( data ){
    var fragmentOnlyUniforms = {};

    var attribs = {};
    attribs.aTextureCoord = { type: "vec2",glsl: "attribute vec2 aTextureCoord;", value:null};
    attribs.aVertexPos    = { type: "vec3",glsl: "attribute vec3 aVertexPos;"   , value: null};
    attribs.aVertexNormal = { type: "vec3",glsl: "attribute vec3 aVertexNormal;", value:null};
    this.attribs = attribs;

    var uniforms = {};
    uniforms.uModelMatrix      = { type: "mat4", glsl: "uniform mat4 uModelMatrix;"     , value: null };
    uniforms.uProjectionMatrix = { type: "mat4", glsl: "uniform mat4 uProjectionMatrix;", value: null };
    uniforms.uViewMatrix       = { type: "mat4", glsl: "uniform mat4 uViewMatrix;"      , value: null };
    uniforms.uInvViewMatrix    = { type: "mat4", glsl: "uniform mat4 uInvViewMatrix;"   , value: null };
    uniforms.uNormalMatrix     = { type: "mat4", glsl: "uniform mat4 uNormalMatrix;"    , value: null };
    this.uniforms = uniforms;


    var custom_uniforms = {};
    this.custom_uniforms = custom_uniforms;

    this.Clear = function(){
        for( var key in  custom_uniforms){
            custom_uniforms[key] = {type:  custom_uniforms[key].type, glsl:  custom_uniforms[key].glsl    , value: null };
        }

    };

    this.SetValue = function( key, value ){
       var o =  uniforms[key] || attribs[key] || custom_uniforms[key];
       if(o) o.value = value;
    };
    this.GetValue = function( key ){
        var o =  uniforms[key] || attribs[key] || custom_uniforms[key] || {value:null};
        return o.value;
    };



    this.processData = function( data ){
        var texCount = 0;
        for( var key in data.uniforms){
            var glsl = "";
            glsl = "uniform " + data.uniforms[key].type + " " + key + ";";
            if( data.uniforms[key].type != "sampler2D" &&
                data.uniforms[key].type != "samplerCube" ) {
                custom_uniforms[key] = { type: data.uniforms[key].type, glsl: glsl, value: data.uniforms[key].value };
            }else{
                fragmentOnlyUniforms[key] = { id:key, type: data.uniforms[key].type, glsl: glsl, value: null };
                data.uniforms[key].value.tex_id = key;
                data.uniforms[key].value.ID = texCount++;
                this.textures.push( data.uniforms[key].value );
            }
        };
    };

    var createShader = function(){
        var vertex_shader_src = attachData(attribs );
        vertex_shader_src += attachData(uniforms );
        vertex_shader_src += data.vertex_src;

        var fragment_shader_src = "precision mediump float;";
        fragment_shader_src += data.fragment_src;
        return new OMEGA.Omega3D.Shader( vertex_shader_src, fragment_shader_src, [attribs, uniforms, custom_uniforms, fragmentOnlyUniforms]);
    };
    var attachData = function(  a){
        var out = "";
        for( var key in a) out += "\n"+ a[key].glsl;
        return out;
    };

    Material.apply(this,[null, []]);
    this.processData(data);
    this.shader = createShader();
};
ShaderMaterial.prototype = new Material();
OMEGA.Omega3D.ShaderMaterial = ShaderMaterial;
