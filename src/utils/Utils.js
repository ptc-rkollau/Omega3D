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



OMEGA.Utils.Timeline = function(debug){
    this.triggers = new Array();
    this.trigger_set = new Array();
    this.time = 0; this.trigger_set_index = 0;
    this.startTime = new Date().getTime();
    this.deltaTime = this.savedTime = 0;
    this.upCommingTriggerTime = 0;
    this.isEnabled = false;
    this.isDebug = debug || false;
    this.frames = new Array();
};
OMEGA.Utils.Timeline.prototype.On = function(){
    this.isEnabled = true;
};
OMEGA.Utils.Timeline.prototype.Off = function(){
    this.isEnabled = false;
};
OMEGA.Utils.Timeline.prototype.Add = function( time, trigger){
    if( this.triggers[time] == null){
        this.triggers[time] = new Array();
    }
    this.triggers[time].push( trigger );
    if(this.trigger_set.indexOf(time) == -1 ) this.trigger_set.push( time );
};
OMEGA.Utils.Timeline.prototype.Reset = function(){
    this.Off();
    this.trigger_set_index    = -1;
    if(this.isDebug) console.log("[OMEGA :: Timeline] - Reset!");
    this.startTime = new Date().getTime();
    this.savedTime = 0;
    this.On();
};
OMEGA.Utils.Timeline.prototype.Clear = function(){
    this.triggers = new Array();
    this.upCommingTriggerTime = 0;
    this.trigger_set_index    = 0;
};
OMEGA.Utils.Timeline.prototype.Tick = function( time ){
    if(!this.isEnabled) return;
    this.time = time || (new Date().getTime() -  this.startTime);
    this.deltaTime = (this.time - this.savedTime);
    this.upCommingTriggerTime = this.trigger_set[this.trigger_set_index];
    if( this.triggers[this.upCommingTriggerTime] != null && (this.time-this.deltaTime <= this.upCommingTriggerTime && this.time+this.deltaTime >= this.upCommingTriggerTime)){
        if(this.isDebug) console.log("[OMEGA :: Timeline] - TriggerSet: { trigger_time: " + this.upCommingTriggerTime + " current_time: " + this.time + " }");
        for( var i = 0; i < this.triggers[this.upCommingTriggerTime].length; i++) this.triggers[this.upCommingTriggerTime][i]();
        if( this.trigger_set.length-1 >this.trigger_set_index) this.trigger_set_index++;
    }
    this.savedTime = this.time;
};



OMEGA.Utils.StringParser = function(str){
    this.str;
    this.index;
    this.words;
    this.Init(str);
};
OMEGA.Utils.StringParser.prototype.Init = function(str){
    this.str = str;
    this.index = 0;
};
OMEGA.Utils.StringParser.prototype.skipDelimiters = function(){
    for(var i = this.index, len = this.str.length; i < len; i++){
        var c = this.str.charAt(i);
        //skip tab, space, (, ), "
        if(c=='\t' || c == ' ' || c == '(' || c == ')' || c == '"')continue;
        break;
    }
    this.index = i;
};
OMEGA.Utils.StringParser.prototype.GetFirstWord = function(){
   this.words = this.str.split(String.fromCharCode(32));
    if(this.words.length == 0 ) return null;
    else return this.words[0];
};








