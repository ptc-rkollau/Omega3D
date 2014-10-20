# OMEGA3D - WebGL 3D Rendering Library#

### What ?  ###
* Javascript WebGL 3D rendering library.
* Current stable version: **0.0.1.3 Alpha**
* [Learn more here!](http://lab.rackdoll.nl/js/omega/)

### How ? ###
* Go to the **examples -> display3D** folder for examples.
* A good place to start is the **shapes** demo.


### Basic Setup ###
```
#!javascript

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
