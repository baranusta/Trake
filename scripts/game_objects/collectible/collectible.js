class Collectible extends RectangleGameObject{
    constructor(center){
        super(center,[collectibleSize[0]/aspectRatio,collectibleSize[1]],DIRECTION.NORTH);
    }

    draw(frame)
    {
        super.draw(frame, this.color);
    }

    apply(player){
        if(player instanceof Snake){
            this.applyPower(player);
        }
        else
        {
            throw "wrong apply parameter";
        }
    }
}