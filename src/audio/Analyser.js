OMEGA.Audio.Analyser = function( audio_ctx, fftSize ){
    this.analyser = audio_ctx.createAnalyser();
    //this.analyser.smoothingTimeConstant = 1.0;
    this.analyser.fftSize = fftSize || 1024;

    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(this.frequencyData);

    this.feeler    = 0;
    this.prevfeeler = 0;
    this.threshold =6;
    this.decay     = 0.98;
    this.bars      =3;
    this.hold      = 0;
    this.Render = function(){


        this.analyser.getByteFrequencyData(this.frequencyData);


        var total    = 0;
        for (var i = 1; i <this.bars; i++) {
           total += this.frequencyData[i];
        }
        total /= (this.bars-1);

        this.feeler *= this.decay;
        if(this.feeler < 160) this.hold = 0;
        //if(this.hold > 0){
        //    return;
        //}


        if( (total-this.prevfeeler)   > this.threshold && this.hold == 0){
            this.feeler = total;
            this.hold =1;
            document.dispatchEvent(new Event('KICK'));
        }
        this.prevfeeler = total;

       //

    };

    console.log("OMEGA Audio: Analyzer made.");
};
