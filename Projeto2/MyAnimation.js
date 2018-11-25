
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
		this.matrix = mat4.create();
		mat4.identity(this.matrix);
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
	 */
	apply()
	{
		this.scene.multMatrix(this.matrix);
	}
}