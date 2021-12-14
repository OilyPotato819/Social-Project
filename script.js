// Social Studies Game by Oli and Xander

// SETUP CANVAS AND GRAPHICS CONTEXT
let cnv = document.getElementById("my_canvas");
let ctx = cnv.getContext("2d");
cnv.width = 1000;
cnv.height = 600;

// GLOBAL VARIABLES
let screen = "title";
let background;
let rightIsPressed = false;
let leftIsPressed = false;
let eIsPressed = false;
let upIsPressed = false;
let distance;
let opacity = 0;
let char = {
  x: 500,
  y: 450,
  facing: 0,
  gravity: 0,
  standing: true,
};
let laser = {
  xMove: 0,
  xLine: 0,
  y: 0,
  shoot: "ready",
  timer: 0,
  collide: false,
  width: 0,
};

// EVENT LISTENERS
document.addEventListener("keydown", keydownHandler);
document.addEventListener("keyup", keyupHandler);
document.addEventListener("click", startGame);
document.addEventListener("mousemove", mousemoveHandler);

// FUNCTIONS
function startGame() {
  if (distance < 30) {
    screen = "level1-1";
    document.body.style.cursor = "default";
  }
}

function mousemoveHandler(event) {
  // if (screen === "title") {
  let cnvRect = cnv.getBoundingClientRect();
  let run = Math.abs(event.x - cnvRect.x - 500);
  let rise = Math.abs(event.y - cnvRect.y - 300);
  distance = Math.sqrt(run ** 2 + rise ** 2);

  if (distance < 30) {
    document.body.style.cursor = "pointer";
  } else {
    document.body.style.cursor = "default";
  }
  console.log("x: " + (event.x - cnvRect.x), "y: " + (event.y - cnvRect.y));
  // }
}

function keydownHandler(event) {
  if (event.code === "KeyE") {
    eIsPressed = true;
  }
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
    upIsPressed = true;
  }
}

function keyupHandler(event) {
  if (event.code === "KeyE") {
    eIsPressed = false;
  }
  if (event.code === "KeyD" || event.code === "ArrowRight") {
    rightIsPressed = false;
  }
  if (event.code === "KeyA" || event.code === "ArrowLeft") {
    leftIsPressed = false;
  }
  if (
    event.code === "KeyW" ||
    event.code === "ArrowUp" ||
    event.code === "Space"
  ) {
    upIsPressed = false;
  }
}

// CREATE LEVEL OBJECTS

// Platform function
function newBlock(x, y, w, h) {
  return {
    x: x,
    y: y,
    w: w,
    h: h,
  }
}

// Create objects
let platform1 = newBlock(400, 425, 50, 10);
let platform2 = newBlock(500, 400, 50, 10);
let wall1 = newBlock(545, 425, 10, 50);
let wall2 = newBlock(300, 400, 10, 50);
let wall3 = newBlock(550, 391, 43, 35);

// MAIN PROGRAM LOOP
requestAnimationFrame(loop);

