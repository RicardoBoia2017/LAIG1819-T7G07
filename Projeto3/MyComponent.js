

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
	this.lastAnimationType = null;

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

/**
* Pushes animation into array
* @param {animation's id} animationId
*/
MyComponent.prototype.pushAnimation = function (animationId)
{
	if(this.animations.length == 0)
		this.lastAnimationType = this.scene.graph.animations[animationId][0];
	
	let animation =	this.scene.graph.animations[animationId];
	let newAnimation;

	if(animation[0] == "Linear")
		//scene, animations span, controlPoints
		newAnimation = new LinearAnimation(this.scene, animation[1], animation[2]);
	
	else if(animation[0] == "Circular")
		//scene, animation span, center, radius, start angle, rotation angle
		newAnimation = new CircularAnimation(this.scene, animation[1], animation[2], animation[3], animation[4], animation[5]);


	this.animations.push(newAnimation);
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
	//Se não houver animação, a função retorna
	if(this.getAnimationsLenght() == 0 || this.currentAnimation == this.getAnimationsLenght())
		return;

	this.animationTime += timeVariation;
	let previousSectionTime = 0;

	var animation = this.animations[this.currentAnimation];

	//Se a animação acabou, passa para a seguinte
	if(this.animationTime >= animation.time)
	{
		//faz a animação com o tempo total desta de forma a acabar sempre na mesma posição
		animation.update(animation.sectionTime[this.currentSection], this.currentSection);
		mat4.multiply(this.matrixTransf, this.matrixTransf, animation.matrix);		

		//prepara animação seguinte
		this.animationTime = 0;
		this.currentSection = 0;
		this.currentAnimation++;

		//Se não houver mais animações, a função retorna
		if (this.currentAnimation == this.getAnimationsLenght())
			return;

		animation = this.animations[this.currentAnimation];
	}	

	this.lastAnimationType = animation.getType();

	//cálculo do tempo das animações anteriores
	for(let i = 0; i < this.currentSection; i++)
		previousSectionTime += animation.sectionTime[i];
	
	let currentSectionTime = this.animationTime - previousSectionTime;

	//Se o tempo for maior que o tempo total da animação atual, é passado o tempo total da animação
	if(currentSectionTime > animation.sectionTime)
	{
		currentSectionTime = animation.sectionTime;
	}

	if (this.currentAnimation < this.animations.length)
	{
		animation.update(currentSectionTime, this.currentSection);

		//Se a animação não acabou, mas se a uma secção dela sim (LinearAnimation), passa para a secção seguinte
		if (currentSectionTime >= animation.sectionTime[this.currentSection])
			this.currentSection++;
		
	}
}

/**
 * Calls animation function that apply animation matrix to scene
 */
MyComponent.prototype.applyAnimationMatrix = function ()
{
	var animation = this.animations[this.currentAnimation];

	if(animation != null)
		animation.apply();
}
	

