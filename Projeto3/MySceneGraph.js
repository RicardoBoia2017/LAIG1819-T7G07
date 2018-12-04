var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSF_INDEX = 6;
var ANIMATIONS_INDEX = 7;
var PRIMITIVE_INDEX = 8;
var COMPONENTS_INDEX = 9;

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

	
		//Create BoundingBoxes Quads

		this.objects= [
		new MyQuad(this.scene, [0, 0, 1, 1]),
		new MyQuad(this.scene, [0, 0, 1, 1]),
		new MyQuad(this.scene, [0, 0, 1, 1]),
		new MyQuad(this.scene, [0, 0, 1, 1]),
		new MyQuad(this.scene, [0, 0, 1, 1]),
		new MyQuad(this.scene, [0, 0, 1, 1]),
		new MyQuad(this.scene, [0, 0, 1, 1]),
		new MyQuad(this.scene, [0, 0, 1, 1]),
		new MyQuad(this.scene, [0, 0, 1, 1]),
		new MyQuad(this.scene, [0, 0, 1, 1]),
		new MyQuad(this.scene, [0, 0, 1, 1]),
		new MyQuad(this.scene, [0, 0, 1, 1]),
		new MyQuad(this.scene, [0, 0, 1, 1]),
		new MyQuad(this.scene, [0, 0, 1, 1]),
		new MyQuad(this.scene, [0, 0, 1, 1]),
		new MyQuad(this.scene, [0, 0, 1, 1]),
		new MyQuad(this.scene, [0, 0, 1, 1]),
		new MyQuad(this.scene, [0, 0, 1, 1]),
		new MyQuad(this.scene, [0, 0, 1, 1]),
		new MyQuad(this.scene, [0, 0, 1, 1]),
		new MyQuad(this.scene, [0, 0, 1, 1]),
		new MyQuad(this.scene, [0, 0, 1, 1]),
		new MyQuad(this.scene, [0, 0, 1, 1]),
		new MyQuad(this.scene, [0, 0, 1, 1]),
		new MyQuad(this.scene, [0, 0, 1, 1])
	];

		this.scene.setPickEnabled(true);

		
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

		for (var i = 0; i < nodes.length; i++)
			nodeNames.push(nodes[i].nodeName);

		var error;

		// Processes each node, verifying errors.

		// <scene>
		var index;
		if ((index = nodeNames.indexOf("scene")) == -1)
			return "tag <scene> missing";
		else {
			if (index != SCENE_INDEX)
				this.onXMLMinorErro("tag <scene> out of order");

			//Parse scene block
			if ((error = this.parseScene(nodes[index])) != null)
				return error;
		}

		// <views>
		if ((index = nodeNames.indexOf("views")) == -1)
			return "tag <views> missing";
		else {
			if (index != VIEWS_INDEX)
				this.onXMLMinorErro("tag <views> out of order");

			//Parse views block
			if ((error = this.parseViews(nodes[index])) != null)
				return error;
		}

		// <ambient>
		if ((index = nodeNames.indexOf("ambient")) == -1)
			return "tag <ambient> missing";
		else {
			if (index != AMBIENT_INDEX)
				this.onXMLMinorErro("tag <ambient> out of order");

			//Parse ambient block
			if ((error = this.parseAmbient(nodes[index])) != null)
				return error;
		}

		// <lights>
		if ((index = nodeNames.indexOf("lights")) == -1)
			return "tag <lights> missing";
		else {
			if (index != LIGHTS_INDEX)
				this.onXMLMinorErro("tag <lights> out of order");

			//Parse lights block
			if ((error = this.parseLights(nodes[index])) != null)
				return error;
		}

		// <textures>
		if ((index = nodeNames.indexOf("textures")) == -1)
			return "tag <textures> missing";
		else {
			if (index != TEXTURES_INDEX)
				this.onXMLMinorErro("tag <textures> out of order");

			//Parse textures block
			if ((error = this.parseTextures(nodes[index])) != null)
				return error;
		}

		// <materials>
		if ((index = nodeNames.indexOf("materials")) == -1)
			return "tag <materials> missing";
		else {
			if (index != MATERIALS_INDEX)
				this.onXMLMinorErro("tag <materials> out of order");

			//Parse materials block
			if ((error = this.parseMaterials(nodes[index])) != null)
				return error;
		}

		// <transformations>
		if ((index = nodeNames.indexOf("transformations")) == -1)
			return "tag <transformations> missing";
		else {
			if (index != TRANSF_INDEX)
				this.onXMLMinorErro("tag <transformations> out of order");

			//Parse transformations block
			if ((error = this.parseTransf(nodes[index])) != null)
				return error;
		}

		// <animations>
		if ((index = nodeNames.indexOf("animations")) == -1)
			return "tag <animations> missing";
		else {
			if (index != ANIMATIONS_INDEX)
				this.onXMLMinorErro("tag <animations> out of order");

			//Parse animations block
			if ((error = this.parseAnimations(nodes[index])) != null)
				return error;
		}

		// <primitives>
		if ((index = nodeNames.indexOf("primitives")) == -1)
			return "tag <primitives> missing";
		else {
			if (index != PRIMITIVE_INDEX)
				this.onXMLMinorErro("tag <primitives> out of order");

			//Parse primitives block
			if ((error = this.parsePrimitives(nodes[index])) != null)
				return error;
		}

		// <components>
		if ((index = nodeNames.indexOf("components")) == -1)
			return "tag <components> missing";
		else {
			if (index != COMPONENTS_INDEX)
				this.onXMLMinorErro("tag <components> out of order");

			//Parse components block
			if ((error = this.parseComponents(nodes[index])) != null)
				return error;
		}


	}


	/**
	 * Parses the <scene> block.
	 *  @param {scene block element} sceneNode
	 */
	parseScene(sceneNode) {
		this.root = this.reader.getString(sceneNode, 'root');

		if (this.root == null) {
			this.root = "root";
			this.onXMLMinorErro("unable to parse value for root; assuming 'root = root'");
		}

		this.referenceLength = this.reader.getFloat(sceneNode, 'axis_length');

		if (!(this.referenceLength != null && !isNaN(this.referenceLength))) {
			this.referenceLength = 1;
			this.onXMLMinorErro("unable to parse value for axis_length; assuming 'axis_length = 1'");
		}

		this.log("Parsed scene node");

		return null;
	}


	/**
	 * Parses the <views> block.
	 * @param {views block elements} viewsNode
	 */
	parseViews(viewsNode) {

		this.views = [];

		var children = viewsNode.children;

		this.defaultView = this.reader.getString(viewsNode, 'default');

		var nodeNames = [];

		for (var i = 0; i < children.length; i++)
			nodeNames.push(children[i].nodeName);

		var numViews = 0;

		for (var j = 0; j < nodeNames.length; j++) {
			if (nodeNames[j] == "perspective") {
				//id
				var id;
				id = this.reader.getString(children[j], 'id');

				if (id == null) {
					return "unable to parse id value for view";
				}

				if (this.views[id] != null)
					return "ID must be unique for each view (conflict: ID = " + id + ")";


				//near
				var near = this.reader.getFloat(children[j], 'near');

				if (near == null) {
					near = 0.1;
					this.onXMLMinorErro("unable to parse value for near plane; assuming 'near = 0.1'");
				}

				else if (isNaN(near)) {
					near = 0.1;
					this.onXMLMinorErro("non-numeric value found for near plane; assuming 'near = 0.1'");
				}

				else if (near <= 0) {
					near = 0.1;
					this.onXMLMinorErro("'near' must be positive; assuming 'near = 0.1'");
				}

				//far
				var far;
				far = this.reader.getFloat(children[j], 'far');

				if (far == null) {
					far = 500;
					this.onXMLMinorErro("unable to parse value for far plane; assuming 'far = 500'");
				}

				else if (isNaN(far)) {
					far = 500;
					this.onXMLMinorErro("non-numeric value found for far plane; assuming 'far = 500'");
				}

				if (near >= far)
					return "'near' must be smaller than 'far'";

				//angle
				var angle;
				angle = this.reader.getFloat(children[j], 'angle');

				if (angle == null) {
					angle = 0;
					this.onXMLMinorErro("unable to parse value for angle plane; assuming 'angle = 0'");
				}

				else if (isNaN(angle)) {
					angle = 0;
					this.onXMLMinorErro("non-numeric value found for angle plane; assuming 'angle = 0'");
				}

				//specifications of view				
				var viewSpecs = children[j].children;

				var from = [];
				var to = [];

				for (var k = 0; k < viewSpecs.length; k++) {
					//from
					if (viewSpecs[k].nodeName == "from") {
						var fromX = this.reader.getFloat(viewSpecs[k], 'x');
						var fromY = this.reader.getFloat(viewSpecs[k], 'y');
						var fromZ = this.reader.getFloat(viewSpecs[k], 'z');

						if (fromX == null) {
							fromX = 0.1;
							this.onXMLMinorErro("unable to parse value for x; assuming 'fromX = 0.1'");
						}

						else if (isNaN(fromX)) {
							fromX = 0.1;
							this.onXMLMinorErro("non-numeric value found for x; assuming 'fromX = 0.1'");
						}

						if (fromY == null) {
							fromY = 0.1;
							this.onXMLMinorErro("unable to parse value for y; assuming 'fromY = 0.1'");
						}

						else if (isNaN(fromY)) {
							fromY = 0.1;
							this.onXMLMinorErro("non-numeric value found for y; assuming 'fromY = 0.1'");
						}

						if (fromZ == null) {
							fromZ = 0.1;
							this.onXMLMinorErro("unable to parse value for z; assuming 'fromZ = 0.1'");
						}

						else if (isNaN(fromZ)) {
							fromZ = 0.1;
							this.onXMLMinorErro("non-numeric value found for z; assuming 'fromZ = 0.1'");
						}

						from.push(fromX);
						from.push(fromY);
						from.push(fromZ);
					}
					//to
					else if (viewSpecs[k].nodeName == "to") {
						var toX = this.reader.getFloat(viewSpecs[k], 'x');
						var toY = this.reader.getFloat(viewSpecs[k], 'y');
						var toZ = this.reader.getFloat(viewSpecs[k], 'z');

						if (toX == null) {
							toX = 20;
							this.onXMLMinorErro("unable to parse value for x; assuming 'toX = 20'");
						}

						else if (isNaN(toX)) {
							toX = 20;
							this.onXMLMinorErro("non-numeric value found for x; assuming 'toX = 20'");
						}

						if (toY == null) {
							toY = 20;
							this.onXMLMinorErro("unable to parse value for y; assuming 'toY = 20'");
						}

						else if (isNaN(toY)) {
							toY = 20;
							this.onXMLMinorErro("non-numeric value found for y; assuming 'toY = 20'");
						}

						if (toZ == null) {
							toZ = 20;
							this.onXMLMinorErro("unable to parse value for z; assuming 'toZ = 20'");
						}

						else if (isNaN(toZ)) {
							toZ = 20;
							this.onXMLMinorErro("non-numeric value found for z; assuming 'toZ = 20'");
						}

						to.push(toX);
						to.push(toY);
						to.push(toZ);
					}

				}

				this.views[id] = ["perspective", near, far, angle, from, to];
				numViews++;
			}


			else if (nodeNames[j] == "ortho") {
				//id
				var id;
				id = this.reader.getString(children[j], 'id');

				if (id == null)
					return "unable to parse id value for view";

				if (this.views[id] != null)
					return "ID must be unique for each view (conflict: ID = " + id + ")";

				//near
				var near = this.reader.getFloat(children[j], 'near');

				if (near == null) {
					near = 0.1;
					this.onXMLMinorErro("unable to parse value for near plane; assuming 'near = 0.1'");
				}

				else if (isNaN(near)) {
					near = 0.1;
					this.onXMLMinorErro("non-numeric value found for near plane; assuming 'near = 0.1'");
				}

				else if (near <= 0) {
					near = 0.1;
					this.onXMLMinorErro("'near' must be positive; assuming 'near = 0.1'");
				}

				//far
				var far = this.reader.getFloat(children[j], 'far');

				if (far == null) {
					far = 500;
					this.onXMLMinorErro("unable to parse value for far plane; assuming 'far = 500'");
				}

				else if (isNaN(far)) {
					far = 500;
					this.onXMLMinorErro("non-numeric value found for far plane; assuming 'far = 500'");
				}

				else if (far <= 0) {
					far = 500;
					this.onXMLMinorErro("'far' must be positive; assuming 'far = 500'");
				}

				if (near >= far)
					return "'near' must be smaller than 'far'";


				//left
				this.left = this.reader.getFloat(children[j], 'left');

				if (this.left == null) {
					this.left = -10;
					this.onXMLMinorErro("unable to parse value for left plane; assuming 'left = -10'");
				}

				else if (isNaN(this.left)) {
					this.left = -10;
					this.onXMLMinorErro("non-numeric value found for left plane; assuming 'left = -10'");
				}


				//right
				this.right;
				this.right = this.reader.getFloat(children[j], 'right');

				if (this.right == null) {
					this.right = 10;
					this.onXMLMinorErro("unable to parse value for right plane; assuming 'right = 10'");
				}

				else if (isNaN(this.right)) {
					this.right = 10;
					this.onXMLMinorErro("non-numeric value found for right plane; assuming 'right = 10'");
				}

				if (this.left >= this.right)
					return "'left' must be smaller than 'right'";


				//top
				this.top = this.reader.getFloat(children[j], 'top');

				if (this.top == null) {
					this.top = 10;
					this.onXMLMinorErro("unable to parse value for top plane; assuming 'top = 10'");
				}

				else if (isNaN(this.top)) {
					this.top = 10;
					this.onXMLMinorErro("non-numeric value found for top plane; assuming 'top = 10'");
				}


				//bottom
				this.bottom;
				this.bottom = this.reader.getFloat(children[j], 'bottom');

				if (this.bottom == null) {
					this.bottom = -10;
					this.onXMLMinorErro("unable to parse value for bottom plane; assuming 'bottom = -10'");
				}

				else if (isNaN(this.bottom)) {
					this.right = -10;
					this.onXMLMinorErro("non-numeric value found for bottom plane; assuming 'bottom = -10'");
				}

				if (this.bottom >= this.top)
					return "'bottom' must be smaller than 'top'";

				//specifications of view				
				var viewSpecs = children[j].children;

				var from = [];
				var to = [];

				for (var k = 0; k < viewSpecs.length; k++) {
					//from
					if (viewSpecs[k].nodeName == "from") {
						var fromX = this.reader.getFloat(viewSpecs[k], 'x');
						var fromY = this.reader.getFloat(viewSpecs[k], 'y');
						var fromZ = this.reader.getFloat(viewSpecs[k], 'z');

						if (fromX == null) {
							fromX = 0.1;
							this.onXMLMinorErro("unable to parse value for x; assuming 'fromX = 0.1'");
						}

						else if (isNaN(fromX)) {
							fromX = 0.1;
							this.onXMLMinorErro("non-numeric value found for x; assuming 'fromX = 0.1'");
						}

						if (fromY == null) {
							fromY = 0.1;
							this.onXMLMinorErro("unable to parse value for y; assuming 'fromY = 0.1'");
						}

						else if (isNaN(fromY)) {
							fromY = 0.1;
							this.onXMLMinorErro("non-numeric value found for y; assuming 'fromY = 0.1'");
						}

						if (fromZ == null) {
							fromZ = 0.1;
							this.onXMLMinorErro("unable to parse value for z; assuming 'fromZ = 0.1'");
						}

						else if (isNaN(fromZ)) {
							fromZ = 0.1;
							this.onXMLMinorErro("non-numeric value found for z; assuming 'fromZ = 0.1'");
						}

						from.push(fromX);
						from.push(fromY);
						from.push(fromZ);
					}
					//to
					else if (viewSpecs[k].nodeName == "to") {
						var toX = this.reader.getFloat(viewSpecs[k], 'x');
						var toY = this.reader.getFloat(viewSpecs[k], 'y');
						var toZ = this.reader.getFloat(viewSpecs[k], 'z');

						if (toX == null) {
							toX = 20;
							this.onXMLMinorErro("unable to parse value for x; assuming 'toX = 20'");
						}

						else if (isNaN(toX)) {
							toX = 20;
							this.onXMLMinorErro("non-numeric value found for x; assuming 'toX = 20'");
						}

						if (toY == null) {
							toY = 20;
							this.onXMLMinorErro("unable to parse value for y; assuming 'toY = 20'");
						}

						else if (isNaN(toY)) {
							toY = 20;
							this.onXMLMinorErro("non-numeric value found for y; assuming 'toY = 20'");
						}

						if (toZ == null) {
							toZ = 20;
							this.onXMLMinorErro("unable to parse value for z; assuming 'toZ = 20'");
						}

						else if (isNaN(toZ)) {
							toZ = 20;
							this.onXMLMinorErro("non-numeric value found for z; assuming 'toZ = 20'");
						}

						to.push(toX);
						to.push(toY);
						to.push(toZ);
					}

				}

				this.views[id] = ["ortho", near, far, this.left, this.right, this.top, this.bottom, from, to];
				numViews++;
			}

			else
				return "view cant be " + nodeNames[j] + ". It must be perspective or ortho.";

		}

		if (this.views[this.defaultView] == null)
			return "view '" + this.defaultView + "' does not exist";

		if (numViews == 0)
			return "at least one view must be defined";

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
			return "ambient component undefined for ambient";

		//r (red)
		var r = this.reader.getFloat(children[ambientIndex], 'r');

		if (!(r != null && !isNaN(r)))
			return "unable to parse R component of the ambient illumination for ambient";

		else if (r < 0 || r > 1)
			return "unable to parse R component of the ambient illumination for ambient";


		this.ambientSpecs[0] = r;

		//g (green)
		var g = this.reader.getFloat(children[ambientIndex], 'g');

		if (!(g != null && !isNaN(g)))
			return "unable to parse G component of the ambient illumination for ambient";


		else if (g < 0 || g > 1)
			return "unable to parse G component of the ambient illumination for ambient";


		this.ambientSpecs[1] = g;

		//b (blue)
		var b = this.reader.getFloat(children[ambientIndex], 'b');

		if (!(b != null && !isNaN(b)))
			return "unable to parse G component of the ambient illumination for ambient";


		else if (b < 0 || b > 1)
			return "unable to parse G component of the ambient illumination for ambient";

		this.ambientSpecs[2] = b;

		//a (alpha)
		var a = this.reader.getFloat(children[ambientIndex], 'a');

		if (!(a != null && !isNaN(a)))
			return "unable to parse A component of the ambient illumination for ambient";


		else if (a < 0 || a > 1)
			return "unable to parse A component of the ambient illumination for ambient";


		this.ambientSpecs[3] = a;

		//background
		this.backgroundSpecs = [];
		var backgroundIndex = nodeNames.indexOf("background");

		if (backgroundIndex == -1)
			return "background component undefined for ambient";

		//r (red)
		var r = this.reader.getFloat(children[backgroundIndex], 'r');

		if (!(r != null && !isNaN(r)))
			return "unable to parse R component of the background illumination for ambient";


		else if (r < 0 || r > 1)
			return "unable to parse R component of the background illumination for ambient";


		this.backgroundSpecs[0] = r;

		//g (green)
		var g = this.reader.getFloat(children[backgroundIndex], 'g');

		if (!(g != null && !isNaN(g)))
			return "unable to parse G component of the background illumination for ambient";


		else if (g < 0 || g > 1)
			return "unable to parse G component of the background illumination for ambient";


		this.backgroundSpecs[1] = g;

		//b (blue)
		var b = this.reader.getFloat(children[backgroundIndex], 'b');

		if (!(b != null && !isNaN(b)))
			return "unable to parse B component of the background illumination for ambient";


		else if (b < 0 || b > 1)
			return "unable to parse B component of the background illumination for ambient";


		this.backgroundSpecs[2] = b;

		//a (alpha)
		var a = this.reader.getFloat(children[backgroundIndex], 'a');

		if (!(a != null && !isNaN(a)))
			return "unable to parse A component of the background illumination for ambient";


		else if (a < 0 || a > 1)
			return "unable to parse A component of the background illumination for ambient";


		this.backgroundSpecs[3] = a;

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

			if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
				this.onXMLMinorErro("unknown tag <" + children[i].nodeName + ">");
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

			if (enableLight == null || isNaN(enableLight) || (enableLight != 0 && enableLight != 1)) {
				enableLight = 1;
				this.onXMLMinorErro("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");
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
					return "unable to parse w-coordinate of the light location for ID = " + lightId;
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

			var target = [];
			var angle;
			var exponent;

			if (children[i].nodeName == "spot") {
				//Retrieve the angle component
				angle = this.reader.getFloat(children[i], 'angle');
				if (!(angle != null && !isNaN(angle)))
					return "unable to parse angle component for ID = " + lightId;


				//Retrieve the exponent component
				exponent = this.reader.getFloat(children[i], 'exponent');
				if (!(exponent != null && !isNaN(exponent)))
					return "unable to parse exponent component for ID = " + lightId;

				//Retrieve the target component					
				var targetIndex = nodeNames.indexOf("target");

				if (targetIndex != -1) {

					// X
					var x = this.reader.getFloat(grandChildren[targetIndex], 'x');
					if (!(x != null && !isNaN(x)))
						return "unable to parse x component of the target for ID = " + lightId;
					else
						target.push(x);

					// Y
					var y = this.reader.getFloat(grandChildren[targetIndex], 'y');
					if (!(y != null && !isNaN(y)))
						return "unable to parse y component of the target for ID = " + lightId;
					else
						target.push(y);

					// Z
					var z = this.reader.getFloat(grandChildren[targetIndex], 'z');
					if (!(z != null && !isNaN(z)))
						return "unable to parse z component of the target for ID = " + lightId;
					else
						target.push(z);
				}
				else
					return "target component undefined for ID = " + lightId;
			}

			if (children[i].nodeName == "omni")
				this.lights[lightId] = [enableLight, locationLight, ambientIllumination, diffuseIllumination, specularIllumination];
			else
				this.lights[lightId] = [enableLight, locationLight, ambientIllumination, diffuseIllumination, specularIllumination, target, angle, exponent];

			numLights++;
		}

		if (numLights == 0)
			return "at least one light must be defined";
		else if (numLights > 8)
			this.onXMLMinorErro("too many lights defined; WebGL imposes a limit of 8 lights");


		this.log("Parsed lights");

		return null;
	}

	/**
	 * Parses the <textures> block. 
	 * @param {textures block element} texturesNode
	 */
	parseTextures(texturesNode) {

		this.textures = [];

		var nTextures = 0;
		var children = texturesNode.children;

		for (var i = 0; i < children.length; i++) {
			if (children[i].nodeName != "texture") {
				this.onXMLMinorErro("unknown tag <" + children[i].nodeName + ">");
				continue;
			}

			else {
				//id
				var id = this.reader.getString(children[i], 'id')

				if (id == null)
					return "unable to parse id value for texture";

				if (this.textures[id] != null)
					return "textures id have to be unique";

				//file
				var file = this.reader.getString(children[i], 'file');

				if (file == null)
					return "unable to parse file for texture " + id;

				var texture = new CGFtexture(this.scene, "./scenes/" + file);
				this.textures[id] = texture;
				nTextures++;
			}
		}

		if (nTextures == 0)
			return "at least one texture must be defined";

		this.log("Parsed textures");

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

		for (var i = 0; i < children.length; i++) {

			if (children[i].nodeName != "material") {
				this.onXMLMinorErro("unknown tag <" + children[i].nodeName + ">");
				continue;
			}

			//id
			var materialId = this.reader.getString(children[i], 'id');

			if (materialId == null)
				return "unable to parse id value for material";

			if (this.materials[materialId] != null)
				return "ID must be unique for each material (conflict: ID = " + materialId + ")";

			//Specifications for the current material

			var shininessMaterial = this.reader.getFloat(children[i], 'shininess')

			if (shininessMaterial == null || isNaN(shininessMaterial))
				return "unable to parse value component of the 'shininess' field for ID = " + lightId;

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

			if (emissionMaterial != 1) {
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

			var material = new CGFappearance(this.scene);
			material.setShininess(shininessMaterial);
			material.setEmission(emissionMaterial[0], emissionMaterial[1], emissionMaterial[2], emissionMaterial[3]);
			material.setAmbient(ambientIllumination[0], ambientIllumination[1], ambientIllumination[2], ambientIllumination[3]);
			material.setDiffuse(diffuseIllumination[0], diffuseIllumination[1], diffuseIllumination[2], diffuseIllumination[3]);
			material.setSpecular(specularIllumination[0], specularIllumination[1], specularIllumination[2], specularIllumination[3]);

			this.materials[materialId] = material;
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
		var numTransformations = 0;

		var grandChildren = []
		var nodeNames = [];

		for (var i = 0; i < children.length; i++) {

			if (children[i].nodeName != "transformation") {
				this.onXMLMinorErro("unknown tag <" + children[i].nodeName + ">");
				continue;
			}

			//Get id of current transformation
			var transfId = this.reader.getString(children[i], 'id');

			if (transfId == null)
				return "unable to parse value for transformation id";

			if (this.transformations[transfId] != null)
				return "ID must be unique for each transformation (conflict: ID = " + transfId + ")";

			grandChildren = children[i].children;

			var matrix = mat4.create();
			mat4.identity(matrix);
			//Retrieves transformation
			for (var j = 0; j < grandChildren.length; j++) {
				switch (grandChildren[j].nodeName) {
					case "translate":
						{
							//x
							var x = this.reader.getFloat(grandChildren[j], 'x');

							if (x == null || isNaN(x))
								return "unable to parse x-coordinate of translation for ID = " + transfId;

							//y
							var y = this.reader.getFloat(grandChildren[j], 'y');
							if (y == null || isNaN(y))
								return "unable to parse y-coordinate of translation for ID = " + transfId;


							//z
							var z = this.reader.getFloat(grandChildren[j], 'z');
							if (z == null || isNaN(z))
								return "unable to parse z-coordinate of translation for ID = " + transfId;

							mat4.translate(matrix, matrix, [x, y, z]);
							break;
						}
					case "rotate":
						{
							//axis of rotation
							var axis = this.reader.getString(grandChildren[j], 'axis');

							if (axis == null ||
								(axis != "x" && axis != "y" && axis != "z"))
								return "unable to parse axis of rotation for ID = " + transfId;

							//angle
							var angle = this.reader.getFloat(grandChildren[j], 'angle');
							if (angle == null || isNaN(angle))
								return "unable to parse angle of rotation for ID = " + transfId;

							if (axis == "x")
								axis = [1, 0, 0];

							else if (axis == "y")
								axis = [0, 1, 0];

							else if (axis == "z")
								axis = [0, 0, 1];

							mat4.rotate(matrix, matrix, angle * DEGREE_TO_RAD, axis);
							break;
						}
					case "scale":
						{
							//x
							var x = this.reader.getFloat(grandChildren[j], 'x');
							if (x == null || isNaN(x))
								return "unable to parse x-coordinate of scale for ID = " + transfId;

							//y
							var y = this.reader.getFloat(grandChildren[j], 'y');
							if (y == null || isNaN(y))
								return "unable to parse y-coordinate of scale for ID = " + transfId;


							//z
							var z = this.reader.getFloat(grandChildren[j], 'z');
							if (z == null || isNaN(z))
								return "unable to parse z-coordinate of scale for ID = " + transfId;

							mat4.scale(matrix, matrix, [x, y, z]);
							break;
						}

					default:
						return "unable to parse type of transformation for ID = " + transfId;
				}

			}
			this.transformations[transfId] = matrix;
			numTransformations++;
		}

		if (numTransformations == 0)
			return "at least one transformation must be defined";

		this.log("Parsed transformations");
		return null;

	}
	/**
	 * Parses the <animations> node.
	 * @param {animations block element} animationsNode
	 */
	parseAnimations(animationsNode) {

		this.animations = [];

		var children = animationsNode.children;

		for (var i = 0; i < children.length; i++) {
			if (children[i].nodeName != "linear" && children[i].nodeName != "circular") {
				this.onXMLMinorErro("unknown tag <" + children[i].nodeName + ">");
				continue;
			}

			//Animation id
			var animationId = this.reader.getString(children[i], 'id');
			if (animationId == null)
				return "unable to parse id value for animation";

			// Checks for repeated IDs.
			if (this.animations[animationId] != null)
				return "ID must be unique for each animation (conflict: ID = " + animationId + ")";

			// Animation span
			var animationSpan = this.reader.getFloat(children[i], 'span');

			if (animationSpan == null || isNaN(animationSpan))
				return "unable to parse span of the animation for ID = " + animationId;

			if (children[i].nodeName == "linear") {
				var grandChildren = children[i].children;

				var numControlPoints = 0;
				var controlPoints = [];

				for (var j = 0; j < grandChildren.length; j++) {
					if (grandChildren[j].nodeName != "controlpoint") {
						this.onXMLMinorErro("unknown tag <" + grandChildren[j].nodeName + ">");
						continue;
					}

					var x = this.reader.getFloat(grandChildren[j], 'xx');
					if (!(x != null && !isNaN(x)))
						return "unable to parse x-coordinate of the control point for animation ID = " + animationId;

					var y = this.reader.getFloat(grandChildren[j], 'yy');
					if (!(y != null && !isNaN(y)))
						return "unable to parse y-coordinate of the control point for animation ID = " + animationId;

					var z = this.reader.getFloat(grandChildren[j], 'zz');
					if (!(z != null && !isNaN(z)))
						return "unable to parse z-coordinate of the control point for animation ID = " + animationId;

					controlPoints.push([x, y, z]);
					numControlPoints++;
				}

				if (numControlPoints < 2)
					return "at least two control points should be defined for animation ID = " + animationId;

				this.animations[animationId] = ["Linear", animationSpan, controlPoints];
			}

			else if (children[i].nodeName == "circular") {
				//Center
				var center = this.reader.getVector3(children[i], 'center');

				if (!(center[0] != null && !isNaN(center[0])))
					return "unable to parse x-coordinate of center for animation ID = " + animationId;

				if (!(center[1] != null && !isNaN(center[1])))
					return "unable to parse y-coordinate of center for animation ID = " + animationId;

				if (!(center[2] != null && !isNaN(center[2])))
					return "unable to parse z-coordinate of center for animation ID = " + animationId;

				//Radius	
				var radius = this.reader.getFloat(children[i], 'radius');

				if (!(radius != null && !isNaN(radius)))
					return "unable to parse radius for animation ID = " + animationId;

				//Start angle
				var startAng = this.reader.getFloat(children[i], 'startang');

				if (!(startAng != null && !isNaN(startAng)))
					return "unable to parse start angle for animation ID = " + animationId;

				//Start angle
				var rotAng = this.reader.getFloat(children[i], 'rotang');

				if (!(rotAng != null && !isNaN(rotAng)))
					return "unable to parse rotation angle for animation ID = " + animationId;

				this.animations[animationId] = ["Circular", animationSpan, center, radius, startAng, rotAng];

			}

		}

		this.log("Parsed animations");

		return null;
	}

	/**
	* Parses the <primitives> node.
	* @param {primitives block element} primitivesNode
	*/
	parsePrimitives(primitivesNode) {

		this.primitives = [];

		var children = primitivesNode.children;
		var numPrimitives = 0;

		for (var i = 0; i < children.length; i++) {
			if (children[i].nodeName != "primitive") {
				this.onXMLMinorErro("unknown tag <" + children[i].nodeName + ">");
				continue;
			}

			//id
			var primitiveId = this.reader.getString(children[i], 'id');

			if (primitiveId == null)
				return "unable to parse id value for primitive";

			if (this.primitives[primitiveId] != null)
				return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";

			//gets primitive specifications
			var primitiveSpecs = children[i].children;
			switch (primitiveSpecs[0].nodeName) {
				case "rectangle":
					{
						//x1 
						var x1 = this.reader.getFloat(primitiveSpecs[0], 'x1');
						if (x1 == null || isNaN(x1))
							return "unable to parse x1-coordinate for ID = " + primitiveId;

						//y1 
						var y1 = this.reader.getFloat(primitiveSpecs[0], 'y1');
						if (y1 == null || isNaN(y1))
							return "unable to parse y1-coordinate for ID = " + primitiveId;


						//x2 
						var x2 = this.reader.getFloat(primitiveSpecs[0], 'x2');
						if (x2 == null || isNaN(x2))
							return "unable to parse x2-coordinate for ID = " + primitiveId;

						//y2 
						var y2 = this.reader.getFloat(primitiveSpecs[0], 'y2');
						if (y2 == null || isNaN(y2))
							return "unable to parse y2-coordinate for ID = " + primitiveId;

						this.primitives[primitiveId] = new MyQuad(this.scene, [x1, y1, x2, y2]);
						numPrimitives++;
						break;
					}

				case "triangle":
					{

						//x1 
						var x1 = this.reader.getFloat(primitiveSpecs[0], 'x1');

						if (x1 == null || isNaN(x1))
							return "unable to parse x1-coordinate for ID = " + primitiveId;

						//y1 
						var y1 = this.reader.getFloat(primitiveSpecs[0], 'y1');
						if (y1 == null || isNaN(y1))
							return "unable to parse y1-coordinate for ID = " + primitiveId;

						//z1 
						var z1 = this.reader.getFloat(primitiveSpecs[0], 'z1');
						if (z1 == null || isNaN(z1))
							return "unable to parse z1-coordinate for ID = " + primitiveId;


						//x2
						var x2 = this.reader.getFloat(primitiveSpecs[0], 'x2');

						if (x2 == null || isNaN(x2))
							return "unable to parse x2-coordinate for ID = " + primitiveId;

						//y2
						var y2 = this.reader.getFloat(primitiveSpecs[0], 'y2');
						if (y2 == null || isNaN(y2))
							return "unable to parse y2-coordinate for ID = " + primitiveId;

						//z2 
						var z2 = this.reader.getFloat(primitiveSpecs[0], 'z2');
						if (z2 == null || isNaN(z2))
							return "unable to parse z2-coordinate for ID = " + primitiveId;

						//x3
						var x3 = this.reader.getFloat(primitiveSpecs[0], 'x3');

						if (x3 == null || isNaN(x3))
							return "unable to parse x3-coordinate for ID = " + primitiveId;

						//y3
						var y3 = this.reader.getFloat(primitiveSpecs[0], 'y3');
						if (y3 == null || isNaN(y3))
							return "unable to parse y3-coordinate for ID = " + primitiveId;

						//z3 
						var z3 = this.reader.getFloat(primitiveSpecs[0], 'z3');
						if (z3 == null || isNaN(z3))
							return "unable to parse z3-coordinate for ID = " + primitiveId;

						this.primitives[primitiveId] = new MyTriangle(this.scene, [x1, y1, z1, x2, y2, z2, x3, y3, z3]);
						numPrimitives++;
						break;
					}

				case "cylinder":
					{

						//base
						var base = this.reader.getFloat(primitiveSpecs[0], 'base');
						if (base == null || isNaN(base))
							return "unable to parse base component for ID = " + primitiveId;

						//top 
						var cTop = this.reader.getFloat(primitiveSpecs[0], 'top');
						if (cTop == null || isNaN(cTop))
							return "unable to parse top component for ID = " + primitiveId;


						//height 
						var height = this.reader.getFloat(primitiveSpecs[0], 'height');
						if (height == null || isNaN(height))
							return "unable to parse height component for ID = " + primitiveId;


						//slices 
						var slices = this.reader.getFloat(primitiveSpecs[0], 'slices');
						if (slices == null || !Number.isInteger(slices))
							return "unable to parse slices component for ID = " + primitiveId;


						//stacks 
						var stacks = this.reader.getFloat(primitiveSpecs[0], 'stacks');
						if (stacks == null || !Number.isInteger(stacks))
							return "unable to parse stacks component for ID = " + primitiveId;


						this.primitives[primitiveId] = new MySolidCylinder(this.scene, [height, base, cTop, stacks, slices]);
						numPrimitives++;

						break;
					}

				case "sphere":
					{

						//radius
						var radius = this.reader.getFloat(primitiveSpecs[0], 'radius');
						if (radius == null || isNaN(radius))
							return "unable to parse radius component for ID = " + primitiveId;


						//slices 
						var slices = this.reader.getFloat(primitiveSpecs[0], 'slices');
						if (slices == null || !Number.isInteger(slices))
							return "unable to parse slices component for ID = " + primitiveId;


						//stacks 
						var stacks = this.reader.getFloat(primitiveSpecs[0], 'stacks');
						if (stacks == null || !Number.isInteger(stacks))
							return "unable to parse stacks component for ID = " + primitiveId;

						this.primitives[primitiveId] = new MySphere(this.scene, [radius, slices, stacks]);
						numPrimitives++;

						break;
					}

				case "torus":
					{
						//inner
						var inner = this.reader.getFloat(primitiveSpecs[0], 'inner');
						if (inner == null || isNaN(inner))
							return "unable to parse inner component for ID = " + primitiveId;


						//outer 
						var outer = this.reader.getFloat(primitiveSpecs[0], 'outer');
						if (outer == null || isNaN(outer))
							return "unable to parse outer component for ID = " + primitiveId;


						//slices 
						var slices = this.reader.getFloat(primitiveSpecs[0], 'slices');
						if (slices == null || !Number.isInteger(slices))
							return "unable to parse slices component for ID = " + primitiveId;

						//loops 
						var loops = this.reader.getFloat(primitiveSpecs[0], 'loops');
						if (loops == null || !Number.isInteger(loops))
							return "unable to parse loops component for ID = " + primitiveId;

						this.primitives[primitiveId] = new MyTorus(this.scene, [inner, outer, slices, loops]);
						numPrimitives++;

						break;
					}

				case "plane":
					{
						//npartsU
						var npartsU = this.reader.getFloat(primitiveSpecs[0], 'npartsU');
						if(npartsU == null || !Number.isInteger(npartsU))
							return "unable to parse npartsU for primitive ID = " + primitiveId;

						//npartsV
						var npartsV = this.reader.getFloat(primitiveSpecs[0], 'npartsV');
						if(npartsV == null || !Number.isInteger(npartsV))
							return "unable to parse npartsV for primitive ID = " + primitiveId;		

						this.primitives[primitiveId] = new Plane(this.scene, npartsU, npartsV);
						numPrimitives++;
						break;
					}

				case "patch":
					{
						//npointsU
						var npointsU = this.reader.getFloat(primitiveSpecs[0], 'npointsU');
						if(npointsU == null || !Number.isInteger(npointsU))
							return "unable to parse npointsU for primitive ID = " + primitiveId;

						//npointsV
						var npointsV = this.reader.getFloat(primitiveSpecs[0], 'npointsV');
						if(npointsV == null || !Number.isInteger(npointsV))
							return "unable to parse npointsV for primitive ID = " + primitiveId;	
							
						//npartsU
						var npartsU = this.reader.getFloat(primitiveSpecs[0], 'npartsU');
						if(npartsU == null || !Number.isInteger(npartsU))
							return "unable to parse npartsU for primitive ID = " + primitiveId;

						//npartsV
						var npartsV = this.reader.getFloat(primitiveSpecs[0], 'npartsV');
						if(npartsV == null || !Number.isInteger(npartsV))
							return "unable to parse npartsV for primitive ID = " + primitiveId;	
						
						let numControlPoints = 0;
						let controlPoints = [];

						for(let j = 0; j < primitiveSpecs[0].children.length; j++)
						{
							if (primitiveSpecs[0].children[j].nodeName != "controlpoint") {
								this.onXMLMinorErro("unknown tag <" + primitiveSpecs[0].children[j].nodeName + ">");
								continue;
							}

							let controlPoint = primitiveSpecs[0].children[j];

							var x = this.reader.getFloat(controlPoint, 'xx');
							if (!(x != null && !isNaN(x)))
								return "unable to parse x-coordinate of the control point for primitive ID = " + primitiveId;
		
							var y = this.reader.getFloat(controlPoint, 'yy');
							if (!(y != null && !isNaN(y)))
								return "unable to parse y-coordinate of the control point for primitive ID = " + primitiveId;
		
							var z = this.reader.getFloat(controlPoint, 'zz');
							if (!(z != null && !isNaN(z)))
								return "unable to parse z-coordinate of the control point for primitive ID = " + primitiveId;
		
							controlPoints.push([x, y, z, 1]);
							numControlPoints++;
						}	
						
						if(numControlPoints != npointsU * npointsV)
							return "number of control points must be equal to npointsU * npointsV for primitive ID = " + primitiveId;

						this.primitives[primitiveId] = new Patch(this.scene, npointsU, npointsV, npartsU, npartsV, controlPoints);
						numPrimitives++;

						break;
					}
					case "cylinder2":
					{
						//base
						var base = this.reader.getFloat(primitiveSpecs[0], 'base');
						if (base == null || isNaN(base))
							return "unable to parse base component for ID = " + primitiveId;

						//top 
						var cTop = this.reader.getFloat(primitiveSpecs[0], 'top');
						if (cTop == null || isNaN(cTop))
							return "unable to parse top component for ID = " + primitiveId;


						//height 
						var height = this.reader.getFloat(primitiveSpecs[0], 'height');
						if (height == null || isNaN(height))
							return "unable to parse height component for ID = " + primitiveId;


						//slices 
						var slices = this.reader.getFloat(primitiveSpecs[0], 'slices');
						if (slices == null || !Number.isInteger(slices))
							return "unable to parse slices component for ID = " + primitiveId;


						//stacks 
						var stacks = this.reader.getFloat(primitiveSpecs[0], 'stacks');
						if (stacks == null || !Number.isInteger(stacks))
							return "unable to parse stacks component for ID = " + primitiveId;


						this.primitives[primitiveId] = new MyCylinder2(this.scene, base, cTop, height, slices, stacks);
						numPrimitives++;

						break;
					}
					case "terrain":
					{
						//idtexture
						var idtexture = this.reader.getString(primitiveSpecs[0], 'idtexture');

						if(idtexture == null)
							return "unable to parse idtexture for primitive ID = " + primitiveId;

						if(this.textures[idtexture] == null)
							return "texture ID = " + idtexture + " not found for primitive ID = " + primitiveId;

						//idheightmap
						var idheightmap = this.reader.getString(primitiveSpecs[0], 'idheightmap');

						if(idheightmap == null)
							return "unable to parse idheightmap for primitive ID = " + primitiveId;

						if(this.textures[idheightmap] == null)
							return "texture ID = " + idheightmap + " not found for primitive ID = " + primitiveId;	
						
						//parts
						var parts = this.reader.getFloat(primitiveSpecs[0],'parts');

						if (!(parts != null && !isNaN(parts)))
							return "unable to parse parts for primitive ID = " + primitiveId;

						if(!Number.isInteger(parts))
							return "parts must be an integer for primitive ID = " + primitiveId;

						//heightscale

						var heightscale = this.reader.getFloat(primitiveSpecs[0], 'heightscale');

						if (!(heightscale != null && !isNaN(heightscale)))
						return "unable to parse heightscale for primitive ID = " + primitiveId;

						this.primitives[primitiveId] = new Terrain (this.scene, idtexture, idheightmap, parts, heightscale);
						numPrimitives++;

						break;
					}
					case "water" :
					{
						//idtexture
						var idtexture = this.reader.getString(primitiveSpecs[0], 'idtexture');

						if(idtexture == null)
							return "unable to parse idtexture for primitive ID = " + primitiveId;

						if(this.textures[idtexture] == null)
							return "texture ID = " + idtexture + " not found for primitive ID = " + primitiveId;
						
						//idwavemap
						var idwavemap = this.reader.getString(primitiveSpecs[0], 'idwavemap');

						if(idwavemap == null)
							return "unable to parse idwavemap for primitive ID = " + primitiveId;

						if(this.textures[idwavemap] == null)
							return "texture ID = " + idwavemap + " not found for primitive ID = " + primitiveId;

						//parts
						var parts = this.reader.getFloat(primitiveSpecs[0],'parts');

						if (!(parts != null && !isNaN(parts)))
							return "unable to parse parts for primitive ID = " + primitiveId;

						if(!Number.isInteger(parts))
							return "parts must be an integer for primitive ID = " + primitiveId;

						//heightscale
						var heightscale = this.reader.getFloat(primitiveSpecs[0], 'heightscale');

						if (!(heightscale != null && !isNaN(heightscale)))
							return "unable to parse heightscale for primitive ID = " + primitiveId;

						//texscale
						var texscale = this.reader.getFloat(primitiveSpecs[0], 'texscale');

						if (!(texscale != null && !isNaN(texscale)))
							return "unable to parse texscale for primitive ID = " + primitiveId;

						numPrimitives++;							
						this.primitives[primitiveId] = new Water (this.scene, idtexture, idwavemap, parts, heightscale, texscale);

						break;
					}

				default:
					return "unable to parse this type for ID = " + primitiveId;
			}

		}

		if (numPrimitives == 0)
			return "at least one primitive must be defined";

		this.log("Parsed primitives");
		return null;

	}

	/**
	 * Parses the <components> block.
	 * @param {components block element} componentsNode
	 */
	parseComponents(componentsNode) {

		this.components = [];

		var children = componentsNode.children;

		for (var i = 0; i < children.length; i++) {
			if (children[i].nodeName != "component") {
				this.onXMLMinorErro("unknown tag <" + children[i].nodeName + ">");
				continue;
			}

			//id
			var componentId = this.reader.getString(children[i], 'id');

			if (componentId == null)
				return "unable to parse id value for component";

			if (this.components[componentId] != null)
				return "ID must be unique for each transformation (conflict: ID = " + componentId + ")";

			this.components[componentId] = new MyComponent(this.scene, componentId);

			//gets component grandChildren
			var grandChildren = children[i].children;

			for (var j = 0; j < grandChildren.length; j++) {

				switch (grandChildren[j].nodeName) {
					case "transformation":
						{

							var transfChildren = grandChildren[j].children;

							if (transfChildren.length == 0)
								break;

							for (var k = 0; k < transfChildren.length; k++) {
								if (transfChildren[k].nodeName == "transformationref") {
									var transId = this.reader.getString(transfChildren[k], 'id');

									if (transId == null)
										return "unable to parse id value for transformationref for ID = " + componentId;

									if (this.transformations[transId] == null)
										return "unable to parse id value for transformationref for ID = " + componentId;

									mat4.multiply(this.components[componentId].matrixTransf, this.components[componentId].matrixTransf, this.transformations[transId]);
								}

								else {
									switch (transfChildren[k].nodeName) {
										case "translate":
											{
												//x
												var x = this.reader.getFloat(transfChildren[k], 'x');

												if (x == null || isNaN(x))
													return "unable to parse x-coordinate of translation for ID = " + componentId;

												//y
												var y = this.reader.getFloat(transfChildren[k], 'y');
												if (y == null || isNaN(y))
													return "unable to parse y-coordinate of translation for ID = " + componentId;


												//z
												var z = this.reader.getFloat(transfChildren[k], 'z');
												if (z == null || isNaN(z))
													return "unable to parse z-coordinate of translation for ID = " + componentId;

												mat4.translate(this.components[componentId].matrixTransf, this.components[componentId].matrixTransf, [x, y, z]);

												break;
											}

										case "rotate":
											{
												//axis of rotation
												var axis = this.reader.getString(transfChildren[k], 'axis');

												if (axis == null ||
													(axis != "x" && axis != "y" && axis != "z"))
													return "unable to parse axis of rotation for ID = " + componentId;

												if (axis == "x")
													axis = [1, 0, 0];

												else if (axis == "y")
													axis = [0, 1, 0];

												else if (axis == "z")
													axis = [0, 0, 1];

												//angle
												var angle = this.reader.getFloat(transfChildren[k], 'angle');
												if (angle == null || isNaN(angle))
													return "unable to parse angle of rotation for ID = " + componentId;

												mat4.rotate(this.components[componentId].matrixTransf, this.components[componentId].matrixTransf, angle * DEGREE_TO_RAD, axis);

												break;
											}

										case "scale":
											{
												//x
												var x = this.reader.getFloat(transfChildren[k], 'x');
												if (x == null || isNaN(x))
													return "unable to parse x-coordinate of scale for ID = " + componentId;

												//y
												var y = this.reader.getFloat(transfChildren[k], 'y');
												if (y == null || isNaN(y))
													return "unable to parse y-coordinate of scale for ID = " + componentId;


												//z
												var z = this.reader.getFloat(transfChildren[k], 'z');
												if (z == null || isNaN(z))
													return "unable to parse z-coordinate of scale for ID = " + componentId;

												mat4.scale(this.components[componentId].matrixTransf, this.components[componentId].matrixTransf, [x, y, z]);

												break;
											}
										default:
											return "unable to parse this type of transformation for ID = " + componentId;
									}

								}
							}

							break;
						}

					case "animations":
						{
							var animationsChildren = grandChildren[j].children;

							for (var h = 0; h < animationsChildren.length; h++) {
								if (animationsChildren[h].nodeName != "animationref") {
									this.onXMLMinorErro("unknown tag <" + animationsChildren[h].nodeName + ">");
									continue;
								}

								var animationId = this.reader.getString(animationsChildren[h], 'id');

								if (animationId == null)
									return "unable to parse id value for animation for ID = " + componentId;

								if (this.animations[animationId] == null)
									return "unable to get animation '" + animationId + "' for ID = " + componentId;

								this.components[componentId].pushAnimation(animationId);
							}

							break;
						}

					case "materials":
						{

							var materialsChildren = grandChildren[j].children;

							if (materialsChildren.length == 0)
								return "at least one material must be defined for ID = " + componentId;

							for (var h = 0; h < materialsChildren.length; h++) {

								if (materialsChildren[h].nodeName != "material") {
									this.onXMLMinorErro("unknown tag <" + materialsChildren[h].nodeName + ">");
									continue;
								}
								else {
									var materialId = this.reader.getString(materialsChildren[h], 'id');
									if (materialId == null)
										return "unable to parse id value for material for ID = " + componentId;

									if (this.materials[materialId] == null && materialId != "none" && materialId != "inherit")
										return "unable to get material '" + materialId + "' for ID = " + componentId;

								}

								this.components[componentId].pushMaterial(materialId);

							}
							break;
						}

					case "texture":
						{
							var textureId = this.reader.getString(grandChildren[j], 'id');

							if (textureId == null)
								return "unable to parse id value for texture for ID = " + componentId;

							if (this.textures[textureId] == null && textureId != "none" && textureId != "inherit")
								return "unable to get texture '" + textureId + "' for ID = " + componentId;

							this.components[componentId].textureId = textureId;

							if (textureId == "none")
								continue;

							if (!this.reader.hasAttribute(grandChildren[j], 'length_s'))
								continue;

							//length_s
							var length_s = this.reader.getFloat(grandChildren[j], 'length_s');

							if (length_s == null || isNaN(length_s))
								return ("unable to parse length_s component of texture for ID = " + componentId);

							this.components[componentId].texS = length_s;

							//length_t 
							var length_t = this.reader.getFloat(grandChildren[j], 'length_t');
							if (length_t == null || isNaN(length_t))
								return ("unable to parse length_t component of texture for ID = " + componentId);

							this.components[componentId].texT = length_t;


							break;
						}

					case "children":
						{
							var childrenChildren = grandChildren[j].children;

							if (childrenChildren.length == 0)
								return "at least one child must be defined for ID = " + componentId;

							for (var l = 0; l < childrenChildren.length; l++) {
								if (childrenChildren[l].nodeName != "componentref" && childrenChildren[l].nodeName != "primitiveref") {
									this.onXMLMinorErro("unknown tag <" + childrenChildren[l].nodeName + ">");
									continue;
								}

								else {
									var childId = this.reader.getString(childrenChildren[l], 'id');

									if (childId == null)
										return "unable to parse id value for child for ID = " + componentId;

									if (childrenChildren[l].nodeName == "componentref") {
										this.components[componentId].pushComp(childId);
									}

									else {
										if (this.primitives[childId] == null)
											return "unable to parse primitiveref " + childId;

										this.components[componentId].pushPrim(childId);

									}

								}

							}
							break;
						}

					default:
						this.onXMLMinorErro("unknown tag <" + children[i].nodeName + ">");
						continue;
				}
			}
		}

		for (var key in this.components) {
			var currentComponent = this.components[key];

			for (var i = 0; i < currentComponent.childrenComp.length; i++) {
				if (this.components[currentComponent.childrenComp[i]] == null)
					return "component '" + currentComponent.childrenComp[i] + "' does not exist";
			}
		}

		this.log("Parsed components");
		return null;
	}

	makeSurface(degree1, degree2, uDivs, vDivs, controlvertexes) {

		var nurbsSurface = new CGFnurbsSurface(degree1, degree2, controlvertexes);

		var surface = new CGFnurbsObject(this.scene, uDivs, vDivs, nurbsSurface); 

		return surface;
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



	logPicking()
	{
		if (this.scene.pickMode == false) {
			
			if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {

				for (var i=0; i< this.scene.pickResults.length; i++) {

					var obj = this.scene.pickResults[i][0];
					if (obj)
					{
						var customId = this.scene.pickResults[i][1];				
						console.log("Picked object: " + obj + ", with pick id " + customId);
					}
				}
				this.scene.pickResults.splice(0,this.scene.pickResults.length);
			}		
		}

	}



	/**
	 * Displays the scene, processing each node, starting in the root node.
	 */
	displayScene() {

	if (this.scene.pickMode == false)
	{
		if (this.scene.interface.isKeyPressed("KeyM") == true)
			this.changeMaterials();



		this.logPicking();
		this.scene.clearPickRegistration();

		
		var root = this.components[this.root];
		this.displayComponent(root, root.materials[root.currentMaterial], root.texture, root.texS, root.texT);
	}

	//else if(this.scene.pickMode == true)
	//{
			for (i =0; i<5; i++) 
			{		
				for (var j =0; j<5; j++) 
				{
					this.scene.pushMatrix();

						this.scene.translate(5.25+j*0.7915, 3.10, 3.35+(i+1)*0.755);
						this.scene.rotate(-Math.PI/2, 1, 0, 0);
						this.scene.scale(0.775, 0.745, 1);
						

						this.scene.registerForPick(5*i+j+1, this.objects[5*i+j]);

						this.objects[5*i+j].display();
					this.scene.popMatrix();
				}
			}	
		//}
	}

	/**
	* Changes materials of components who have more than one
	*/
	changeMaterials() {
		for (var key in this.components) {
			var currentComponent = this.components[key];
			if (currentComponent.currentMaterial + 1 == currentComponent.materials.length)
				currentComponent.currentMaterial = 0;
			else
				currentComponent.currentMaterial++;

		}
	}

	/**
	* Recursive function to display components
	* @param {component to be displayed} component 
	* @param {parent's material} parenMat
	* @param {parent's texture} parentTex
	* @param {parent's scale factor S} parentTexS
	* @param {parent's scale factor T} parentTexT
	*/
	displayComponent(component, parentMat, parentTex, parentTexS, parentTexT) {

		var texture = parentTex;
		var material = parentMat;
		var texS = parentTexS;
		var texT = parentTexT;

		this.scene.pushMatrix();

		this.scene.multMatrix(component.matrixTransf);
		component.applyAnimationMatrix();

		if (component.materials[component.currentMaterial] != "inherit") {
			if (component.materials[component.currentMaterial] == "none")
				material = null;

			else
				material = this.materials[component.materials[component.currentMaterial]];
		}

		if (component.textureId != "inherit") {
			if (component.textureId == "none")
				texture = null;

			else {
				texture = this.textures[component.textureId];
				texS = component.texS
				texT = component.texT
			}
		}

		for (var i = 0; i < component.childrenComp.length; i++) {
			var childrenId = component.childrenComp[i];
			this.displayComponent(this.components[childrenId], material, texture, texS, texT);
		}

		if (material != null)
			material.apply();

		if (texture != null)
			texture.bind();

		for (var j = 0; j < component.childrenPrim.length; j++) {
			
			var primitiveId = component.childrenPrim[j];
			var primitive = this.primitives[primitiveId];

			if((primitive.getType() != "Cylinder2") && 
			   (primitive.getType() != "Water") && 
			   (primitive.getType() != "Terrain") && 
			   (primitive.getType() != "Patch") && 
			   (primitive.getType() != "Plane"))
			   
				primitive.updateTex(texS, texT);

			if(primitive.getType() == "Water")
				primitive.update();

			primitive.display();
		}

		this.scene.popMatrix();
	}

}