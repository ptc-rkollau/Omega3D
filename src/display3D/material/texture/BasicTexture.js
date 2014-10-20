function BasicTexture( img, needsUpdate, ID ){
    Texture.apply( this, arguments );
    this.handleTextureLoaded = function(image, texture ){
        if(!this.needsUpdate) {
            this.gl_context.bindTexture(this.gl_context.TEXTURE_2D, texture);
           // this.gl_context.pixelStorei(this.gl_context.UNPACK_FLIP_Y_WEBGL, true);
            if(image)this.gl_context.texImage2D(this.gl_context.TEXTURE_2D, 0, this.gl_context.RGBA, this.gl_context.RGBA, this.gl_context.UNSIGNED_BYTE, image);
            this.gl_context.texParameteri(this.gl_context.TEXTURE_2D, this.gl_context.TEXTURE_MAG_FILTER, this.gl_context.NEAREST);
            this.gl_context.texParameteri(this.gl_context.TEXTURE_2D, this.gl_context.TEXTURE_MIN_FILTER, this.gl_context.NEAREST);
            if(image)this.gl_context.generateMipmap(this.gl_context.TEXTURE_2D);
            this.gl_context.bindTexture(this.gl_context.TEXTURE_2D, null);
        }else {
            this.gl_context.bindTexture(this.gl_context.TEXTURE_2D, texture);
            this.gl_context.texParameteri(this.gl_context.TEXTURE_2D, this.gl_context.TEXTURE_MAG_FILTER, this.gl_context.LINEAR);
            this.gl_context.texParameteri(this.gl_context.TEXTURE_2D, this.gl_context.TEXTURE_MIN_FILTER, this.gl_context.LINEAR);
            this.gl_context.texParameteri(this.gl_context.TEXTURE_2D, this.gl_context.TEXTURE_WRAP_S, this.gl_context.CLAMP_TO_EDGE);
            this.gl_context.texParameteri(this.gl_context.TEXTURE_2D, this.gl_context.TEXTURE_WRAP_T, this.gl_context.CLAMP_TO_EDGE);
        };
    };
    this.Enable = function( shader ){
        this.gl_context.activeTexture( this.gl_context.TEXTURE0+this.ID );
        this.gl_context.bindTexture( this.gl_context.TEXTURE_2D,this.tex);
        if(shader && this.img){
            this.gl_context.uniform1i(shader.GetSamplerLocation(this.tex_id), this.ID );
        }
    };
    this.Disable = function(){
        this.gl_context.bindTexture(this.gl_context.TEXTURE_2D, null);
    };
    this.handleTextureLoaded(this.img, this.tex);
};
BasicTexture.prototype = new Texture();
OMEGA.Omega3D.BasicTexture = BasicTexture;
