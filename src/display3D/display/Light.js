OMEGA.Omega3D.Light = function(type, ambientColor,diffuseColor,specularColor){
    Object3D.apply(this, [null, null]);

    this.SetDirection = function(x,y,z){
       // x = x>1?1:x<-1?-1:x; y = y>1?1:y<-1?-1:y; z = z>1?1:z<-1?-1:z;
        this.direction[0] = x; this.direction[1] = y; this.direction[2] = z;
        this.invdirection[0] = -x; this.invdirection[1] = -y; this.invdirection[2] = -z;
        this.LookAt( x, y, z, this.position);
    };
    this.SetAmbient = function(r,g,b){
        this.ambientColor[0] = r; this.ambientColor[1] = g; this.ambientColor[2] = b;
    };

    this.SetDiffuse = function(r,g,b){
        this.diffuseColor[0] = r; this.diffuseColor[1] = g; this.diffuseColor[2] = b;
    };
    this.SetSpecular = function(r,g,b){
        this.specularColor[0] = r; this.specularColor[1] = g; this.specularColor[2] = b;
    };

    this.GetDirection = function(){ return this.direction; };
    this.GetSpecular = function(){ return this.specularColor; };
    this.GetDiffuse = function(){ return this.diffuseColor; };
    this.GetAmbient = function(){ return this.ambientColor; };

    this.GetInvDirection = function(){ return this.invdirection; };

    this.LookAt = function( x, y, z, position ){
        mat4.identity(laMatrix);
        mat4.lookAt(laMatrix,position || this.position,[x,y,z],  [0,1,0]);
    };
    this.GetMatrix    = function(){
        mat4.identity(this.modelView);
        mat4.multiply(this.modelView, this.rMatrix, this.tMatrix);
        mat4.multiply(this.modelView, this.modelView, this.sMatrix);
        mat4.multiply(this.modelView, this.modelView, laMatrix);
        return this.modelView;
    };
    this.GenerateGLSL = function(){
        if(this.type==0) this.glsl = this.genDirectional();
        else if(this.type == 1) this.glsl = this.genPoint();
        else if(this.type==2) this.glsl = this.genSpot();
    };
    this.genUniforms = function(){
        var uniforms = "";
            if( this.type != 0 ){
                uniforms += "uniform vec3 u" + this.id +"Position;\n";
                this.uniforms["u"+this.id +"Position"] = { type: "vec3", glsl: "uniform vec3 u" + this.id +"Position;", value: this.GetPosition };
            }else if( this.type == 0){
                uniforms += "uniform vec3 u" + this.id +"Direction;\n";
                this.uniforms["u"+this.id +"Direction"] = { type: "vec3", glsl: "uniform vec3 u" + this.id +"Direction;", value: this.GetDirection };
            }

            uniforms += "uniform vec3 u" + this.id +"Ambient;\n";
            uniforms += "uniform vec3 u" + this.id +"Diffuse;\n";



            this.uniforms["u"+this.id +"Ambient"]   = { type: "vec3", glsl: "uniform vec3 u" + this.id +"Ambient;", value: this.GetAmbient };
            this.uniforms["u"+this.id +"Diffuse"]   = { type: "vec3", glsl: "uniform vec3 u" + this.id +"Diffuse;", value: this.GetDiffuse };

        return uniforms;
    };
    this.genVarying = function(){
        var varying =[
              "varying vec3 vTNormal;",
              "varying vec4 vMVVertexPos;",
              "varying mat4 vViewMatrix;"
             // "varying vec3 vLightWeight;"
       ].join("\n");
        return varying;
    };
    this.genDirectional = function(){
        var uniforms = this.genUniforms();
        var varying = this.index == 0 ? this.genVarying() : "";

        //VERTEX SHADER:
        this.vs = [
            varying
        ].join("\n");


        //FRAGMENT SHADER:
        this.fs = [
            uniforms,
            varying,
            "vec3 " +this.id +"(){",
                "vec3 lightDir = normalize( u" + this.id +"Direction );",
                "float dirLightWeight = max(dot(vTNormal, lightDir), 0.0);",

                "vec3 reflectionVector  = normalize(reflect(lightDir, vTNormal));",
                "vec3 viewVectorEye     = normalize(vMVVertexPos.xyz);",
                "float rdotv            = max(dot(reflectionVector, viewVectorEye), 0.0);",
                "float specularLightWeighting = pow(rdotv, 25.0);",


                "vec3 lightFinalColor =  (uAmbient*u"+this.id+"Ambient) + ((uDiffuse*u"+this.id+"Diffuse) * dirLightWeight)+ (uSpecular * specularLightWeighting);",
                "return lightFinalColor;",
            "}"
        ].join("\n");
    };
    this.genPoint = function(){
        var uniforms = this.genUniforms();
        var varying = this.index == 0 ? this.genVarying() : "";

        //VERTEX SHADER:
        this.vs = [
            varying
        ].join("\n");


        //FRAGMENT SHADER:
        this.fs = [
            uniforms,
            varying,
            "vec3 " +this.id +"(){",
                "vec4 mvLight  = vViewMatrix *  vec4(u" +this.id +"Position, 1.0) ;",
                "vec3 lightDir = normalize( vec3(mvLight) - vec3(vMVVertexPos)   );",
                "float dirLightWeight   = max(dot(lightDir,vTNormal), 0.0);",

                "vec3 reflectionVector  = normalize(reflect(lightDir, vTNormal));",
                "vec3 viewVectorEye     = normalize(vec3(vMVVertexPos));",
                "float rdotv            = max(dot(reflectionVector, viewVectorEye), 0.0);",
                "float specularLightWeighting = pow(rdotv, 10.0);",


                "vec3 diffuse = uDiffuse * u"+this.id+"Diffuse *  dirLightWeight;",
                "vec3 ambient = uAmbient * u"+this.id+"Ambient;",

                "vec3 lightFinalColor = ambient + diffuse + (uSpecular * specularLightWeighting);",
                "return lightFinalColor;",
            "}"
        ].join("\n");
    };
    this.genSpot = function(){

    }


    this.uniforms = {};
    this.type = type || 0;
    this.vs = "";
    this.fs = "";
    this.index = OMEGA.Omega3D.LIGHTS.length;
    this.id = "light"+this.index.toString();
    this.direction     = [0.0, 0.0, 0.0];
    this.invdirection  = [0.0, 0.0, 0.0];
    var laMatrix = mat4.create();
    this.ambientColor  = ambientColor  || [0, 0, 0];
    this.diffuseColor  = diffuseColor  || [0.1, 0.1,0.1];
    this.specularColor = specularColor || [0, 0, 0];
    OMEGA.Omega3D.LIGHTS.push( this );
    this.GenerateGLSL();
};
OMEGA.Omega3D.DIRECTIONAL_LIGHT = 0;
OMEGA.Omega3D.POINT_LIGHT = 1;
OMEGA.Omega3D.SPOT_LIGHT = 2;


