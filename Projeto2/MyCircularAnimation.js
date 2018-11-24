/**
* Circular Animation
* @extends Animation
*/
class CircularAnimation extends Animation
{
	/**
	* Circular Animation Constructor
	* @param scene The Scene
	* @param time Number of Seconds of the Animation
	* @param center The Center of the Animation Circle
	* @param radius The Radius of the Animation Circle
	* @param initialAngle The Initial Angle of the Animation
	* @param rotationAngle The Rotation Angle of the Animation
	*/
	constructor (scene, time, center, radius, initialAngle, rotationAngle) {
		super(scene, time);

		this.AuxAngle = Math.PI/180;

		this.radius = radius;
		this.center = center;

		this.initialAngle = initialAngle * this.AuxAngle;
		this.rotationAngle = rotationAngle * this.AuxAngle;

		this.totalDistance = 2 * this.radius * Math.PI * (this.rotationAngle - this.initialAngle)/(2 * Math.PI);

		this.angleSpeed = (this.totalDistance/this.time)/this.radius;

		this.sectionTime = [];
		this.sectionTime.push(this.time);
	}
	
	/**
	* Computes the Matrix for the Animation
	* @param time Amount of time gone by
	* @return Returns the Matrix for the Animation
	*/
	update(time, section)
	{
//		if(time >= this.totalTime)
//			this.finishAnimation = true;
			
//    	else 
//    	{
			var matrixTransf = mat4.create();
			mat4.identity(matrixTransf);
			let angleFraction = this.initialAngle + this.angleSpeed * time;

			mat4.translate(matrixTransf, matrixTransf, [this.center[0], this.center[1], this.center[2]]);
			mat4.rotate(matrixTransf, matrixTransf, angleFraction, [0, 1, 0]);
			mat4.translate(matrixTransf, matrixTransf, [0, 0, this.radius]);
//    	}
//			if (this.rotationAngle > 0) mat4.rotate(matrixTransf, matrixTransf, Math.PI, [0, 1, 0]); //se o ângulo for maior do que 0, rodar 180º para rodar para z negativo


		return matrixTransf;
	}

	/**
	 * Returns type of animation
	 */
	getType()
	{
		return "Circular";
	}
} 