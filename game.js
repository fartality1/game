// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Background
let bg = new Image();
bg.src = "background.png";   // your background image

// Load bird image (your face)
let bird = new Image();
bird.src = "face.png";       // your custom face image

// Sounds
let jumpSound = new Audio("jump.mp3");
let hitSound = new Audio("hit.mp3");
let pointSound = new Audio("point.mp3");

// Bird physics
let birdY = 200;
let velocity = 0;
let gravity = 0.4;
let jumpForce = -8;

// Pipes
let pipes = [];
let pipeGap = 150;
let pipeWidth = 60;
let pipeSpeed = 2;

// Score
let score = 0;

// Add first pipe
pipes.push({
    x: canvas.width,
    height: Math.random() * 250 + 50
});

// Jump function
function jump() {
    velocity = jumpForce;
    jumpSound.currentTime = 0;
    jumpSound.play();
}

// Controls
canvas.addEventListener("click", jump);
document.addEventListener("keydown", jump);
canvas.addEventListener("touchstart", jump);

// Main game loop
function gameLoop() {
    // Draw background
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    // Update bird physics
    velocity += gravity;
    birdY += velocity;

    // Draw bird
    ctx.drawImage(bird, 50, birdY, 40, 40);

    // Bird boundaries check
    if (birdY + 40 > canvas.height || birdY < 0) {
        hitSound.play();
        alert("Game Over! Score: " + score);
        location.reload();
    }

    // Pipes
    for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];

        // Move pipe
        pipe.x -= pipeSpeed;

        // Draw top pipe
        ctx.fillStyle = "green";
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.height);

        // Draw bottom pipe
        ctx.fillRect(pipe.x, pipe.height + pipeGap, pipeWidth, canvas.height);

        // Collision detection
        if (pipe.x < 90 && pipe.x + pipeWidth > 50) {
            if (birdY < pipe.height || birdY + 40 > pipe.height + pipeGap) {
                hitSound.play();
                alert("Game Over! Score: " + score);
                location.reload();
            }
        }

        // Score
        if (pipe.x + pipeWidth === 50) {
            score++;
            pointSound.play();
        }

        // Add new pipe
        if (pipe.x < canvas.width - 200 && !pipe.added) {
            pipes.push({
                x: canvas.width,
                height: Math.random() * 250 + 50
            });
            pipe.added = true;
        }
    }

    // Draw score
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("Score: " + score, 10, 40);

    requestAnimationFrame(gameLoop);
}

gameLoop();
