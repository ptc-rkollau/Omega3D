/**
 *  Vector2
 *
 * @param x
 * @param y
 * @return {{x: *, y: *, z: *}}
 * @constructor
 */

function Vector2( x, y){
    this.x = x;
    this.y = y;

    __construct = function(){
    }();

    this.add = function( v ){
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    this.subtract= function( v ){
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
    this.multiply= function( v ){
        this.x *= v;
        this.y *= v;
        return this;
    }
    this.zero = function() {
        this.x = 0;
        this.y = 0;
        return this;
    };
};
Vector2.Multiply = function( a, b){
    return new Vector2(a.x* b.x, a.y* b.y);
};
Vector2.MultiplyByValue = function( a, b){
    return new Vector2(a.x* b, a.y* b);
};
Vector2.Subtract = function( a, b){
    return new Vector2(a.x- b.x, a.y- b.y);
};
Vector2.Equals = function( a, b ){
    return (a.x==b.x&&a.y==b.y);
}
