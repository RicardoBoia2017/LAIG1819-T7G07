/**
 * MyComponent
 * @constructor
**/

function MyComponent (scene, id){
	
	this.scene = scene;
	this.id = id;
	
	this.material = null;
	
	this.textureId = null;
	this.texS = null;
	this.texT = null;
	
	this.children = [];
	
	this.matrixTransf = mat4.create();
	mat4.identity(this.matrixTransf);
}

//TODO Pode ser preciso diferenciar primitivas e components nos childs
MyComponent.prototype.pushChild = function (childId)
{
	this.children.push(childId);
}
