OMEGA.Audio.Analyser = function( audio_ctx ){
    this.analyser = audio_ctx.createAnalyser();
    this.analyser.smoothingTimeConstant = 0.3;
    this.analyser.fftSize = 1024;
    this.analyser.connect( audio_ctx.destination );

    this.levelsCount = 16;
    this.binCount = this.analyser.frequencyBinCount;
    this.levelBins = Math.floor( this.binCount / this.levelsCount );

    this.freqByteData = new Uint8Array(this.binCount);
    this.timeByteData = new Uint8Array(this.binCount);
};
