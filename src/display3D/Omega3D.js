/*
 *        OMEGA 3D Package
 */
var OMEGA = OMEGA || {};
OMEGA.Omega3D = OMEGA.Omega3D || {};
OMEGA.Omega3D = function(canvas){
    this.canvas   =  canvas || document.getElementById("omega");
    this.scenes   = [];
    this.cameras  = [];
    this.shaders  = [];
    this.keylisteners = [];


    try {
        this.gl = this.canvas.getContext("webgl", {stencil:true});
        this.gl.viewPortWidth  = this.canvas.width;
        this.gl.viewPortHeight = this.canvas.height;
    } catch (e) {
        console.error("[Omega3D] Cant initiate WebGL!");
    }
    if (!this.gl)console.log("Cant initiate WebGL");
    OMEGA.Omega3D.GL = this.gl;
    console.log(".: Omega3D v"+OMEGA.Omega3D.VERSION+" :.");
};
OMEGA.Omega3D.Recalibrate = function(cnvs){
    OMEGA.Omega3D.INSTANCE.gl.viewPortWidth  = OMEGA.Omega3D.INSTANCE.canvas.width;
    OMEGA.Omega3D.INSTANCE.gl.viewPortHeight = OMEGA.Omega3D.INSTANCE.canvas.height;
}
OMEGA.Omega3D.GetGL = function(){
    return OMEGA.Omega3D.INSTANCE.gl;
};
OMEGA.Omega3D.AddKeyListener = function(listener){
    OMEGA.Omega3D.INSTANCE.keylisteners.push(listener);
    document.keylisteners = OMEGA.Omega3D.INSTANCE.keylisteners;

};
OMEGA.Omega3D.RemoveKeyListener = function(listener){
    OMEGA.Omega3D.INSTANCE.keylisteners.splice( OMEGA.Omega3D.INSTANCE.keylisteners.lastIndexOf(listener), 1 );
    document.keylisteners = OMEGA.Omega3D.INSTANCE.keylisteners;
};

//LISTENERS
window.onload = function(){
    var body = document.getElementsByTagName("body");
    OMEGA.Omega3D.INSTANCE = new OMEGA.Omega3D;
};

document.keylisteners = [];
document.onkeydown = function(e){
    for(var i = 0; i < document.keylisteners.length; i++){
        document.keylisteners[i].HandleKeyDown(e);
    }
};
document.onkeyup =  function(e){
    for(var i = 0; i < document.keylisteners.length; i++){
        document.keylisteners[i].HandleKeyUp(e);
    }
};







OMEGA.Omega3D.GL = null;
OMEGA.Omega3D.LIGHTS = [];
OMEGA.Omega3D.PointSize = 1.0;
OMEGA.Omega3D.VERSION = "0.0.1.3 Alpha";
OMEGA.Omega3D.ScenesCount   = 0;
OMEGA.Omega3D.ObjectsCount   = 0;
OMEGA.Omega3D.MaterialsCount = 0;
OMEGA.Omega3D.INSTANCE = null;


OMEGA.Omega3D.KEEP    = 7680;
OMEGA.Omega3D.REPLACE = 7681;
OMEGA.Omega3D.NEVER   = 512;
OMEGA.Omega3D.LESS    = 513;
OMEGA.Omega3D.EQUAL   = 514;
OMEGA.Omega3D.LEQUAL  = 515;
OMEGA.Omega3D.GREATER = 516;
OMEGA.Omega3D.NOTEQUAL= 517;
OMEGA.Omega3D.GEQUAL  = 518;
OMEGA.Omega3D.ALWAYS  = 519;
var Omega3D = OMEGA.Omega3D;









