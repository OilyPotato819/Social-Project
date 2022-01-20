// Social Studies Game by Oli and Xander

// SETUP CANVAS AND GRAPHICS CONTEXT
let cnv = document.getElementById('my_canvas');
let ctx = cnv.getContext('2d');
cnv.width = 1000;
cnv.height = 600;

// GLOBAL VARIABLES
let screen = 'title0';
let frameCount = 0;
let background = document.getElementById('title');;
let openHole;
let rightIsPressed = false;
let leftIsPressed = false;
let eIsPressed = false;
let upIsPressed = false;
let distance;
let opacity = 0;
let checkMirrors = 'ready';
let char = {
  imgX: 0,
  imgY: 0,
  x: 850,
  y: 474 - 54,
  w: 24,
  h: 69,
  facing: 'right',
  gravity: 0,
  standing: true,
};
let laser = {
  originX: 0,
  originY: 0,
  xMove: 0,
  xLine: 0,
  yMove: 0,
  yLine: 0,
  dx: 0,
  dy: 0,
  shoot: 'ready',
  timer: 0,
  collide: false,
  width: 0,
};

// EVENT LISTENERS
document.addEventListener('keydown', keydownHandler);
document.addEventListener('keyup', keyupHandler);

// FUNCTIONS
cnv.addEventListener('click', function (evt) {
  var mousePos = getMousePos(cnv, evt);
  console.log(mousePos.x + ',' + mousePos.y);
}, false);

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function keydownHandler(event) {
  if (event.code === 'KeyE') {
    eIsPressed = true;
  }
  if (event.code === 'KeyD' || event.code === 'ArrowRight') {
    rightIsPressed = true;
  }
  if (event.code === 'KeyA' || event.code === 'ArrowLeft') {
    leftIsPressed = true;
  }
  if (
    event.code === 'KeyW' ||
    event.code === 'ArrowUp' ||
    event.code === 'Space'
  ) {
    upIsPressed = true;
  }
}

function keyupHandler(event) {
  if (event.code === 'KeyE') {
    eIsPressed = false;
  }
  if (event.code === 'KeyD' || event.code === 'ArrowRight') {
    rightIsPressed = false;
  }
  if (event.code === 'KeyA' || event.code === 'ArrowLeft') {
    leftIsPressed = false;
  }
  if (
    event.code === 'KeyW' ||
    event.code === 'ArrowUp' ||
    event.code === 'Space'
  ) {
    upIsPressed = false;
  }
}

// CREATE LEVEL OBJECTS

// Button function
function newButton(x, y, w, h, action, activate, baseY, timer) {
  return {
    x: x,
    y: y,
    w: w,
    h: h,
    action: action,
    activate: activate,
    baseY: baseY,
    timer: timer,
  }
}

// Create buttons
let button1C = newButton(400, 454, 30, 10, 'button', '', '', 0);
let button2C = newButton(500, 454, 30, 10, 'button', '', '', 0);
let button1L = newButton(500, 454, 10, 30, 'button', '', '', 0);

// Block function
function newBlock(x, y, w, h, action, activate, img, color) {
  return {
    x: x,
    y: y,
    w: w,
    h: h,
    action: action,
    activate: activate,
    img: img,
    color: color,
  }
}

// Create blocks
let platform1 = newBlock(-100, 0, 50, 10);
let platform2 = newBlock(-100, 0, 50, 10);
let wallL1 = newBlock(100, 400, 10, 50);
let wallL2 = newBlock(-100, 0, 10, 50);
let wallC1 = newBlock(-100, 0, 0.01, 0);
let wallC2 = newBlock(-100, 0, 0.01, 0);
let entrance = newBlock(-100, 0, 45, 35, 'hole');
let hole = newBlock(-100, 474, 100, 0);
let portal = newBlock(900, 380, 69, 90, 'portal');
let showDialogue = newBlock(0, 0, 0, 0, 'dialogue', true, document.getElementById("lvl1dia"));
let dialogueImg = newBlock(0, 0, 0, 0, 'dialogue');

// Mirror function
function newMirror(x1, y1, action, coords, rotation, x2, y2, cor1x, cor1y, cor2x, cor2y, ) {
  return {
    x1: x1,
    y1: y1,
    action: action,
    coords: coords,
    rotation: rotation,
    x2: x2,
    y2: y2,
    cor1x: cor1x,
    cor1y: cor1y,
    cor2x: cor2x,
    cor2y: cor2y,
  }
}

