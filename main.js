// -------------
// EVENTS
// -------------
document.addEventListener('DOMContentLoaded',function(){
    game.init();
    game.start();
});

document.addEventListener('keydown',function(e){
    if (e.code == 'ArrowUp') {
        game.changeSpeed(0, -1);
    } else if (e.code == 'ArrowDown') {
        game.changeSpeed(0, 1);
    } else if (e.code == 'ArrowLeft') {
        game.changeSpeed(-1, 0);
    } else if (e.code == 'ArrowRight') {
        game.changeSpeed(1, 0);
    }
});

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
    createFood = function(){
        food.x = Math.floor((Math.random()*800 + 1)/pixel) * pixel;
        food.y = Math.floor((Math.random()*600 + 1)/pixel) * pixel;
    },
    eatFood = function(){
        distance = {x:headPosition.x-food.x, y:headPosition.y-food.y};
        console.log('distance from food:', distance);
        if (distance.x == 0 && distance.y == 0) {
            snakeTailSize++;
            createFood();
        }
    },
    updateSpeed = function(newX, newY){
        speed.x = newX*pixel;
        speed.y = newY*pixel;
    };

    return {
        init:init,
        start:start,
        changeSpeed:updateSpeed
    };
})(document.getElementById('game-canvas'));