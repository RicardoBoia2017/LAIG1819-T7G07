/**
* MyTriangle
* @param {scene} scene
* @param {args} primitive's arguments
* @constructor
*/
function MyTriangle(scene, args) {
  CGFobject.call(this, scene);

  this.args = args;

  this.initBuffers();
};

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor = MyTriangle;

/** 
 * Initializes the buffers
 */
MyTriangle.prototype.initBuffers = function() {

  this.vertices = this.args;

  this.indices = [
    0, 1, 2,
  ];

  this.normals = [
    0,0,1,
    0,0,1,
    0,0,1
  ];


  var edge1 = Math.sqrt(Math.pow(this.args[3] - this.args[0], 2) + Math.pow(this.args[4] - this.args[1], 2) + Math.pow(this.args[5] - this.args[2], 2));
  var edge2 = Math.sqrt(Math.pow(this.args[3] - this.args[6], 2) + Math.pow(this.args[4] - this.args[7], 2) + Math.pow(this.args[5] - this.args[8], 2));
  var edge3 = Math.sqrt(Math.pow(this.args[0] - this.args[6], 2) + Math.pow(this.args[1] - this.args[7], 2) + Math.pow(this.args[2] - this.args[8], 2));
  
  var theAngle = Math.acos((Math.pow(edge2, 2) + Math.pow(edge1, 2) - Math.pow(edge3, 2)) / (2 * edge1 * edge2));
  
  var textureCoord1 = (edge1 - edge2 * Math.cos(theAngle)) / edge1;
  var textureCoord2 = edge2 * Math.sin(theAngle) / edge1;




  this.baseTexCoords = [
    	1, 0,
		0, 0,
		textureCoord1, textureCoord2
  ];


  this.texCoords = [];
  this.texCoords = this.baseTexCoords.slice();


  this.primitiveType = this.scene.gl.TRIANGLES;

  this.initGLBuffers();
};

/**
* Updates texture scale factors
* @param {scale factor S} S
* @param {scale factor T} T
*/
MyTriangle.prototype.updateTex = function(S, T) {
  for (var i = 0; i < this.texCoords.length; i+=2) {
    this.texCoords[i] = this.baseTexCoords[i]/S;
    this.texCoords[i+1] = this.baseTexCoords[i+1]/T;
  }

  this.updateTexCoordsGLBuffers();
};

/**
 * Returns type of primitive
 */
MyTriangle.prototype.getType = function()
{
    return "Triangle";
}
