let violinImg;
let stave;
let letterBoxDefault;
let letterBox;
let strings = [];
let stavePosArray = [];
let letters = [];
let letterImagesHover = {};
let letterImagesCorrect = {};
let currentFingerPosition;
let currentStavePosition;
let currentLetter;
let isEntirelyCorrect = false;
let GFingerPositions = [
  { name: "G1", y: 350, hovered: false, clicked: false },
  { name: "G2", y: 412, hovered: false, clicked: false },
  { name: "G3", y: 450, hovered: false, clicked: false },
  { name: "G4", y: 511, hovered: false, clicked: false },
];
let DFingerPositions = [
  { name: "D1", y: 350, hovered: false, clicked: false },
  { name: "D2", y: 412, hovered: false, clicked: false },
  { name: "D3", y: 450, hovered: false, clicked: false },
  { name: "D4", y: 511, hovered: false, clicked: false },
];
let AFingerPositions = [
  { name: "A1", y: 350, hovered: false, clicked: false },
  { name: "A2", y: 412, hovered: false, clicked: false },
  { name: "A3", y: 450, hovered: false, clicked: false },
  { name: "A4", y: 511, hovered: false, clicked: false },
];
let EFingerPositions = [
  { name: "E1", y: 350, hovered: false, clicked: false },
  { name: "E2", y: 412, hovered: false, clicked: false },
  { name: "E3", y: 450, hovered: false, clicked: false },
  { name: "E4", y: 511, hovered: false, clicked: false },
];

let fingerPositionNotes = {
  G1: "A",
  G2: "B",
  G3: "C",
  G4: "D",
  D1: "E",
  D2: "FSharp",
  D3: "G",
  D4: "A",
  A1: "B",
  A2: "CSharp",
  A3: "D",
  A4: "E",
  E1: "FSharp",
  E2: "GSharp",
  E3: "A",
  E4: "B",
};

function preload() {
  violinImg = loadImage("violin_cropped.png");
  stave = loadImage("stave_v2.png");
  letterBoxDefault = loadImage("letterBox_default.png");
  letterImagesHover["A"] = loadImage("lettersHover/AGrey.png");
  letterImagesHover["B"] = loadImage("lettersHover/BGrey.png");
  letterImagesHover["C"] = loadImage("lettersHover/CGrey.png");
  letterImagesHover["CSharp"] = loadImage("lettersHover/CSharpGrey.png");
  letterImagesHover["D"] = loadImage("lettersHover/DGrey.png");
  letterImagesHover["E"] = loadImage("lettersHover/EGrey.png");
  letterImagesHover["FSharp"] = loadImage("lettersHover/FSharpGrey.png");
  letterImagesHover["G"] = loadImage("lettersHover/GGrey.png");
  letterImagesHover["GSharp"] = loadImage("lettersHover/GSharpGrey.png");

  letterImagesCorrect["A"] = loadImage("LettersCorrect/AGreen.png");
  letterImagesCorrect["B"] = loadImage("LettersCorrect/BGreen.png");
  letterImagesCorrect["C"] = loadImage("LettersCorrect/CGreen.png");
  letterImagesCorrect["CSharp"] = loadImage("LettersCorrect/CSharpGreen.png");
  letterImagesCorrect["D"] = loadImage("LettersCorrect/DGreen.png");
  letterImagesCorrect["E"] = loadImage("LettersCorrect/EGreen.png");
  letterImagesCorrect["FSharp"] = loadImage("LettersCorrect/FSharpGreen.png");
  letterImagesCorrect["G"] = loadImage("LettersCorrect/GGreen.png");
  letterImagesCorrect["GSharp"] = loadImage("LettersCorrect/GSharpGreen.png");
}

