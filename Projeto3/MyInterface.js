/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application); 
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)
		
		this.activeKeys={}; 
		
        return true;
    }

	addScenesGroup()
	{
		var group = this.gui.addFolder("Scenes");
		group.open();

		this.gui.add(this.scene.graph, 'root', ['gym', 'lan'] ).name("Scenes");
	}

    /**
     * Adds a folder containing the IDs of the lights passed as parameter.
     * @param {array} lights
     */
    addLightsGroup(lights) {

        var group = this.gui.addFolder("Lights");
        group.open();

        // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
        // e.g. this.option1=true; this.option2=false;

        for (var key in lights) {
            if (lights.hasOwnProperty(key)) {
                this.scene.lightValues[key] = lights[key][0];
                group.add(this.scene.lightValues, key);
            }
        }
    }

	/**
	* Adds a folder containing a combo box with the views passed as parameter 
	* @param {array} views
	*/
	addViewsGroup(views) {
	
		var group = this.gui.addFolder("Views");
		
        group.open();
		
		var viewsIds = [];
		
		for (var key in views)
			viewsIds.push(key);
		

		this.gui.add(this.scene, 'defaultView', viewsIds ).name("Views");
		this.gui.add(this.scene, 'moveCamera');		
	}
	
	/**
	 * Adds folder with menu options
	 */
	addMenu() {

	    this.hvh  = this.gui.addFolder("Human vs Human");
		this.hvh.open();	
		this.gui.add(this.scene, 'HvH');
		
		this.hvc = this.gui.addFolder("Human vs Computer");
		this.hvc.open();	

		this.gui.add(this.scene, 'HvC_Easy');
		this.gui.add(this.scene, 'HvC_Hard');

		this.cvc = this.gui.addFolder("Computer vs Computer");
		this.cvc.open();	

		this.gui.add(this.scene, 'CvC_Easy');
		this.gui.add(this.scene, 'CvC_Hard');

		this.gameOptions = this.gui.addFolder("Game Options");
		this.gameOptions.open();
		this.gui.add(this.scene, 'turnTime', 10, 120);
		this.gui.add(this.scene, 'resetScore');
	}
	
	/**
	* Event handler called when the user types a key
	* @param {event} event
	*/
	processKeyboard(event) {
		super.processKeyboard(event);
	}

	/**
	* Event handler called when the user presses down a key
	* @param {event} event
	*/
	processKeyDown(event) {
		this.activeKeys[event.code]=true;
	};
	
	/**
	* Event handler called when the user releases a key
	* @param {event} event
	*/
	processKeyUp(event) {
		this.activeKeys[event.code]=false;
	};
	
	/**
	* Checks if key is pressed
	* {keyCode} key being pressed's code
	*/
	isKeyPressed (keyCode){
		return this.activeKeys [keyCode];	
	}
	
	
}