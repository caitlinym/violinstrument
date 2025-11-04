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
let sustainMode = false;
let sustainButton;
let singButton;
let recordButton;
let recordOn = false;
let recordedNotes = [];
let playButton;

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
  controlsText = loadImage("controls.png");
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
  createCanvas(1150, 700);
  imageMode(CENTER);

  let sampler = new Tone.Sampler({
    A4: "sounds/D4.m4a",
  });

  // let voiceSampler = new Tone.Sampler({
  //   A4: "sounds/Voice_D4.m4a",
  // });

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
  stavePosArray.push(new StavePos(["G4", "D"], 260)); // Can be G4 or open D
  stavePosArray.push(new StavePos("D1", 247));
  stavePosArray.push(new StavePos("D2", 233));
  stavePosArray.push(new StavePos("D3", 221));
  stavePosArray.push(new StavePos(["D4", "A"], 204)); // Can be D4 or open A
  stavePosArray.push(new StavePos("A1", 193));
  stavePosArray.push(new StavePos("A2", 177));
  stavePosArray.push(new StavePos("A3", 164));
  stavePosArray.push(new StavePos(["A4", "E"], 148)); // Can be A4 or open E
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

  sustainButton = createButton("sustain mode");
  sustainButton.position(1010, 125);
  sustainButton.addClass("button");
  sustainButton.mousePressed(sustainModeToggle);

  singButton = createButton("sing mode");
  singButton.position(1010, 185);
  singButton.addClass("button");

  // Create styled sustain button
  // Record button with icon
  recordButton = createButton("");
  recordButton.position(1010, 245);
  recordButton.addClass("button");
  recordButton.addClass("icon-button");
  recordButton.addClass("record-button");
  recordButton.mousePressed(handleRecord);

  // Play button with icon
  playButton = createButton("");
  playButton.position(1010, 305);
  playButton.addClass("button");
  playButton.addClass("icon-button");
  playButton.addClass("play-button");
  playButton.mousePressed(handlePlay);
}

function draw() {
  background(255);
  // make a border for the canvas
  stroke(0);
  strokeWeight(5);
  noFill();
  rect(2.5, 2.5, width - 5, height - 5);

  // Controls panel separator line
  stroke(0);
  strokeWeight(3);
  line(1000, 2.5, 1000, height - 2.5);

  // Controls panel heading
  noStroke();
  fill(0);
  textSize(18);
  textAlign(CENTER, CENTER);
  textFont("Arial");
  image(
    controlsText,
    1075,
    72,
    controlsText.width * 0.5,
    controlsText.height * 0.5
  );

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

  // Clear any pending reset when clicking a new note
  if (resetTimeout) {
    clearTimeout(resetTimeout);
    resetTimeout = null;
  }

  // Handle clicks on different regions
  if (mouseX < 550) {
    // Left side: violin strings
    handleStringClick();
  } else if (mouseX >= 550 && mouseY <= 356) {
    // Stave area
    handleStaveClick();
  } else if (mouseX >= 550 && mouseY > 356) {
    // Letter box area
    handleLetterClick();
  }

  // Get the currently clicked finger position
  const clickedString = strings.find((string) => string.getClickedFinger());
  const newFingerPosition = clickedString
    ? clickedString.getClickedFinger()
    : null;

  // Only update currentFingerPosition if we clicked a string
  if (newFingerPosition) {
    currentFingerPosition = newFingerPosition;
  }

  // Handle unlocked finger positions
  if (currentFingerPosition?.isUnlocked && newFingerPosition) {
    displayUnlockedNote(currentFingerPosition);
    return;
  }

  // Handle learning mode - check whenever any of the three are set
  if (currentFingerPosition && !currentFingerPosition.isUnlocked) {
    handleLearningMode();
  }
}