function setup() {
  createCanvas(1000, 700);
  imageMode(CENTER);

  letterBox = letterBoxDefault;

  strings.push(new ViolinString("G", 217, GFingerPositions));
  strings.push(new ViolinString("D", 237, DFingerPositions));
  strings.push(new ViolinString("A", 256, AFingerPositions));
  strings.push(new ViolinString("E", 272, EFingerPositions));

  stavePosArray.push(new StavePos("G", 317));
  stavePosArray.push(new StavePos("G1", 303));
  stavePosArray.push(new StavePos("G2", 288));
  stavePosArray.push(new StavePos("G3", 275));
  stavePosArray.push(new StavePos("D", 260));
  stavePosArray.push(new StavePos("D1", 247));
  stavePosArray.push(new StavePos("D2", 233));
  stavePosArray.push(new StavePos("D3", 221));
  stavePosArray.push(new StavePos("A", 204));
  stavePosArray.push(new StavePos("A1", 193));
  stavePosArray.push(new StavePos("A2", 177));
  stavePosArray.push(new StavePos("A3", 164));
  stavePosArray.push(new StavePos("E", 148));
  stavePosArray.push(new StavePos("E1", 135));
  stavePosArray.push(new StavePos("E2", 120));
  stavePosArray.push(new StavePos("E3", 105));
  stavePosArray.push(new StavePos("E4", 92));

  letters.push(new Letter("A", 601, 645, true));
  letters.push(new Letter("B", 676, 707, true));
  letters.push(new Letter("C", 740, 779, true));
  letters.push(new Letter("CSharp", 805, 880, true));
  letters.push(new Letter("D", 570, 616, false));
  letters.push(new Letter("E", 640, 670, false));
  letters.push(new Letter("FSharp", 700, 761, false));
  letters.push(new Letter("G", 780, 820, false));
  letters.push(new Letter("GSharp", 839, 912, false));
}

function draw() {
  background(255);
  // make a border for the canvas
  stroke(0);
  strokeWeight(5);
  noFill();
  rect(2.5, 2.5, width - 5, height - 5);

  // Violin
  image(
    violinImg,
    250,
    height / 2,
    violinImg.width * 1.835,
    violinImg.height * 1.825
  );

  image(stave, 740, 190, stave.width * 0.5, stave.height * 0.5);
  image(letterBox, 740, 520, letterBox.width * 0.5, letterBox.height * 0.5);

  for (const string of strings) {
    string.checkHover(mouseX, mouseY);
    string.display();
  }

  for (const stavePos of stavePosArray) {
    stavePos.checkHover(mouseX, mouseY);
    stavePos.display();
  }

  for (const letter of letters) {
    letter.checkHover(mouseX, mouseY);
  }

  const hoveredLetter = letters.find((letter) => letter.hovered);
  const clickedLetter = letters.find((letter) => letter.clicked);

  // due to the way the hovers are implemented with pngs, i would need a million
  // more combinations to make it work when one is click and another is hovered.
  // i donnt have time for that. sorry.
  if (clickedLetter && clickedLetter.isCorrect) {
    letterBox = letterImagesCorrect[clickedLetter.name];
  } else if (clickedLetter) {
    letterBox = letterImagesHover[clickedLetter.name];
  } else if (hoveredLetter) {
    letterBox = letterImagesHover[hoveredLetter.name];
  } else {
    letterBox = letterBoxDefault;
  }

  noStroke();
  fill(0);
  text(mouseX + " " + mouseY, mouseX, mouseY);
}

function mousePressed() {
  // only if mouse is on left side of screen check strings (to prevent unclicking when interacting with stave/notes)
  if (mouseX < 550) {
    for (const string of strings) {
      string.onClick();
    }
    // potentially move some of this logic into stavePos
    // only the .onClick needs to be in the ifs liam thinks
  } else if (mouseX >= 550 && mouseY <= 356) {
    for (const stavePos of stavePosArray) {
      stavePos.onClick();
    }
    // mouse is on the letter box
  } else if (mouseX >= 550 && mouseY > 356) {
    for (const letter of letters) {
      letter.onClick();
    }
  }

  const clickedString = strings.find((string) => string.getClickedFinger());
  let currentFingerPosition;
  if (clickedString) {
    currentFingerPosition = clickedString.getClickedFinger();
  }

  for (const stavePos of stavePosArray) {
    stavePos.isCorrect = stavePos.fingerName === currentFingerPosition;
  }

  for (const letter of letters) {
    letter.isCorrect =
      currentFingerPosition &&
      fingerPositionNotes[currentFingerPosition] === letter.name;
  }
}
