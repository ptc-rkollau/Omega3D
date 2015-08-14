OMEGA.Omega3D.Scene = function() {
    this.id = (++OMEGA.Omega3D.ScenesCount).toString();
    this.name = "Scene_"+this.id;
    this.renderer = null;
    this.gl       = OMEGA.Omega3D.GL;
    this.children = new Array();
    this.objects  = new Array();
    this.materials = new Array();
    this.list = new Array();
    this.lights = new Array();
    this.counter  = new OMEGA.Utils.Counter();
    this.color = {r: 0.0, g:0.0, b:0.0, a:1.0};
    this.hasFog = true;
    this.fogStart = 1.0;
    this.fogEnd   = 3.0;
    this.lightsON = true;




   // this.gl.enable( this.gl.DEPTH_TEST );
   // this.gl.enable( this.gl.STENCIL_TEST );
   // this.gl.clearColor(this.color.r, this.color.g, this.color.b, this.color.a);
//    this.gl.cullFace(this.gl.FRONT);
//    this.gl.enable(this.gl.CULL_FACE);
//    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE);
//    this.gl.enable( this.gl.BLEND);

    this.getLights = function( ){
       return this.lights;
    };
    this.addLight = function( light ){
        this.lights.push(light);
    };
    this.removeLight = function( light ){
        this.lights.splice(this.lights.indeOf(light), 1);
    };

    this.getColor = function(){
        return this.color;
    };
    this.setColor = function(r, g, b){
        this.color = {r: r, g:g, b:b, a:1.0};
        this.gl.clearColor(this.color.r, this.color.g, this.color.b, this.color.a);
    };
    this.checkForMaterial = function(id){
        for(var i = 0; i < this.materials.length; i++)
        {
            if( this.materials[i].id == id ) return true;
        }

        return false;
    }
    this.setName = function(value){
        this.name = value;
    };
    this.getName = function(){
        return this.name;
    };
    this.getID = function(){
        return this.id;
    };

    this.getMaterials = function( id ){
        return materials[id];
    };
    this.getObjectsFromMaterialID = function( id ){
        return objects[id];
    };
};
OMEGA.Omega3D.Scene.prototype.getGL = function(){
    return this.gl;
};
OMEGA.Omega3D.Scene.prototype.addChild = function( c  ){

    this.children.push( c );
    c.parentScene = this;

    //if(!this.checkForMaterial(c.GetMaterial().GetID())) this.materials.push( { id:c.GetMaterial().GetID(), material:c.GetMaterial() } );
    //var materialID = c.GetMaterial().GetID();
    //if( materialID == "")materialID = "default";
    //if( this.objects[ materialID] == null ){
    //    this.objects[ materialID] = new Array();
    //}
    //this.objects[materialID].push( c );
    //
    //
    //
    ////LIST SEGMENT.
    //if( this.list[ materialID] == null ){
    //    this.list[ materialID] = {head:c, tail:null};
    //    c.prev = null;c.next = null;
    //}else {
    //    if (this.list[materialID].tail == null) {
    //        this.list[materialID].tail = c;
    //        c.prev = this.list[materialID].head;
    //        this.list[materialID].head.next = c;
    //    } else {
    //        c.prev = this.list[materialID].tail;
    //        this.list[materialID].tail.next = c;
    //        this.list[materialID].tail = c;
    //    }
    //
    //}
};
OMEGA.Omega3D.Scene.prototype.removeChild = function( c ){
    for(var i=0;i<this.children.length;i++){
        if( this.children[i] == c )
            this.children.splice(i,1);
    }
    //var materialID = c.GetMaterial().GetID();
    //if( this.list[ materialID].head == c ){
    //    if(c.next!=null){
    //        this.list[ materialID].head = c.next;
    //        this.list[ materialID].head.prev = null;
    //    }else{
    //        this.list[ materialID].head = null;
    //        this.list[ materialID ] = null;
    //    }
    //}else if(  this.list[ materialID].head != c && this.list[ materialID].tail == c){
    //    if(c.prev != null){
    //        this.list[ materialID].tail = c.prev;
    //        this.list[ materialID].tail.next = null;
    //    }
    //}else if( this.list[ materialID].head != c && this.list[ materialID].tail != c ){
    //    if(c.prev != null && c.next != null){
    //        c.prev.next = c.next;
    //        c.next.prev = c.prev.next;
    //    }
    //}
    //
    //if(!this.objects[ materialID ]){
    //    c = null;
    //    return;
    //}
    //for( var i = 0; i < this.objects[ materialID ].length; i++){
    //    if( this.objects[materialID][i] == c ){
    //        this.objects[materialID].splice( i, 1 );
    //    }
    //}
    //if(this.objects[materialID].length == 0){
    //
    //    this.objects[materialID] = null;
    //}
    c.parentScene = null;
    c = null;
};


OMEGA.Omega3D.Scene.prototype.update = function(){
   this.counter.update();
};
OMEGA.Omega3D.Scene.prototype.getTime = function(){
    return this.counter.getTime();
};
OMEGA.Omega3D.Scene.prototype.getFPS = function(){
    return this.counter.getFPS();
};
OMEGA.Omega3D.Scene.prototype.getFrameNumber = function(){
    return this.counter.getFrame();
};
