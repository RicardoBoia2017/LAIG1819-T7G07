

class Plane extends CGFobject {

    /**
     * Constructor
     * 
     * @param {Scene} scene 
     * @param {Number of parts U} npartsU 
     * @param {Number of parts V} npartsV 
     */
    constructor(scene, npartsU, npartsV) {
        super(scene);

        var controlPoints =        
         [	// U = 0
            [ // V = 0..1;
                 [-0.5, 0.0, -0.5, 1 ],
                 [0.5, 0.0, -0.5, 1 ]
                
            ],
            // U = 1
            [ // V = 0..1
                 [-0.5, 0.0, 0.5, 1 ],
                 [0.5, 0.0, 0.5, 1 ]							 
            ]
        ];

       this.surface = this.scene.graph.makeSurface(1 , 1, npartsU, npartsV, controlPoints);

    };

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
        return "Plane";
    }
}
