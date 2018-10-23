

class LinearAnimation  extends Animation
{
	constructor (scene, id, time, controlPoints)
	{
		
		super(scene, id, time);
		this.controlPoints = controlPoints;
	    this.matrixTransf = mat4.create();
		//this.end = false;
	}

	init ()
	{
	
		var totalDistance = 0;
		this.movValues = [];
		this.sectionTime = [];
		
		for (let i = 0; i < this.controlPoints.lenght - 1; i++)
		{
			let controlPoint = this.controlPoints[i];
			let nextControlPoint = this.controlPoints[i+1];
			
			let distance = Math.sqrt (
						  (nextControlPoint[0] - controlPoint[0])* (nextControlPoint[0] - controlPoint[0]) +
						  (nextControlPoint[1] - controlPoint[1])* (nextControlPoint[1] - controlPoint[1]) +
						  (nextControlPoint[2] - controlPoint[2])* (nextControlPoint[2] - controlPoint[2]));
						  
			totalDistance += distance;
			  
		}	
		
		var speed = totalDistance/ this.time;
		
		for (let i = 0; i < this.controlPoints.lenght - 1; i++)
		{
			let controlPoint = this.controlPoints[i];
			let nextControlPoint = this.controlPoints[i+1];
			
			let distance = Math.sqrt (
						  (nextControlPoint[0] - controlPoint[0])* (nextControlPoint[0] - controlPoint[0]) +
						  (nextControlPoint[1] - controlPoint[1])* (nextControlPoint[1] - controlPoint[1]) +
						  (nextControlPoint[2] - controlPoint[2])* (nextControlPoint[2] - controlPoint[2]));

			let sinAngle = (nextControlPoint[2] - controlPoint[2])/distance; 						  
			let cosAngle = (nextControlPoint[0] - controlPoint[0])/distance; 
			
			let dy = 0;

			if (nextControlPoint[1] != controlPoint[1])
				dy = (nextControlPoint[1] - controlPoint[1])/Math.abs(nextControlPoint[1] - controlPoint[1]);
			
			let vx = speed * cosAngle;
			let vz = speed * sinAngle;
			
			//Pode precisar do round
//			let vy = Math.sqrt(Math.round((speed * speed - vx*vx - vz*vz)*1000)/1000)*dy;
			let vy = Math.sqrt(speed * speed - vx*vx - vz*vz)*dy;
			
			let angle = Math.asin(sinAngle);
			
			this.movValues.push ( [vx,vy,vz,angle] );
			this.sectionTime.push (distance/speed);
			
		}
		
		
	}
	
	getMatrix(time, section)	
	{
		let previousSectionTime = 0;
		for (let i = 0; i < section; i++)
			previousSectionTime += this.sectionTime [i];
		
		let currentSectionTime = time - previousSectionTime;
		
		if (section < sectionTime.lenght - 1)
		{
			mat4.identity(this.matrixTransf);
	
			let dx = currentSectionTime * movValues[section][0];
			let dy = currentSectionTime * movValues[section][1];
			let dz = currentSectionTime * movValues[section][2];	

			let currentX = dx + this.controlPoints[section][0];
			let currentY = dy + this.controlPoints[section][1];
			let currentZ = dz + this.controlPoints[section][2];
			
			mat4.translate(this.transformMatrix, this.transformMatrix, [currentX, currentY, currentZ]);			
			mat4.rotate(this.matrixTransf, this.matrixTransf, this.movValues[section][3], [0, 1, 0]);
		}
//		else
//			this.end = true;
	}
}