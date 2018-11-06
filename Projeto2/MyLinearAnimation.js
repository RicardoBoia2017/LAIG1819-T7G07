
/**
 * LinearAnimation
 * @constructor
**/
class LinearAnimation extends Animation {
	constructor(scene, time, controlPoints) {
		super(scene, time);
		this.controlPoints = controlPoints;
		this.matrixTransf = mat4.create();
		this.finished = false;
		this.movValues = [];

		this.init();
	}

	init() {

		var totalDistance = 0;
		this.sectionTime = [];

		console.log("Hello");
		console.log(this.controlPoints);

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
			//			let vy = Math.sqrt(Math.round((speed * speed - vx*vx - vz*vz)*1000)/1000)*dy;
			let vy = Math.sqrt(speed * speed - vx * vx - vz * vz) * dy;

			let angle = Math.asin(sinAngle);

			this.movValues.push([vx, vy, vz, angle]);
			this.sectionTime.push(distance / speed);

		}


	}

	pushControlPoint (controlPoint) 
	{
		this.controlPoints.push(controlPoint);
	}

	getMatrix(time, section) {
		let previousSectionTime = 0;

		for (let i = 0; i < section; i++)
			previousSectionTime += this.sectionTime[i];

			//ERRO
		var currentSectionTime = time - previousSectionTime;

	//	console.log(section);

		if(section >= this.controlPoints.length - 1)
			this.finished = true;


		else {

			mat4.identity(this.matrixTransf);
			
			console.log(currentSectionTime);

			let dx = currentSectionTime * this.movValues[section][0];
			let dy = currentSectionTime * this.movValues[section][1];
			let dz = currentSectionTime * this.movValues[section][2];


			let currentX = dx + this.controlPoints[section][0];
			let currentY = dy + this.controlPoints[section][1];
			let currentZ = dz + this.controlPoints[section][2];


			mat4.translate(this.matrixTransf, this.matrixTransf, [currentX, currentY, currentZ]); 
			mat4.rotate(this.matrixTransf, this.matrixTransf, this.movValues[section][3], [0, 1, 0]);
		
		}

		return this.matrixTransf;
	}
}