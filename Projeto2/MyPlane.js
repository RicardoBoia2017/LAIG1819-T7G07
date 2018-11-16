

class Plane extends CGFobject {

    constructor(scene, npartsU, npartsV) {
        super(scene);
        this.npartsU = npartsU;
        this.npartsV = npartsV;

       this.scene.graph.makeSurface('0', 1 , 1, this.npartsU, this.npartsV, 
        [	// U = 0
            [ // V = 0..1;
                 [-1.0, 0.0, -1.0, 1 ],
                 [1.0, 0.0, -1.0, 1 ]
                
            ],
            // U = 1
            [ // V = 0..1
                 [-1.0, 0.0, 1.0, 1 ],
                 [1.0, 0.0, 1.0, 1 ]							 
            ]
        ],
        [0,0,0]);

    };

}