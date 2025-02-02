class Terrain extends CGFobject {

    /**
     * Constructor
     * 
     * @param {Scene} scene 
     * @param {Texture to cover plane} idtexture 
     * @param {Texture used as height map} idheightmap 
     * @param {Number of parts} parts 
     * @param {Heigth Scale} heightscale 
     */
    constructor(scene, idtexture, idheightmap, parts, heightscale)
    {
        super(scene);

        this.textureId = idtexture;
        this.heightmapId = idheightmap;
        this.parts = parts,
        this.heightscale = heightscale;

        this.plane = new Plane (scene, parts, parts);
        this.shader = new CGFshader(this.scene.gl, "shaders/terrain.vert", "shaders/terrain.frag");
        this.shader.setUniformsValues({normScale: this.heightscale});
        this.shader.setUniformsValues({heightMap: 1}); 
    }

    /**
     * Changes shader according to terrain variables and displays it
     */
    display()
    {
        this.scene.pushMatrix();
        this.scene.setActiveShader(this.shader);
        this.scene.graph.textures[this.heightmapId].bind(1);
        this.scene.graph.textures[this.textureId].bind();
        this.plane.display();
        this.scene.popMatrix();

        this.scene.setActiveShader(this.scene.defaultShader);
    }

    /**
	 * Returns type of primitive
	 */
    getType()
    {
        return "Terrain";
    }
}