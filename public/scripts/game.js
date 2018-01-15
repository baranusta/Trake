
let player;
let playerIndex;
let snakes = [];
let world = {};
world.boundaries = new Box([0, 0], [2, 2]);
let collectibles = [];
let bait;
let frame;
let score;
let rank;
let intervals = [];

let gameEnded = true;
let isMultiPlayer = false;

var url = "https://trake-cc1ed.firebaseapp.com/snake-head.png";
if (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    url = "http://localhost:5000/snake-head.png"

var isHost;

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

var initContext = function () {
    let canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        return false;
    }
    viewSize = [canvas.width, canvas.height];
    aspectRatio = viewSize[0] / viewSize[1];

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(230 / 255.0, 208 / 255.0, 177 / 255.0, 1);
    return true;
}

var initGame = function (playerCount) {
    blur('game', 0);
    $('#post_game').hide();
    $('#playAgainBtn').hide();
    $('#post_game .quitRoom').hide();
    gameEnded = true;

    score = 0;
    frame = 0;
    rank = playerCount;
    collectibles = [];

    isMultiPlayer = playerCount > 1;
    let grid = [1, 1];
    if (isMultiPlayer)
        grid = [Math.pow(2.0, Math.ceil(Math.log2(playerCount - 1))), 2];
    else
        updateScore(score);

    if (isHost) {
        createSnakes(playerCount, grid, [2.0 / grid[0], 2.0 / grid[1]]);

        loadTexture(gl, url, function (texture) {
            for (var i = 0, len = snakes.length; i < len; i++) {
                snakes[i].head.addTexture(texture)
            }
        });

        intervals.push(window.setInterval(function () {
            if (!bait) {
                let collectible = CollectibleFactory.getCollectible(snakes, 0)
                sendEvent("client-collectible", { position: collectible.displacement, type: collectible.type });
                bait = collectible;
            }
        }, 7000));
        intervals.push(window.setInterval(function () {
            let collectible = CollectibleFactory.getCollectible(snakes)
            collectibles.push(collectible);
            sendEvent("client-collectible", { position: collectible.displacement, type: collectible.type });
        }, 5000));

        setTimeout(function () {
            sendEvent('client-start-game', {});
            let index = 0;
            Object.keys(gameChannel.members.members).sort().forEach(function (key, index) {
                if (gameChannel.members.myID == key) {
                    startGame(index);
                    return;
                }
            });
        }, 2000);
    }
}

const startGame = function (playerId) {
    console.log("WOWOWOW - playerId: " + playerId + "   WOWOWOW");
    gameEnded = false;
    playerIndex = playerId;
    player = snakes[playerIndex];
    gameLoop();
    populatePlayersList();
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
            if (!snakes[i].dead) {
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
    if (players[playerInConcernIndex].dead)
        return;

    for (let i = 0; i < collectibles.length; i++) {
        const collectible = collectibles[i];
        if (Physics.isColliding(collectible.collider, players[playerInConcernIndex].getCollider())) {
            if (!collectible.apply(players[playerInConcernIndex]) && !players[playerInConcernIndex].power)
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
                if (playerIndex == playerInConcernIndex) {
                    gameEnded = true;
                    showGameOver();
                }
                else {
                    players[playerInConcernIndex].dead = true;
                    rank--;
                }
                console.log("player" + playerInConcernIndex + "  collided");
                return false;
            }
        }

        if (Physics.isColliding(players[playerInConcernIndex].getCollider(), collisionBox)) {
            if (!players[playerInConcernIndex].isFirstPartsCollisionBox(collisionBox)) {
                if (playerIndex == playerInConcernIndex) {
                    gameEnded = true;
                    showGameOver();
                }
                else {
                    players[playerInConcernIndex].dead = true;
                    rank--;
                }
                console.log("player" + playerInConcernIndex + " self collided");
                return false;
            }
        }

        if (!Physics.isCompletelyInside(world.boundaries, collisionBox)) {
            if (playerIndex == playerInConcernIndex) {
                gameEnded = true;
                showGameOver();
            }
            else {
                players[playerInConcernIndex].dead = true;
                rank--;
            }
            console.log("player" + playerInConcernIndex + " collided to boundaries");
        }
        return true;
    });
}

