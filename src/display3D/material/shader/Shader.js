function Shader(vsrc, fsrc, vars ){
    this.vars = vars;
    this.vertex_shader_src   = vsrc;
    this.fragment_shader_src = fsrc;

    this.program = null;
    this.GetVertexShaderSource = function(){
        return this.vertex_shader_src;
    };
    this.GetFragmentShaderSource = function(){
        return this.fragment_shader_src;
    };
    this.GetVertexShader = function(){
        return this.vertex_shader;
    };
    this.GetFragmentShader = function(){
        return this.fragment_shader;
    };
    this.GetProgram = function(){
        return this.program;
    };
    this.Enable = function(){
        if(!this.program) return;
        this.gl_context.useProgram( this.program );
    };
    this.Disable = function(){
        if(!this.program)return;
        this.gl_context.useProgram(null);
    };

    this.createProgram = function ( ){
        if(this.vertex_shader==null||this.fragment_shader==null)return;
        this.program = this.gl_context.createProgram();
        this.gl_context.attachShader(this.program, this.vertex_shader);
        this.gl_context.attachShader(this.program, this.fragment_shader);
        this.gl_context.linkProgram(this.program);

        if(!this.gl_context.getProgramParameter( this.program, this.gl_context.LINK_STATUS) ){
            console.log("Could not initialize shaders / program");
            return null;
        }

        //TODO:
        //FIX VARS IF NOT FROM SHADERMATERIAL.
        if(vars){
            for( var key in vars ){
                for(var k in vars[key]){
                    if(key == 0 ) this.program[k] = this.gl_context.getAttribLocation( this.program, k.toString());
                    else  this.program[k] = this.gl_context.getUniformLocation( this.program, k.toString());

                }
            }
        }
        return this.program;
    };
    this.createShaderElement = function( type, src ) {
        if(!src)return null;
        var shader_element = this.gl_context.createShader( type );
        this.gl_context.shaderSource( shader_element, src );
        this.gl_context.compileShader( shader_element );

        if(!this.gl_context.getShaderParameter( shader_element, this.gl_context.COMPILE_STATUS )) {
            console.log( (type == this.gl_context.VERTEX_SHADER ? "Vertex shader: " : "Fragment shader: ") + this.gl_context.getShaderInfoLog( shader_element ));
            return null;
        }else{
            console.log((type == this.gl_context.VERTEX_SHADER ? "Vertex shader: " : "Fragment shader: ") + "succesfully compiled!");
        }

        return shader_element;
    };
    this.GetSamplerLocation = function(){
        for( var key in vars ){
            for(var k in vars[key]){
                if(vars[key][k].type == "sampler2D" || vars[key][k].type == "samplerCube" ) return this.program[k];
            }
        }
        return -1;
    };



    this.gl_context          = OMEGA.Omega3D.GL;
    this.vertex_shader       = this.gl_context ? this.createShaderElement( this.gl_context.VERTEX_SHADER, this.vertex_shader_src ) : null;
    this.fragment_shader     = this.gl_context ? this.createShaderElement( this.gl_context.FRAGMENT_SHADER, this.fragment_shader_src  ) : null;
    this.program             = this.gl_context ? this.createProgram() : null;
};
OMEGA.Omega3D.Shader = Shader;