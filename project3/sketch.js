let years = [
  2010, 2015, 2020, 2025, 2030, 2035, 2040,
  2045, 2050, 2055, 2060, 2065, 2070
];

let population = [
  24672998, 25429053, 25910542, 25846661, 25678440,
  25459331, 25104567, 24657912, 24173923, 22519827,
  20637676, 18766724, 18013264
];

let circles = [];
let maxPop, minPop;
let boundaryR;
let bgSound;
let interFont;

function preload() {
  bgSound = loadSound("street_sounds-seoul_2-16621-[AudioTrimmer.com].mp3");
  interFont = loadFont("InterTight-Medium.ttf");
}

function setup() {
  pixelDensity(1);
  createCanvas(windowWidth, windowHeight);
  textFont(interFont);
  textAlign(CENTER, CENTER);

  maxPop = max(population);
  minPop = min(population);

  boundaryR = min(width, height) * 0.35;

  bgSound.loop();
  bgSound.setVolume(0.5);

  for (let i = 0; i < years.length; i++) {
    const r = map(population[i], minPop, maxPop, 15, 50);

    let brightness = 255 - map(population[i], minPop, maxPop, 10, 220);
    brightness = min(brightness + 20, 255);

    const ang = random(TWO_PI);
    const distFromCenter = random(boundaryR - r);
    const x = width / 2 + cos(ang) * distFromCenter;
    const y = height / 2 + sin(ang) * distFromCenter;

    const velMag = 1.5;
    let vx = random(-velMag, velMag);
    let vy = random(-velMag, velMag);

    circles.push({
      year: years[i],
      pop: population[i],
      r,
      col: brightness,
      x,
      y,
      vx,
      vy,
      flashTimer: 0
    });
  }
}

function draw() {
  background(255);

  fill(0);
  noStroke();
  ellipse(width / 2, height / 2, boundaryR * 2);

  for (let c of circles) {
    c.x += c.vx;
    c.y += c.vy;

    const d = dist(c.x, c.y, width / 2, height / 2);
    if (d + c.r > boundaryR) {
      const normalAng = atan2(c.y - height / 2, c.x - width / 2);
      const overlap = d + c.r - boundaryR;

      c.x -= cos(normalAng) * overlap;
      c.y -= sin(normalAng) * overlap;

      const nx = cos(normalAng);
      const ny = sin(normalAng);
      const dotProd = c.vx * nx + c.vy * ny;
      c.vx -= 2 * dotProd * nx;
      c.vy -= 2 * dotProd * ny;

      c.vx += random(-0.6, 0.6);
      c.vy += random(-0.6, 0.6);

      const targetMag = 1.5;
      const velMag = max(0.0001, sqrt(c.vx * c.vx + c.vy * c.vy));
      c.vx = (c.vx / velMag) * targetMag;
      c.vy = (c.vy / velMag) * targetMag;

      c.flashTimer = 60;
      const vol = map(c.pop, minPop, maxPop, 0.1, 1);
      bgSound.setVolume(vol);
    }

    noStroke();
    if (c.flashTimer > 0) {
      fill(255, 0, 0);
      c.flashTimer--;
    } else {
      fill(c.col);
    }
    ellipse(c.x, c.y, c.r * 2);

    fill(0);
    textSize(constrain(c.r * 0.45, 12, 20));
    text(c.year, c.x, c.y);
  }
}

function drawBigTitle(txt) {
  const titleSize = max(20, min(width, height) * 0.045);
  textAlign(CENTER, BOTTOM);
  textStyle(BOLD);
  fill(0);
  textSize(titleSize);
  text(txt, width / 2, height - 60);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  boundaryR = min(width, height) * 0.35;
}
