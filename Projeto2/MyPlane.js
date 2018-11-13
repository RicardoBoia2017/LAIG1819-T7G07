

class Plane extends CGFobject {

    constructor(scene, divU, divV) {
        super(scene);
        this.divU = divU;
        this.divV = divV;

        this.surface = null;

        this.init();
    };

    init() {

        this.primitiveType = this.scene.gl.TRIANGLES;

        var distanceU = 1 / this.divU;
        var distanceV = 1 / this.divV;

        var allControlPoints = [];

        for(let i = 0; i <= this.divU; i++) 
        {
            var controlPoints = [];

            for(let j = 0; j <= this.divV; j++)
                controlPoints.push([distanceV * j - 0.5, 0 , distanceU * i - 0.5, 1]);
            
            allControlPoints.push(controlPoints);
        }    
        
        this.scene.graph.makeSurface('0', this.divU, this.divV, allControlPoints, [0,0,0]);

    };

}