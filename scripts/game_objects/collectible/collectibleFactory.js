class CollectibleFactory {
    static getCollectible(snakes, choice, pos) {
        let collectible;
        let posFound = true;
        if(pos === undefined){
            do {
                let center = [Math.random() * 1.9 - 1.0, Math.random() * 1.9 - 1.0];
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
            collectible = new Collectible(pos);
        }
        let type;
        if (choice === undefined)
            type = getRandomInt(0, 1);
        else
            type = choice;
        switch (type) {
            case 0://Bait
                collectible.color = vec4(1.0, 1.0, 1.0, 1.0);
                collectible.applyPower = function (player) {
                    player.changingLength += baitAddLength;
                };
                break;
            case 1:
                collectible.color = vec4(1.0, 0.0, 1.0, 1.0);
                collectible.applyPower = function (player) {
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