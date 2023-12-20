// -------------
// MAIN GAME LOGIC
// -------------
var game = (function($canvas, $score){
    const CANVASIZE = { width: 360, height: 225 };
    const FPS = 150;
    const PIXEL = 15;

    let ctx,
        food,
        gameOver,
        headPosition,
        score,
        speed,
        maxScore;

    let init = function(){
        ctx = $canvas.getContext('2d');
        food = {};
        gameOver = false;
        headPosition = {x:60, y:60};
        score = 0.2;
        snakeTail = [];
        speed = {x:PIXEL, y:0};
        maxScore = localStorage.getItem('snakeMaxScore');
        maxScore = maxScore ? parseInt(maxScore) : 0;

        createFood();
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
    clearIntervals = function(){
        var latest = setInterval(function(){},1000);
        for (var i=0 ; i<latest ; i++) {
            clearInterval(i);
        }
    },
    createFood = function(){
        food.x = Math.floor((Math.random()*(CANVASIZE.width-PIXEL) + 1)/PIXEL) * PIXEL;
        food.y = Math.floor((Math.random()*(CANVASIZE.height-PIXEL) + 1)/PIXEL) * PIXEL;
    },
    draw = function(){
        // clean canvas
        ctx.clearRect(0, 0, CANVASIZE.width, CANVASIZE.height);

        // snake fill
        ctx.fillStyle = '#6D601D';
        ctx.fillRect(headPosition.x, headPosition.y, PIXEL, PIXEL);
        
        // snake border
        ctx.strokeStyle = '#6D601D';
        ctx.strokeRect(headPosition.x, headPosition.y, PIXEL, PIXEL);

        for (var i=0 ; i<snakeTail.length ; i++) {
            ctx.fillRect(snakeTail[i].x, snakeTail[i].y, PIXEL, PIXEL);
            ctx.strokeRect(snakeTail[i].x, snakeTail[i].y, PIXEL, PIXEL);
        }

        // draw food
        ctx.fillStyle = 'black';
        ctx.fillRect(food.x + 2, food.y + 2, PIXEL - 4, PIXEL - 4);
    },
    drawScore = function(){
        $score.querySelector('.current').innerHTML = 'SCORE: '+Math.floor(score);
    },
    drawMaxScore = function() {
        $score.querySelector('.max').innerHTML = 'MAX SCORE: '+Math.floor(maxScore);
    },
    drawGameOver = function(){
        clearIntervals();

        ctx.globalAlpha = 0.8;
        ctx.fillStyle = 'white';
        ctx.fillRect(10, 10, CANVASIZE.width-20, CANVASIZE.height-20);
        ctx.globalAlpha = 1.0;

        ctx.fillStyle = 'black';
        ctx.font = "40px digital";
        ctx.fillText("Game Over", 95, 80);
        ctx.font = "30px digital";
        ctx.fillText("Score: "+Math.floor(score), 120, 130);
        ctx.font = "20px digital";
        ctx.fillText("Press 's' to start a new game", 40, 180);
    },
    eatFood = function(){
        distance = {x:headPosition.x-food.x, y:headPosition.y-food.y};
        if (distance.x == 0 && distance.y == 0) {
            snakeTail.push({x:headPosition.x, y:headPosition.y});
            createFood();
            score += 10;
        }
    },
    getGameStatus = function(){
        return gameOver;
    },
    saveMaxScore = function() {
        if (score > maxScore) {
            localStorage.setItem('snakeMaxScore', score);
        }
    },
    start = function(){
        setInterval(function(){
            if (gameOver) {
                saveMaxScore();
                drawGameOver();
            } else {
                update();
                draw();
                drawScore();
            }
        },FPS);
        drawMaxScore();
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
    validateDirection = function(keyCode){
        var currentDirection = '',
            validCode = true;
        
        if (speed.x == PIXEL * -1) {
            currentDirection = 'ArrowLeft';
        } else if (speed.x == PIXEL) {
            currentDirection = 'ArrowRight';
        } else if (speed.y == PIXEL * -1) {
            currentDirection = 'ArrowUp';
        } else if (speed.y == PIXEL) {
            currentDirection = 'ArrowDown';
        }

        if (keyCode == 'ArrowLeft' && currentDirection == 'ArrowRight' ||
            keyCode == 'ArrowRight' && currentDirection == 'ArrowLeft' ||
            keyCode == 'ArrowUp' && currentDirection == 'ArrowDown' ||
            keyCode == 'ArrowDown' && currentDirection == 'ArrowUp') {
            validCode = false;
        }
        return validCode;
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