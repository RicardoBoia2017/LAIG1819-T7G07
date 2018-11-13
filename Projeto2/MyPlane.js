

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

        this.scene.graph.makeSurface('0', 1, 1,
            [	// U = 0
                [ // V = 0..1;
                    [-0.5, 0.0, -0.5, 1],
                    [0.5, 0.0, -0.5, 1]

                ],
                // U = 1
                [ // V = 0..1
                    [-0.5, 0.0, 0.5, 1],
                    [0.5, 0.0, 0.5, 1]
                ]
            ],
            [0, 0, 0]);

    };

}