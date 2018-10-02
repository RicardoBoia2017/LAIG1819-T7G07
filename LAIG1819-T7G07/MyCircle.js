/**
 * MyCircle
 * @constructor
 */
function MyCircle(scene, radius, slices) 
{
    CGFobject.call(this, scene);

    this.radius = radius;// || 1;
    this.slices = slices;// || 8; 

    this.initBuffers();
};

MyCircle.prototype = Object.create(CGFobject.prototype);
MyCircle.prototype.constructor = MyCircle;

MyCircle.prototype.initBuffers = function() 
{
    this.vertices = [];
    this.texCoords = [];
    this.normals = [];
    this.indices = [];
    
    const theAngle = ((Math.PI * 2) / this.slices);
    var theCos;
    var theSin;

    for (i = 0; i < this.slices; i++) 
    {
        theCos = Math.cos(theAngle * i);
        theSin = Math.sin(theAngle * i);
        this.vertices.push(this.radius * theCos, this.radius * theSin, 0);
        this.texCoords.push(0.5 + (0.5 * theCos), 0.5 - (0.5 * theSin));
        this.normals.push(0, 0, 1);
    }

    //Agora falta adicionar o Vertice central
    this.vertices.push(0, 0, 0);
    this.normals.push(0, 0, 1);
    this.texCoords.push(0.5, 0.5);


    var theIndex = 0;

    for (i = 0; i < this.slices; i++) 
    {
        if (theIndex == this.slices - 1) 
        {
            this.indices.push(theIndex, 0, this.slices);
            break;
        } 
        else 
        {
            this.indices.push(theIndex, theIndex + 1, this.slices);
        }
        theIndex++;
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};