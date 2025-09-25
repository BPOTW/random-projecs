let canvas = document.getElementById("canvas");

const box = canvas.getContext("2d");

let canvasSize = 400;
let ballRad = 6;

let velocity = 2;
let NoOfParticles = 4;

let vX = velocity;
let vY = velocity;

let maxDistForCon = 400;
let minDistForCon = 10;

let maxBallConnections = 2;

let ballCollisions = true;
let boundaryCollisions = true;

let balls = [];

let boundries = [];

let particles = document.getElementById("particles");
let radius = document.getElementById("ballRad");
let ballVelocity = document.getElementById("velocity");
let maxDist = document.getElementById("maxDistForCon");
let minDist = document.getElementById("minDistForCon");
let noOfConn = document.getElementById("noOfConnections");
let ballColl = document.getElementById("ballCollision");
let boundColl = document.getElementById("boundaryCollision");

function setValues(){
  particles.value = NoOfParticles;
  radius.value = ballRad;
  ballVelocity.value = velocity;
  minDist.value = minDistForCon;
  maxDist.value = maxDistForCon;
  noOfConn.value = maxBallConnections;
  ballColl.checked = ballCollisions;
  boundColl.checked = boundaryCollisions;
}

function checkParticles(){
  if(Number(particles.value) > NoOfParticles){
    addBalls();
  }else{
    balls.pop();
  }
}

function checkValues() {

  NoOfParticles = Number(particles.value);
  ballRad = Number(radius.value);
  velocity = Number(ballVelocity.value);
  maxDistForCon = Number(maxDist.value);
  minDistForCon = Number(minDist.value);
  maxBallConnections = Number(noOfConn.value);
  ballCollisions = ballColl.checked;
  boundaryCollisions = boundColl.checked;

}

function addBalls(){
  let [x, y] = randomPathGenerator();

    box.beginPath();
    box.arc(x + 4, y + 4, 6, 0, Math.PI * 2);
    box.fillStyle = "black";
    box.fill();
    vX = ((Math.round(Math.random()) * velocity - velocity / 2) * velocity) / 2;
    vY = ((Math.round(Math.random()) * velocity - velocity / 2) * velocity) / 2;
    balls.push({ x, y, ballRad, vX, vY });
}

function changeRad(){
  ballRad = Number(radius.value);
  for(let ball of balls){
    ball.ballRad = ballRad;
  }
}

function changeVel(){
  ballsGeneratore();
}


function ballsGeneratore() {
  box.clearRect(0, 0, canvasSize, canvasSize);
  let index = 0;
  for (let i = 0; i < NoOfParticles; i++) {
    let [x, y] = randomPathGenerator();

    box.beginPath();
    box.arc(x + 4, y + 4, ballRad, 0, Math.PI * 2);
    box.fillStyle = "black";
    box.fill();
    vX = ((Math.round(Math.random()) * velocity - velocity / 2) * velocity) / 2;
    vY = ((Math.round(Math.random()) * velocity - velocity / 2) * velocity) / 2;
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

function generateConnetionLine(x1, y1, x2, y2) {
  box.beginPath();
  box.moveTo(x1, y1); // Starting point (x, y)
  box.lineTo(x2, y2); // Ending point (x, y)
  box.stroke();
}

function connections() {
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      let dx = balls[j].x - balls[i].x;
      let dy = balls[j].y - balls[i].y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= maxDistForCon && distance >= minDistForCon) {
        // console.log(balls[i].x,balls[i].y,balls[j].x,balls[j].y);
        generateConnetionLine(balls[i].x, balls[i].y, balls[j].x, balls[j].y);
      }
    }
  }
}

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
    // if (ball.x - ball.ballRad <= 0 || ball.x + ball.ballRad >= canvasSize) {
    //   ball.vX *= -1;
    //   //   console.log("collision");
    // }
    // if (ball.y - ball.ballRad <= 0 || ball.y + ball.ballRad >= canvasSize) {
    //   ball.vY *= -1;
    //   //   console.log("collision");
    // }

    if (ball.x - ball.ballRad <= 0) {
      ball.x = 393;
      console.log("collision");
    } else if (ball.x + ball.ballRad >= canvasSize) {
      ball.x = 7;
    }
    if (ball.y - ball.ballRad <= 0) {
      ball.y = 393;
      //   console.log("collision");
    } else if (ball.y + ball.ballRad >= canvasSize) {
      ball.y = 7;
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
  connections();
  generateConnetionLine(0, 0, 0, 0);
  requestAnimationFrame(animate);
}
setValues();
ballsGeneratore();
animate();
