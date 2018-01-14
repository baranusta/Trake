
let player;
let playerIndex;
let snakes = [];
let world = {};
world.boundaries = new Box([0, 0], [2, 2]);
let collectibles = [];
let bait;
let frame;
let score;
let intervals = [];

let gameEnded = false;
let isMultiPlayer = false;

var colors = [
    vec4(1.0, 0.0, 0.0, 1.0),
    vec4(1.0, 1.0, 0.0, 1.0),
    vec4(1.0, 0.0, 1.0, 1.0),
    vec4(0.0, 1.0, 0.0, 1.0),
    vec4(0.0, 0.0, 1.0, 1.0),
    vec4(0.0, 1.0, 1.0, 1.0),
    vec4(0.0, 0.0, 0.0, 1.0),
    vec4(1.0)
];

var gameStart = function (playerCount, playerId) {
    blur('game', 0);
    $('#post_game').hide();
    $('#playAgainBtn').hide();
    $('#post_game .quitRoom').hide();
    gameEnded = false;

    score = 0;
    frame = 0;
    snakes = [];
    collectibles = [];
    let canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("yo");
    }
    viewSize = [canvas.width, canvas.height];
    aspectRatio = viewSize[0] / viewSize[1];

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(230 / 255.0, 208 / 255.0, 177 / 255.0, 1);

    isMultiPlayer = playerCount > 1;
    let grid = [1, 1];
    if (isMultiPlayer)
        grid = [Math.pow(2.0, Math.ceil(Math.log2(playerCount - 1))), 2];
    else
        updateScore(score);

    let gridSize = [2.0 / grid[0], 2.0 / grid[1]];

    for (let i = 0; i < playerCount; i++) {
        var color = colors[i];
        var pos = vec2(-1 + gridSize[0] * (i % grid[0] + 1.0 / 2.0), -1 + gridSize[1] * (i % grid[1] + 1.0 / 2.0));
        var direction = getRandomInt(0, DIRECTION.COUNT - 1);
        snakes.push(new Snake("P_" + i, pos, direction, color));
    }
    player = snakes[playerId];
    playerIndex = playerId;
    
    var url = "https://trake-cc1ed.firebaseapp.com/snake-head.png";
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1")
        url = "http://localhost:5000/snake-head.png"
    loadTexture(gl, url, function (texture) {
        gameLoop();
        for (var i = 0, len = snakes.length; i < len; i++) {
            snakes[i].head.addTexture(texture)
        }
    });


    if (playerId == 0) {
        intervals.push(window.setInterval(function () {
            if (!bait) {
                bait = CollectibleFactory.getCollectible(snakes, 0);
                sendEvent("bait", { position: bait.displacement });
            }
        }, 7000));
        intervals.push(window.setInterval(function () {
            collectibles.push(CollectibleFactory.getCollectible(snakes));
        }, 5000));
    }
}
  
const gameLoop = function () {
    gl.clear(gl.COLOR_BUFFER_BIT);
    frame++;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    if (!gameEnded) {
        for (var i = 0, len = snakes.length; i < len; i++) {
            checkPlayerCollision(i, snakes, collectibles);
            snakes[i].draw(frame);
            if (move) {
                snakes[i].update();  
            }
        }
        if (!!bait) bait.draw(frame)

        collectibles.forEach(function (each) {
            each.draw(frame);
        })

        window.requestAnimationFrame(gameLoop);
    }
    else {
        if (!isMultiPlayer)
            showGameOver();
        else {
            collectibles.length = 0;
            snakes.length = 0;
        }
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
            if(!collectible.apply(players[playerInConcernIndex]) && !players[playerInConcernIndex].power)
                players[playerInConcernIndex].power = collectible;
            collectibles.splice(i, 1);
            break;
        }
    }


    if (!!bait && Physics.isColliding(bait.collider, players[playerInConcernIndex].getCollider())) {
        console.log("player" + playerInConcernIndex + " collected bait");
        bait.apply(players[playerInConcernIndex]);
        bait = null;
        if (!isMultiPlayer)
            updateScore(++score);
        console.log(score);
    }

    players[playerInConcernIndex].eachCollisionBox(function (collisionBox) {
        for (let i = 0; i < players.length; i++) {
            const player = players[i];
            if (playerInConcernIndex !== i && Physics.isColliding(player.getCollider(), collisionBox)) {
                if (playerIndex == playerInConcernIndex)
                    gameEnded = true;
                console.log("player" + playerInConcernIndex + "  collided");
                return false;
            }
        }

        if (Physics.isColliding(players[playerInConcernIndex].getCollider(), collisionBox)) {
            if (!players[playerInConcernIndex].isFirstPartsCollisionBox(collisionBox)) {
                if (playerIndex == playerInConcernIndex)
                    gameEnded = true;
                console.log("player" + playerInConcernIndex + " self collided");
                return false;
            }
        }

        if (!Physics.isCompletelyInside(world.boundaries, collisionBox)) {
            if (playerIndex == playerInConcernIndex)
                gameEnded = true;
            console.log("player" + playerInConcernIndex + " collided to boundaries");
        }
        return true;
    });
}

var move = true;
document.onkeydown = function (e) {
    if (e.keyCode == 39) {
        player.turn(true);
    }
    else if (e.keyCode == 37)
        player.turn(false);
    else if (e.keyCode == 65) {
        move = !move;
    }
    else if (e.keyCode == 32) {
        player.usePower();
        //send event
    }
}

document.onkeyup = function(e){
    if(e.keyCode == 32){
        player.stopUsingPower();
        //send event
    }
}

var sendEvent = function (eventName, data) {
    console.log(data);
    if (isMultiPlayer) {

    }
}

var showGameOver = function () {
    blur('game', 8);
    $('#post_game').show();
    $('#score_head').html('Your Score: ' + score);
    for (var i = 0; i <= intervals.length; i++) {
        window.clearInterval(intervals[i]);
    }

    if (isMultiPlayer) {
        $('#post_game .quitRoom').show();
    }
    else {
        $('#playAgainBtn').show();
    }
}

var updateScore = function (score) {
    $('#score').text("Score: " + score);
}

var playAgain = function () {
    gameStart(1, 0);
}

var quitRoom = function () {
    //unsubscribe channel
    $('.lobbyScreen').show();
    $('.gameScreen').hide();
}
