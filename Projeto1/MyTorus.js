/**
 * MyTorus
 * @param {scene} scene
 * @param {args} primitive's arguments
 * @constructor 
 */
function MyTorus(scene, args) {
    CGFobject.call(this, scene);
	
	this.inner = args[0];
	this.outer = args[1];
    this.slices = args[2];
    this.loops = args[3];	
	
    this.torusRadius = (this.outer - this.inner) / 2;
    this.fullRadius = this.inner + this.torusRadius;

    this.initBuffers();
};


MyTorus.prototype = Object.create(CGFobject.prototype);
MyTorus.prototype.constructor = MyTorus;

/**
 * Initializes the buffers
 */
MyTorus.prototype.initBuffers = function() {

    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.baseTexCoords = [];

    for (var i = 0; i <= this.loops; i++) {
		
        var theta = i * 2 * Math.PI / this.loops;

        for (var j = 0; j <= this.slices; j++) {
			
            var phi = j * 2 * Math.PI / this.slices;

            var x = (this.fullRadius + this.torusRadius * Math.cos(theta)) * Math.cos(phi);
            var y = (this.fullRadius + this.torusRadius * Math.cos(theta)) * Math.sin(phi)
            var z = this.torusRadius * Math.sin(theta);
			
            this.vertices.push(x, y, z);
            this.normals.push(x, y, z);			
			
            var texS = 1 - (i / this.loops);
            var texT = 1 - (j / this.slices);

            this.baseTexCoords.push(texS, texT);
        }
    }

	//indexs
    for (var i = 0; i < this.loops; i++) {
        for (var j = 0; j < this.slices; j++) {
            var first = (i * (this.slices + 1)) + j;
            var second = first + this.slices + 1;

            this.indices.push(first, second + 1, second);
            this.indices.push(first, first + 1, second + 1);
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
MyTorus.prototype.updateTex = function(S, T) {
		
    for (var i = 0; i < this.texCoords.length; i += 2) {
        this.texCoords[i] = this.baseTexCoords[i] / (S * 2);
        this.texCoords[i + 1] = this.baseTexCoords[i + 1] / (T * 2);
    }

    this.updateTexCoordsGLBuffers();
};