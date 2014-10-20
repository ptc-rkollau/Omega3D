function PostProcessingShader(vsrc, fsrc ){
    Shader.apply( this, [vsrc,fsrc] );
};
PostProcessingShader.prototype = new Shader();
OMEGA.Omega3D.PostProcessingShader = PostProcessingShader;
