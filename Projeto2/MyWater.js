class Water extends CGFobject {

    constructor(scene, idtexture, idwavemap, parts, heightscale, texscale)
    {
        super(scene),

        this.textureId = idtexture;
        this.wavemapId = idwavemap;
        this.parts = parts,
        this.heightscale = heightscale;
        this.texscale = texscale;
    }
}