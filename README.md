# Omega3D - Javascript WebGL 3D Library#

### What ?  ###
* Javascript WebGL 3D rendering library.
* Current stable version: **0.0.1.4 Alpha**
* [Learn more here!](http://lab.rackdoll.nl/js/omega/)

### Features ###
* Linkedlist batch rendering.
* Customizable RenderPasses.
* RenderChains, for rendering control.
* FrameBuffer and StencilBuffer support.
* Textures, Multi textures, Video textures and Cubemap support.
* OBJ fileformat support.
* Camera and Free roaming camera support.
* Build-in geometries ( Cube, Sphere, Torus, Cilinder, Square ), support for custom geometries.
* Build-in Shaders and support for custom shaders.
* Build-in pseudo static pipeline ( beginners ) and pseudo dynamic pipeline ( novice )

### How ? ###
* Go to the **examples -> display3D** folder for examples.
* A good place to start is the **geometry** demo.


### Basic Setup ###
```
var scene = new Omega3D.Scene();
var cam    = new Omega3D.cameras.Camera();

var tex  = new Omega3D.BasicTexture();
var sh   = new Omega3D.Shaders.Basic(false);
var mat = new Omega3D.Material(sh, [tex] );

var geom = new Omega3D.Geometry.TorusGeometry(0.5, 0.25);
var mesh = new Omega3D.Mesh(geom);
var torus  = new Omega3D.Object3D( mesh, mat );
torus.SetPosition( 0, 0, -1 );

scene.addChild(torus);

var renderer = new Omega3D.WebGLRenderer();
var chain      = new Omega3D.RenderChain();
chain.AddRenderPass( new RenderPass( renderer, scene, cam ) );
renderer.SetRenderChain(chain);

renderer.render();
```



### Who do I talk to? ###

* Project Owner:  Rackdoll@gmail.com
