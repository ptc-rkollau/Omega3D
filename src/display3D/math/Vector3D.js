/**
 *  Vector3D
 *
 * @param x
 * @param y
 * @param z
 * @return {{x: *, y: *, z: *}}
 * @constructor
 */

function Vector3D( x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;

    __construct = function(){
    }();

    this.add = function( v ){
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }
    this.subtract= function( v ){
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }
    this.multiply= function( v ){
        this.x *= v;
        this.y *= v;
        this.z *= v;
        return this;
    }
    this.zero = function() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        return this;
    };
}