function handleStringClick() {
  let clickedFinger = null;
  for (const string of strings) {
    string.onClick();
    const finger = string.getClickedFinger();
    if (finger) clickedFinger = finger;
    // recording logic
    if (recordOn && finger && finger.isUnlocked) {
      recordedNotes.push(finger);
    }
  }

  // Reset stave and letters if:
  // 1. We clicked a different finger position, OR
  // 2. We clicked on a string but no finger (unclicked)
  // BUT don't reset if clicking the same unlocked finger twice
  if (clickedFinger !== currentFingerPosition || !clickedFinger) {
    // Exception: if both are the same unlocked finger, don't reset
    if (
      !(clickedFinger === currentFingerPosition && clickedFinger?.isUnlocked)
    ) {
      stavePosArray.forEach((sp) => sp.reset());
      letters.forEach((letter) => letter.reset());
    }
  }
}

function handleStaveClick() {
  for (const stavePos of stavePosArray) {
    stavePos.onClick();
    if (stavePos.clicked) currentStavePosition = stavePos;
  }
}

function handleLetterClick() {
  for (const letter of letters) {
    letter.onClick();
    if (letter.clicked) currentLetter = letter;
  }
}

function displayUnlockedNote(fingerPosition) {
  // Reset all stave and letter selections
  stavePosArray.forEach((sp) => sp.reset());
  letters.forEach((l) => l.reset());

  // Set correct stave position
  stavePosArray.forEach((sp) => sp.setCorrectFor(fingerPosition.name));

  // Set correct letter
  const noteName = fingerPositionNotes[fingerPosition.name];
  letters.forEach((l) => l.setCorrectFor(noteName));
}

function handleLearningMode() {
  // Don't clear selections - just update correctness
  const noteName = fingerPositionNotes[currentFingerPosition.name];
  stavePosArray.forEach((sp) =>
    sp.checkCorrectness(currentFingerPosition.name)
  );
  letters.forEach((l) => l.checkCorrectness(noteName));

  // Check if all three match correctly
  if (checkIfAllCorrect()) {
    currentFingerPosition.unlock();
    scheduleReset();
  } else {
    currentFingerPosition.isCorrect = false;
  }
}

function checkIfAllCorrect() {
  return (
    currentStavePosition?.isCorrect &&
    currentLetter?.isCorrect &&
    currentFingerPosition &&
    currentStavePosition.matchesFingerName(currentFingerPosition.name) &&
    fingerPositionNotes[currentFingerPosition.name] === currentLetter.name
  );
}

function scheduleReset() {
  resetTimeout = setTimeout(() => {
    currentFingerPosition.clicked = false;
    stavePosArray.forEach((sp) => sp.reset());
    letters.forEach((l) => l.reset());
    resetTimeout = null;
  }, 1300); // 1300ms delay so user can see the green correct state ( this was a random time that looked good)
}

function sustainModeToggle() {
  sustainMode = !sustainMode;
  sustainButton.toggleClass("active", sustainMode);
}

function mouseReleased() {
  // Stop sound for all finger positions when mouse is released
  if (!sustainMode) {
    for (const string of strings) {
      string.onRelease();
    }
  }
}

function handleRecord() {
  recordOn = !recordOn;
  if (recordOn) {
    recordedNotes = []; // Clear previous recordings
    // Switch to stop button
    recordButton.removeClass("record-button");
    recordButton.addClass("stop-button");
  } else {
    // Switch back to record button
    recordButton.removeClass("stop-button");
    recordButton.addClass("record-button");
  }
}

function handlePlay() {
  if (recordedNotes.length === 0) return;
  playButton.addClass("playing");
  playButton.attribute("disabled", "");
  let index = 0;

  const playNextNote = () => {
    if (index < recordedNotes.length) {
      const note = recordedNotes[index];
      displayUnlockedNote(note);
      note.playSound();
      setTimeout(() => {
        note.stopSound();
        index++;
        playNextNote();
      }, 600); // Play each note for 600ms
    } else {
      playButton.removeClass("playing");
      playButton.removeAttribute("disabled");
    }
  };
  playNextNote();

  console.log("Playback complete");
}
