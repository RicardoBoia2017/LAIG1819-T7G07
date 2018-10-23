/**
 * MySphere
 * @param {scene} scene
 * @param {args} primitive's arguments
 * @constructor
 */
 function MySphere(scene, args) {
 	CGFobject.call(this,scene);

	args = args;//.split(" ").map(x => parseInt(x, 10));

	this.radius = args[0];
	this.slices = args[1];
	this.stacks = args[2];

 	this.initBuffers();
 };

 MySphere.prototype = Object.create(CGFobject.prototype);
 MySphere.prototype.constructor = MySphere;

 /**
 * Initializes the buffers
 */
 MySphere.prototype.initBuffers = function() {

 	this.vertices = [];
 	this.indices = [];
	this.normals = [];
	this.baseTexCoords = [];

    for (var latNumber = 0; latNumber <= this.slices; latNumber++) {
      var theta = latNumber * Math.PI / this.slices;
      var sinTheta = Math.sin(theta);
      var cosTheta = Math.cos(theta);

      for (var longNumber = 0; longNumber <= this.stacks; longNumber++) {
        var phi = longNumber * 2 * Math.PI / this.stacks;
        var sinPhi = Math.sin(phi);
        var cosPhi = Math.cos(phi);

        var x = cosPhi * sinTheta;
        var y = cosTheta;
        var z = sinPhi * sinTheta;
        var u = 1 - (longNumber / this.stacks);
        var v = 1 - (latNumber / this.slices);

        this.normals.push(x);
        this.normals.push(y);
        this.normals.push(z);
        this.baseTexCoords.push(u);
        this.baseTexCoords.push(v);
        this.vertices.push(this.radius * x);
        this.vertices.push(this.radius * y);
        this.vertices.push(this.radius * z);
      }
    }

   // var indices = [];
    for (var latNumber = 0; latNumber < this.slices; latNumber++) {
      for (var longNumber = 0; longNumber < this.stacks; longNumber++) {
        var first = (latNumber * (this.stacks + 1)) + longNumber;
        var second = first + this.stacks + 1;
        this.indices.push(first);
        this.indices.push(second);
        this.indices.push(first + 1);

        this.indices.push(second);
        this.indices.push(second + 1);
        this.indices.push(first + 1);
      }
    }
	
    this.texCoords = this.baseTexCoords.slice();


 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
 
/**
* Updates texture scale factors
* @param {scale factor S} S
* @param {scale factor T} T
*/
 MySphere.prototype.updateTex = function(S, T) {

    for (var i = 0; i < this.texCoords.length; i+=2) {
        this.texCoords[i] = this.baseTexCoords[i]/(S);
        this.texCoords[i+1] = this.baseTexCoords[i+1]/ (T);
    }
	
    this.updateTexCoordsGLBuffers();
};