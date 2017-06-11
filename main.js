// -------------
// MAIN GAME LOGIC
// -------------
var game = (function(canvas){
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
        ctx = canvas.getContext('2d');
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
            }
        },FPS);
    },
    end = function(){

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
    drawGameOver = function(){
        console.log('game over!!');
    },
    update = function(){
        for (var i=0 ; i<snakeTail.length-1 ; i++) {
            snakeTail[i] = snakeTail[i+1];
        }
        if (snakeTail.length) {
            snakeTail[snakeTail.length-1] = { x: headPosition.x, y: headPosition.y };
        }

        headPosition.x += speed.x;
        headPosition.y += speed.y;

        eatFood();
        checkCollision();

        score += 0.05;
    },
    updateSpeed = function(newX, newY){
        speed.x = newX*PIXEL;
        speed.y = newY*PIXEL;
    },
    createFood = function(){
        food.x = Math.floor((Math.random()*CANVASIZE.width + 1)/PIXEL) * PIXEL;
        food.y = Math.floor((Math.random()*CANVASIZE.height + 1)/PIXEL) * PIXEL;
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

        if (headPosition.x < 0 ||
            headPosition.x > CANVASIZE.width ||
            headPosition.y < 0 ||
            headPosition.y > CANVASIZE.height) {
            gameOver = true;
            //console.log('wrong game over');
            return;
        }

        //console.log('--------------------- collision');
        for (var i=snakeTail.length-1 ; i>0 ; i--) {
            //console.log('position:',i);
            //console.log('x: ',headPosition.x - snakeTail[i].x);
            //console.log('y: ',headPosition.y - snakeTail[i].y);
            if (headPosition.x - snakeTail[i].x == 0 && 
                headPosition.y - snakeTail[i].y == 0) {
                //console.log('wrong 2');
                //console.log('position: ',i,' length: ',snakeTail.length);
                // gameOver = true;
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
    getScore = function(){
        return Math.floor(score);
    };

    return {
        init:init,
        start:start,
        changeSpeed:updateSpeed,
        validDirection: validateDirection,
        readScore: getScore
    };
})(document.getElementById('game-canvas'));

// -------------
// EVENTS
// -------------
document.addEventListener('DOMContentLoaded',function(){
    var scoreDiv = document.getElementById('score');
    game.init();
    game.start();
    setInterval(function(){
        scoreDiv.innerHTML = 'SCORE: '+game.readScore();
    },200);
});

document.addEventListener('keydown',function(e){
    if (!game.validDirection(e.code)) { return; }

    if (e.code == 'Backspace') { // hold history back
        e.preventDefault();
        e.stopPropagation();
    } else if (e.code == 's') { // game start
        game.start();
    } else if (e.code == 'ArrowUp') {
        game.changeSpeed(0, -1);
    } else if (e.code == 'ArrowDown') {
        game.changeSpeed(0, 1);
    } else if (e.code == 'ArrowLeft') {
        game.changeSpeed(-1, 0);
    } else if (e.code == 'ArrowRight') {
        game.changeSpeed(1, 0);
    }
});

kill = function(){
    var latest = setInterval(function(){},1000);
    for (var i=0 ; i<latest ; i++) {
        clearInterval(i);
    }
}