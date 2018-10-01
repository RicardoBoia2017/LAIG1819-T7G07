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
		this.root = this.reader.getString(sceneNode,'root');	
			
		if (this.root == null) {
            this.root = "root";
            this.onXMLMinorError("unable to parse value for root; assuming 'root = root'");
        }
		
		this.axis_length = this.reader.getFloat(sceneNode, 'axis_length');

        if (!(this.axis_length != null && !isNaN(this.axis_length))) {
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
					this.onXMLMinorError("unable to parse id value for view");
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
			
			
			else if (nodeNames[j] == "ortho") //TODO
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
            this.onXMLMinorError("unable to parse ambient component of ambient; assuming ambient = [0,0,0,1]");
		
		//r (red)
		var r = this.reader.getFloat(children[ambientIndex], 'r');
		
		if (!(r != null && !isNaN(r)))
		{
			r = 0;
            this.onXMLMinorError("unable to parse red component of ambient; assuming r = 0");	
		}			
		
		else if (r < 0 || r > 1)
		{
			r = 0;
            this.onXMLMinorError("red component value of ambient must be between 0 and 1");				
		}
			
		this.ambientSpecs [0] = r;

		//g (green)
		var g = this.reader.getFloat(children[ambientIndex], 'g');
		
		if (!(g != null && !isNaN(g)))
		{
			r = 0;
            this.onXMLMinorError("unable to parse green component of ambient; assuming g = 0");	
		}			
		
		else if (g < 0 || g > 1)
		{
			r = 0;
            this.onXMLMinorError("green component value of ambient must be between 0 and 1");				
		}
			
		this.ambientSpecs [1] = g;		
		
		//b (blue)
		var b = this.reader.getFloat(children[ambientIndex], 'b');
		
		if (!(b != null && !isNaN(b)))
		{
			b = 0;
            this.onXMLMinorError("unable to parse blue component of ambient; assuming b = 0");	
		}			
		
		else if (b < 0 || b > 1)
		{
			b = 0;
            this.onXMLMinorError("blue component value of ambient must be between 0 and 1");				
		}
			
		this.ambientSpecs [2] = b;
		
		//a (alpha)
		var a = this.reader.getFloat(children[ambientIndex], 'a');
		
		if (!(a != null && !isNaN(a)))
		{
			a = 0;
            this.onXMLMinorError("unable to parse alpha component of ambient; assuming a = 0");	
		}			
		
		else if (a < 0 || a > 1)
		{
			a = 0;
            this.onXMLMinorError("alpha component value of ambient must be between 0 and 1");				
		}
			
		this.ambientSpecs [3] = a;
		
		//background
		this.backgroundSpecs = [];
		var backgroundIndex = nodeNames.indexOf("background");
		
		if (backgroundIndex == -1)
            this.onXMLMinorError("unable to parse background component of ambient; assuming background = [0,0,0,1]");
		
		//r (red)
		var r = this.reader.getFloat(children[backgroundIndex], 'r');
		
		if (!(r != null && !isNaN(r)))
		{
			r = 0;
            this.onXMLMinorError("unable to parse red component of background; assuming r = 0");	
		}			
		
		else if (r < 0 || r > 1)
		{
			r = 0;
            this.onXMLMinorError("red component value of background must be between 0 and 1");				
		}
			
		this.backgroundSpecs [0] = r;

		//g (green)
		var g = this.reader.getFloat(children[backgroundIndex], 'g');
		
		if (!(g != null && !isNaN(g)))
		{
			r = 0;
            this.onXMLMinorError("unable to parse green component of background; assuming g = 0");	
		}			
		
		else if (g < 0 || g > 1)
		{
			r = 0;
            this.onXMLMinorError("green component value of background must be between 0 and 1");				
		}
			
		this.backgroundSpecs [1] = g;		
		
		//b (blue)
		var b = this.reader.getFloat(children[backgroundIndex], 'b');
		
		if (!(b != null && !isNaN(b)))
		{
			b = 0;
            this.onXMLMinorError("unable to parse blue component of background; assuming b = 0");	
		}			
		
		else if (b < 0 || b > 1)
		{
			b = 0;
            this.onXMLMinorError("blue component value of background must be between 0 and 1");				
		}
			
		this.backgroundSpecs [2] = b;
		
		//a (alpha)
		var a = this.reader.getFloat(children[backgroundIndex], 'a');
		
		if (!(a != null && !isNaN(a)))
		{
			a = 0;
            this.onXMLMinorError("unable to parse alpha component of background; assuming a = 0");	
		}			
		
		else if (a < 0 || a > 1)
		{
			a = 0;
            this.onXMLMinorError("alpha component value of background must be between 0 and 1");				
		}
			
		this.backgroundSpecs [3] = a;	
		
        this.log("Parsed ambient");

        return null;
    }


    /**
     * Parses the <lights> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {

        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "omni"){ //TODO ALTERAR DEPOIS{
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "unable to parse id value for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            grandChildren = children[i].children;
            // Specifications for the current light.

			var enableLight = this.reader.getFloat(children[i], 'enabled');

			// Light enable/disable
			
			if (enableLight == null || isNaN (enableLight) || (enableLight != 0 && enableLight != 1))
			{
				enableLight = 1;
                this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");
			}
			
            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }
			
            // Gets indices of each element.
            var enableIndex = nodeNames.indexOf("enable");
            var locationIndex = nodeNames.indexOf("location");
            var ambientIndex = nodeNames.indexOf("ambient");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var specularIndex = nodeNames.indexOf("specular");

            // Retrieves the light location.
            var locationLight = [];
            if (locationIndex != -1) {
                // x
                var x = this.reader.getFloat(grandChildren[locationIndex], 'x');
                if (!(x != null && !isNaN(x)))
                    return "unable to parse x-coordinate of the light location for ID = " + lightId;
                else
                    locationLight.push(x);

                // y
                var y = this.reader.getFloat(grandChildren[locationIndex], 'y');
                if (!(y != null && !isNaN(y)))
                    return "unable to parse y-coordinate of the light location for ID = " + lightId;
                else
                    locationLight.push(y);

                // z
                var z = this.reader.getFloat(grandChildren[locationIndex], 'z');
                if (!(z != null && !isNaN(z)))
                    return "unable to parse z-coordinate of the light location for ID = " + lightId;
                else
                    locationLight.push(z);

                // w
                var w = this.reader.getFloat(grandChildren[locationIndex], 'w');
                if (!(w != null && !isNaN(w) && w >= 0 && w <= 1))
                    return "unable to parse x-coordinate of the light location for ID = " + lightId;
                else
                    locationLight.push(w);
            }
            else
                return "light location undefined for ID = " + lightId;

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

            // Retrieve the diffuse component
            var diffuseIllumination = [];
            if (diffuseIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[diffuseIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the diffuse illumination for ID = " + lightId;
                else
                    diffuseIllumination.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[diffuseIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the diffuse illumination for ID = " + lightId;
                else
                    diffuseIllumination.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[diffuseIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the diffuse illumination for ID = " + lightId;
                else
                    diffuseIllumination.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[diffuseIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the diffuse illumination for ID = " + lightId;
                else
                    diffuseIllumination.push(a);
            }
            else
                return "diffuse component undefined for ID = " + lightId;
			
            //Retrieve the specular component
            var specularIllumination = [];
            if (specularIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[specularIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the specular illumination for ID = " + lightId;
                else
                    specularIllumination.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[specularIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the specular illumination for ID = " + lightId;
                else
                    specularIllumination.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[specularIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the specular illumination for ID = " + lightId;
                else
                    specularIllumination.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[specularIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the specular illumination for ID = " + lightId;
                else
                    specularIllumination.push(a);
            }
            else
                return "specular component undefined for ID = " + lightId;
            // TODO: Store Light global information.
            this.lights[lightId] = [enableLight, locationLight, ambientIllumination, diffuseIllumination, specularIllumination];
			
			numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

            
        this.log("Parsed lights");

        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

		this.textures = [];
		
		var children = texturesNode.children;

		for (var i = 0; i < children.length; i++)
		{
			if (children[i].nodeName != "texture")
				this.onXMLMinorError("unable to parse texture id");
			
			else
			{ 
				//id
				var id = this.reader.getString(children[i], 'id')
				
				if (id == null)
					return "unable to parse value for texture";	

				if (this.textures [id] != null)
				{
					return "textures id have to be unique";
				}
				
				//file
				var file = this.reader.getString(children[i], 'file');
				
				if (file == null)
					return "unable to parse file for texture " + id;
				
				this.textures [id] = [file];
			}
		}
		
        console.log("Parsed textures");

        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {

		this.materials = [];
		var numMaterials = 0;
		
		var children = materialsNode.children;
		
		var grandChildren = [];
		var nodeNames = [];
		
		for(var i = 0; i < children.length; i++)
		{
			
			if (children[i].nodeName != "material")
			{
			    this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
			}
					
			//id
			var materialId = this.reader.getString (children[i], 'id');
									
			if (materialId == null)
				return "unable to parse id value for material";
			
			if (this.materials [materialId] != null)
				return "materials id must be unique";

			//Specifications for the current material
			
			var shininessMaterial = this.reader.getFloat (children[i], 'shininess')
			
			if (shininessMaterial == null || isNaN(shininessMaterial) )
			{
				shininessMaterial = 1;
                this.onXMLMinorError("unable to parse value component of the 'shininess' field for ID = " + lightId + "; assuming 'value = 1'");				
			}
			
			grandChildren = children[i].children;
			
			var nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) 
                nodeNames.push(grandChildren[j].nodeName);
			
            // Gets indices of each element
            var emissionIndex = nodeNames.indexOf("emission");
            var ambientIndex = nodeNames.indexOf("ambient");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var specularIndex = nodeNames.indexOf("specular");
			
			//Retrieves the material emission
			var emissionMaterial = [];
			
			if (emissionMaterial != 1)
			{
                // R
                var r = this.reader.getFloat(grandChildren[emissionIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the emission for ID = " + materialId;
                else
                    emissionMaterial.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[emissionIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the emission for ID = " + materialId;
                else
                    emissionMaterial.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[emissionIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the emission for ID = " + materialId;
                else
                    emissionMaterial.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[emissionIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the emission for ID = " + materialId;
                else
                    emissionMaterial.push(a);				
			}
			else
				return "material emission undefined for ID" + materialId;
			
			//Retrieves the ambient component
	        var ambientIllumination = [];
            if (ambientIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[ambientIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the ambient illumination for ID = " + materialId;
                else
                    ambientIllumination.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[ambientIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the ambient illumination for ID = " + materialId;
                else
                    ambientIllumination.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[ambientIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the ambient illumination for ID = " + materialId;
                else
                    ambientIllumination.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[ambientIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the ambient illumination for ID = " + materialId;
                else
                    ambientIllumination.push(a);
            }
            else
                return "ambient component undefined for ID = " + materialId;	

            // Retrieve the diffuse component
            var diffuseIllumination = [];
            if (diffuseIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[diffuseIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the diffuse illumination for ID = " + materialId;
                else
                    diffuseIllumination.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[diffuseIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the diffuse illumination for ID = " + materialId;
                else
                    diffuseIllumination.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[diffuseIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the diffuse illumination for ID = " + materialId;
                else
                    diffuseIllumination.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[diffuseIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the diffuse illumination for ID = " + materialId;
                else
                    diffuseIllumination.push(a);
            }
            else
                return "diffuse component undefined for ID = " + materialId;

            //Retrieve the specular component
            var specularIllumination = [];
            if (specularIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[specularIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the specular illumination for ID = " + materialId;
                else
                    specularIllumination.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[specularIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the specular illumination for ID = " + materialId;
                else
                    specularIllumination.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[specularIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the specular illumination for ID = " + materialId;
                else
                    specularIllumination.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[specularIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the specular illumination for ID = " + materialId;
                else
                    specularIllumination.push(a);
            }
            else
                return "specular component undefined for ID = " + materialId;		

			this.materials[materialId] = [shininessMaterial, emissionMaterial, ambientIllumination, diffuseIllumination, specularIllumination];
			
			this.log (this.materials[materialId]);
			numMaterials++;
		}
		
		if (numMaterials == 0)
			return "at least one material must be defined";
		
        this.log("Parsed materials");
        return null;

    }

     /**
     * Parses the <transformations> node.
     * @param {transformations block element} transfNode
     */
    parseTransf(transfNode) {
		
		this.transformations = [];
		
		var children = transfNode.children;
		var numTransf = 0;
		
		var grandChildren = []
		var nodeNames = [];
		
		for (var i = 0; i < children.length; i++)
		{
            if (children[i].nodeName != "transformation"){
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

			//Get id of current transformation
			var transfId = this.reader.getString (children [i], 'id');

			if (transfId == null)
					return "unable to parse value for transformation id";
			
			if (this.transformations[transfId] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transfId + ")";

			grandChildren = children[i].children;
			
			//Retrieves transformation
			for (var j = 0; j < grandChildren.length; j++)
			{
				switch (grandChildren[j].nodeName)
				{
					case "translate":
					{
						//x
						var x = this.reader.getFloat (grandChildren[j],'x');
						if (x == null || isNaN (x))
						{
							x = 0
							this.onXMLMinorErro ("unable to parse x component of translation, assuming x = 0");
						}
						
						//y
						var y = this.reader.getFloat (grandChildren[j],'y');
						if (y == null || isNaN (y))
						{
							y = 0
							this.onXMLMinorErro ("unable to parse y component of translation, assuming y = 0");
						}
						
						//z
						var z = this.reader.getFloat (grandChildren[j],'z');
						if (z == null || isNaN (z))
						{
							z = 0
							this.onXMLMinorErro ("unable to parse z component of translation, assuming z = 0");
						}
												
						//type, x, y, z
						this.transformations [transfId] = ["t", x, y, z];
						
						break;
					}
					case "rotate":
					{		
						//axis of rotation
						var axis = this.reader.getString (grandChildren[j],'axis');
						
						if (axis == null || 
						   (axis != "x" && axis != "y" && axis != "z") )
								return "unable to parse axis of rotation from " + transfId;

						//angle
						var angle = this.reader.getFloat (grandChildren[j],'angle');
						if (angle == null || isNaN (angle))
						{
							angle = 0
							this.onXMLMinorErro ("unable to parse angle of rotation, assuming angle = 0");
						}	
						
						this.transformations [transfId] = ["r", angle, axis];
						
						break;
					}
					case "scale":
					{
						//x
						var x = this.reader.getFloat (grandChildren[j],'x');
						if (x == null || isNaN (x))
						{
							x = 0
							this.onXMLMinorErro ("unable to parse x component of scale, assuming x = 0");
						}
						
						//y
						var y = this.reader.getFloat (grandChildren[j],'y');
						if (y == null || isNaN (y))
						{
							y = 0
							this.onXMLMinorErro ("unable to parse y component of scale, assuming y = 0");
						}
						
						//z
						var z = this.reader.getFloat (grandChildren[j],'z');
						if (z == null || isNaN (z))
						{
							z = 0
							this.onXMLMinorErro ("unable to parse z component of scale, assuming z = 0");
						}
												
						//type, x, y, z
						this.transformations [transfId] = ["s", x, y, z];	
						break;
					}
					
					default:
						return "unable to parse type of transformation of '" + transfId + "'";
				}
				
			}
		}
		
        this.log("Parsed transformations");
        return null;

    }

     /**
     * Parses the <primitives> node.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {

		this.primitives = [];
		
		var children = primitivesNode.children;
		
		for (var i = 0; i < children.length; i++)
		{
			//id
			var primitiveId = this.reader.getString (children [i],'id');
			
			if (primitiveId == null)
				return "unable to parse id value for primitive";
			
			if (this.primitives [primitiveId] != null)
				return "primitives id must be unique";
			
			//gets primitive specifications
			var primitiveSpecs = children[i].children;
			var specsArray = [];
			
			for (var j = 0; j < primitiveSpecs.length; j++)
			{
				switch (primitiveSpecs[j].nodeName)
				{
					case "rectangle":
					{
						
						var rectangleSpecs = [];
						
						//pushes type
						rectangleSpecs.push ("rectangle");
						
						//x1 
						var x1 = this.reader.getFloat (primitiveSpecs[j],'x1');
						if (x1 == null || isNaN (x1))
						{
							x1 = 0;
							this.onXMLMinorErro ("unable to parse x1 component of primitive, assuming x1 = 0");
						}	
						
						rectangleSpecs.push (x1);
						
						//y1 
						var y1 = this.reader.getFloat (primitiveSpecs[j],'y1');
						if (y1 == null || isNaN (y1))
						{
							y1 = 0;
							this.onXMLMinorErro ("unable to parse y1 component of primitive, assuming y1 = 0");
						}	

						rectangleSpecs.push (y1);						
						
						//x2 
						var x2 = this.reader.getFloat (primitiveSpecs[j],'x2');
						if (x2 == null || isNaN (x2))
						{
							x2 = 1;
							this.onXMLMinorErro ("unable to parse x2 component of primitive, assuming x2 = 1");
						}	
												
						else if (x1 >= x2)
							return "x2 of primitive must be greater than x1";

						rectangleSpecs.push (x2);						
						
						//y2 
						var y2 = this.reader.getFloat (primitiveSpecs[j],'y2');
						if (y2 == null || isNaN (y2))
						{
							y2 = 1;
							this.onXMLMinorErro ("unable to parse y2 component of primitive, assuming y2 = 1");
						}	
						
						else if (y1 >= y2)
							return "y2 of primitive must be greater than y1";

						rectangleSpecs.push (y2);
						
						specsArray.push (rectangleSpecs);
						break;
					}
					
					case "triangle":
					{

						var triangleSpecs = [];
						
						//pushes type
						triangleSpecs.push ("triangle");
						
						//x1 
						var x1 = this.reader.getFloat (primitiveSpecs[j],'x1');
						
						if (x1 == null || isNaN (x1))
							return "unable to x1 component of primitive";
						
						triangleSpecs.push (x1);					
					
						//y1 
						var y1 = this.reader.getFloat (primitiveSpecs[j],'y1');
						if (y1 == null || isNaN (y1))
							return "unable to y1 component of primitive";
	
						triangleSpecs.push (y1);	

						//z1 
						var z1 = this.reader.getFloat (primitiveSpecs[j],'z1');
						if (z1 == null || isNaN (z1))
							return "unable to z1 component of primitive";
	
						triangleSpecs.push (z1);
						
						//x2
						var x2 = this.reader.getFloat (primitiveSpecs[j],'x2');
						
						if (x2 == null || isNaN (x2))
							return "unable to x2 component of primitive";
						
						triangleSpecs.push (x2);							
						
						//y2
						var y2 = this.reader.getFloat (primitiveSpecs[j],'y2');
						if (y2 == null || isNaN (y2))
							return "unable to y2 component of primitive";
	
						triangleSpecs.push (y2);

						//z2 
						var z2 = this.reader.getFloat (primitiveSpecs[j],'z2');
						if (z2 == null || isNaN (z2))
							return "unable to z2 component of primitive";
	
						triangleSpecs.push (z2);
					
						//x3
						var x3 = this.reader.getFloat (primitiveSpecs[j],'x3');
						
						if (x3 == null || isNaN (x3))
							return "unable to x3 component of primitive";
						
						triangleSpecs.push (x3);

						//y3
						var y3 = this.reader.getFloat (primitiveSpecs[j],'y3');
						if (y3 == null || isNaN (y3))
							return "unable to y3 component of primitive";
	
						triangleSpecs.push (y3);						

						//z3 
						var z3 = this.reader.getFloat (primitiveSpecs[j],'z3');
						if (z3 == null || isNaN (z3))
							return "unable to z3 component of primitive";
	
						triangleSpecs.push (z3); 
						
						specsArray.push(triangleSpecs);			
						break;
					}
					
					case "cylinder":
					{
						break;
					}	
					
					case "sphere":
					{
						
						break;
					}
					
					case "torus":
					{
						break;
					}
				}
			}
			
			this.primitives [primitiveId] = [primitiveSpecs];
		}
		
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