// Create mirror
let mirror1 = newMirror(700, 350, 'mirror', '', 135);
let mirror2 = newMirror(670, 420, 'mirror', '', 45);
let mirror3 = newMirror(750, 350, 'mirror', '', 45);
let mirror4 = newMirror(780, 420, 'mirror', '', 135);

// MAIN PROGRAM LOOP
requestAnimationFrame(loop);

function loop() {
  frameCount++;
  // Play button
  ctx.fillStyle = 'black';
  ctx.arc(500, 300, 30, 0, 2 * Math.PI);
  ctx.fill();
  // SET UP LEVEL

  // Draw background
  ctx.drawImage(background, 0, 0, cnv.width, cnv.height);

  // factory interior
  if (background === document.getElementById('level4')) {
    if (char.x < 200 && opacity < 10) {
      opacity += 1;
    } else if (char.x > 200 && opacity > 0) {
      opacity -= 1;
    }
    ctx.globalAlpha = opacity / 10
    ctx.drawImage(document.getElementById('factory-interior'), 0, 271, 200, 207);
    ctx.globalAlpha = 1
  }

  // Dialogue box
  if (showDialogue.activate) {
    ctx.drawImage(showDialogue.img, dialogueImg.x, dialogueImg.y, dialogueImg.w, dialogueImg.h);
  }
  ctx.strokeRect(showDialogue.x, showDialogue.y, showDialogue.w, showDialogue.h);

  // Platforms
  ctx.fillStyle = 'blue';
  ctx.fillRect(platform1.x, platform1.y, platform1.w, platform1.h);
  ctx.fillRect(platform2.x, platform2.y, platform2.w, platform2.h);

  // Walls
  ctx.fillRect(wallL1.x, wallL1.y, wallL1.w, wallL1.h);
  ctx.fillRect(wallL2.x, wallL2.y, wallL2.w, wallL2.h);
  ctx.fillRect(entrance.x, entrance.y, entrance.w, entrance.h);
  ctx.fillStyle = hole.c;
  ctx.fillRect(wallC1.x, wallC1.y, wallC1.w, wallC1.h);
  ctx.fillRect(wallC2.x, wallC2.y, wallC2.w, wallC2.h);

  // Hole
  ctx.fillRect(hole.x, hole.y, hole.w, hole.h);

  // Portal
  ctx.drawImage(document.getElementById('portal'), portal.x, portal.y, portal.w, portal.h);

  // Mirrors
  mirror45(mirror1);
  mirror135(mirror2);
  mirror135(mirror3);
  mirror45(mirror4);

  function mirror45(aMirror) {
    aMirror.x2 = aMirror.x1 + 6.5;
    aMirror.y2 = aMirror.y1 + 6.5;
    aMirror.cor1x = aMirror.x1 - 35;
    aMirror.cor1y = aMirror.y1 + 35;
    aMirror.cor2x = aMirror.cor1x + 6.5;
    aMirror.cor2y = aMirror.cor1y + 6.5;
  }

  function mirror135(aMirror) {
    aMirror.x2 = aMirror.x1 + 6.5;
    aMirror.y2 = aMirror.y1 - 6.5;
    aMirror.cor1x = aMirror.x1 + 35;
    aMirror.cor1y = aMirror.y1 + 35;
    aMirror.cor2x = aMirror.cor1x + 6.5;
    aMirror.cor2y = aMirror.cor1y - 6.5;
  }

  // Buttons

  // Draw button
  drawButtonC(button1C);
  drawButtonC(button2C);

  function drawButtonC(aButtonC) {
    ctx.fillStyle = 'red';
    ctx.fillRect(aButtonC.x, aButtonC.y, aButtonC.w, aButtonC.h);
    ctx.fillStyle = 'grey';
    ctx.fillRect(aButtonC.x + (aButtonC.w / 2) - 50 / 2, aButtonC.y + 10 + aButtonC.baseY, 50, 10);
  }

  drawButtonL(button1L);

  function drawButtonL(aButtonL) {
    ctx.fillStyle = 'red';
    ctx.fillRect(aButtonL.x, aButtonL.y, aButtonL.w, aButtonL.h);
    ctx.fillStyle = 'grey';
    ctx.fillRect(aButtonL.x + 10 + aButtonL.baseY, aButtonL.y + (aButtonL.h / 2) - 50 / 2, 10, 50);
  }

  pressButton(button1C);
  pressButton(button2C);

  function pressButton(aButton) {
    if (aButton.activate === true) {
      aButton.y += 5;
      aButton.h -= 5;
      aButton.baseY = -5;
      aButton.activate = 'wait';
      aButton.timer = 0;
    } else if (aButton.activate === 'count') {
      aButton.timer++;
      console.log(aButton.timer)
      if (aButton.timer > 30) {
        aButton.activate = 'reset';
      }
    }
    if (aButton.activate === 'reset') {
      aButton.y -= 5;
      aButton.h += 5;
      aButton.baseY = 0;
      aButton.activate = false;
    }
  }

  // LASER

  // Shoot laser
  if (laser.shoot === 'animate') {
    laser.shoot = true;
    laser.width = 4;
    if (rightIsPressed || leftIsPressed) {
      laser.originY = char.y + 37;
    } else {
      laser.originY = char.y + 34;
    }
    if (char.imgY === 0) {
      laser.originX = char.x + char.w + 13;
    } else if (char.imgY === 112) {
      laser.originX = char.x + char.w + 23;
    } else if (char.imgY === 56) {
      laser.originX = char.x - 13;
    } else if (char.imgY === 168) {
      laser.originX = char.x - 23;
    }
  }

  if (eIsPressed && laser.shoot === 'ready') {
    laser.shoot = 'animate';
    char.gravity = 0;
  }

  if (laser.shoot === true) {
    laser.collide = false;
    laser.xMove = laser.originX;
    laser.xLine = laser.originX;
    laser.yMove = laser.originY;
    laser.yLine = laser.originY;
    laser.dx = 0;
    laser.dy = 0;
    shootLaser();
  }

  function shootLaser() {
    if (char.facing === "right") {
      laser.dx = 1;
    } else {
      laser.dx = -1;
    }

    while (!laser.collide) {
      if (checkMirrors === 'ready') {
        getCoordinates(mirror1);
        getCoordinates(mirror2);
        getCoordinates(mirror3);
        getCoordinates(mirror4);
      }

      laser.xMove = laser.xLine;
      laser.xLine += laser.dx;
      laser.yMove = laser.yLine;
      laser.yLine += laser.dy;

      // Check collision
      mirrorCollision(mirror1);
      mirrorCollision(mirror2);
      mirrorCollision(mirror3);
      mirrorCollision(mirror4);

      wallCollide(wallL1);
      wallCollide(wallL2);
      wallCollide(entrance);

      if (laser.xLine < -1 || laser.xLine > cnv.width + 1 || laser.yLine < 0 || laser.yLine > 473) {
        laser.collide = true;
      }

      // Draw laser
      ctx.lineWidth = laser.width;
      ctx.strokeStyle = 'red';
      ctx.beginPath();
      ctx.moveTo(laser.xMove, laser.yMove);
      ctx.lineTo(laser.xLine, laser.yLine);
      ctx.stroke();
    }
  }

  function getCoordinates(aMirror) {
    checkMirrors = true;
    aMirror.coords += '///coords1///'
    if (aMirror.rotation === 135) {
      for (let checkY = aMirror.y1, checkX = aMirror.x1; checkY < aMirror.cor1y; checkY++) {
        aMirror.coords += '|' + parseInt(checkX) + ',' + parseInt(checkY) + '|';
        checkX--;
      }
      aMirror.coords += '///coords2///'
      for (let checkY = aMirror.y1, checkX = aMirror.x1; checkY < aMirror.y2; checkY++) {
        aMirror.coords += '|' + parseInt(checkX) + ',' + parseInt(checkY) + '|';
        checkX++;
      }
      aMirror.coords += '///coords3///'
      for (let checkY = aMirror.y2, checkX = aMirror.x2; checkY < aMirror.cor2y; checkY++) {
        aMirror.coords += '|' + parseInt(checkX) + ',' + parseInt(checkY) + '|';
        checkX--;
      }
      aMirror.coords += '///coords4///'
      for (let checkY = aMirror.cor1y, checkX = aMirror.cor1x; checkY < aMirror.cor2y; checkY++) {
        aMirror.coords += '|' + parseInt(checkX) + ',' + parseInt(checkY) + '|';
        checkX++;
      }
    } else if (aMirror.rotation === 45) {
      for (let checkY = aMirror.y2, checkX = aMirror.x2; checkY < aMirror.y1; checkY++) {
        aMirror.coords += '|' + parseInt(checkX) + ',' + parseInt(checkY) + '|';
        checkX--;
      }
      aMirror.coords += '///coords2///'
      for (let checkY = aMirror.y2, checkX = aMirror.x2; checkY < aMirror.cor2y; checkY++) {
        aMirror.coords += '|' + parseInt(checkX) + ',' + parseInt(checkY) + '|';
        checkX++;
      }
      aMirror.coords += '///coords3///'
      for (let checkY = aMirror.cor2y, checkX = aMirror.cor2x; checkY < aMirror.cor1y; checkY++) {
        aMirror.coords += '|' + parseInt(checkX) + ',' + parseInt(checkY) + '|';
        checkX--;
      }
      aMirror.coords += '///coords4///'
      for (let checkY = aMirror.y1, checkX = aMirror.x1; checkY < aMirror.cor1y; checkY++) {
        aMirror.coords += '|' + parseInt(checkX) + ',' + parseInt(checkY) + '|';
        checkX++;
      }
    }
  }

  function mirrorCollision(aMirror) {
    let searchFor = '|' + parseInt(laser.xLine) + ',' + parseInt(laser.yLine) + '|';
    aMirror.coords = aMirror.coords.replace(searchFor, '|match|');
    if (aMirror.coords.includes('match')) {
      let coords2 = aMirror.coords.search('coords2');
      let coords3 = aMirror.coords.search('coords3');
      let coords4 = aMirror.coords.search('coords4');
      let match = aMirror.coords.search('match');
      if (match < coords2) {
        if (laser.dx === 0) {
          laser.dx = -1;
          laser.dy = 0;
        } else {
          laser.dx = 0;
          laser.dy = -1;
        }
      } else if (match > coords2 && match < coords3) {
        if (laser.dx === 0) {
          laser.dx = 1;
          laser.dy = 0;
        } else {
          laser.dx = 0;
          laser.dy = -1;
        }
      } else if (match > coords3 && match < coords4) {
        if (laser.dx === 0) {
          laser.dx = 1;
          laser.dy = 0;
        } else {
          laser.dx = 0;
          laser.dy = 1;
        }
      } else {
        if (laser.dx === 0) {
          laser.dx = -1;
          laser.dy = 0;
        } else {
          laser.dx = 0;
          laser.dy = 1;
        }
      }

      checkMirrors = 'ready'
      mirror1.coords = '';
      mirror2.coords = '';
      mirror3.coords = '';
      mirror4.coords = '';
    }
  }

  function wallCollide(aWall) {
    if (laser.xLine >= aWall.x && laser.xLine <= aWall.x + aWall.w && laser.yLine > aWall.y && laser.yLine < aWall.y + aWall.h) {
      laser.collide = true;
      laser.xLine;
      if (aWall.action === 'hole') {
        openHole = true;
      }
    }
  }

  // Laser timer
  if (laser.shoot != 'ready') {
    laser.timer++;
  }
  if (laser.timer >= 25) {
    laser.width -= 1;
  }
  if (laser.timer >= 30) {
    laser.shoot = 'cooldown';
    laser.collide = false;
  }
  if (laser.timer >= 60) {
    laser.shoot = 'ready';
    laser.timer = 0;
  }

  // Draw mirrors
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'black';
  drawMirror(mirror1);
  drawMirror(mirror2);
  drawMirror(mirror3);
  drawMirror(mirror4);

  function drawMirror(aMirror) {
    ctx.beginPath();
    ctx.moveTo(aMirror.x1, aMirror.y1);
    ctx.lineTo(aMirror.cor1x, aMirror.cor1y);
    ctx.lineTo(aMirror.cor2x, aMirror.cor2y);
    ctx.lineTo(aMirror.x2, aMirror.y2);
    ctx.closePath();
    ctx.stroke();
  }

  // CHARACTER
  ctx.drawImage(document.getElementById('spritesheet'), char.imgX, char.imgY, 54, 56, char.x - 23, char.y - 2, 70, 72);

  if (laser.shoot != true) {
    // Animations
    if (rightIsPressed) {
      char.imgY = 0;
      if (laser.shoot === 'animate') {
        char.imgX = 108;
      } else {
        if (frameCount % 10 === 0) {
          if (char.imgX === 54) {
            char.imgX = 0;
          } else {
            char.imgX = 54;
          }
        }
      }
    } else if (leftIsPressed) {
      char.imgY = 56;
      if (laser.shoot === 'animate') {
        char.imgX = 108;
      } else {
        if (frameCount % 10 === 0) {
          if (char.imgX === 54) {
            char.imgX = 0;
          } else {
            char.imgX = 54;
          }
        }
      }
    } else if (char.facing === 'right') {
      char.imgY = 112;
      if (laser.shoot === 'animate') {
        char.imgX = 54;
      } else {
        char.imgX = 0;
      }
    } else if (char.facing === 'left') {
      char.imgY = 168;
      if (laser.shoot === 'animate') {
        char.imgX = 54;
      } else {
        char.imgX = 0;
      }
    }

    // Move x
    if (rightIsPressed && !leftIsPressed) {
      char.x += 5;
      char.facing = 'right';
    }
    if (leftIsPressed && !rightIsPressed) {
      char.x -= 5;
      char.facing = 'left';
    }


    // Collision

    // wall
    function wallCollide(aWall) {
      if (char.x + char.w > aWall.x && char.x < aWall.x + aWall.w && char.y + char.h > aWall.y && char.y < aWall.y + aWall.h) {
        if (aWall.action === 'portal') {
          screen = screen.replace(/puzzle|title/, '');
          let levelNum = +screen;
          levelNum++;
          screen = 'level' + levelNum;
          level1Setup();
          level2Setup();
          level3Setup();
          level4Setup();
          level5Setup();
        } else if (aWall.action === 'dialogue') {
          aWall.activate = true;
        } else if (aWall.action === 'button') {
          if (aWall.activate != 'wait' && aWall.activate != 'count') {
            aWall.activate = true;
          }
        } else if (char.facing === 'right') {
          char.x = aWall.x - char.w - 1;
        } else if (char.facing === 'left') {
          char.x = aWall.x + aWall.w;
        } else {
          aWall.activate = false;

        }
      } else {
        if (aWall.action === 'button' && aWall.activate != false) {
          aWall.activate = 'count';
        } else {
          aWall.activate = false;
        }
      }
    }
    wallCollide(wallC1);
    wallCollide(wallC2);
    wallCollide(portal);
    wallCollide(showDialogue);
    wallCollide(button1C);
    wallCollide(button2C);

    // platform
    function platformCollide(aPlatform) {
      if (char.x + char.w > aPlatform.x && char.x < aPlatform.x + aPlatform.w && char.y + char.h > aPlatform.y - 7 && char.y + char.h < aPlatform.y + aPlatform.h && char.y != aPlatform.y - char.h) {
        char.y = aPlatform.y - char.h;
        char.gravity = 0;
        char.standing = true;
      }
    }
    if (char.x > hole.x && char.x + char.w < hole.x + hole.w && openHole) {
      char.standing = false;
      if (char.y >= hole.y + hole.h - char.h - 2) {
        char.y = hole.y + hole.h - char.h;
      }
    } else if (char.y > 396 && char.y != 404) {
      char.y = 404;
      char.gravity = 0;
      char.standing = true;
    } else if (char.gravity >= 0) {
      char.standing = false;
      platformCollide(platform1);
      platformCollide(platform2);
    }

    // Gravity
    char.y += char.gravity;
    if (char.gravity < 8.5) {
      char.gravity += 0.45;
    }
    if (upIsPressed && char.standing) {
      char.standing = false;
      char.y -= 8.5;
      char.gravity = -8.5;
    }

    // Puzzle room
    if (char.y > cnv.height) {
      screen = screen.replace('level', 'puzzle');
      puzzle1Setup();
      puzzle2Setup();
      puzzle3Setup();
      puzzle4Setup();
      puzzle5Setup();
      openHole = false;
    }
  }

  // prevent character from going off screen
  if (char.x < 0) {
    char.x = 0;
  }
  if (char.x > cnv.width - char.w) {
    char.x = cnv.width - char.w;
  }

  // Hole
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

  requestAnimationFrame(loop);
}

