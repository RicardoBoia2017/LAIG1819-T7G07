/**
* MyCylinder2
*/
class MyCylinder2 extends CGFobject{

  constructor(scene, botRadius, topRadius, height, slices, stacks) {
        super(scene);

  this.height = height;
  this.botRadius = botRadius;
  this.topRadius = topRadius;
  this.npartsU = slices;
  this.npartsV = stacks;

  this.controlPoints = [];

  this.buildControlPoints();

  this.scene.graph.makeSurface('2', 8 , 1, this.npartsU, this.npartsV, this.controlPoints, [0,0,0]);

};


    buildControlPoints()
    {
            this.controlPoints =        
            [	// U = 0
                [ // V = 0..1;
                 [this.botRadius, 0, 0, 1 ],
                 [this.topRadius, this.height, 0, 1 ]
                
                ],
                // U = 1
                [ // V = 0..1
                 [0, 0, 0, 0.707],
                 [0, this.height, 0, 0.707]							 
                ],
                // U = 2
                [ // V = 0..1;
                 [0, 0, this.botRadius, 1 ],
                 [0, this.height, this.topRadius, 1 ]
                
                ],
                // U = 3
                [ // V = 0..1
                 [0, 0, 2*this.botRadius, 0.707],
                 [0, this.height, 2*this.topRadius, 0.707]							 
                ],
                // U = 4
                [ // V = 0..1;
                 [this.botRadius, 0, 2*this.botRadius, 1 ],
                 [this.topRadius, this.height, 2*this.topRadius, 1 ]
                
                ],
                // U = 5
                [ // V = 0..1
                 [2*this.botRadius, 0, 2*this.botRadius, 0.707],
                 [2*this.topRadius, this.height, 2*this.topRadius, 0.707]							 
                ],
                // U = 6
                [ // V = 0..1;
                 [2*this.botRadius, 0, this.botRadius, 1 ],
                 [2*this.topRadius, this.height, this.topRadius, 1 ]
                
                ],
                // U = 7
                [ // V = 0..1
                 [2*this.botRadius, 0, 0, 0.707],
                 [2*this.topRadius, this.height, 0, 0.707]							 
                ],
                // U = 8
                [ // V = 0..1
                 [this.botRadius, 0, 0, 1],
                 [this.topRadius, this.height, 0, 1]							 
                ]
            ];
   
     }
}
