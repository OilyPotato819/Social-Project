// Social Studies Game by Oli and Xander

// SETUP CANVAS AND GRAPHICS CONTEXT
let cnv = document.getElementById("my_canvas");
let ctx = cnv.getContext("2d");
cnv.width = 1000;
cnv.height = 600;

// GLOBAL VARIABLES
let screen = "title";
let background;
let openHole;
let rightIsPressed = false;
let leftIsPressed = false;
let eIsPressed = false;
let upIsPressed = false;
let distance;
let opacity = 0;
let char = {
  x: 500,
  y: 449,
  w: 25,
  h: 25,
  facing: "right",
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
  if (screen === "title") {
    if (distance < 30) {
      screen = "level1";
      puzzle1Setup();
      document.body.style.cursor = "default";
    }
  }

}

function mousemoveHandler(event) {
  let cnvRect = cnv.getBoundingClientRect();
  // console.log("x: " + (event.x - cnvRect.x), "y: " + (event.y - cnvRect.y));
  if (screen === "title") {
    let run = Math.abs(event.x - cnvRect.x - 500);
    let rise = Math.abs(event.y - cnvRect.y - 300);
    distance = Math.sqrt(run ** 2 + rise ** 2);

    if (distance < 30) {
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "default";
    }
  }
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
function newBlock(x, y, w, h, a, r, c) {
  return {
    x: x,
    y: y,
    w: w,
    h: h,
    a: a,
    r: r,
    c: c,
  }
}

// Create objects
let platform1 = newBlock(0, 0, 50, 10);
let platform2 = newBlock(0, 0, 50, 10);
let wallL1 = newBlock(0, 0, 10, 50);
let wallL2 = newBlock(0, 0, 10, 50);
let wallC1 = newBlock(0, 0, 1, 0);
let wallC2 = newBlock(0, 0, 1, 0);
let entrance = newBlock(0, 0, 45, 35, "hole");
let hole = newBlock(0, 474, 100, 0);
let mirror = newBlock(0, 0, 50, 10, "mirror", 90);
let portal = newBlock(0, 0, 69, 90, "portal");

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

    // Draw background
    ctx.drawImage(background, 0, 0, cnv.width, cnv.height);

    // factory interior
    if (background === document.getElementById("level4")) {
      if (char.x < 200 && opacity < 10) {
        opacity += 1;
      } else if (char.x > 200 && opacity > 0) {
        opacity -= 1;
      }
      ctx.globalAlpha = opacity / 10
      ctx.drawImage(document.getElementById("factory-interior"), 0, 271, 200, 207);
      ctx.globalAlpha = 1
    }

    // Platforms
    ctx.fillStyle = "blue";
    ctx.fillRect(platform1.x, platform1.y, platform1.w, platform1.h);
    ctx.fillRect(platform2.x, platform2.y, platform2.w, platform2.h);

    // Walls
    ctx.fillRect(wallL1.x, wallL1.y, wallL1.w, wallL1.h);
    ctx.fillRect(wallL2.x, wallL2.y, wallL2.w, wallL2.h);
    ctx.fillRect(entrance.x, entrance.y, entrance.w, entrance.h);
    ctx.fillStyle = hole.c;
    ctx.fillRect(wallC1.x, wallC1.y, wallC1.w, wallC1.h);
    ctx.fillRect(wallC2.x, wallC2.y, wallC2.w, wallC2.h);

    // Mirror
    let mcx = mirror.x + 0.5 * mirror.w;
    let mcy = mirror.y + 0.5 * mirror.h;
    ctx.save();
    ctx.translate(mcx, mcy);
    ctx.rotate(mirror.r * Math.PI / 180);
    ctx.translate(-mcx, -mcy);
    ctx.fillRect(mirror.x, mirror.y, mirror.w, mirror.h);
    ctx.restore();

    // Hole
    ctx.fillRect(hole.x, hole.y, hole.w, hole.h);

    // Portal
    ctx.drawImage(document.getElementById("portal"), portal.x, portal.y, portal.w, portal.h);

    // LASER

    // Shoot laser
    if (eIsPressed && laser.shoot === "ready") {
      char.gravity = 1;
      laser.width = 4;
      laser.y = char.y + 12.5;
      laser.shoot = true;
      if (char.facing === "right") {
        laser.xMove = char.x + char.h;
        laser.xLine = char.x + char.h;
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
          if (laser.xLine > aWall.x && laser.xLine < aWall.x + aWall.w && laser.y > aWall.y && laser.y < aWall.y + aWall.h) {
            laser.collide = true;
            if (aWall.a === "hole") {
              openHole = true;
            }
          }
        }
        wallCollide(wallL1);
        wallCollide(wallL2);
        wallCollide(entrance);

        function mirrorCollide(aMirror) {
          if (laser.xLine > aMirror.x && laser.xLine < aMirror.x + aMirror.w && laser.y > aMirror.y && laser.y < aMirror.y + aMirror.h) {
            console.log("yee")
            // mirror.x = 400;
            // mirror.y = 444;
            // 421
            // 425
          }
        }
        mirrorCollide(mirror);

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

    if (openHole) {
      if (hole.h < cnv.height) {
        hole.h += 4;
      }
      wallC1.x = hole.x;
      wallC1.y = hole.y;
      wallC1.h = hole.h;
      wallC2.x = hole.x + 100;
      wallC2.y = hole.y;
      wallC2.h = hole.h;
    }

    // CHARACTER
    ctx.fillStyle = "green";
    ctx.fillRect(char.x, char.y, char.w, char.h);

    // Move x
    if (laser.shoot != true) {
      if (rightIsPressed && !leftIsPressed) {
        char.x += 5;
        char.facing = "right";
      }
      if (leftIsPressed && !rightIsPressed) {
        char.x -= 5;
        char.facing = "left";
      }

      function wallCollide(aWall) {
        if (char.x + char.w > aWall.x && char.x < aWall.x + aWall.w && char.y + char.h > aWall.y && char.y < aWall.y + aWall.h) {
          if (aWall.action = "portal") {
            screen = screen.replace("puzzle", "level");
            level1Setup();
            level2Setup();
            level3Setup();
            level4Setup();
            level5Setup();
          } else if (char.facing === "right") {
            char.x = aWall.x + aWall.w - char.w
          } else if (char.facing === "left") {
            char.x = aWall.x + aWall.w
          }
        }
      }
      wallCollide(wallC1);
      wallCollide(wallC2);
      wallCollide(portal);
    }

    // prevent character from going off screen
    if (char.x < 0) {
      char.x = 0;
    }
    if (char.x > cnv.width - char.w) {
      char.x = cnv.width - char.w;
    }

    // Gravity
    if (laser.shoot != true) {
      // jump
      char.y += char.gravity;
      if (char.gravity < 8.5) {
        char.gravity += 0.45;
      }
      if (upIsPressed && char.standing) {
        char.standing = false;
        char.y -= 8.5;
        char.gravity = -8.5;
      }

      // check if standing on something
      function platformCollide(aPlatform) {
        if (char.x + char.w > aPlatform.x && char.x < (aPlatform.x + aPlatform.w) && char.y + char.w >= aPlatform.y && char.y + char.w <= (aPlatform.y + aPlatform.h)) {
          char.y = aPlatform.y - char.w;
          char.gravity = 0;
          char.standing = true;
        }
      }

      if (char.x > hole.x && char.x < (hole.x + hole.w) && openHole) {
        char.standing = false;
        if (char.y >= hole.y + hole.h - char.h - 2) {
          char.y = hole.y + hole.h - char.h;
        }
      } else if (char.y >= 449) {
        char.standing = true;
        char.gravity = 0;
        char.y = 449;
      } else if (char.gravity >= 0) {
        char.standing = false;
        platformCollide(platform1);
        platformCollide(platform2);
      }

      if (char.y > cnv.height) {
        screen = screen.replace("level", 'puzzle');
        puzzle1Setup();
        puzzle2Setup();
        puzzle3Setup();
        puzzle4Setup();
        puzzle5Setup();
      }
    }
  }
  requestAnimationFrame(loop);
}