function level1Setup() {
  if (screen === 'level1') {
    background = document.getElementById('level1');
    hideAll();
    entrance.x = 549;
    entrance.y = 386;
    entrance.w = 45.1;
    entrance.h = 50;
    hole.x = 920;
    hole.color = '#ffeb3b';
    showDialogue.img = document.getElementById("lvl1dia");
    showDialogue.x = 430;
    showDialogue.y = 400;
    showDialogue.w = 75;
    showDialogue.h = 50;
    dialogueImg.x = 340;
    dialogueImg.y = 230;
    dialogueImg.w = 300;
    dialogueImg.h = 300;
  }
}

function level2Setup() {
  if (screen === 'level2') {
    background = document.getElementById('level2');
    hideAll();
    entrance.x = 549;
    entrance.y = 386;
    entrance.w = 45.1;
    entrance.h = 50;
    hole.x = 615;
    hole.color = '#8d6e63';
    showDialogue.img = document.getElementById("lvl2dia");
    showDialogue.x = 355;
    showDialogue.y = 400;
    showDialogue.w = 75;
    showDialogue.h = 50;
    dialogueImg.x = 238;
    dialogueImg.y = 230;
    dialogueImg.w = 300;
    dialogueImg.h = 300;
  }
}

function level3Setup() {
  if (screen === 'level3') {
    background = document.getElementById('level3');
    hideAll();
    entrance.x = 549;
    entrance.y = 386;
    entrance.w = 45.1;
    entrance.h = 50;
    hole.x = 615;
    hole.color = '#685a55';
    showDialogue.img = document.getElementById("lvl3dia");
    showDialogue.x = 510;
    showDialogue.y = 400;
    showDialogue.w = 75;
    showDialogue.h = 50;
    dialogueImg.x = 400;
    dialogueImg.y = 230;
    dialogueImg.w = 300;
    dialogueImg.h = 300;
  }
}

