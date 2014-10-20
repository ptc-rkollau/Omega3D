var OMEGA = OMEGA || {};
OMEGA.Audio = OMEGA.Audio || {};
OMEGA.Audio.ctx = null;
OMEGA.Audio.sounds = null;
OMEGA.Audio.succesCallback = null;
OMEGA.Audio = function(){
    try{
        window.AudioCosntext = window.AudioContext || window.webkitAudioContext;
        OMEGA.Audio.ctx = new AudioContext();
        OMEGA.Audio.sounds = [];
        console.log('Welcome to OmegaAudio');
    }catch(e){alert('This browser does not support Web Audio')};
};
OMEGA.Audio.LoadSounds = function( data, successCallback ){
    OMEGA.Audio.succesCallback = successCallback;
    var loader = new OMEGA.Audio.Loader(
        data,
        function(b){
            for( var k in b ){
                OMEGA.Audio.sounds[k] = new OMEGA.Audio.Sound(k, b[k]);
            }
            OMEGA.Audio.succesCallback();
        }
    );
    loader.load();
};
OMEGA.Audio.PlaySound = function( id, time, panner ){
    var timeValue   = time || 0.0;
    if( panner )OMEGA.Audio.sounds[id].setPanner(panner);
    OMEGA.Audio.sounds[id].setVolume(1.0);
    OMEGA.Audio.sounds[id].play(timeValue);
    return OMEGA.Audio.sounds[id];
};
OMEGA.Audio.getPeaksAtThreshold = function(data, threshold){
    var peaksArray = [];
    var length = data.length;
    for(var i = 0; i < length;) {
        if (data[i] > threshold) {
            peaksArray.push(i);
            // Skip forward ~ 1/4s to get past this peak.
            i += 10000;
        }
        i++;
    }
    return peaksArray;
};
OMEGA.Audio();