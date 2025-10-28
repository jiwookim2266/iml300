let circles = [];
let numCircles = 40;
let elderlyRatio = 0.3;
let bufferGap = 25;
let spawnInterval = 60;
let lastSpawn = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  frameRate(60);
}

function draw() {
  background(255);

  // Add circles slowly
  if (frameCount - lastSpawn > spawnInterval && circles.length < numCircles) {
    let isElderly = random() < elderlyRatio;
    let r = isElderly ? random(25, 55) : random(40, 90);
    let col = isElderly ? color(185, 215, 235) : color(225);
    circles.push(new Circle(random(width), random(height), r, isElderly, col));
    lastSpawn = frameCount;
  }

  // Elderly: steer and separate gently
  for (let c of circles) {
    if (c.isElderly) {
      c.avoid(circles);
      c.resolveOverlap(circles);
    }
  }

  // Move & draw
  for (let c of circles) {
    c.update();
    c.edges();
    c.display();
  }
}

class Circle {
  constructor(x, y, r, isElderly, col) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(0.2);
    this.acc = createVector(0, 0);
    this.r = r;
    this.isElderly = isElderly;
    this.col = col;
    this.alpha = 0;
  }

  applyForce(f) {
    this.acc.add(f);
  }

  avoid(others) {
    // steer gently away from nearby circles
    let steer = createVector(0, 0);
    let count = 0;

    for (let other of others) {
      if (other === this) continue;
      let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
      let minDist = this.r + other.r + bufferGap;

      if (d < minDist * 1.3) { // start steering before touching
        let diff = p5.Vector.sub(this.pos, other.pos);
        diff.normalize();
        diff.mult(map(d, 0, minDist * 1.3, 0.3, 0.02, true));
        steer.add(diff);
        count++;
      }
    }

    if (count > 0) {
      steer.div(count);
      steer.limit(0.05); // soft and slow
      this.applyForce(steer);
    }
  }

  resolveOverlap(others) {
    // physically separate if too close (ensures no overlap)
    for (let other of others) {
      if (other === this) continue;
      let dir = p5.Vector.sub(this.pos, other.pos);
      let d = dir.mag();
      let minDist = this.r + other.r + 2; // tiny buffer

      if (d < minDist && d > 0) {
        dir.normalize();
        let overlap = minDist - d;
        this.pos.add(dir.mult(overlap * 0.5)); // shift away softly
      }
    }
  }

  update() {
    let drift = p5.Vector.random2D().mult(this.isElderly ? 0.0015 : 0.004);
    this.applyForce(drift);

    this.vel.add(this.acc);
    let maxSpeed = this.isElderly ? 0.25 : 0.5;
    this.vel.limit(maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);

    this.alpha = min(255, this.alpha + 1.5);
  }

  edges() {
    if (this.pos.x < this.r || this.pos.x > width - this.r) this.vel.x *= -1;
    if (this.pos.y < this.r || this.pos.y > height - this.r) this.vel.y *= -1;
  }

  display() {
    fill(red(this.col), green(this.col), blue(this.col), this.alpha);
    circle(this.pos.x, this.pos.y, this.r * 2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