function level4Setup() {
  if (screen === 'level4') {
    background = document.getElementById('level4');
    hideAll();
    entrance.x = 549;
    entrance.y = 386;
    entrance.w = 45.1;
    entrance.h = 50;
    hole.x = 850;
    hole.color = '#9e939e';
    showDialogue.img = document.getElementById("lvl4dia");
    showDialogue.x = 620;
    showDialogue.y = 400;
    showDialogue.w = 75;
    showDialogue.h = 50;
    dialogueImg.x = 570;
    dialogueImg.y = 215;
    dialogueImg.w = 300;
    dialogueImg.h = 300;
  }
}

function level5Setup() {
  if (screen === 'level5') {
    background = document.getElementById('level5');
    hideAll();
    entrance.x = 549;
    entrance.y = 386;
    entrance.w = 45.1;
    entrance.h = 50;
    hole.x = 200;
    hole.color = '#5c5353';
    showDialogue.img = document.getElementById("lvl5dia");
    showDialogue.x = 75;
    showDialogue.y = 400;
    showDialogue.w = 75;
    showDialogue.h = 50;
    dialogueImg.x = -15;
    dialogueImg.y = 235;
    dialogueImg.w = 300;
    dialogueImg.h = 300;
  }
}

function puzzle1Setup() {
  if (screen === 'puzzle1') {
    puzzleSetup();
    hole.x = -100;
    mirror1.x1 = 400;
    mirror1.y1 = 444;
    portal.x = 900;
    portal.y = 380;
  }
}

