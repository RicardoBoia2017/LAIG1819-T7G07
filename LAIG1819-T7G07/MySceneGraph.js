var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSF_INDEX = 6;
var PRIMITIVE_INDEX = 7;
var COMPONENTS_INDEX = 8;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null;                    // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */

        this.reader.open('scenes/' + filename, this);
    }


    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "yas")
            return "root tag <yas> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order");

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <ambient>
        if ((index = nodeNames.indexOf("ambient")) == -1)
            return "tag <ambient> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");

            //Parse ambient block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }

        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSF_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransf(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVE_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
    }


    /**
     * Parses the <scene> block.
     *  @param {scene block element} sceneNode
     */
    parseScene(sceneNode) 
    {		 
		this.root = "root";
		this.axis_length = 1;

		this.root = this.reader.getString(sceneNode,'root');
		this.axis_length = this.reader.getFloat(sceneNode, 'axis_length');
			
		if (this.root == null) {
            this.root = "root";
            this.onXMLMinorError("unable to parse value for root; assuming 'root = root'");
        }
		
        else if (!(this.axis_length != null && !isNaN(this.axis_length))) {
            this.axis_length = 1;
            this.onXMLMinorError("unable to parse value for axis_length; assuming 'axis_length = 1'");
        }
		
        this.log("Parsed scene node");
	
        return null;
    }


    /**
     * Parses the <views> block.
     */
    parseViews(viewsNode) {

		this.views = [];
	
		var children = viewsNode.children;
		
		var nodeNames = [];

		for (var i = 0; i < children.length; i++)
			nodeNames.push(children[i].nodeName);
	
		for (var j = 0; j < nodeNames.length; j++)
		{
			if (nodeNames[j] == "perspective")
			{
				//id
				var id;
				id = this.reader.getString(children[j], 'id');
				
				if (id == null) { // acrescentar conversão para o default
					this.onXMLMinorError("unable to parse value for id");
				}
				
				//near
				var near;
				near = this.reader.getFloat(children[j], 'near');
				
				if (near == null ) {
					near = 0.1;
					this.onXMLMinorError("unable to parse value for near plane; assuming 'near = 0.1'");
				}
				
				else if (isNaN(near)) {
					near = 0.1;
					this.onXMLMinorError("non-numeric value found for near plane; assuming 'near = 0.1'");
				}
				
				else if (near <= 0) {
					near = 0.1;
					this.onXMLMinorError("'near' must be positive; assuming 'near = 0.1'");
				}	

				//far
				var far;
				far = this.reader.getFloat(children[j], 'far');
				
				if (far == null ) {
					far = 500;
					this.onXMLMinorError("unable to parse value for far plane; assuming 'far = 500'");
				}
				
				else if (isNaN(far)) {
					far = 500;
					this.onXMLMinorError("non-numeric value found for far plane; assuming 'far = 500'");
				}
				
				if (near >= far)
					return "'near' must be smaller than 'far'";	
				
				//angle
				var angle;
				angle = this.reader.getFloat(children[j], 'angle');
				
				if (angle == null ) {
					angle = 0;
					this.onXMLMinorError("unable to parse value for angle plane; assuming 'angle = 500'");
				}
				
				else if (isNaN(angle)) {
					angle = 0;
					this.onXMLMinorError("non-numeric value found for angle plane; assuming 'angle = 500'");
				}				
				
				//specifications of view				
				var viewSpecs = children[j].children;
				
				var from = [];
				var to = [];
				
				for (var k = 0; k < viewSpecs.length; k++)
				{
					//from
					if (viewSpecs[k].nodeName == "from")
					{
						var fromX = this.reader.getFloat (viewSpecs[k], 'x');
						var fromY = this.reader.getFloat (viewSpecs[k], 'y');
						var fromZ = this.reader.getFloat (viewSpecs[k], 'z');
									
						if (fromX == null ) {
							fromX = 0.1;
							this.onXMLMinorError("unable to parse value for near plane; assuming 'fromX = 0.1'");
						}
						
						else if (isNaN(fromX)) {
							fromX = 0.1;
							this.onXMLMinorError("non-numeric value found for near plane; assuming 'fromX = 0.1'");
						}
						
						if (fromY == null ) {
							fromY = 0.1;
							this.onXMLMinorError("unable to parse value for near plane; assuming 'fromY = 0.1'");
						}
						
						else if (isNaN(fromY)) {
							fromY = 0.1;
							this.onXMLMinorError("non-numeric value found for near plane; assuming 'fromY = 0.1'");
						}	
						
						if (fromZ == null ) {
							fromZ = 0.1;
							this.onXMLMinorError("unable to parse value for near plane; assuming 'fromZ = 0.1'");
						}
						
						else if (isNaN(fromZ)) {
							fromZ = 0.1;
							this.onXMLMinorError("non-numeric value found for near plane; assuming 'fromZ = 0.1'");
						}			

						from.push (fromX);
						from.push (fromY);
						from.push (fromZ);
					}
					//to
					else if (viewSpecs[k].nodeName == "to")
					{
						var toX = this.reader.getFloat (viewSpecs[k], 'x');
						var toY = this.reader.getFloat (viewSpecs[k], 'y');
						var toZ = this.reader.getFloat (viewSpecs[k], 'z');
									
						if (toX == null ) {
							toX = 20;
							this.onXMLMinorError("unable to parse value for near plane; assuming 'toX = 20'");
						}
						
						else if (isNaN(toX)) {
							toX = 20;
							this.onXMLMinorError("non-numeric value found for near plane; assuming 'toX = 20'");
						}
						
						if (toY == null ) {
							toY = 20;
							this.onXMLMinorError("unable to parse value for near plane; assuming 'toY = 20'");
						}
						
						else if (isNaN(toY)) {
							toY = 20;
							this.onXMLMinorError("non-numeric value found for near plane; assuming 'toY = 20'");
						}	
						
						if (toZ == null ) {
							toZ = 20;
							this.onXMLMinorError("unable to parse value for near plane; assuming 'toZ = 20'");
						}
						
						else if (isNaN(toZ)) {
							toZ = 20;
							this.onXMLMinorError("non-numeric value found for near plane; assuming 'toZ = 20'");
						}	
						
						to.push (toX);
						to.push (toY);
						to.push (toZ);						
					}
					
				}
				
				this.views[id] = ["perspective", near, far, angle, from, to];
			}	
			
			
			else if (nodeNames[j] == "ortho")
			{
			
			}
			
		}
		
        this.log("Parsed views");

        return null;
    }

    /**
     * Parses the <ambient> block.
     * @param {ambient block element} ambientNode
     */
    parseAmbient(ambientNode) {

		var children = ambientNode.children;
		var nodeNames = [];
		
		for (var i = 0; i < children.length; i++)
			nodeNames.push(children[i].nodeName);
		
		//ambient
		this.ambientSpecs = [];
		var ambientIndex = nodeNames.indexOf("ambient");
		
		if (ambientIndex == -1)
            this.onXMLMinorError("unable to parse ambient component of ambient; assuming ambient = [0.2,0.2,0.2,1]");
		
		//r (red)
		var r = this.reader.getFloat(children[ambientIndex], 'r');
		
		if (!(r != null && !isNaN(r)))
		{
			r = 0.2;
            this.onXMLMinorError("unable to parse red component of ambient; assuming r = 0.2");	
		}			
		
		else if (r < 0 || r > 1)
		{
			r = 0.2;
            this.onXMLMinorError("red component value of ambient must be between 0 and 1");				
		}
			
		this.ambientSpecs [0] = r;

		//g (green)
		var g = this.reader.getFloat(children[ambientIndex], 'g');
		
		if (!(g != null && !isNaN(g)))
		{
			r = 0.2;
            this.onXMLMinorError("unable to parse green component of ambient; assuming g = 0.2");	
		}			
		
		else if (g < 0 || g > 1)
		{
			r = 0.2;
            this.onXMLMinorError("green component value of ambient must be between 0 and 1");				
		}
			
		this.ambientSpecs [1] = g;		
		
		//b (blue)
		var b = this.reader.getFloat(children[ambientIndex], 'b');
		
		if (!(b != null && !isNaN(b)))
		{
			b = 0.2;
            this.onXMLMinorError("unable to parse blue component of ambient; assuming b = 0.2");	
		}			
		
		else if (b < 0 || b > 1)
		{
			b = 0.2;
            this.onXMLMinorError("blue component value of ambient must be between 0 and 1");				
		}
			
		this.ambientSpecs [2] = b;
		
		//a (alpha)
		var a = this.reader.getFloat(children[ambientIndex], 'a');
		
		if (!(a != null && !isNaN(a)))
		{
			a = 0.2;
            this.onXMLMinorError("unable to parse alpha component of ambient; assuming a = 0.2");	
		}			
		
		else if (a < 0 || a > 1)
		{
			a = 0.2;
            this.onXMLMinorError("alpha component value of ambient must be between 0 and 1");				
		}
			
		this.ambientSpecs [3] = a;
		
		//background
		this.backgroundSpecs = [];
		var backgroundIndex = nodeNames.indexOf("background");
		
		if (backgroundIndex == -1)
            this.onXMLMinorError("unable to parse background component of background; assuming background = [0.2,0.2,0.2,1]");
		
		//r (red)
		var r = this.reader.getFloat(children[backgroundIndex], 'r');
		
		if (!(r != null && !isNaN(r)))
		{
			r = 0.2;
            this.onXMLMinorError("unable to parse red component of background; assuming r = 0.2");	
		}			
		
		else if (r < 0 || r > 1)
		{
			r = 0.2;
            this.onXMLMinorError("red component value of background must be between 0 and 1");				
		}
			
		this.backgroundSpecs [0] = r;

		//g (green)
		var g = this.reader.getFloat(children[backgroundIndex], 'g');
		
		if (!(g != null && !isNaN(g)))
		{
			r = 0.2;
            this.onXMLMinorError("unable to parse green component of background; assuming g = 0.2");	
		}			
		
		else if (g < 0 || g > 1)
		{
			r = 0.2;
            this.onXMLMinorError("green component value of background must be between 0 and 1");				
		}
			
		this.backgroundSpecs [1] = g;		
		
		//b (blue)
		var b = this.reader.getFloat(children[backgroundIndex], 'b');
		
		if (!(b != null && !isNaN(b)))
		{
			b = 0.2;
            this.onXMLMinorError("unable to parse blue component of background; assuming b = 0.2");	
		}			
		
		else if (b < 0 || b > 1)
		{
			b = 0.2;
            this.onXMLMinorError("blue component value of background must be between 0 and 1");				
		}
			
		this.backgroundSpecs [2] = b;
		
		//a (alpha)
		var a = this.reader.getFloat(children[backgroundIndex], 'a');
		
		if (!(a != null && !isNaN(a)))
		{
			a = 0.2;
            this.onXMLMinorError("unable to parse alpha component of background; assuming a = 0.2");	
		}			
		
		else if (a < 0 || a > 1)
		{
			a = 0.2;
            this.onXMLMinorError("alpha component value of background must be between 0 and 1");				
		}
			
		this.backgroundSpecs [3] = a;	
	    this.log (this.backgroundSpecs);
        this.log("Parsed ambient");

        return null;
    }


    /**
     * Parses the <lights> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {

        /*
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "light") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            // Gets indices of each element.
            var enableIndex = nodeNames.indexOf("enable");
            var positionIndex = nodeNames.indexOf("position");
            var ambientIndex = nodeNames.indexOf("ambient");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var specularIndex = nodeNames.indexOf("specular");

            // Light enable/disable
            var enableLight = true;
            if (enableIndex == -1) {
                this.onXMLMinorError("enable value missing for ID = " + lightId + "; assuming 'value = 1'");
            }
            else {
                var aux = this.reader.getFloat(grandChildren[enableIndex], 'value');
                if (!(aux != null && !isNaN(aux) && (aux == 0 || aux == 1)))
                    this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");
                else
                    enableLight = aux == 0 ? false : true;
            }

            // Retrieves the light position.
            var positionLight = [];
            if (positionIndex != -1) {
                // x
                var x = this.reader.getFloat(grandChildren[positionIndex], 'x');
                if (!(x != null && !isNaN(x)))
                    return "unable to parse x-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(x);

                // y
                var y = this.reader.getFloat(grandChildren[positionIndex], 'y');
                if (!(y != null && !isNaN(y)))
                    return "unable to parse y-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(y);

                // z
                var z = this.reader.getFloat(grandChildren[positionIndex], 'z');
                if (!(z != null && !isNaN(z)))
                    return "unable to parse z-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(z);

                // w
                var w = this.reader.getFloat(grandChildren[positionIndex], 'w');
                if (!(w != null && !isNaN(w) && w >= 0 && w <= 1))
                    return "unable to parse x-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(w);
            }
            else
                return "light position undefined for ID = " + lightId;

            // Retrieves the ambient component.
            var ambientIllumination = [];
            if (ambientIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[ambientIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[ambientIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[ambientIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[ambientIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(a);
            }
            else
                return "ambient component undefined for ID = " + lightId;

            // TODO: Retrieve the diffuse component

            // TODO: Retrieve the specular component

            // TODO: Store Light global information.
            //this.lights[lightId] = ...;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

            */
        this.log("Parsed lights");

        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        // TODO: Parse block

        console.log("Parsed textures");

        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        // TODO: Parse block
        this.log("Parsed materials");
        return null;

    }

     /**
     * Parses the <transformations> node.
     * @param {transformations block element} transfNode
     */
    parseTransf(transfNode) {
        // TODO: Parse block
        this.log("Parsed transformations");
        return null;

    }

     /**
     * Parses the <primitives> node.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        // TODO: Parse block
        this.log("Parsed primitives");
        return null;

    }

    /**
     * Parses the <components> block.
     * @param {components block element} componentsNode
     */
    parseComponents(componentsNode) {
        // TODO: Parse block
        this.log("Parsed componentss");
        return null;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorErro(message) {
        console.warn("Warning: " + message);
    }


    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        // entry point for graph rendering
        //TODO: Render loop starting at root of graph
    }
}