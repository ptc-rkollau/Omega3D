OMEGA.Audio.Loader = function( data, successCallback){
    this.data = data;
    this.onLoaded = successCallback;
    this.loadCount = 0;
    this.buffers = [];
};

OMEGA.Audio.Loader.prototype.loadURL = function( url, id ){
    var loader = this;
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
    request.onload = function() {
        OMEGA.Audio.ctx.decodeAudioData(
            request.response,
            function(buffer) {
                loader.buffers[id] = buffer;
                if (++loader.loadCount == loader.data.length){

                    loader.onLoaded(loader.buffers);
                }
            },
            function(error) {console.error('decodeAudioData error', error);})};
    request.onerror = function() { alert('BufferLoader: XHR error');};
    request.send();
};

OMEGA.Audio.Loader.prototype.load = function(){
    for( var i = 0; i < this.data.length; i++) {
        this.loadURL(this.data[i].path, this.data[i].id);
    }
};