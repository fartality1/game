// Canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Images
let bg = new Image();
bg.src = "background.png";

let bird = new Image();
bird.src = "face.png";

// Sounds
let music1 = new Audio("music1.mp3");
let music2 = new Audio("music2.mp3");
let gameOverSound = new Audio("gameover.mp3");

music1.loop = true;
music2.loop = true;

let currentMusic = music1;

// Physics (fast gameplay)
let birdX = 60;
let birdY = 200;
let gravity = 0.18;
let velocity = 0;
let jumpForce = -5;

// Pipes
let pipes = [];
let pipeGap = 190;
let pipeSpeed = 2.2;
let pipeWidth = 60;

// Game state
let score = 0;
let gameStarted = false;
let paused = false;
let gameOver = false;

// First pipe
pipes.push({
    x: canvas.width + 150,
    height: Math.random() * 200 + 100
});

// Jump / Start
function jump(){

    if(!gameStarted){
        gameStarted = true;

        // Start background music
        currentMusic.play();

        return;
    }

    if(paused || gameOver) return;

    velocity = jumpForce;
}

// Pause
function togglePause(){

    if(!gameStarted || gameOver) return;

    paused = !paused;

    if(paused){
        currentMusic.pause();
    } else {
        currentMusic.play();
    }
}

// Controls
canvas.addEventListener("click", jump);
canvas.addEventListener("touchstart", jump);

document.addEventListener("keydown", function(e){

    if(e.code === "Space") jump();

    if(e.code === "KeyP") togglePause();

});

// Game loop
function gameLoop(){

    ctx.drawImage(bg,0,0,canvas.width,canvas.height);

    // Start screen
    if(!gameStarted){

        ctx.fillStyle="white";
        ctx.font="40px Arial";
        ctx.fillText("Tap to Start",90,300);

        requestAnimationFrame(gameLoop);
        return;
    }

    // Pause screen
    if(paused){

        ctx.fillStyle="white";
        ctx.font="28px Arial";
        ctx.fillText("Continue chey ra kojja",60,300);

        requestAnimationFrame(gameLoop);
        return;
    }

    // Physics
    velocity += gravity;
    birdY += velocity;

    ctx.drawImage(bird,birdX,birdY,40,40);

    // Boundaries
    if(birdY < 0 || birdY + 40 > canvas.height){

        gameOver = true;

        currentMusic.pause();
        gameOverSound.play();

        alert("Game Over! Score: " + score);
        location.reload();
        return;
    }

    // Pipes
    for(let pipe of pipes){

        pipe.x -= pipeSpeed;

        ctx.fillStyle="green";

        ctx.fillRect(pipe.x,0,pipeWidth,pipe.height);

        ctx.fillRect(pipe.x,pipe.height + pipeGap,pipeWidth,canvas.height);

        // Collision
        if(pipe.x < birdX + 35 && pipe.x + pipeWidth > birdX + 5){

            if(birdY < pipe.height - 15 ||
               birdY + 35 > pipe.height + pipeGap + 15){

                gameOver = true;

                currentMusic.pause();
                gameOverSound.play();

                alert("Game Over! Score: " + score);
                location.reload();
                return;
            }
        }

        // Score
        if(!pipe.passed && pipe.x + pipeWidth < birdX){

            score++;
            pipe.passed = true;

            // Switch music after 10 points
            if(score === 10){

                currentMusic.pause();

                currentMusic = music2;
                currentMusic.currentTime = 0;
                currentMusic.play();
            }
        }
    }

    // Add new pipe
    if(pipes[pipes.length - 1].x < canvas.width - 250){

        pipes.push({
            x: canvas.width,
            height: Math.random()*200 + 100
        });
    }

    // Score display
    ctx.fillStyle="white";
    ctx.font="32px Arial";
    ctx.fillText("Score: " + score,10,40);

    requestAnimationFrame(gameLoop);
}

gameLoop();
