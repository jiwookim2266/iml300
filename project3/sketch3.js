let data = [
  { year: 1965, value: 0.28 }, { year: 1975, value: 0.39 },
  { year: 1985, value: 0.53 }, { year: 1995, value: 0.85 },
  { year: 2005, value: 1.54 }, { year: 2015, value: 3.9 },
  { year: 2025, value: 4.79 }, { year: 2035, value: 7.15 },
  { year: 2045, value: 13.65 }, { year: 2055, value: 18.29 },
  { year: 2065, value: 21.34 }, { year: 2075, value: 21.65 }
];

let circles = [];
let lines = [];
let startTime = 0;
let font;

function preload() {
  font = loadFont("InterTight-Medium.ttf");
}

function setup() {
  pixelDensity(displayDensity());
  createCanvas(windowWidth, windowHeight);
  smooth();
  textFont(font);

  startTime = millis();

  let cx = width * 0.5;
  let cy = height * 0.5 + 120;

  let maxVal = max(data.map(d => d.value));
  let maxLine = min(width, height) * 0.50 + 20;
  let maxCircle = 140;

  for (let i = 0; i < data.length; i++) {
    let ang = map(i, 0, data.length - 1, 0, TWO_PI * 0.75);
    let len = map(data[i].value, 0, maxVal, 120, maxLine);

    lines.push({
      angle: ang,
      len: len,
      currentLen: 0
    });

    let d = map(data[i].value, 0, maxVal, 45, maxCircle);
    let speedScale = map(pow(maxCircle - d, 1.5),
                         0, pow(maxCircle - 45, 1.5),
                         2.5, 0.8) * 1.2;

    let c = new CircleViz(cx, cy, d, speedScale);
    c.data = data[i];
    circles.push(c);
  }
}

function draw() {
  background(255);

  let cx = width * 0.5;
  let cy = height * 0.5 + 120;
  let elapsed = (millis() - startTime) / 1000;

  stroke(0);
  strokeWeight(1.4);

  for (let i = 0; i < lines.length; i++) {
    let L = lines[i];
    let speedFactor = map(circles[i].d, 45, 140, 1.5, 3);

    if (L.currentLen < L.len) L.currentLen += speedFactor;

    let x = cx + cos(L.angle) * L.currentLen;
    let y = cy + sin(L.angle) * L.currentLen;

    line(cx, cy, x, y);

    circles[i].x = x;
    circles[i].y = y;
  }

  for (let c of circles) {
    c.update();
    let hovered = dist(mouseX, mouseY, c.x, c.y) < c.d * 0.5;
    c.display(elapsed, hovered);
  }

  if (elapsed > 3) drawLabels();
}

function drawLabels() {
  textAlign(CENTER, CENTER);
  noStroke();

  for (let c of circles) {
    let hovered = dist(mouseX, mouseY, c.x, c.y) < c.d * 0.5;
    fill(hovered ? 255 : 0);

    textSize(c.d * 0.23);
    text(c.data.year, c.x, c.y - c.d * 0.09);

    textSize(c.d * 0.15);
    text(c.data.value.toFixed(2) + "%", c.x, c.y + c.d * 0.13);
  }
}

class CircleViz {
  constructor(ox, oy, d, speedScale) {
    this.x = ox;
    this.y = oy;
    this.d = d;
    this.r = d / 2;
    this.speedScale = speedScale;

    this.pg = createGraphics(d * 2, d * 2);
    this.pg.pixelDensity(displayDensity());
    this.pg.drawingContext.imageSmoothingEnabled = true;
    this.pg.clear();

    this.pgCX = this.pg.width / 2;
    this.pgCY = this.pg.height / 2;
    this.pgR = this.pgCX - 2;

    this.mask = createGraphics(d * 2, d * 2);
    this.mask.pixelDensity(displayDensity());
    this.mask.clear();
    this.mask.noStroke();
    this.mask.fill(255);
    this.mask.ellipse(this.pgCX, this.pgCY, this.pgR * 2);

    this.veins = [];
    this.maxVeins = 1800;

    let initialCount = floor(map(d, 45, 140, 8, 2));
    for (let i = 0; i < initialCount; i++) {
      this.veins.push(new Vein(this.pgCX, this.pgCY, this, this.speedScale));
    }
  }

  update() {
    for (let i = this.veins.length - 1; i >= 0; i--) {

      let v = this.veins[i];
      let newBranches = v.update();

      if (newBranches) {
        for (let b of newBranches) {
          if (this.veins.length < this.maxVeins) {
            this.veins.push(b);
          }
        }
      }

      if (v.dead) this.veins.splice(i, 1);
    }
  }

  display(elapsed, hovered) {
    if (elapsed > 6) {
      let p = constrain(map(elapsed, 6, 12, 0, 1), 0, 1);
      this.pg.noStroke();
      this.pg.fill(hovered ? color(255, 0, 0, 255 * p) : color(0, 255 * p));
      this.pg.ellipse(this.pgCX, this.pgCY, this.pgR * 2);
    }

    let masked = this.pg.get();
    masked.mask(this.mask);

    imageMode(CENTER);
    image(masked, this.x, this.y, this.d, this.d);
  }
}

class Vein {
  constructor(x, y, parent, speed) {
    this.x = x;
    this.y = y;
    this.px = x;
    this.py = y;
    this.parent = parent;
    this.speed = speed;

    this.dead = false;
    this.steps = 0;
    this.maxSteps = 900;

    this.angle = random(TWO_PI);
    this.noiseOffset = random(9999);
    this.turnFactor = random(0.55, 0.88);
  }

  update() {
    if (this.dead) return null;

    this.px = this.x;
    this.py = this.y;

    let n = noise(this.noiseOffset);
    this.angle += map(n, 0, 1, -0.35, 0.35) * this.turnFactor;
    this.noiseOffset += 0.012;

    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;

    let dx = this.x - this.parent.pgCX;
    let dy = this.y - this.parent.pgCY;

    if (dx * dx + dy * dy > this.parent.pgR * this.parent.pgR) {
      this.dead = true;
      return null;
    }

    let pg = this.parent.pg;
    pg.stroke(0, 200);
    pg.strokeWeight(random(0.8, 1.7));
    pg.line(this.px, this.py, this.x, this.y);

    this.steps++;

    if (this.steps > 4 && random(1) < 0.12) {
      let child = new Vein(this.x, this.y, this.parent, this.speed * random(0.9, 1.1));
      child.angle = this.angle + random(-0.35, 0.35);
      return [child];
    }

    if (this.steps > this.maxSteps) this.dead = true;

    return null;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
