// Social Studies Game by Oli and Xander

// Setup canvas and graphics context
let cnv = document.getElementById("my_canvas");
let ctx = cnv.getContext("2d");
cnv.width = 1000;
cnv.height = 600;

// Global variables
let screen = "title";
let charX = 100;
let charY = 100;
let rightIsPressed = false;
let leftIsPressed = false;
let jumping = false;
let gravity = 0;
let cnvRect = cnv.getBoundingClientRect();
let distance;

// Event listeners
document.addEventListener("keydown", keydownHandler);
document.addEventListener("keyup", keyupHandler);
document.addEventListener("click", startGame);
document.addEventListener("mousemove", mousemoveHandler);

function keydownHandler(event) {
  if (event.code === "KeyD" || event.code === "ArrowRight") {
    rightIsPressed = true;
  }
  if (event.code === "KeyA" || event.code === "ArrowLeft") {
    leftIsPressed = true;
  }
  if (
    event.code === "KeyW" ||
    event.code === "ArrowUp" ||
    event.code === "Space"
  ) {
    if (!jumping) {
      jumping = "start";
    }
  }
}

function keyupHandler(event) {
  if (event.code === "KeyD" || event.code === "ArrowRight") {
    rightIsPressed = false;
  }
  if (event.code === "KeyA" || event.code === "ArrowLeft") {
    leftIsPressed = false;
  }
}

function startGame() {
  if (distance < 30) {
    screen = "level1";
  }
}

function mousemoveHandler(event) {
  let run = Math.abs(event.x - cnvRect.x - 500);
  let rise = Math.abs(event.y - cnvRect.y - 300);
  distance = Math.sqrt(run ** 2 + rise ** 2);

  if (distance < 30) {
    document.body.style.cursor = "pointer";
  } else {
    document.body.style.cursor = "default";
  }
}

// Main Program Loop (60 FPS)
requestAnimationFrame(loop);

function loop() {
  // console.log();

  if (screen === "title") {
    ctx.fillStyle = "black";
    ctx.arc(500, 300, 30, 0, 2 * Math.PI);
    ctx.fill();
  } else {
    // BACKGROUND
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, cnv.width, cnv.height);

    // FLOOR
    ctx.lineWidth = 3;
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(0, 538);
    ctx.lineTo(cnv.width, 538);
    ctx.stroke();

    // CHARACTER
    ctx.fillStyle = "black";
    ctx.fillRect(charX, charY, 25, 25);

    // move x
    if (rightIsPressed) {
      charX += 5;
    } else if (leftIsPressed) {
      charX -= 5;
    }

    // jump
    if (jumping === "start") {
      jumping = true;
      gravity = -10;
    }
    charY += gravity;
    if (jumping) {
      gravity += 0.5;
    }
    if (charY > 500) {
      gravity = 0;
      jumping = false;
    } else if (!jumping) {
      gravity = 10;
    }

    // prevent character from going off screen
    if (charX < 0) {
      charX = 0;
    }
    if (charX > cnv.width - 25) {
      charX = cnv.width - 25;
    }

    // LEVEL 1: Route de la Soie
    // if (screen === "level1") {

    // }

    // LEVEL 2: First Nations
    // if (screen === "level2") {

    // }

    // LEVEL 3: Europeans
    // if (screen === "level3") {

    // }

    // LEVEL 4: Industrialisation in UK
    // if (screen === "level4") {

    // }

    // LEVEL 5: Child Labour
    // if (screen === "level15") {

    // }
  }
  requestAnimationFrame(loop);
}

// Xander code

// function click(event) {
//   let mouseX = event.x - cnvRect.x;
//   let mouseY = event.y - cnvRect.y;
//   let run = Math.abs(mouseX - target1X || mouseX - target2X || mouseX - target3X);
//   let rise = Math.abs(mouseY - target1Y || mouseY - target2Y || mouseY - target3Y);
//   let distance = Math.sqrt(run ** 2 + rise ** 2);
// }

// https://www.w3schools.com/cssref/pr_class_cursor.asp