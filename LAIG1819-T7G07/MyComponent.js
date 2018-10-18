/**
 * MyComponent
 * @constructor
**/

function MyComponent (scene, id){
	
	this.scene = scene;
	this.id = id;
	
	this.materials = []
	this.currentMaterial = 0;
	
	this.textureId = null;
	this.texS = null;
	this.texT = null;
	
	this.childrenComp = [];
	this.childrenPrim = [];
	
	this.matrixTransf = mat4.create();
	mat4.identity(this.matrixTransf);
}

//TODO Pode ser preciso diferenciar primitivas e components nos childs
MyComponent.prototype.pushComp = function (childId)
{
	this.childrenComp.push(childId);
}

MyComponent.prototype.pushPrim = function (childId)
{
	this.childrenPrim.push(childId);
}

MyComponent.prototype.pushMaterial = function (materialId)
{
	this.materials.push(materialId);
}