function puzzle2Setup() {
  if (screen === 'puzzle2') {
    puzzleSetup();
    hole.x = -100;
    portal.x = 900;
    portal.y = 380;
  }
}

function puzzle3Setup() {
  if (screen === 'puzzle3') {
    puzzleSetup();
    hole.x = -100;
    portal.x = 900;
    portal.y = 380;
  }
}

function puzzle4Setup() {
  if (screen === 'puzzle4') {
    puzzleSetup();
    hole.x = -100;
    portal.x = 900;
    portal.y = 380;
  }
}

function puzzle5Setup() {
  if (screen === 'puzzle5') {
    puzzleSetup();
    hole.x = -100;
    portal.x = 900;
    portal.y = 380;
  }
}

function puzzleSetup() {
  background = document.getElementById('puzzle');
  char.y = 0 - char.h;
  hole.h = 0;
  entrance.x = -100;
  showDialogue.x = 75;
  showDialogue.y = 400;
}

function hideAll() {
  wallL1.x = -100;
  wallL2.x = -100;
  wallC1.x = -100;
  wallC2.x = -100;
  mirror1.x1 = -100;
  platform1.x = -100;
  platform2.x = -100;
  portal.x = -100;
}

// LEVEL 1: Route de la Soie
// LEVEL 2: First Nations
// LEVEL 3: Europeans
// LEVEL 4: Industrialisation in UK
// LEVEL 5: Child Labour