function loop() {
  if (screen === "title") {
    // TITLE SCREEN

    // Play button
    ctx.fillStyle = "black";
    ctx.arc(500, 300, 30, 0, 2 * Math.PI);
    ctx.fill();

    // Title
    ctx.font = "100px  Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Titre", 420, 100);
  } else {
    // SET UP LEVEL

    // Background
    background = document.getElementById("level4");
    ctx.drawImage(background, 0, 0, cnv.width, cnv.height);

    ctx.drawImage(document.getElementById("factory-worker"), 600, 422);

    // if (screen === "level4") {
      if (char.x < 200 && opacity < 10) {
        opacity += 1;
      } else if (char.x > 200 && opacity > 0) {
        opacity -= 1;
      }
      ctx.globalAlpha = opacity / 10
      ctx.drawImage(document.getElementById("factory-interior"), 0, 271, 200, 207);
      ctx.globalAlpha = 1
    // }

    // Platforms
    // ctx.fillStyle = "blue";
    // ctx.fillRect(platform1.x, platform1.y, platform1.w, platform1.h);
    // ctx.fillRect(platform2.x, platform2.y, platform2.w, platform2.h);

    // Walls
    // ctx.fillRect(wall1.x, wall1.y, wall1.w, wall1.h);
    // ctx.fillRect(wall2.x, wall2.y, wall2.w, wall2.h);

    // CHARACTER
    ctx.fillStyle = "yellow";
    ctx.fillRect(char.x, char.y, 25, 25);

    // Move x
    if (laser.shoot != true) {
      if (rightIsPressed) {
        char.x += 5;
        char.facing = "right";
      }
      if (leftIsPressed) {
        char.x -= 5;
        char.facing = "left";
      }
    }

    // prevent character from going off screen
    if (char.x < 0) {
      char.x = 0;
    }
    if (char.x > cnv.width - 25) {
      char.x = cnv.width - 25;
    }

    // Gravity
    if (laser.shoot != true) {
      // jump
      char.y += char.gravity;
      char.gravity += 0.5;
      if (upIsPressed && char.standing) {
        char.standing = false;
        char.y -= 10;
        char.gravity = -10;
      }

      // check if standing on something
      function platformCollide(aPlatform) {
        if (char.x + 25 > aPlatform.x && char.x < (aPlatform.x + aPlatform.w) && char.y + 25 >= aPlatform.y && char.y + 25 <= (aPlatform.y + aPlatform.h)) {
          char.y = aPlatform.y - 25;
          char.gravity = 0;
          char.standing = true;
        }
      }

      if (char.y >= 450) {
        char.standing = true;
        char.gravity = 0;
        char.y = 450;
      } else if (char.gravity >= 0) {
        char.standing = false;
        // platformCollide(platform1);
        // platformCollide(platform2);
      }
    }

    // LASER

    // Shoot laser
    if (eIsPressed && laser.shoot === "ready") {
      char.gravity = 1;
      laser.width = 4;
      laser.y = char.y + 12.5;
      laser.shoot = true;
      if (char.facing === "right") {
        laser.xMove = char.x + 25;
        laser.xLine = char.x + 25;
      } else {
        laser.xMove = char.x;
        laser.xLine = char.x;
      }
    }
    if (laser.shoot === true) {
      while (!laser.collide) {
        // Laser moves left or right
        if (char.facing === "right") {
          laser.xLine++;
        }
        if (char.facing === "left") {
          laser.xLine--;
        }

        // Check collision
        function wallCollide(aWall) {
          if ((laser.xLine === aWall.x || laser.xLine === aWall.x + aWall.w) && laser.y > aWall.y && laser.y < aWall.y + aWall.h) {
            laser.collide = true;
          }
        }
        // wallCollide(wall1);
        // wallCollide(wall2);
        wallCollide(wall3);
        if (laser.xLine < -1 || laser.xLine > cnv.width + 1) {
          laser.collide = true;
        }
      }

      // Draw laser
      ctx.lineWidth = laser.width;
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.moveTo(laser.xMove, laser.y);
      ctx.lineTo(laser.xLine, laser.y);
      ctx.stroke();
    }
    // Laser timer
    if (laser.shoot != false && laser.shoot != "ready") {
      laser.timer++;
    }
    if (laser.timer >= 25) {
      laser.width -= 1;
    }
    if (laser.timer >= 30) {
      laser.shoot = "cooldown";
      laser.collide = false;
    }
    if (laser.timer >= 60) {
      laser.shoot = "ready";
      laser.timer = 0;
    }
  }
  requestAnimationFrame(loop);
}

// LEVEL 1: Route de la Soie
// LEVEL 2: First Nations
// LEVEL 3: Europeans
// LEVEL 4: Industrialisation in UK
// LEVEL 5: Child Labour