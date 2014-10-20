/**
 *
 *  MATRIX3D
 *
 * @constructor
 */
function Matrix3D(){
    var raw = null;
    var m0  = 0; var m1  = 0; var m2  = 0; var m3  = 0;
    var m4  = 0; var m5  = 0; var m6  = 0; var m7  = 0;
    var m8  = 0; var m9  = 0; var m10 = 0; var m11 = 0;
    var m12 = 0; var m13 = 0; var m14 = 0; var m15 = 0;


    __construct = function(){
        console.log("matrix made! " );
        identity();
        update();
    }()

    function identity(){
        m0  = 1; m1  = 0; m2  = 0; m3  = 0;
        m4  = 0; m5  = 1; m6  = 0; m7  = 0;
        m8  = 0; m9  = 0; m10 = 1; m11 = 0;
        m12 = 0; m13 = 0; m14 = 0; m15 = 1;
        update();
    }

    function scale(x, y, z ){
        m0  *= x;
        m5  *= y;
        m10 *= z;
        update();
    }

    function translate( x, y, z ){
        m12 += x;
        m13 += y;
        m14 += z;
        update();
    }


    function getScale(){
        return  new Vector3D( m0, m5, m10);
    }
    function getPosition(){
        return new Vector3D( m12, m13, m14);
    }

    function rotate( axis, radians ){
        //axis   : Unit Vector3D
        //radians: float
        identity();
        this.c = Math.cos( radians );
        this.s = Math.sin( radians );
        this.t = 1 - Math.cos( radians );
        this.x2 = Math.pow( axis.x, 2 );
        this.y2 = Math.pow( axis.y, 2);
        this.z2 = Math.pow( axis.z, 2);

        m0 = t*x2 + c;                         m1 = t * axis.x * axis.y - s * axis.z;  m2  = t * axis.x * axis.z + s * axis.y;  m3  = 0;
        m4 = t * axis.x * axis.y + s * axis.z; m5 = t * y2 + c;                        m6  = t * axis.y * axis.z - s * axis.x;  m7  = 0;
        m8 = t * axis.x * axis.z - s * axis.y; m9 = t * axis.y * axis.z + s * axis.x;  m10 = t * z2 + c;                        m11 = 0;
        m12 = 0;                               m13 = 0;                                m14 = 0;                                  m15 = 1;
        update();
    }

    function projection( fov, ratio, zNear, zFar ){
        identity();
        m0  = 1 / Math.tan( fov/2);
        m5  = m0 / ratio;
        m10 = -(zFar + zNear/zFar-zNear);
        m11 = -(2* zFar * zNear/zFar - zNear);
        m14 = -1;
        m15 = 0;
        update();
    }


    function update(){
        raw = [
            m0,  m1,   m2,  m3,
            m4,  m5,   m6,  m7,
            m8,  m9,  m10, m11,
            m12, m13, m14, m15
        ]
    }

    return {
        GetRaw:raw,
        Identity:function(){
            identity();
        },
        Scale:function(x,y,z){
            scale(x, y, z);
        },
        Translate:function(x, y, z){
            translate( x, y, z );
        },
        Rotate:function( axis, radians){
            rotate( axis, radians );
        },
        Projection:projection,
        GetScale:getScale,
        GetPosition:getPosition
    }
}