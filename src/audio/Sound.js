OMEGA.Audio = OMEGA.Audio || { };
OMEGA.Audio.Sound = function( id, buffer ){
    this.sound_id     = id;
    this.sound_buffer = buffer;
    this.sound_src = null;
    this.gainNode = OMEGA.Audio.ctx.createGain();
    this.gainNode.gain.value = 1.0;
    this.panner = OMEGA.Audio.ctx.createPanner();

    this.getID = function(){ return this.sound_id; };
    this.getVolume = function(){ return this.gainNode.gain.value; };
    this.getBuffer = function(){ return this.sound_buffer; };

    this.setVolume = function(value){ this.gainNode.gain.value = value; };
    this.setPanner = function(value){this.panner = value; };

    this.play = function(time){
        var offlineContext = new OfflineAudioContext(1, this.sound_buffer.length, this.sound_buffer.sampleRate);

        this.sound_src = OMEGA.Audio.ctx.createBufferSource();
        this.sound_src.buffer = this.sound_buffer;


        var filter = OMEGA.Audio.ctx.createBiquadFilter();
        filter.type = "lowpass";




      //  this.sound_src.connect(filter);
      //  filter.connect(OMEGA.Audio.ctx.destination);
      //
       this.sound_src.connect(this.panner);
        this.panner.connect(OMEGA.Audio.ctx.destination);

        this.sound_src.start(time);

        //OMEGA.Audio.ctx.startRendering();

        OMEGA.Audio.ctx.oncomplete = function(e){
            var filteredBuffer = e.renderedBuffer;
            console.log(filteredBuffer.length, filteredBuffer);

                var threshold = 0.4;
                var peaksArray = [];
                var length = filteredBuffer.length;
                for(var i = 0; i < length;) {
                   // console.log(filteredBuffer[i]);
                    if (filteredBuffer[i] > threshold) {
                        peaksArray.push(i);
                        // Skip forward ~ 1/4s to get past this peak.
                        i += 10000;
                    }
                    i++;
                }

            console.log(peaksArray);
        }
    };
};


