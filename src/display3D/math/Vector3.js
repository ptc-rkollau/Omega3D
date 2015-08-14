/**
 *  Vector3
 *
 * @param x
 * @param y
 * @param z
 * @return {{x: *, y: *, z: *}}
 * @constructor
 */

function Vector3( x, y, z){
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
};
Vector3.Multiply = function( a, b){
    return new Vector3(a.x* b.x, a.y* b.y, a.z* b.z);
};
Vector3.MultiplyByValue = function( a, b){
    return new Vector3(a.x* b, a.y* b, a.z* b);
};
Vector3.Subtract = function( a, b){
    return new Vector3(a.x- b.x, a.y- b.y, a.z- b.z);
};
Vector3.Equals = function( a, b ){
    return (a.x==b.x&&a.y==b.y&&a.z== b.z);
}
