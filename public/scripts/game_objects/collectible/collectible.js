class Collectible extends RectangleGameObject{
    constructor(center){
        super(center,[collectibleSize[0]/aspectRatio,collectibleSize[1]],DIRECTION.NORTH);
    }

    draw(frame)
    {
        super.draw(frame, this.color);
    }

    //returns false if there is no usePower functionality
    apply(snake){
        return false;
    }
}