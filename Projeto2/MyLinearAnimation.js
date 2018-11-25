
/**
* Linear Animation
* @extends Animation
*/
class LinearAnimation extends Animation {

	/**
	 * Linear animations constructor
	 * @param {Scene} scene 
	 * @param {Total time needed to complete animation} time 
	 * @param {List of control points} controlPoints 
	 */
	constructor(scene, time, controlPoints) {
		super(scene, time);
		this.controlPoints = controlPoints;
		this.movValues = [];

		this.init();
	}

	/**
	 * Calculates velocity vectors and angle of each section of the animation
	 */
	init() {

		var totalDistance = 0;
		this.sectionTime = [];

		for (let i = 0; i < this.controlPoints.length - 1; i++) {
			let controlPoint = this.controlPoints[i];
			let nextControlPoint = this.controlPoints[i + 1];

			let distance = Math.sqrt(
				(nextControlPoint[0] - controlPoint[0]) * (nextControlPoint[0] - controlPoint[0]) +
				(nextControlPoint[1] - controlPoint[1]) * (nextControlPoint[1] - controlPoint[1]) +
				(nextControlPoint[2] - controlPoint[2]) * (nextControlPoint[2] - controlPoint[2]));

			totalDistance += distance;

		}

		var speed = totalDistance / this.time;

		for (let i = 0; i < this.controlPoints.length - 1; i++) {
			let controlPoint = this.controlPoints[i];
			let nextControlPoint = this.controlPoints[i + 1];

			let distance = Math.sqrt(
				(nextControlPoint[0] - controlPoint[0]) * (nextControlPoint[0] - controlPoint[0]) +
				(nextControlPoint[1] - controlPoint[1]) * (nextControlPoint[1] - controlPoint[1]) +
				(nextControlPoint[2] - controlPoint[2]) * (nextControlPoint[2] - controlPoint[2]));

			let sinAngle = (nextControlPoint[2] - controlPoint[2]) / distance;
			let cosAngle = (nextControlPoint[0] - controlPoint[0]) / distance;

			let dy = 0;

			if (nextControlPoint[1] != controlPoint[1])
				dy = (nextControlPoint[1] - controlPoint[1]) / Math.abs(nextControlPoint[1] - controlPoint[1]);

			let vx = speed * cosAngle;
			let vz = speed * sinAngle;

			//Pode precisar do round
			//let vy = Math.sqrt(Math.round((speed * speed - vx*vx - vz*vz)*1000)/1000)*dy;
			let vy = Math.sqrt(speed * speed - vx * vx - vz * vz) * dy;

			let angle = Math.asin(sinAngle);

			this.movValues.push([vx, vy, vz, angle]);
			this.sectionTime.push(distance / speed);

		}
	}

	/**
	 * Pushes a control point to the array
	 * 
	 * @param {Control Point} controlPoint 
	 */
	pushControlPoint(controlPoint) {
		this.controlPoints.push(controlPoint);
	}

	/**
	 * Updates animation matrix according to current time and section
	 * 
	 * @param {Current time} time 
	 * @param {Current section} section 
	 */
	update(time, section) {

		mat4.identity(this.matrix);

		//movimento a ser realizado tendo em conta a percentagem de secção que já foi realizada
		let dx = time * this.movValues[section][0];
		let dy = time * this.movValues[section][1];
		let dz = time * this.movValues[section][2];

		//posição do objeto é a posição inicial mais o movimento
		let currentX = dx + this.controlPoints[section][0];
		let currentY = dy + this.controlPoints[section][1];
		let currentZ = dz + this.controlPoints[section][2];

		mat4.translate(this.matrix, this.matrix, [currentX, currentY, currentZ]);
		mat4.rotate(this.matrix, this.matrix, this.movValues[section][3], [0, 1, 0]);

		return this.matrix;
	}

	/**
	 * Returns type of animation
	 */
	getType() {
		return "Linear";
	}
}