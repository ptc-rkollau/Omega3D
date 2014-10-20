var OMEGA = OMEGA || {};
OMEGA.Utils = function(){};
OMEGA.Utils.prototype.LoadScript = function( url, callback ){
    var head    = document.getElementsByTagName('head')[0];
    var script  = document.createElement('script');
    script.type = 'text/javascript';
    script.src  = url;
    script.onreadystatechange = callback;
    script.onload = callback;
    head.appendChild(script);
};
OMEGA.Utils.prototype.LoadScripts = function( urls, callback ){
    for( var i =0; i<urls.length;i++){
        this.LoadScript( urls[i], i<urls.length-1?null:callback);
    }
};
OMEGA.Utils.prototype.LoadImages = function( urls, callback ){
    var images = [];
    var loads  = urls.length;
    var onLoaded = function(){
        if(--loads == 0) callback(images);
    }
    for( var i = 0; i < loads; ++i){
        var image = this.LoadImage( urls[i], onLoaded );
        images.push( image );
    }
};
OMEGA.Utils.prototype.LoadImage = function( url, callback ){
    var image = new Image();
    image.src = url;
    image.onload = callback;
    return image;
};




OMEGA.Utils.Counter = function(){
    this.startTime = new Date().getTime();
    this.time = new Date().getTime();
    this.frameTime = 0;  this.framesNumber = 0;
    this.FPS = 0;
};
OMEGA.Utils.Counter.prototype.update = function(){
    this.framesNumber++;
    this.frameTime = (new Date().getTime() -  this.time) / 1000;
    if( this.frameTime > 1){
        this.FPS = Math.round( this.framesNumber/ this.frameTime);
        this.time = new Date().getTime();
        this.framesNumber = 0;
    }
};
OMEGA.Utils.Counter.prototype.getFPS = function(){
    return this.FPS;
};
OMEGA.Utils.Counter.prototype.getFrame = function(){
    return this.framesNumber;
};
OMEGA.Utils.Counter.prototype.getFrameTime = function(){
    return this.frameTime;
};
OMEGA.Utils.Counter.prototype.getTime = function(){
   return (new Date().getTime() -  this.startTime) / 1000;
};







