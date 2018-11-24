

/**
 * Constructor
 * 
 * @param {Scene} scene 
 * @param {Component id} id 
 */
function MyComponent (scene, id){
	
	this.scene = scene;
	this.id = id;
	
	this.materials = []
	this.currentMaterial = 0;
	
	this.animations = []
	this.currentAnimation = 0;
	this.animationTime = 0;
	this.currentSection = 0;

	this.textureId = null;
	this.texS = null;
	this.texT = null;
	
	this.childrenComp = [];
	this.childrenPrim = [];
	
	this.matrixTransf = mat4.create();
	mat4.identity(this.matrixTransf);
	
	this.matrixAnimation = mat4.create();
	mat4.identity(this.matrixAnimation);
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

/**
* Pushes animation into array
* @param {animation's id} animationId
*/
MyComponent.prototype.pushAnimation = function (animationId)
{
	this.animations.push(animationId);
}

/**
 * Returns animations array's length
 */
MyComponent.prototype.getAnimationsLenght = function ()
{
	var lenght = this.animations.length;

	return lenght;
}

/**
 * Updates animation matrix
 */
MyComponent.prototype.updateAnimation = function (timeVariation)
{
	this.animationTime += timeVariation;
	let previousSectionTime = 0;
	var animation = this.scene.graph.animations[this.animations[this.currentAnimation]];

	//cálculo do tempo das animações anteriores
	for(let i = 0; i < this.currentSection; i++)
		previousSectionTime += animation.sectionTime[i];
	
	let currentSectionTime = this.animationTime - previousSectionTime;

	//Se o tempo for maior que o tempo total da animação atual, é passado o tempo total da animação
	if(animation != null && currentSectionTime > animation.sectionTime)
		currentSectionTime = animation.sectionTime;

	if (this.currentAnimation < this.animations.length)
	{
		this.matrixAnimation = animation.update(currentSectionTime, this.currentSection);

		//Se a animação acabou, passa para a seguinte
		if(this.animationTime >= animation.time)
		{
			this.animationTime = 0;
			this.currentSection = 0;
			this.currentAnimation++;
		}

		//Se a animação não acabou, mas se a uma secção dela sim (LinearAnimation), passa para a secção seguinte
		else if (currentSectionTime >= animation.sectionTime[this.currentSection])
			this.currentSection++;
		
	}
}

/**
 * Calls animation function that apply animation matrix to scene
 */
MyComponent.prototype.applyAnimationMatrix = function ()
{
	var animation = this.scene.graph.animations[this.animations[this.currentAnimation]];	

	if(animation != null)
		animation.apply(this.matrixAnimation);
	
	else
		this.scene.multMatrix(this.matrixAnimation);
}
	

