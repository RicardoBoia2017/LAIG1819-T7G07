

class Patch extends CGFobject {

    /**
     * Constructor
     * 
     * @param {Scene} scene 
     * @param {Number of points U} npointsU 
     * @param {Number of points V} npointsV 
     * @param {Number of parts U} npartsU 
     * @param {Number of parts V} npartsV 
     * @param {List of control points} controlPoints 
     */
    constructor(scene, npointsU, npointsV, npartsU, npartsV, controlPoints) {
        super(scene);

        this.npointsU = npointsU;
        this.npointsV = npointsV;
        this.controlPoints = controlPoints;

        var degree1 = controlPoints.length/npointsV - 1;
        var degree2 = controlPoints.length/npointsU - 1;

        this.buildControlPoints();

        this.surface = this.scene.graph.makeSurface(degree1, degree2, npartsU, npartsV, this.controlPoints);
    };

    /**
     * Groups control points in smaller arrays
     */
    buildControlPoints()
    {
        let counter = 0;
        let newControlPoints = [];

        for(let i = 0; i < this.controlPoints.length; i += this.npointsV)
        {
            let array = [];

            do
            {
                array.push(this.controlPoints[i + counter]),
                counter++;

            }while(counter < this.npointsV)

            newControlPoints.push(array);
            counter = 0;
        }

        this.controlPoints = newControlPoints;
    }

    /**
     * Displays surface
     */
    display()
    {
        this.surface.display();
    }

    /**
	 * Returns type of primitive
	 */
    getType()
    {
        return "Patch";
    }

}