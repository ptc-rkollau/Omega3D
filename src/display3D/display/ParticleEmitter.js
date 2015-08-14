function ParticleEmitter( material){
    var m = new OMEGA.Omega3D.Mesh( new OMEGA.Omega3D.Geometry());
    Object3D.apply(this, [m, material]);
    this.drawType = OMEGA.Omega3D.Object3D.POINTS;
    this.sortParticles = true;
    this.particles = new Array();
    this.AddParticle = function( p ){
        this.particles.push(p.x, p.y, p.z);
        this.GetMesh().GetGeometry().SetVertices( this.particles );
        this.GetMesh().CreateBuffers();
    };
    this.AddParticles = function( particles ){
        this.particles = particles;
        this.GetMesh().GetGeometry().SetVertices( this.particles );
        this.GetMesh().CreateBuffers();
    };

    this.Update = function(gl,camera){
          if(this.sortParticles){
              gl.disable(gl.DEPTH_TEST);
              gl.enable(gl.BLEND);
              gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
            //this.sort(camera);
          }
    };
    this.LateUpdate = function(gl,camera){
        if(this.sortParticles){
            gl.enable(gl.DEPTH_TEST);
            gl.disable(gl.BLEND);
        }
    };

    this.sort = function(camera){
        this.particles.sort(function(a,b){
            return a.z - b.z;
        })
    }

}
ParticleEmitter.prototype = new Object3D();
OMEGA.Omega3D.Particles = OMEGA.Omega3D.Particles || {};
OMEGA.Omega3D.Particles.ParticleEmitter = ParticleEmitter;

