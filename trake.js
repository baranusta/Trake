
let player_1;
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
    
    gameLoop();
}

const gameLoop = function(){
    gl.clear(gl.COLOR_BUFFER_BIT);
    frame++;
    if(!gameEnded)
    {
        
        player_1.update();
        player_1.draw(frame);
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

