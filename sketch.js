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
let GFingerPositions;
let DFingerPositions;
let AFingerPositions;
let EFingerPositions;
let resetTimeout;

let fingerPositionNotes = {
  G: "G",
  G1: "A",
  G2: "B",
  G3: "C",
  G4: "D",
  D: "D",
  D1: "E",
  D2: "FSharp",
  D3: "G",
  D4: "A",
  A: "A",
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

  let sampler = new Tone.Sampler({
    A4: "sounds/D4.m4a",
  });

  sampler.envelope = {
    attack: 0.2,
    decay: 0.5,
    sustain: 0.5,
    release: 0.1,
  };
  sampler.toMaster();

  var vibrato = new Tone.Vibrato({
    maxDelay: 0.005,
    frequency: 5,
    depth: 0.1,
  }).toMaster();

  sampler.connect(vibrato);

  letterBox = letterBoxDefault;

  GFingerPositions = [
    new FingerPosition("G", 255, sampler),
    new FingerPosition("G1", 350, sampler),
    new FingerPosition("G2", 412, sampler),
    new FingerPosition("G3", 450, sampler),
    new FingerPosition("G4", 511, sampler),
  ];

  DFingerPositions = [
    new FingerPosition("D", 255, sampler),
    new FingerPosition("D1", 350, sampler),
    new FingerPosition("D2", 412, sampler),
    new FingerPosition("D3", 450, sampler),
    new FingerPosition("D4", 511, sampler),
  ];

  AFingerPositions = [
    new FingerPosition("A", 255, sampler),
    new FingerPosition("A1", 350, sampler),
    new FingerPosition("A2", 412, sampler),
    new FingerPosition("A3", 450, sampler),
    new FingerPosition("A4", 511, sampler),
  ];

  EFingerPositions = [
    new FingerPosition("E", 255, sampler),
    new FingerPosition("E1", 350, sampler),
    new FingerPosition("E2", 412, sampler),
    new FingerPosition("E3", 450, sampler),
    new FingerPosition("E4", 511, sampler),
  ];

  strings.push(new ViolinString("G", 217, GFingerPositions));
  strings.push(new ViolinString("D", 237, DFingerPositions));
  strings.push(new ViolinString("A", 256, AFingerPositions));
  strings.push(new ViolinString("E", 272, EFingerPositions));

  stavePosArray.push(new StavePos("G", 317));
  stavePosArray.push(new StavePos("G1", 303));
  stavePosArray.push(new StavePos("G2", 288));
  stavePosArray.push(new StavePos("G3", 275));
  stavePosArray.push(new StavePos("G4", 260));
  stavePosArray.push(new StavePos("D1", 247));
  stavePosArray.push(new StavePos("D2", 233));
  stavePosArray.push(new StavePos("D3", 221));
  stavePosArray.push(new StavePos("D4", 204));
  stavePosArray.push(new StavePos("A1", 193));
  stavePosArray.push(new StavePos("A2", 177));
  stavePosArray.push(new StavePos("A3", 164));
  stavePosArray.push(new StavePos("A4", 148));
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
  // i don't have time for that. sorry.
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
  if (Tone.context.state !== "running") {
    Tone.context.resume();
  }

  if (resetTimeout) {
    clearTimeout(resetTimeout);
    resetTimeout = null;
  }

  // only if mouse is on left side of screen check strings (to prevent unclicking when interacting with stave/notes)
  if (mouseX < 550) {
    currentFingerPosition = null;
    for (const string of strings) {
      string.onClick();
    }
    // if mouse is on the stave
  } else if (mouseX >= 550 && mouseY <= 356) {
    currentStavePosition = null;
    for (const stavePos of stavePosArray) {
      stavePos.onClick();
      if (stavePos.clicked) currentStavePosition = stavePos;
    }
    // mouse is on the letter box
  } else if (mouseX >= 550 && mouseY > 356) {
    currentLetter = null;
    for (const letter of letters) {
      letter.onClick();
      if (letter.clicked) currentLetter = letter;
    }
  }

  const clickedString = strings.find((string) => string.getClickedFinger());
  if (clickedString) {
    currentFingerPosition = clickedString.getClickedFinger();
  }

  // When clicking an unlocked finger position, display associated note and letter
  if (currentFingerPosition?.isUnlocked) {
    console.log("displaying unlocked note for:", currentFingerPosition.name);

    // Clear all previous stave and letter selections
    stavePosArray.forEach((sp) => {
      sp.clicked = false;
      sp.isCorrect = false;
    });
    letters.forEach((l) => {
      l.clicked = false;
      l.isCorrect = false;
    });

    // Find and display the matching stave position
    const matchingStavePos = stavePosArray.find(
      (sp) => sp.fingerName === currentFingerPosition.name
    );
    if (matchingStavePos) {
      matchingStavePos.clicked = true;
      matchingStavePos.isCorrect = true;
    }

    // Find and display the matching letter
    const noteName = fingerPositionNotes[currentFingerPosition.name];
    const matchingLetter = letters.find((l) => l.name === noteName);
    if (matchingLetter) {
      matchingLetter.clicked = true;
      matchingLetter.isCorrect = true;
    }

    return; // Exit early so we don't run the learning mode logic below
  }

  // Learning mode: check correctness when clicking non-unlocked positions
  for (const stavePos of stavePosArray) {
    stavePos.isCorrect = stavePos.fingerName === currentFingerPosition?.name;
  }

  for (const letter of letters) {
    letter.isCorrect =
      currentFingerPosition &&
      fingerPositionNotes[currentFingerPosition.name] === letter.name;
  }

  // check that all three match - then the finger position is ultimately correct
  if (
    currentStavePosition?.isCorrect &&
    currentLetter?.isCorrect &&
    currentFingerPosition &&
    currentStavePosition.fingerName === currentFingerPosition.name &&
    fingerPositionNotes[currentFingerPosition.name] === currentLetter.name
  ) {
    currentFingerPosition.isCorrect = true;
    currentFingerPosition.isUnlocked = true;
  } else if (currentFingerPosition && !currentFingerPosition.isUnlocked) {
    currentFingerPosition.isCorrect = false;
  }

  // unlock if you click anywhere after currentFingerPosition is correct
  // Add a small delay so user can see the correct state
  if (
    currentFingerPosition?.isCorrect &&
    currentStavePosition?.isCorrect &&
    currentLetter?.isCorrect
  ) {
    resetTimeout = setTimeout(() => {
      currentFingerPosition.clicked = false;
      stavePosArray.forEach((sp) => {
        sp.clicked = false;
        sp.isCorrect = false;
      });
      letters.forEach((l) => {
        l.clicked = false;
        l.isCorrect = false;
      });
      resetTimeout = null;
    }, 1600); // 800ms delay so user can see the green correct state
  }
}
