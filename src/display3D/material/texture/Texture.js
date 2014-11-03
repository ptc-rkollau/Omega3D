function Texture( img, needsUpdate, ID ){
    if(!OMEGA.Omega3D.GL) return null;
    this.ID = ID || 0;
    this.gl_context = OMEGA.Omega3D.GL;
    this.img        = img;
    this.isCubeMap  =  true;
    this.needsUpdate= needsUpdate || false;
    this.tex        =  this.gl_context.createTexture();
    this.tex_id     = "uSampler";


    this.GetTexture = function(){ return this.tex; };
    this.GetImage   = function(){ return this.img; };
    this.handleTextureLoaded = function(image, texture ){ };

    this.Enable = function( shader ){ };
    this.Disable = function(){ };

    this.IsPowerOf2 = function( value ){
        return ( value & (value-1) == 0);
    };

    this.Update = function() {
        this.gl_context.bindTexture(this.gl_context.TEXTURE_2D, this.tex);
        this.gl_context.pixelStorei(this.gl_context.UNPACK_FLIP_Y_WEBGL, true);
        this.gl_context.texImage2D(this.gl_context.TEXTURE_2D, 0, this.gl_context.RGBA, this.gl_context.RGBA, this.gl_context.UNSIGNED_BYTE, this.img);
    };

    this.GenerateMipmap = function(){
        this.gl_context.bindTexture(this.gl_context.TEXTURE_2D, this.tex);
        this.gl_context.generateMipmap(this.gl_context.TEXTURE_2D);
        this.gl_context.bindTexture(this.gl_context.TEXTURE_2D, null);
    };
};
OMEGA.Omega3D.Texture = Texture;
OMEGA.Omega3D.Texture.TEXTURE0 = 33984;
