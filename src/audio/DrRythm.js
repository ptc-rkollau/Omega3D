OMEGA.Audio.DrRythm = function( bpm ){
    this.beatsPerMinute = bpm;
    this.eightNoteTime     = ( 60 /  this.beatsPerMinute ) * 0.5;
    this.sixteenthNoteTime = ( 60 /  this.beatsPerMinute ) * 0.25;
    this.current8Note  = 0;
    this.current16Note = 0;
    this.nextNodeTime = 0;
    this.scheduleAheadTime = 0.1;
};

OMEGA.Audio.DrRythm.prototype.tick8 = function(){
    while (this.nextNodeTime < OMEGA.Audio.ctx.currentTime + this.scheduleAheadTime ) {
        console.log("tick8 : " + this.current8Note + " @ " + this.beatsPerMinute + "BPM");
        this.nextNodeTime += this.eightNoteTime;
        this.current8Note++;
        if (this.current8Note == 8)this.current8Note = 0;
    }
};

OMEGA.Audio.DrRythm.prototype.tick16 = function(){
    while (this.nextNodeTime < OMEGA.Audio.ctx.currentTime + this.scheduleAheadTime ) {
        console.log("tick16 : " + this.current16Note + " @ " + this.beatsPerMinute + "BPM");
        this.nextNodeTime += this.sixteenthNoteTime;
        this.current16Note++;
        if (this.current16Note == 16)this.current16Note = 0;
    }
};
