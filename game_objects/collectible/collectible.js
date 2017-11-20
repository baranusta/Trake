class Collectible extends RectangleGameObject{
    constructor(center){
        super(center,collectibleSize,DIRECTION.NORTH);
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