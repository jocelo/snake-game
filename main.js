// -------------
// MAIN GAME LOGIC
// -------------
var game = (function(canvas){
    var pixel,
        headPosition,
        snakeTailSize,        
        food,
        speed,
        ctx,
        fps;

    var init = function(){
        ctx = canvas.getContext('2d');
        fps = 250;
        pixel = 20;
        headPosition = {x:60, y:60};
        snakeTailSize = 0;
        speed = {x:20, y:0};
        food = {};
        createFood();
    },
    start = function(){
        setInterval(function(){
            update();
            draw();
        },fps);
    },
    end = function(){

    },
    draw = function(){
        // clean canvas
        ctx.clearRect(0,0,800,600);

        // snake fill
        ctx.fillStyle = 'white';
        ctx.fillRect(headPosition.x, headPosition.y, pixel, pixel);
        
        // snake border
        ctx.strokeStyle = 'black';
        ctx.strokeRect(headPosition.x, headPosition.y, pixel, pixel);

        // draw food
        ctx.fillStyle = '#FF0066';
        ctx.fillRect(food.x, food.y, pixel, pixel);

    },
    update = function(){
        headPosition.x += speed.x;
        headPosition.y += speed.y;

        eatFood();
    },
    updateSpeed = function(newX, newY){
        speed.x = newX*pixel;
        speed.y = newY*pixel;
    },
    createFood = function(){
        food.x = Math.floor((Math.random()*800 + 1)/pixel) * pixel;
        food.y = Math.floor((Math.random()*600 + 1)/pixel) * pixel;
    },
    eatFood = function(){
        distance = {x:headPosition.x-food.x, y:headPosition.y-food.y};
        if (distance.x == 0 && distance.y == 0) {
            snakeTailSize++;
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