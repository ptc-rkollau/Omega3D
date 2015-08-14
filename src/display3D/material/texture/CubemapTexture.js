function CubemapTexture( imgs, needsUpdate, ID ){
    Texture.apply( this, arguments );
    this.handleTextureLoaded = function(image, texture ){
        this.gl_context.bindTexture(this.gl_context.TEXTURE_CUBE_MAP, texture);
        this.gl_context.texParameteri(this.gl_context.TEXTURE_CUBE_MAP, this.gl_context.TEXTURE_WRAP_S, this.gl_context.CLAMP_TO_EDGE);
        this.gl_context.texParameteri(this.gl_context.TEXTURE_CUBE_MAP, this.gl_context.TEXTURE_WRAP_T, this.gl_context.CLAMP_TO_EDGE);
        this.gl_context.texParameteri(this.gl_context.TEXTURE_CUBE_MAP, this.gl_context.TEXTURE_MIN_FILTER, this.gl_context.LINEAR);
        this.gl_context.texParameteri(this.gl_context.TEXTURE_CUBE_MAP, this.gl_context.TEXTURE_MAG_FILTER, this.gl_context.LINEAR);

        var faces = [ this.gl_context.TEXTURE_CUBE_MAP_POSITIVE_X,
            this.gl_context.TEXTURE_CUBE_MAP_NEGATIVE_X,
            this.gl_context.TEXTURE_CUBE_MAP_POSITIVE_Y,
            this.gl_context.TEXTURE_CUBE_MAP_NEGATIVE_Y,
            this.gl_context.TEXTURE_CUBE_MAP_POSITIVE_Z,
            this.gl_context.TEXTURE_CUBE_MAP_NEGATIVE_Z ];


        for (var i = 0; i < faces.length; i++) {
            this.gl_context.pixelStorei( this.gl_context.UNPACK_FLIP_Y_WEBGL, true);
            this.gl_context.bindTexture( this.gl_context.TEXTURE_CUBE_MAP, texture);
            this.gl_context.texImage2D(faces[i], 0,  this.gl_context.RGBA,  this.gl_context.RGBA,  this.gl_context.UNSIGNED_BYTE, image[i]);
            this.gl_context.bindTexture( this.gl_context.TEXTURE_CUBE_MAP, null);

        }
    };
    this.Enable = function( shader ){
        this.gl_context.activeTexture( this.gl_context.TEXTURE0+this.ID );
        this.gl_context.bindTexture( this.gl_context.TEXTURE_CUBE_MAP, this.tex);
        if(shader){
            this.gl_context.uniform1i(shader.GetSamplerLocation() , this.ID );
        }
    };
    this.Disable = function(){
        this.gl_context.bindTexture(this.gl_context.TEXTURE_CUBE_MAP, null)
    };

    this.handleTextureLoaded(this.img, this.tex);
};
CubemapTexture.prototype = new Texture();
OMEGA.Omega3D.CubemapTexture = CubemapTexture;
