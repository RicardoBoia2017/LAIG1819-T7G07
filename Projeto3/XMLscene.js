var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
        this.lightValues = {};
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initCameras();
		this.defaultView = 0;
        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
                
        this.counter = 0;

        this.lastUpdate = 0;
        this.waterTimer = 0;
        this.setUpdatePeriod(100);
        
        this.setPickEnabled(true);

        this.objects= [
            new MyQuad(this, [0, 0, 1, 1]),
            new MyQuad(this, [0, 0, 1, 1]),
            new MyQuad(this, [0, 0, 1, 1]),	
            new MyQuad(this, [0, 0, 1, 1]),
            new MyQuad(this, [0, 0, 1, 1]),
            new MyQuad(this, [0, 0, 1, 1]),
            new MyQuad(this, [0, 0, 1, 1]),
            new MyQuad(this, [0, 0, 1, 1]),
            new MyQuad(this, [0, 0, 1, 1]),
            new MyQuad(this, [0, 0, 1, 1]),
            new MyQuad(this, [0, 0, 1, 1]),
            new MyQuad(this, [0, 0, 1, 1]),
            new MyQuad(this, [0, 0, 1, 1]),
            new MyQuad(this, [0, 0, 1, 1]),
            new MyQuad(this, [0, 0, 1, 1]),
            new MyQuad(this, [0, 0, 1, 1]),
            new MyQuad(this, [0, 0, 1, 1]),
            new MyQuad(this, [0, 0, 1, 1]),
            new MyQuad(this, [0, 0, 1, 1]),
            new MyQuad(this, [0, 0, 1, 1]),
            new MyQuad(this, [0, 0, 1, 1]),
            new MyQuad(this, [0, 0, 1, 1]),
            new MyQuad(this, [0, 0, 1, 1]),
            new MyQuad(this, [0, 0, 1, 1]),
            new MyQuad(this, [0, 0, 1, 1])
        ];
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
  }
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                //lights are predefined in cgfscene
                this.lights[i].setPosition(light[1][0], light[1][1], light[1][2], light[1][3]);
                this.lights[i].setAmbient(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setDiffuse(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setSpecular(light[4][0], light[4][1], light[4][2], light[4][3]);
				
				if (light[5] != null)
				{
					this.lights[i].setSpotDirection(light[5][0] - light[1][0], light[5][1] - light[1][1], light[5][2] - light[1][2], light[5][3] - light[1][3])
					this.lights[i].setSpotCutOff (light[6]);
					this.lights[i].setSpotExponent (light[7]);
				}
				
                this.lights[i].setVisible(true);
                if (light[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }

    }
	
    /**
     * Initializes the scene views with the values read from the XML file.
     */
	initViews()
	{
		this.cameras = [];
		for (var key in this.graph.views)
		{	
			if (this.graph.views[key][0] == "perspective") 	
			{
			
				var near = this.graph.views[key][1];	
				var far = this.graph.views[key][2];	
				var fov =  this.graph.views[key][3];
				var from = this.graph.views[key][4];
				var to = this.graph.views[key][5];
				this.cameras[key] = new CGFcamera (fov, near, far, vec3.fromValues(from[0],from[1], from[2]), to);
			}
			
			else
			{
				var near = this.graph.views[key][1];
				var far = this.graph.views[key][2];
				var left = this.graph.views[key][3];
				var right = this.graph.views[key][4];
				var top = this.graph.views[key][5];
				var bottom = this.graph.views[key][6];
				var from = this.graph.views[key][7];
				var to = this.graph.views[key][8];
				this.cameras[key] = new CGFcameraOrtho (left, right, bottom, top, near, far, from, to, [0,1,0]);
			}	
		}
		
	}
	
    /* Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
		
		this.defaultView = this.graph.defaultView;
		this.initViews();
		
		this.camera = this.cameras[this.defaultView];
		this.interface.setActiveCamera(this.camera);
		
        this.axis = new CGFaxis(this, this.graph.referenceLength);

		this.setGlobalAmbientLight (this.graph.ambientSpecs [0], this.graph.ambientSpecs [1], this.graph.ambientSpecs [2], this.graph.ambientSpecs [3]);
		this.gl.clearColor(this.graph.backgroundSpecs[0], this.graph.backgroundSpecs[1], this.graph.backgroundSpecs[2], this.graph.backgroundSpecs[3]);

        this.initLights();
        // Adds lights group.
        this.interface.addLightsGroup(this.graph.lights);
		this.interface.addViewsGroup (this.graph.views);
        this.interface.addScenesGroup();
        
        this.sceneInited = true;
    }

	/**
	* Updates active view to the one selected
	*/
	updateViews()
	{
		if (this.graph.views[this.defaultView][0] == "perspective") 	
		{
			var near = this.graph.views[this.defaultView][1];
			var far = this.graph.views[this.defaultView][2];	
			var fov =  this.graph.views[this.defaultView][3];
			var from = this.graph.views[this.defaultView][4];
			var to = this.graph.views[this.defaultView][5];
			this.camera = new CGFcamera (fov, near, far, from, to);
		}
		
		else
		{
			var near = this.graph.views[this.defaultView][1];
			var far = this.graph.views[this.defaultView][2];
			var left = this.graph.views[this.defaultView][3];
			var right = this.graph.views[this.defaultView][4];
			var top = this.graph.views[this.defaultView][5];
			var bottom = this.graph.views[this.defaultView][6];
			var from = this.graph.views[this.defaultView][7];
			var to = this.graph.views[this.defaultView][8];
			this.camera = new CGFcameraOrtho (left, right, bottom, top, near, far, from, to, [0,1,0]);
		}		
		
		this.interface.setActiveCamera(this.camera);
    }

    logPicking()
	{
		if (this.pickMode == false) {
			
			if (this.pickResults != null && this.pickResults.length > 0) {

				for (var i=0; i< this.pickResults.length; i++) {

					var obj = this.pickResults[i][0];
					if (obj)
					{
						var customId = this.pickResults[i][1];				
						console.log("Picked object: " + obj + ", with pick id " + customId); 
						this.getPrologRequest("handshake", this.handleReply);
					}
				}
				this.pickResults.splice(0,this.pickResults.length);
			}		
		}

	}

    getPrologRequest(requestString, onSuccess, onError, port)
	{
		var requestPort = port || 8081
		var request = new XMLHttpRequest();
		request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

		request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
		request.onerror = onError || function(){console.log("Error waiting for response");};

		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		request.send();
	}
	
	//Handle the Reply
	handleReply(data){
		let reply = data.target.response;
		if(reply == "handshake")
			console.log("handshake back");
    }
    
    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        if (this.sceneInited) {
            // Draw axis
            this.axis.display();
            var i = 0;

            for (var key in this.lightValues) {
                if (this.lightValues.hasOwnProperty(key)) {
                    if (this.lightValues[key] == 1) {
                        this.lights[i].setVisible(true);
                        this.lights[i].enable();
                    }
                    else {
                        this.lights[i].setVisible(false);
                        this.lights[i].disable();
                    }
                    this.lights[i].update();
                    i++;
                }
            }
		if (this.defaultView != this.lastView) 
			this.updateViews();

		this.lastView = this.defaultView

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        }
        else {
            // Draw axis
            this.axis.display();
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
	
	update(currentTime)
	{
        if(this.lastUpdate == 0)
            this.lastUpdate = currentTime;

        for (var key in this.graph.components)
        {          
            if(this.graph.components[key].getAnimationsLenght() > 0)
                this.graph.components[key].updateAnimation((currentTime - this.lastUpdate)/1000);    
        }

        this.waterTimer += 0.05 * (currentTime - this.lastUpdate)/1000;
        this.counter += (currentTime - this.lastUpdate)/1000;

        this.lastUpdate = currentTime;

	}
}