

let canvas = document.getElementById("canvas");
const box = canvas.getContext("2d");

let canvasSize = 400;
let ballRad = 6;

let velocity = 4;
let NoOfParticles = 100;

let vX = velocity;
let vY = velocity;


let balls = [];

let boundries = [];

function ballsGeneratore() {
    
  let index = 0;
  for (let i = 0; i < NoOfParticles; i++) {
    let [x, y] = randomPathGenerator();

    box.beginPath();
    box.arc(x + 4, y + 4, 6, 0, Math.PI * 2);
    box.fillStyle = "black";
    box.fill();
    vX = (Math.round(Math.random()) * velocity - velocity/2) * velocity/2;
    vY = (Math.round(Math.random()) * velocity - velocity/2) * velocity/2;
    balls[index] = { x, y, ballRad, vX, vY };
    // console.log(balls[index].x,balls[index].y);
    index++;
  }
}

function randomPathGenerator() {
  let x =
    Math.floor(Math.random() * (canvasSize - ballRad - ballRad + 0)) +
    ballRad -
    2;
  let y =
    Math.floor(Math.random() * (canvasSize - ballRad - ballRad + 0)) +
    ballRad -
    2;

  return [x, y];
}

// dotGeneratore(1,1, "black");

function checkCollisions() {
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      let dx = balls[j].x - balls[i].x;
      let dy = balls[j].y - balls[i].y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let minDist = balls[i].ballRad + balls[j].ballRad;

      if (distance < minDist) {
        // --- 1. Separate balls ---
        let overlap = minDist - distance;
        let halfOverlap = overlap / 2;

        // normalize direction
        let nx = dx / distance;
        let ny = dy / distance;

        // push balls apart
        balls[i].x -= nx * halfOverlap;
        balls[i].y -= ny * halfOverlap;
        balls[j].x += nx * halfOverlap;
        balls[j].y += ny * halfOverlap;

        // --- 2. Swap velocities (very simple physics) ---
        let tempVX = balls[i].vX;
        let tempVY = balls[i].vY;
        balls[i].vX = balls[j].vX;
        balls[i].vY = balls[j].vY;
        balls[j].vX = tempVX;
        balls[j].vY = tempVY;
      }
    }
  }
}



function moveBalls() {
  box.clearRect(0, 0, canvasSize, canvasSize);

  for (let ball of balls) {
    // move
    ball.x += ball.vX;
    ball.y += ball.vY;

    // bounce on walls
    if (ball.x - ball.ballRad <= 0 || ball.x + ball.ballRad >= canvasSize) {
      ball.vX *= -1;
    //   console.log("collision");
    }
    if (ball.y - ball.ballRad <= 0 || ball.y + ball.ballRad >= canvasSize) {
      ball.vY *= -1;
    //   console.log("collision");
    }

    // draw
    box.beginPath();
    box.arc(ball.x, ball.y, ball.ballRad, 0, Math.PI * 2);
    box.fillStyle = "black";
    box.fill();
  }
}


function animate() {
    moveBalls();
    checkCollisions();
    requestAnimationFrame(animate);
}
ballsGeneratore();
animate();

// console.log(balls);
