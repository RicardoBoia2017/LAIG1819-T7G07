/**
* MyQuad
* @param {scene} scene
* @param {args} primitive's arguments
* @constructor
*/	
function MyQuad(scene, args) {
	CGFobject.call(this,scene);
    this.args = args;

    this.initBuffers();

};
 
MyQuad.prototype = Object.create(CGFobject.prototype);
MyQuad.prototype.constructor=MyQuad;

/**
 * Initializes the buffers
 */
MyQuad.prototype.initBuffers = function () {

    this.vertices = [
        this.args[0], this.args[3], 0,
        this.args[2], this.args[3], 0,
        this.args[0], this.args[1], 0,
        this.args[2], this.args[1], 0
    ];

    this.indices = [
        0, 2, 1,
        3, 1, 2
    ];

    this.normals = [
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1
    ];

	this.baseTexCoords = [
		0, 0,
        1, 0,
        0, 1,     
		1, 1,
    ];
	
    this.texCoords = this.baseTexCoords.slice();

    this.primitiveType=this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

/**
* Updates texture scale factors
* @param {scale factor S} S
* @param {scale factor T} T
*/
MyQuad.prototype.updateTex = function(S, T) {

    for (var i = 0; i < this.texCoords.length; i+=2) {
        this.texCoords[i] = this.baseTexCoords[i]/S;
        this.texCoords[i+1] = this.baseTexCoords[i+1]/T;
    }

    this.updateTexCoordsGLBuffers();
};

/**
 * Return type of primitive
 */
MyQuad.prototype.getType = function() {
    return "Quad";
};
