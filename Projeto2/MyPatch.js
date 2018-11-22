

class Patch extends CGFobject {

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

    display()
    {
        this.surface.display();
    }
}