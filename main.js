// -------------
// MAIN GAME LOGIC
// -------------
var game = (function(canvas){
    var PIXEL,
        headPosition,
        snakesnakeTail,
        food,
        speed,
        ctx,
        CANVASIZE,
        FPS;

    var init = function(){
        ctx = canvas.getContext('2d');
        FPS = 150;
        PIXEL = 20;
        CANVASIZE = { width: 400, height: 200 };
        headPosition = {x:60, y:60};
        snakeTail = [];
        speed = {x:PIXEL, y:0};
        food = {};

        createFood();
    },
    start = function(){
        setInterval(function(){
            update();
            draw();
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
    };

    return {
        init:init,
        start:start,
        changeSpeed:updateSpeed,
        validDirection: validateDirection
    };
})(document.getElementById('game-canvas'));

// -------------
// EVENTS
// -------------
document.addEventListener('DOMContentLoaded',function(){
    game.init();
    game.start();
})

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
})

kill = function(){
    var latest = setInterval(function(){},1000);
    for (var i=0 ; i<latest ; i++) {
        clearInterval(i);
    }
}