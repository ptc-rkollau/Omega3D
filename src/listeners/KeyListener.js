function KeyListener(){
    this.active = true;
    this.currentlyPressedKeys = [];
    this.HandleKeyDown = function(event){
        if(!this.active)return;
        this.currentlyPressedKeys[event.keyCode] = event.keyCode;
    };
    this.HandleKeyUp = function(event){
        if(!this.active)return;
        delete this.currentlyPressedKeys[event.keyCode];
    };
    this.Enable = function(){
        if(this.active)return;
        this.currentlyPressedKeys = [];
        this.active = true;
    };
    this.Disable = function(){
        if(!this.active)return;
        this.currentlyPressedKeys = [];
        this.active = false;
    };
}
OMEGA.listeners = OMEGA.listeners || {};
OMEGA.listeners.KeyListener = KeyListener;