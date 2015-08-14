function RayCaster(){
    var rayDepth = 100;
    var position = [0, 0, 0];
    var direction = [0, 0, 0];

    this.ShootRayForIntersect = function( scene ){
        var length = Math.sqrt( (direction[0] * direction[0]) + (direction[1] * direction[1]) + (direction[2] * directiopn[2]));
        var normalizedDirection = [ direction[0] / length, direction[1]/length, direction[2]/length];

        var ro = position;
        var rd = normalizedDirection;

        var step = ro;
        for( var i = 0; i < rayDepth; i++){
            step += rd;

        }
    };
}
