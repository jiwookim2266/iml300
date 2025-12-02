let births = [];
let labels = [];
let font;
let babyCry;
let maxBirths;

function preload() {
  font = loadFont("InterTight-Medium.ttf");
  babyCry = loadSound("baby-crying-64996.mp3");
}

function setup() {
  let canvasW = windowWidth * 0.50;  
  let canvasH = windowHeight * 0.82;
  createCanvas(canvasW, canvasH);

  textFont(font);

  labels = [
    "1981","1984","1987","1990","1993",
    "1996","1999","2002","2005","2008",
    "2011","2014","2017","2020","2023"
  ];

  births = [
    88151,78667,69473,71336,66975,
    66070,67023,59879,55296,52224,
    51644,50649,38471,30135,36200
  ];

  maxBirths = max(births);

  babyCry.loop();
  babyCry.setVolume(0);
}

function draw() {
  background(255);

  let margin = 70;
  let graphW = width - margin * 2;
  let barW = graphW / births.length;

  let maxCircles = 22;
  let index = floor(map(mouseX, margin, margin + graphW, 0, births.length));
  index = constrain(index, 0, births.length - 1);

  for (let i = 0; i < births.length; i++) {
    let barX = margin + i * barW;
    let circleCount = floor(map(births[i], 0, maxBirths, 1, maxCircles));
    let r = barW * 0.42;
    let spacing = r * 1.3;
    let bottomY = height - margin - 30;

    let hovered =
      mouseX > barX &&
      mouseX < barX + barW &&
      mouseY < bottomY &&
      mouseY > bottomY - circleCount * spacing;

    for (let c = 0; c < circleCount; c++) {
      let cy = bottomY - c * spacing;
      noStroke();
      if (hovered) fill(255, 0, 0);
      else fill(map(births[i], 0, maxBirths, 40, 200));
      ellipse(barX + barW * 0.35, cy, r);
    }

    fill(hovered ? color(255, 0, 0) : 0);
    textAlign(CENTER, TOP);
    textSize(15);
    text(labels[i], barX + barW * 0.35, bottomY + 30);

    if (hovered) {
      let topCircleY = bottomY - (circleCount - 1) * spacing;
      fill(255, 0, 0);
      textSize(20);
      textStyle(BOLD);
      text(
        births[i].toLocaleString(),
        barX + barW * 0.35,
        topCircleY - (r * 2.2)
      );
      textStyle(NORMAL);
    }
  }

  let norm = map(births[index], 0, maxBirths, 0, 1);
  babyCry.setVolume(constrain(pow(norm, 2.5) * 1.4, 0, 1));
}

function windowResized() {
  let canvasW = windowWidth * 0.50;
  let canvasH = windowHeight * 0.82;
  resizeCanvas(canvasW, canvasH);
}
