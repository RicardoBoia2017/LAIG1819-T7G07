/**
* MyCylinder
* @param {scene} scene
* @param {args} primitive's arguments
* @constructor
*/
function MyCylinder(scene, args) {
  CGFobject.call(this,scene);

  args = args;//.split(" ").map(x => parseInt(x, 10));

  this.height = args[0];
  this.botRadius = args[1];
  this.topRadius = args[2];
  this.stacks = args[3];
  this.slices = args[4];

  this.initBuffers();
};

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;

/**
 * Initializes the buffers
 */
MyCylinder.prototype.initBuffers = function() {

  this.vertices = [];

  this.indices = [];

  this.normals = [];

  this.texCoords = [];

  var theAngleRad = (2*Math.PI)/this.slices;
  this.radiusInc = (this.topRadius-this.botRadius)/this.stacks;
  this.heightInc = this.height/this.stacks;
  var a = 0, b = 0;
  var verticesCounter = 0;
  var indicesCounter = 0;
  var normalsCounter = 0;

  for(var k = 0; k < this.stacks; k++)
  {
    for(var i = 0; i < this.slices; i++)
    {

      this.vertices.push((this.botRadius+(k*this.radiusInc))*Math.cos(i*theAngleRad));
      this.vertices.push((this.botRadius+(k*this.radiusInc))*Math.sin(i*theAngleRad));
      this.vertices.push(k*this.heightInc);

      verticesCounter++;

      this.vertices.push((this.botRadius+(k*this.radiusInc))*Math.cos(i*theAngleRad));
      this.vertices.push((this.botRadius+(k*this.radiusInc))*Math.sin(i*theAngleRad));
      this.vertices.push((k+1)*this.heightInc);
      verticesCounter++;


      //normals

      this.normals.push(Math.cos(i*theAngleRad));
      this.normals.push(Math.sin(i*theAngleRad));
      this.normals.push(0);
      //		normalsCounter++;

      this.normals.push(Math.cos(i*theAngleRad));
      this.normals.push(Math.sin(i*theAngleRad));
      this.normals.push(0);
      //		normalsCounter++;

      this.texCoords.push(a, b);
      this.texCoords.push(a, b + 1.0 / this.stacks);
      a += 1 / this.slices;

    }

    a = 0;
    b += 1 / this.stacks;
  }

  for(var k = 0; k < this.stacks; k++)
  {
    for(var i = 0; i < this.slices; i++)
    {
      if(i == (this.slices-1))
      {
        this.indices.push((this.slices*2*k)+(2*i));
        this.indices.push((this.slices*2*k)+0);
        this.indices.push((this.slices*2*k)+(2*i)+1);
        indicesCounter++;

        this.indices.push((this.slices*2*k)+1);
        this.indices.push((this.slices*2*k)+(2*i)+1);
        this.indices.push((this.slices*2*k)+ 0);
        indicesCounter++;
      }
      else
      {
        this.indices.push((this.slices*2*k)+(2*i));
        this.indices.push((this.slices*2*k)+(2*i)+2);
        this.indices.push((this.slices*2*k)+(2*i)+1);
        indicesCounter++;

        this.indices.push((this.slices*2*k)+(2*i)+3);
        this.indices.push((this.slices*2*k)+(2*i)+1);
        this.indices.push((this.slices*2*k)+(2*i)+2);
        indicesCounter++;
      }
    }
  }

  this.baseTexCoords = this.texCoords.slice();

  this.primitiveType = this.scene.gl.TRIANGLES;
  this.initGLBuffers();
  };
  /**
	* Updates texture scale factors
	* @param {scale factor S} S
	* @param {scale factor T} T
	*/
  MyCylinder.prototype.updateTex = function(S, T) {
	 	  
    for (var i = 0; i < this.texCoords.length; i += 2) {
        this.texCoords[i] = this.baseTexCoords[i] / S;
        this.texCoords[i + 1] = this.baseTexCoords[i + 1] / T;
    }

    this.updateTexCoordsGLBuffers();
};
