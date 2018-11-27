/**
 * MySolidCylinder
 * @constructor
 */
function MySolidCylinder(scene, args)
{
	CGFobject.call(this,scene);
    
    this.theCylinder = new MyCylinder(scene, args);
    this.theCylinder.initBuffers();

    args = args;//.split(" ").map(x => parseInt(x, 10));
 
    this.height = args[0]; 
    this.bot = args[1];
    this.top = args[2];
    this.stacks = args[3];
    this.slices = args[4];


    this.theBotFace = new MyCircle(scene, this.bot, this.slices);
 	this.theBotFace.initBuffers();

    this.theTopFace = new MyCircle(scene, this.top, this.slices);
 	this.theTopFace.initBuffers();
};

MySolidCylinder.prototype = Object.create(CGFobject.prototype);
MySolidCylinder.prototype.constructor = MySolidCylinder;


MySolidCylinder.prototype.display = function()
{
    this.scene.pushMatrix();

        this.scene.translate(0, 0, this.height/2);

        this.scene.pushMatrix();
            this.scene.translate(0, 0, this.height/2);
            this.theTopFace.display();
            this.scene.translate(0, 0, -this.height);
            this.scene.rotate(Math.PI, 1, 0, 0);
            this.theBotFace.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0, 0, -this.height/2);
            this.theCylinder.display();
        this.scene.popMatrix();

    this.scene.popMatrix();
};

MySolidCylinder.prototype.updateTex = function(S,T) {
	
	this.theCylinder.updateTex (S,T);
	this.theBotFace.updateTex (S,T);
	this.theTopFace.updateTex(S,T);
	
};

/**
 * Returns type of primitive
 */
MySolidCylinder.prototype.getType = function()
{
    return "Cylinder";
}