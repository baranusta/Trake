class Collectible extends RectangleGameObject{
    constructor(center){
        super(center,[collectibleSize[0]/aspectRatio,collectibleSize[1]],DIRECTION.NORTH);
    }

    draw(frame)
    {
        super.draw(frame, this.color);
    }
}