function FrameBufferTexture(w, h, ID){
    Texture.apply( this, [null, true], ID );
    var frameBuffer, depthBuffer;


    //frame buffer
    frameBuffer =  this.gl_context.createFramebuffer();
    this.gl_context.bindFramebuffer(  this.gl_context.FRAMEBUFFER, frameBuffer);
    frameBuffer.width = w || 1024;
    frameBuffer.height = h || 1024;

    //texture
    this.tex =  this.gl_context.createTexture();
    this.gl_context.bindTexture( this.gl_context.TEXTURE_2D,  this.tex);
    this.gl_context.texParameteri(this.gl_context.TEXTURE_2D, this.gl_context.TEXTURE_WRAP_S, this.gl_context.CLAMP_TO_EDGE);
    this.gl_context.texParameteri(this.gl_context.TEXTURE_2D, this.gl_context.TEXTURE_WRAP_T, this.gl_context.CLAMP_TO_EDGE);
    this.gl_context.texParameteri( this.gl_context.TEXTURE_2D,  this.gl_context.TEXTURE_MAG_FILTER,  this.gl_context.LINEAR );
    this.gl_context.texParameteri( this.gl_context.TEXTURE_2D,  this.gl_context.TEXTURE_MIN_FILTER,  this.gl_context.LINEAR);
    this.gl_context.texImage2D( this.gl_context.TEXTURE_2D, 0,  this.gl_context.RGBA, frameBuffer.width, frameBuffer.height, 0,  this.gl_context.RGBA,  this.gl_context.UNSIGNED_BYTE, null);
   // this.gl_context.generateMipmap( this.gl_context.TEXTURE_2D);

    //depth buffer
    var depthBuffer = this.gl_context.createRenderbuffer();
    this.gl_context.bindRenderbuffer( this.gl_context.RENDERBUFFER, depthBuffer );
    this.gl_context.renderbufferStorage(this.gl_context.RENDERBUFFER, this.gl_context.DEPTH_COMPONENT16, frameBuffer.width, frameBuffer.height);

    this.gl_context.framebufferTexture2D(this.gl_context.FRAMEBUFFER, this.gl_context.COLOR_ATTACHMENT0, this.gl_context.TEXTURE_2D, this.tex, 0);
    this.gl_context.framebufferRenderbuffer(this.gl_context.FRAMEBUFFER, this.gl_context.DEPTH_ATTACHMENT, this.gl_context.RENDERBUFFER, depthBuffer);

    if(!this.gl_context.checkFramebufferStatus(this.gl_context.FRAMEBUFFER) === this.gl_context.FRAMEBUFFER_COMPLETE) {
        console.error("Framebuffer incomplete!");
    }

    this.gl_context.bindTexture(this.gl_context.TEXTURE_2D, null);
    this.gl_context.bindRenderbuffer(this.gl_context.RENDERBUFFER, null);
    this.gl_context.bindFramebuffer(this.gl_context.FRAMEBUFFER, null);


    this.Enable = function( shader ){
        this.gl_context.bindRenderbuffer( this.gl_context.RENDERBUFFER, depthBuffer );
        this.gl_context.activeTexture( this.gl_context.TEXTURE0+this.ID);
        this.gl_context.bindTexture(this.gl_context.TEXTURE_2D,  this.tex);
        if(shader){

            var samplerLocation = shader.GetSamplerLocation(this.tex_id);

            this.gl_context.uniform1i(samplerLocation , this.ID );
        }
    };
    this.GetFrameBuffer = function(){
        return frameBuffer;
    };
    this.Disable = function(){
        this.gl_context.bindTexture(this.gl_context.TEXTURE_2D, null);
        this.gl_context.bindRenderbuffer( this.gl_context.RENDERBUFFER, null );
    };

};
FrameBufferTexture.prototype = new Texture();
OMEGA.Omega3D.FrameBufferTexture = FrameBufferTexture;