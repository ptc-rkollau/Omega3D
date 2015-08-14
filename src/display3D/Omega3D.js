/*
 *        OMEGA 3D Package
 */
var OMEGA = OMEGA || {};
OMEGA.Omega3D = OMEGA.Omega3D || {};
OMEGA.Omega3D = function(){
    this.canvas   =  document.getElementById("omega");
    this.scenes   = [];
    this.cameras  = [];
    this.shaders  = [];
    this.keylisteners = [];

    this.gl = null;
    try {
        this.gl = this.canvas.getContext("experimental-webgl",{preserveDrawingBuffer: true} );
        if(this.gl == null)this.gl = canvas.getContext("webgl",{preserveDrawingBuffer: true});
    } catch (e) {}
    if (this.gl == null){
        console.log("[Omega3D] Cant initiate WebGL!");
        return;
    }
    OMEGA.Omega3D.AVAILABLE = true;
    this.gl.viewPortWidth  = this.canvas.width;
    this.gl.viewPortHeight = this.canvas.height;
    this.canvas.addEventListener('webglcontextlost', function(){ OMEGA.Omega3D.AVAILABLE = false; }, false);
    this.canvas.addEventListener('webglcontextrestored', function(){ OMEGA.Omega3D.AVAILABLE = true; }, false);

    window.addEventListener("resize", function(){
        Omega3D.Recalibrate();
    }, false);

    OMEGA.Omega3D.GL = this.gl;
    console.log(".: Omega3D v"+OMEGA.Omega3D.VERSION+" :.");
};
OMEGA.Omega3D.Recalibrate = function(){
    OMEGA.Omega3D.INSTANCE.canvas.width  = window.innerWidth - 5;
    OMEGA.Omega3D.INSTANCE.canvas.height = window.innerHeight - 5;
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

OMEGA.Omega3D.ReadPixels = function( image,xpos, ypos, width, height ){
    var gl = OMEGA.Omega3D.INSTANCE.gl;
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    var framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

    var data = new Uint8Array(width * height * 4);
    gl.readPixels(xpos, ypos, width,height, gl.RGBA, gl.UNSIGNED_BYTE, data);

    gl.deleteFramebuffer(framebuffer);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.deleteTexture(texture);
    return data;
};
OMEGA.Omega3D.CreateArrayBuffer = function( data, itemSize ){
    var gl = OMEGA.Omega3D.INSTANCE.gl;
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data,gl.STATIC_DRAW);
    buffer.itemSize = itemSize;
    buffer.numItems = data.length / itemSize;
    return buffer;
};

OMEGA.Omega3D.CreateAtlas = function(width, height, cellWidth, cellHeight, out_vertices, out_uvs, out_indices ){
    var xSteps = width / cellWidth;
    var ySteps = height / cellHeight;
    for( var y = 0; y < ySteps; y++){
        for( var x = 0; x < xSteps; x++) {
           var xpos = x * cellWidth;
           var ypos = y * cellHeight;
           var zpos = 0.0;

           out_vertices.push( xpos, ypos, zpos );

           out_uvs.push( x / (xSteps - 1));
           out_uvs.push( y / (ySteps - 1));

           if (y < ySteps-1 && x < xSteps-1) {

               out_indices.push(y * xSteps + x);
               out_indices.push(y * xSteps + x + 1);
               out_indices.push((y+1) * xSteps + x);

               out_indices.push(y * xSteps + x + 1);
               out_indices.push((y+1) * xSteps + x + 1);
               out_indices.push((y+1) * xSteps + x);
           }
        }
    }
};





//LISTENERS
function onload(){
    var body = document.getElementsByTagName("body");
    OMEGA.Omega3D.INSTANCE = new OMEGA.Omega3D();
};


if (window.addEventListener)
    window.addEventListener("load", onload, false);
else if (window.attachEvent)
    window.attachEvent("onload", onload);
else
    window.onload = onload;

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



//PROTOTYPES OF NATIVES.
String.prototype.splice = function( idx, rem, s ) {
    return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
};


OMEGA.Omega3D.Log = function( msg ){
    console.log(msg);
};



OMEGA.Omega3D.GL = null;
OMEGA.Omega3D.LIGHTS = [];
OMEGA.Omega3D.PointSize = 1.0;
OMEGA.Omega3D.VERSION = "0.0.1.5 Alpha";
OMEGA.Omega3D.ScenesCount   = 0;
OMEGA.Omega3D.ObjectsCount   = 0;
OMEGA.Omega3D.MaterialsCount = 0;
OMEGA.Omega3D.INSTANCE = null;

OMEGA.Omega3D.AVAILABLE = false;


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









