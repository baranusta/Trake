class CollectibleFactory{
    static getCollectible(center){
        let collectible = new Collectible(center);
        let type = getRandomInt(0 , 1);
        switch(type){
            case 0://Bait
                collectible.applyPower = function(player){
                    player.changingLength += baitAddLength;
                };
            break;
            case 1:
                collectible.applyPower = function(player){
                    console.log("oyy");
                };
            break;
            default:
            break;
        }
        return collectible;
    }
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}