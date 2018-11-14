

class Plane extends CGFobject {

    constructor(scene, npartsU, npartsV) {
        super(scene);
        this.npartsU = npartsU;
        this.npartsV = npartsV;

        this.init();
    };

    init() {

        this.primitiveType = this.scene.gl.TRIANGLES;

        var distanceU = 1 / this.npartsU;
        var distanceV = 1 / this.npartsV;

        var allControlPoints = [];

        for(let i = 0; i <= this.npartsU; i++) 
        {
            var controlPoints = [];

            for(let j = 0; j <= this.npartsV; j++)
                controlPoints.push([distanceV * j - 0.5, 0 , distanceU * i - 0.5, 1]);
            
            allControlPoints.push(controlPoints);
        }    
        
        this.scene.graph.makeSurface('0', this.npartsU, this.npartsV, allControlPoints, [0,0,0]);

    };

}