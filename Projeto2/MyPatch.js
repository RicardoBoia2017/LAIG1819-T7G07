

class Patch extends CGFobject {

    constructor(scene, npointsU, npointsV, npartsU, npartsV, controlPoints) {
        super(scene);
        this.npointsU = npointsU;     
        this.npointsV = npointsV;
        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.controlPoints = controlPoints;

        this.init();
    };

    init()
    {

    }
}