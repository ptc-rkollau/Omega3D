function ShadowMapTexture(w, h, ID){
    Texture.apply( this, [null, true, ID]);
    this.tex_id = "uShadowMap";

    var depthTextureExt = this.gl_context.getExtension("WEBKIT_WEBGL_depth_texture") ||
                          this.gl_context.getExtension("MOZ_OES_depth_texture") ||
                          this.gl_context.getExtension("WEBKIT_OES_depth_texture") ||
                          this.gl_context.getExtension("WEBGL_depth_texture") ||
                          this.gl_context.getExtension( "MOZ_WEBGL_depth_texture" );
    if(!depthTextureExt) { alert("Depthtextures not available in this browser."); }


    //frame buffer
    var  frameBuffer =  this.gl_context.createFramebuffer();
    this.gl_context.bindFramebuffer( this.gl_context.FRAMEBUFFER, frameBuffer);
    frameBuffer.width  = w || 1024;
    frameBuffer.height = h || 1024;


    //depth texture
    this.tex =  this.gl_context.createTexture();
    this.gl_context.bindTexture( this.gl_context.TEXTURE_2D,  this.tex);
    this.gl_context.texParameteri(this.gl_context.TEXTURE_2D, this.gl_context.TEXTURE_WRAP_S, this.gl_context.CLAMP_TO_EDGE);
    this.gl_context.texParameteri(this.gl_context.TEXTURE_2D, this.gl_context.TEXTURE_WRAP_T, this.gl_context.CLAMP_TO_EDGE);
    this.gl_context.texParameteri( this.gl_context.TEXTURE_2D,  this.gl_context.TEXTURE_MAG_FILTER,  this.gl_context.NEAREST );
    this.gl_context.texParameteri( this.gl_context.TEXTURE_2D,  this.gl_context.TEXTURE_MIN_FILTER,  this.gl_context.NEAREST);
    this.gl_context.texImage2D( this.gl_context.TEXTURE_2D, 0,  this.gl_context.DEPTH_COMPONENT, frameBuffer.width, frameBuffer.height, 0,  this.gl_context.DEPTH_COMPONENT,  this.gl_context.UNSIGNED_SHORT, null);

    this.gl_context.framebufferTexture2D( this.gl_context.FRAMEBUFFER, this.gl_context.DEPTH_ATTACHMENT, this.gl_context.TEXTURE_2D, this.tex, 0);

    if(!this.gl_context.checkFramebufferStatus(this.gl_context.FRAMEBUFFER) === this.gl_context.FRAMEBUFFER_COMPLETE) {
        console.error("[ShadowMapTexture] Framebuffer incomplete!");
    }

    console.log(this.gl_context.checkFramebufferStatus(this.gl_context.FRAMEBUFFER));

    this.gl_context.bindTexture(this.gl_context.TEXTURE_2D, null);
    this.gl_context.bindFramebuffer(this.gl_context.FRAMEBUFFER, null);


    this.GetFrameBuffer = function(){
        return frameBuffer;
    };


    this.Enable = function( shader ){
        this.gl_context.activeTexture( this.gl_context.TEXTURE0+this.ID );
        this.gl_context.bindTexture( this.gl_context.TEXTURE_2D,this.tex);
        if(shader){
            this.gl_context.uniform1i(shader.GetSamplerLocation(this.tex_id), this.ID );

        }

    };
};
ShadowMapTexture.prototype = new Texture();
OMEGA.Omega3D.ShadowMapTexture = ShadowMapTexture;