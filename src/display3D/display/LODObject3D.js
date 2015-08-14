function LODObject3D( mesh, material, levels){
    Object3D.apply( this, [mesh, material]);
    this.levels = levels;
    this.current_level = 0;
    this.meshes = new Array();

    this.createMeshes = function(){
        //var type = this.mesh.GetGeometry().constructor;
        for( var i = 0; i < this.levels+1; i++){
            var g = new Omega3D.Geometry.SphereGeometry(this.mesh.GetGeometry().scale,6 + i * 3, 2 + i * 5);
            var m = new Mesh( g );
            m.CreateBuffers();
            this.meshes.push( m );
        }
        this.SetMesh( this.meshes[this.current_level] );
    };


    this.adjustLODLevel = function( camera ){
        var camPos = camera.GetPosition();
        var objPos = this.GetPosition();
        var delta = [ -camPos[0] - objPos[0], -camPos[1] - objPos[1], -camPos[2] - objPos[2] ];
        var deltaSQRT = Math.sqrt(delta[0]*delta[0] + delta[1]*delta[1] + delta[2]*delta[2]) / (this.mesh.GetGeometry().scale * 2);
        var newLevel = this.levels - Math.floor(deltaSQRT);
        if(newLevel==this.current_level)return;
        if(newLevel > this.levels) this.current_level = this.levels;
        else if(newLevel < 0     ) this.current_level = 0;
        else this.current_level= newLevel;
        this.SetMesh( this.meshes[this.current_level] );
    };


    //create meshes.
    if(this.mesh) this.createMeshes();
}
LODObject3D.prototype = Object3D;
OMEGA.Omega3D.LODObject3D = LODObject3D;
