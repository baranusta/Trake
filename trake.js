
let player_1;
let player_2;
let world = {};
let frame=0;

let gameEnded = false;

window.onload = function () {
    let canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("yo");
    }
    viewSize = [canvas.width, canvas.height];

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 1.0, 0, 1);

    player_1 = new Snake( "P_1", vec2(-.3, 0), DIRECTION.NORTH );
    player_2 = new Snake( "P_1", vec2(.3, 0), DIRECTION.NORTH );
    world.boundaries = new Box([0,0], [2,2]);
    gameLoop();
}

const gameLoop = function(){
    gl.clear(gl.COLOR_BUFFER_BIT);
    frame++;
    
    if(!gameEnded)
    {
        player_2.eachCollisionBox(function(collisionBox){
            if(Physics.isColliding(player_1.getCollider(),collisionBox)){
                console.log("player1 collided");
                return false;
            }

            if(Physics.isColliding(player_2.getCollider(),collisionBox)){
                if(!player_2.isFirstPartsCollisionBox(collisionBox))
                {
                    console.log("player2 self collided");
                    return false;
                }    
            }
            return true;
        });

        player_1.eachCollisionBox(function(collisionBox){
            if(Physics.isColliding(player_2.getCollider(),collisionBox)){
                console.log("player2 collided");
                return false;
            }
            
            if(Physics.isColliding(player_1.getCollider(),collisionBox)){
                if(!player_1.isFirstPartsCollisionBox(collisionBox))
                {
                    console.log("player1 self collided");
                    return false;
                }    
            }
            return true;
        });


        player_1.update();
        player_1.draw(frame);
        player_2.draw(frame);
        window.requestAnimationFrame(gameLoop);
    }
    else
    {
        window.cancelAnimationFrame(gameLoop);
    }
}

document.onkeydown = function(e){ 
    if(e.keyCode == 39)
    {
        player_1.turn(true);
    }
    else
        player_1.turn(false);
}

