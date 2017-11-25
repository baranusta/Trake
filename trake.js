
let player_1;
let player_2;
let world = {};
let collectibles = [];
let frame = 0;

let gameEnded = false;

window.onload = function () {
    let canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("yo");
    }
    viewSize = [canvas.width, canvas.height];
    aspectRatio = viewSize[0]/viewSize[1];

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 1.0, 0, 1);

    player_1 = new Snake("P_1", vec2(-.3, 0), DIRECTION.NORTH);
    player_2 = new Snake("P_1", vec2(.3, 0), DIRECTION.NORTH);
    world.boundaries = new Box([0, 0], [2, 2]);
    loadTexture(gl,"http://localhost:10001/snake-head.png", function(texture){
        player_1.head.addTexture(texture);
        player_2.head.addTexture(texture);
        gameLoop();
    });
}

const gameLoop = function () {
    gl.clear(gl.COLOR_BUFFER_BIT);
    frame++;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
    if (!gameEnded) {

        checkPlayerCollision(0, [player_1, player_2], collectibles);
        checkPlayerCollision(1, [player_1, player_2], collectibles);
        
        if (move){
            player_1.update();            
            //player_2.update();            
        }


        collectibles.forEach(function(each){
            each.draw();
        })
        player_1.draw(frame);
        player_2.draw(frame);
        window.requestAnimationFrame(gameLoop);
    }
    else {
        window.cancelAnimationFrame(gameLoop);
    }
}

const checkPlayerCollision = function (playerInConcernIndex, players, collectibles, ) {
    if (!Array.isArray(players) || !Array.isArray(collectibles)) {
        console.error("wrong parameters");
        return;
    }

    for (let i = 0; i < collectibles.length; i++) {
        const collectible = collectibles[i];
        if (Physics.isColliding(collectible.collider, players[playerInConcernIndex].getCollider())) {
            console.log("player" + playerInConcernIndex+ " collected");
            collectible.apply(players[playerInConcernIndex]);
            collectibles.splice(i, 1);
            break;
        }
    }

    players[playerInConcernIndex].eachCollisionBox(function (collisionBox) {
        for (let i = 0; i < players.length; i++) {
            const player = players[i];
            if (playerInConcernIndex !== i && Physics.isColliding(player.getCollider(), collisionBox)) {
                console.log("player" + playerInConcernIndex+ "  collided");
                return false;
            }
        }


        if (Physics.isColliding(players[playerInConcernIndex].getCollider(), collisionBox)) {
            if (!players[playerInConcernIndex].isFirstPartsCollisionBox(collisionBox)) {
                console.log("player" + playerInConcernIndex+ " self collided");
                return false;
            }
        }
        return true;
    });
}

var move = true;
document.onkeydown = function (e) {
    console.log(e.keyCode);
    if (e.keyCode == 39) {
        player_1.turn(true);
    }
    else if (e.keyCode == 37)
        player_1.turn(false);
    else if (e.keyCode == 65) {
        move = !move;
    }
    else if (e.keyCode == 66) {
        collectibles.push(CollectibleFactory.getCollectible([0, 0]));
    }
}

