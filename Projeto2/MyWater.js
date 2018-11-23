class Water extends CGFobject {

    /**
     * 
     * @param {Scene} scene 
     * @param {Texture to cover plane} idtexture 
     * @param {Texture used as wave (heigth) map} idwavemap 
     * @param {Number of parts} parts 
     * @param {Heigth scale} heightscale 
     * @param {Texture scale} texscale 
     */
    constructor(scene, idtexture, idwavemap, parts, heightscale, texscale)
    {
        super(scene),

        this.textureId = idtexture;
        this.waveMapId = idwavemap;
        this.parts = parts,
        this.heightscale = heightscale;
        this.texscale = texscale;

        this.plane = new Plane (scene, parts, parts);

    }
    /**
     * Changes shader according to terrain variables and displays it
     */
    display()
    {
        this.scene.pushMatrix();
        this.scene.setActiveShader(this.scene.graph.waterShader);
        this.scene.graph.waterShader.setUniformsValues({texScale: this.texscale});
        this.scene.graph.waterShader.setUniformsValues({normScale: this.heightscale});
        this.scene.graph.textures[this.waveMapId].bind(1);
		this.scene.graph.waterShader.setUniformsValues({heightMap: 1});   
        this.scene.graph.textures[this.textureId].bind();
        this.plane.display();
        this.scene.popMatrix();

        this.scene.setActiveShader(this.scene.defaultShader);

    }
}