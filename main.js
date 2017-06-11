// -------------
// MAIN GAME LOGIC
// -------------
var game = (function($canvas, $score){
    var CANVASIZE,
        FPS,
        PIXEL,
        ctx,
        food,
        gameOver,
        headPosition,
        score,
        snakesnakeTail,
        speed;

    var init = function(){
        CANVASIZE = { width: 400, height: 200 };
        FPS = 150;
        PIXEL = 20;
        ctx = $canvas.getContext('2d');
        food = {};
        gameOver = false;
        headPosition = {x:60, y:60};
        score = 0.1;
        snakeTail = [];
        speed = {x:PIXEL, y:0};

        createFood();
    },
    start = function(){
        setInterval(function(){
            if (gameOver) {
                drawGameOver();
            } else {
                update();
                draw();
                drawScore();
            }
        },FPS);
    },
    draw = function(){
        // clean canvas
        ctx.clearRect(0, 0, CANVASIZE.width, CANVASIZE.height);

        // snake fill
        ctx.fillStyle = 'white';
        ctx.fillRect(headPosition.x, headPosition.y, PIXEL, PIXEL);
        
        // snake border
        ctx.strokeStyle = 'black';
        ctx.strokeRect(headPosition.x, headPosition.y, PIXEL, PIXEL);

        for (var i=0 ; i<snakeTail.length ; i++) {
            ctx.fillRect(snakeTail[i].x, snakeTail[i].y, PIXEL, PIXEL);
            ctx.strokeRect(snakeTail[i].x, snakeTail[i].y, PIXEL, PIXEL);
        }

        // draw food
        ctx.fillStyle = 'yellowgreen';
        ctx.fillRect(food.x, food.y, PIXEL, PIXEL);
    },
    drawScore = function(){
        $score.innerHTML = 'SCORE: '+Math.floor(score);
    },
    drawGameOver = function(){
        clearIntervals();

        ctx.globalAlpha = 0.8;
        ctx.fillStyle = 'white';
        ctx.fillRect(30, 30, CANVASIZE.width-60, CANVASIZE.height);
        ctx.globalAlpha = 1.0;

        ctx.fillStyle = 'black';
        ctx.font = "40px digital";
        ctx.fillText("Game Over", 110, 80);
        ctx.font = "30px digital";
        ctx.fillText("Score: "+Math.floor(score), 140, 130);
        ctx.font = "20px digital";
        ctx.fillText("Press 's' to start a new game.", 50, 180);
    },
    update = function(){
        for (var i=0 ; i<snakeTail.length-1 ; i++) {
            snakeTail[i] = snakeTail[i+1];
        }
        if (snakeTail.length) {
            snakeTail[snakeTail.length-1] = { x: headPosition.x, y: headPosition.y };
        }
        eatFood();
        headPosition.x += speed.x;
        headPosition.y += speed.y;

        checkCollision();
        score += 0.05;
    },
    updateSpeed = function(newX, newY){
        speed.x = newX*PIXEL;
        speed.y = newY*PIXEL;
    },
    createFood = function(){
        food.x = Math.floor((Math.random()*(CANVASIZE.width-PIXEL) + 1)/PIXEL) * PIXEL;
        food.y = Math.floor((Math.random()*(CANVASIZE.height-PIXEL) + 1)/PIXEL) * PIXEL;
    },
    eatFood = function(){
        distance = {x:headPosition.x-food.x, y:headPosition.y-food.y};
        if (distance.x == 0 && distance.y == 0) {
            snakeTail.push({x:headPosition.x, y:headPosition.y});
            createFood();
            score += 10;
        }
    },
    checkCollision = function(){
        gameOver = false;

        // out of bounds
        if (headPosition.x < 0 ||
            headPosition.x >= CANVASIZE.width ||
            headPosition.y < 0 ||
            headPosition.y >= CANVASIZE.height) {
            gameOver = true;
            return;
        }
        
        // naughty snake climbing over helself
        for (var i=snakeTail.length-1 ; i>0 ; i--) {
            if (headPosition.x - snakeTail[i].x == 0 && 
                headPosition.y - snakeTail[i].y == 0) {
                gameOver = true;
            }
        }
    },
    validateDirection = function(keyCode){
        var currentDirection = '',
            validCode = true;
        
        if (speed.x == -20) {
            currentDirection = 'ArrowLeft';
        } else if (speed.x == 20) {
            currentDirection = 'ArrowRight';
        } else if (speed.y == -20) {
            currentDirection = 'ArrowUp';
        } else if (speed.y == 20) {
            currentDirection = 'ArrowDown';
        }

        if (keyCode == 'ArrowLeft' && currentDirection == 'ArrowRight' ||
            keyCode == 'ArrowRight' && currentDirection == 'ArrowLeft' ||
            keyCode == 'ArrowUp' && currentDirection == 'ArrowDown' ||
            keyCode == 'ArrowDown' && currentDirection == 'ArrowUp') {
            validCode = false;
        }
        return validCode;
    },
    getGameStatus = function(){
        return gameOver;
    },
    clearIntervals = function(){
        var latest = setInterval(function(){},1000);
        for (var i=0 ; i<latest ; i++) {
            clearInterval(i);
        }
    };

    return {
        changeSpeed:updateSpeed,
        init:init,
        over: getGameStatus,
        start:start,
        validDirection: validateDirection
    };
})(document.getElementById('game-canvas'), document.getElementById('game-score'));

// -------------
// EVENTS
// -------------
document.addEventListener('DOMContentLoaded',function(){
    var scoreDiv = document.getElementById('score');
    game.init();
    game.start();
});

document.addEventListener('keydown',function(e){
    if (e.code == 'Backspace') { // hold history backtick
        e.preventDefault();
        e.stopPropagation();
    } else if (e.code == 'KeyS') { // game start
        if ( game.over() ) {
            game.init();
            game.start();
        }
        return;
    }

    // avoid snake to go back on his own back
    if (!game.validDirection(e.code)) { return; }
    
    if (e.code == 'ArrowUp') { game.changeSpeed(0, -1); }
    else if (e.code == 'ArrowDown') { game.changeSpeed(0, 1); }
    else if (e.code == 'ArrowLeft') { game.changeSpeed(-1, 0); }
    else if (e.code == 'ArrowRight') { game.changeSpeed(1, 0); }
});