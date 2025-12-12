// I made this tool to make drawing rice way less tedious—something I've always found super time-consuming when drawing digitally. You can place bowls with a click and then "paint" rice grains by pressing the spacebar and holding down the mouse, with each grain slightly varying in size and shade to look more natural. I love rice, so creating a simple way to make it digitally felt kind of fun and satisfying. The spacebar toggles between placing bowls and scattering rice, making it easy to experiment and fill a scene quickly.

let riceMode = false; // toggles between bowl + rice

function setup() {
  createCanvas(windowWidth, windowHeight);
  drawTable();
}

function draw() {
  if (mouseIsPressed && riceMode) {
    // draw rice grains
    let r = random(8, 14); // slightly bigger grains
    let c = random(220, 255); // white to light gray
    noStroke();
    fill(c);
    ellipse(mouseX + random(-3, 3), mouseY + random(-3, 3), r, r / 2);
  }
}

function mousePressed() {
  if (!riceMode) {
    drawBowl(mouseX, mouseY);
  }
}

function keyPressed() {
  if (key === " ") {
    riceMode = !riceMode; // toggle mode
  }
}

function drawTable() {
  background(150); // grey wall
  fill(220, 200, 170); // beige table
  noStroke();
  rect(0, height * 0.7, width, height * 0.3);
}

function drawBowl(x, y) {
  noStroke();
  fill(216, 157, 88); // beige
  rectMode(CENTER);
  rect(x, y + 100, 50, 20); // pulled farther down

  // bowl body (bigger half circle)
  arc(x, y, 200, 200, 0, PI, CHORD);
}