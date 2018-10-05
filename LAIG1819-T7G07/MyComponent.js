/**
 * MyComponent
 * @constructor
**/

function MyComponent (scene)	{
	
	this.scene = scene

	this.matrixTransf = mat4.create();
	mat4.identity(this.matrixTransf);
}

