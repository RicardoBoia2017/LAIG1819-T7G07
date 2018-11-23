
/**
 * Animation
 * @constructor
**/
class Animation {
	
	constructor (time)
	{
		this.time = time
		this.finishAnimation = false;
	}

	update (time)
	{}

	apply(scene, matrix)
	{
		scene.multMatrix(matrix);
	}
}