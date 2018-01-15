class CollectibleFactory {
    static getCollectible(snakes, choice, pos) {
        let center;
        let collectible;
        let posFound = true;
        if(pos === undefined){
            do {
                center = [Math.random() * 1.9 - 1.0, Math.random() * 1.9 - 1.0];
                collectible = new Collectible(center);
                for (let i = 0; i < snakes.length && posFound; i++) {
                    snakes[i].eachCollisionBox(function (collisionBox) {
                        if (Physics.isColliding(collectible.collider, collisionBox)) {
                            posFound = false;
                            return;
                        }
                    });
                }
            } while (!posFound)
        }
        else{
            center = pos;
        }
        let type;
        if (choice === undefined)
            type = getRandomInt(1, 2);
        else
            type = choice;
        switch (type) {
            case 0://Bait
                collectible = new Collectible(center);
                collectible.color = vec4(0.0, 0.0, 0.0, 1.0);
                collectible.apply = function (player) {
                    player.changingLength += baitAddLength;
                };
                break;
            case 1:
                collectible = new SpeedUp(center);
                break;
            case 2:
                collectible = new PerminentSpeedUp(center);
                break;
            default:
                break;
        }
        collectible.type = type;
        return collectible;
    }
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}