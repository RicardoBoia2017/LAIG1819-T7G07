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

/**
* Pushes component into array
* @param {component's id} childId
*/
MyComponent.prototype.pushComp = function (childId)
{
	this.childrenComp.push(childId);
}

/**
* Pushes primitive into array
* @param {primitive's id} childId
*/
MyComponent.prototype.pushPrim = function (childId)
{
	this.childrenPrim.push(childId);
}

/**
* Pushes material into array
* @param {material's id} materialId
*/
MyComponent.prototype.pushMaterial = function (materialId)
{
	this.materials.push(materialId);
}
