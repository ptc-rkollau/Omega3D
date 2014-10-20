function PostProcessingKernelShader(vsrc, fsrc, kernel ){
    Shader.apply( this, [vsrc,fsrc] );
    this.kernel = kernel;
    this.getKernel = function(){ return this.kernel; };
};
PostProcessingKernelShader.prototype = new Shader();
OMEGA.Omega3D.PostProcessingKernelShader = PostProcessingKernelShader;
