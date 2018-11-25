/**
* Circular Animation
* @extends Animation
*/
class CircularAnimation extends Animation {
	/**
	* Circular Animation Constructor
	* @param scene The Scene
	* @param time Number of Seconds of the Animation
	* @param center The Center of the Animation Circle
	* @param radius The Radius of the Animation Circle
	* @param initialAngle The Initial Angle of the Animation
	* @param rotationAngle The Rotation Angle of the Animation
	*/
	constructor(scene, time, center, radius, initialAngle, rotationAngle) {
		super(scene, time);

		this.AuxAngle = Math.PI / 180;

		this.radius = radius;
		this.center = center;

		this.initialAngle = initialAngle * this.AuxAngle;
		this.rotationAngle = rotationAngle * this.AuxAngle;

		this.totalDistance = 2 * this.radius * Math.PI * (this.rotationAngle - this.initialAngle) / (2 * Math.PI);

		this.angleSpeed = (this.totalDistance / this.time) / this.radius;

		this.sectionTime = [];
		this.sectionTime.push(this.time);
	}

	/**
	* Computes the Matrix for the Animation
	* @param time Amount of time gone by
	* @param section Section
	* @return Returns the Matrix for the Animation
	*/
	update(time, section) {
		
		mat4.identity(this.matrix);
		let angleFraction = this.initialAngle + this.angleSpeed * time;

		mat4.translate(this.matrix, this.matrix, [this.center[0], this.center[1], this.center[2]]);
		mat4.rotate(this.matrix, this.matrix, angleFraction, [0, 1, 0]);
		mat4.translate(this.matrix, this.matrix, [this.radius, 0, 0]);

		return this.matrix;
	}

	/**
	 * Returns type of animation
	 */
	getType() {
		return "Circular";
	}
} 