var move = true;
document.onkeydown = function (e) {
    if (e.keyCode == 39) {
        sendEvent("client-turn", { 
            direction: true, 
            index: playerIndex , 
            lastPart:{
                center: player.parts[player.i_first].center, 
                size:player.parts[player.i_first].size}, 
            head: player.head.displacement });
        player.turn(true);
    }
    else if (e.keyCode == 37) {
        sendEvent("client-turn", { 
            direction: false, 
            index: playerIndex , 
            lastPart:{
                center: player.parts[player.i_first].center, 
                size:player.parts[player.i_first].size}, 
            head: player.head.displacement });
        player.turn(false);
    }
    else if (e.keyCode === 27) {
        move = !move;
    }
    else if (e.keyCode == 32) {
        player.usePower();
    }
}

document.onkeyup = function (e) {
    if (e.keyCode == 32) {
        player.stopUsingPower();
        //send event
    }
}

const usePower = function (data) {
    snakes[data.index].usePower();
}

const stopPower = function (data) {
    snakes[data.index].stopUsingPower();
}

const turnSnake = function (data) {
    snakes[data.index].center = data.lastPart.center;
    snakes[data.index].size = data.lastPart.size;
    snakes[data.index].head.displacement = data.head;
    snakes[data.index].turn(data.direction);
}

const addCollectible = function (data) {
    let collectible = CollectibleFactory.getCollectible([], data.type, data.position)
    collectibles.push(collectible);
}

const setSnakes = function (data) {
    console.log("snakesssssss");
    snakes = [];
    for (let index = 0; index < data.snakes.length; index++) {
        let element = data.snakes[index];
        snakes.push(new Snake("P_" + index, element.position, element.direction, element.color));
    }
    loadTexture(gl, url, function (texture) {
        for (var i = 0, len = snakes.length; i < len; i++) {
            snakes[i].head.addTexture(texture)
        }
    });
}

const createSnakes = function (playerCount, grid, gridSize) {
    var data = {};
    data.snakes = [];
    for (let i = 0; i < playerCount; i++) {
        var color = colors[i];
        var pos = vec2(-1 + gridSize[0] * (i % grid[0] + 1.0 / 2.0), -1 + gridSize[1] * (i % grid[1] + 1.0 / 2.0));
        var direction = getRandomInt(0, DIRECTION.COUNT - 1);
        snakes.push(new Snake("P_" + i, pos, direction, color));
        data.snakes.push({ color: color, position: pos, direction: direction });
    }
    sendEvent('client-snake-created', { snakes: data.snakes });
}

var populatePlayersList = function () {

    if (!isMultiPlayer)
        return;

    $('#playingPlayers').empty();
    Object.keys(gameChannel.members.members).forEach(function (key, index) {
        $('#playingPlayers').append("<li style='color:rgb(" +
            colors[index][0] * 255 + "," +
            colors[index][1] * 255 + "," +
            colors[index][2] * 255 + ");'>" +
            gameChannel.members.members[key].name + "</li>");
    });
}

var sendEvent = function (eventName, data) {
    console.log(data);
    if (isMultiPlayer) {
        gameChannel.trigger(eventName, data);
    }
}

var showGameOver = function () {
    pusher.unsubscribe(gameChannel.name);
    blur('game', 8);
    $('#post_game').show();
    for (var i = 0; i <= intervals.length; i++) {
        window.clearInterval(intervals[i]);
    }

    if (isMultiPlayer) {
        if (rank == 1) {
            $('#score_head').html('Congratulations ' + rank + 'st place');
        }
        else {
            let th = 'nd';
            if (rank == 3)
                th = 'rd';
            else
                th = 'th';
            $('#score_head').html(':( ' + rank + th + ' place');
        }
        $('#post_game .quitRoom').show();
    }
    else {
        $('#score_head').html('Your Score: ' + score);
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
    snakes = [];
    $('.lobbyScreen').show();
    $('.gameScreen').hide();
}