function level1Setup() {
  if (screen = "level1") {
    background = document.getElementById("level1");
    hideAll();
    entrance.x = 549;
    entrance.y = 386;
    entrance.w = 45.1;
    entrance.h = 50;
    hole.x = 920;
    hole.c = "#ffeb3b";
  }
}

function level2Setup() {
  if (screen = "level2") {
    background = document.getElementbyId("level2");
    hideAll();
  }
}

function level3Setup() {
  if (screen = "level3") {
    background = document.getElementbyId("level3");
    hideAll();
  }
}

function level4Setup() {
  if (screen = "level4") {
    background = document.getElementbyId("level4");
    hideAll();
    entrance.x = 549;
    entrance.y = 386;
    entrance.w = 45.1;
    entrance.h = 50;
  }
}

function level5Setup() {
  if (screen = "level5") {
    background = document.getElementbyId("level5");
    hideAll();
  }
}

function puzzle1Setup() {
  if (screen = "puzzle1") {
    background = document.getElementById("puzzle");
    openHole = false;
    entrance.x = -100;
    hole.x = -100;
    char.y = 0 - char.h;
    mirror.x = 400;
    mirror.y = 444;
    portal.x = 900;
    portal.y = 380;
  }
}

function puzzle2Setup() {
  if (screen = "puzzle2") {

  }
}

function puzzle3Setup() {
  if (screen = "puzzle3") {

  }
}

function puzzle4Setup() {
  if (screen = "puzzle4") {

  }
}

function puzzle5Setup() {
  if (screen = "puzzle5") {

  }
}

function hideAll() {
  wallL1.x = -100;
  wallL2.x = -100;
  wallC1.x = -100
  wallC2.x = -100;
  mirror.x = -100;
  platform1.x = -100;
  platform2.x = -100;
  portal.x = -100;
}

// LEVEL 1: Route de la Soie
// LEVEL 2: First Nations
// LEVEL 3: Europeans
// LEVEL 4: Industrialisation in UK
// LEVEL 5: Child Labour