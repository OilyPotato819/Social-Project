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

// Event listeners
document.addEventListener("keydown", keydownHandler);
document.addEventListener("keyup", keyupHandler);
document.addEventListener("click", startGame);

function keydownHandler() {
  if (event.code == "KeyD" || event.code == "ArrowRight") {
    rightIsPressed = true;
  }
  if (event.code == "KeyA" || event.code == "ArrowLeft") {
    leftIsPressed = true;
  }
  if (
    event.code == "KeyW" ||
    event.code == "ArrowUp" ||
    event.code == "Space"
  ) {
    if (!jumping) {
      jumping = "start";
    }
  }
}

function keyupHandler() {
  if (event.code == "KeyD" || event.code == "ArrowRight") {
    rightIsPressed = false;
  }
  if (event.code == "KeyA" || event.code == "ArrowLeft") {
    leftIsPressed = false;
  }
}

function startGame() {
  screen = "levelSelect";
}

// Main Program Loop (60 FPS)
requestAnimationFrame(loop);

function loop() {
  // console.log();

  if (screen == "title") {
    
  } else if (screen == "levelSelect") {

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

    

    // Character
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
      gravity = -13;
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

    // LEVEL 2: First Nations

    // LEVEL 3: Europeans

    // LEVEL 4: Industrialisation in UK

    // LEVEL 5: Child Labour
  }
  requestAnimationFrame(loop);
}
