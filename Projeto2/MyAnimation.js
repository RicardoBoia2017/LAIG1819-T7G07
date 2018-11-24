
/**
 * Animation super class
 * @constructor
**/
class Animation {
	
	/**
	 * 
	 * @param {Total time needed to complete animation} time 
	 * @param {Scene} scene
	 */
	constructor (scene, time)
	{
		this.scene = scene;
		this.time = time
		this.finishAnimation = false;
	}

	/**
	 * Abstract class. Updates animation matrix according to current time
	 * 
	 * @param {Current time} time 
	 * @param {Section} section
	 */
	update (time, section)
	{}

	/**
	 * Applies animation matrix to scene
	 * 
	 * @param {Animation matrix} matrix 
	 */
	apply(matrix)
	{
		this.scene.multMatrix(matrix);
	}
}