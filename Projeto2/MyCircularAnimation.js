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

		this.matrixTransf = mat4.create();

		this.totalDistance = 2 * this.radius * Math.PI * (Math.abs(this.rotationAngle - this.initialAngle)/(2 * Math.PI));

		this.angleSpeed = (this.totalDistance/this.time)/this.radius;

		this.sectionTime = [];
		this.sectionTime.push(this.time);

		//console.log(center + " " + radius + " " + this.initialAngle + " " + this.rotationAngle);
	}
	
	/**
	* Computes the Matrix for the Animation
	* @param time Amount of time gone by
	* @return Returns the Matrix for the Animation
	*/
	getMatrix(time)
	{
		if(time >= this.totalTime)
       		this.finishAnimation = true;
    	else 
    	{
			mat4.identity(this.matrixTransf);
			let angleFraction = this.initialAngle + this.angleSpeed * time;

			mat4.translate(this.matrixTransf, this.matrixTransf, [this.center[0], this.center[1], this.center[2] ]);
			mat4.rotate(this.matrixTransf, this.matrixTransf, angleFraction, [0, 1, 0]);
			mat4.translate(this.matrixTransf, this.matrixTransf, [this.radius, 0, 0]);
		//	mat4.rotate(this.matrixTransf, this.matrixTransf, Math.PI/2, [0, 1, 0]);
    	}

		return this.matrixTransf;
	}
} 