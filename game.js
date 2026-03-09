const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const pauseBtn = document.getElementById("pauseBtn");

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

// Physics
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
let scoreScale = 1;
let gameStarted = false;
let paused = false;
let gameOverFlag = false;

// First pipe
pipes.push({
x: canvas.width + 150,
height: Math.random() * 200 + 100
});

// Jump
function jump(){

if(!gameStarted){
gameStarted = true;
currentMusic.play();
return;
}

if(paused || gameOverFlag) return;

velocity = jumpForce;

}

// Pause button
pauseBtn.onclick = function(){

if(!gameStarted || gameOverFlag) return;

paused = !paused;

if(paused){
pauseBtn.innerText="▶ Resume";
currentMusic.pause();
}else{
pauseBtn.innerText="⏸ Pause";
currentMusic.play();
}

}

// Game Over
function gameOver(){

if(gameOverFlag) return;

gameOverFlag=true;

currentMusic.pause();

gameOverSound.currentTime=0;
gameOverSound.play();

setTimeout(()=>{
alert("Game Over! Score: "+score);
location.reload();
},1500);

}

// Controls
canvas.addEventListener("click",jump);
canvas.addEventListener("touchstart",jump);

document.addEventListener("keydown",(e)=>{
if(e.code==="Space") jump();
});

// Game loop
function gameLoop(){

ctx.drawImage(bg,0,0,canvas.width,canvas.height);

if(!gameStarted){

ctx.fillStyle="white";
ctx.font="40px Arial";
ctx.fillText("Tap to Start",90,300);

requestAnimationFrame(gameLoop);
return;
}

if(paused){

ctx.fillStyle="white";
ctx.font="28px Arial";
ctx.fillText("Continue chey ra kojja",60,300);

requestAnimationFrame(gameLoop);
return;
}

// Bird physics
velocity+=gravity;
birdY+=velocity;

ctx.drawImage(bird,birdX,birdY,40,40);

// Boundaries
if(birdY<0 || birdY+40>canvas.height){
gameOver();
return;
}

// Pipes
for(let pipe of pipes){

pipe.x-=pipeSpeed;

ctx.fillStyle="green";

ctx.fillRect(pipe.x,0,pipeWidth,pipe.height);
ctx.fillRect(pipe.x,pipe.height+pipeGap,pipeWidth,canvas.height);

// Collision
if(pipe.x < birdX+35 && pipe.x+pipeWidth > birdX+5){

if(birdY < pipe.height-15 ||
birdY+35 > pipe.height+pipeGap+15){

gameOver();
return;

}

}

// Score
if(!pipe.passed && pipe.x+pipeWidth < birdX){

score++;
pipe.passed=true;

scoreScale = 1.6;

// Music change at 10
if(score===10){

currentMusic.pause();

currentMusic=music2;
currentMusic.currentTime=0;
currentMusic.play();

}

}

}

// Add pipes
if(pipes[pipes.length-1].x < canvas.width-250){

pipes.push({
x:canvas.width,
height:Math.random()*200+100
});

}

// Score animation
scoreScale += (1-scoreScale)*0.1;

ctx.save();
ctx.translate(10,40);
ctx.scale(scoreScale,scoreScale);

ctx.fillStyle="white";
ctx.font="32px Arial";
ctx.fillText("Score: "+score,0,0);

ctx.restore();

requestAnimationFrame(gameLoop);

}

gameLoop();
