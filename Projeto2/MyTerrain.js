class Terrain extends CGFobject {

    constructor(scene, idtexture, idheightmap, parts, heightscale)
    {
        super(scene),

        this.textureId = idtexture;
        this.heightmapId = idheightmap;
        this.parts = parts,
        this.heightscale = heightscale;
    }
}