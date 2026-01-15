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
let singMode = false;

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
  E: "E",
  E1: "FSharp",
  E2: "GSharp",
  E3: "A",
  E4: "B",
};

function preload() {
  violinImg = loadImage("violin_cropped.png");
  stave = loadImage("stave_v2.png");
  controlsText = loadImage("Controls.png");
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

  letterImagesCorrect["A"] = loadImage("lettersCorrect/AGreen.png");
  letterImagesCorrect["B"] = loadImage("lettersCorrect/BGreen.png");
  letterImagesCorrect["C"] = loadImage("lettersCorrect/CGreen.png");
  letterImagesCorrect["CSharp"] = loadImage("lettersCorrect/CSharpGreen.png");
  letterImagesCorrect["D"] = loadImage("lettersCorrect/DGreen.png");
  letterImagesCorrect["E"] = loadImage("lettersCorrect/EGreen.png");
  letterImagesCorrect["FSharp"] = loadImage("lettersCorrect/FSharpGreen.png");
  letterImagesCorrect["G"] = loadImage("lettersCorrect/GGreen.png");
  letterImagesCorrect["GSharp"] = loadImage("lettersCorrect/GSharpGreen.png");
}

function setup() {
  createCanvas(1200, 700);
  imageMode(CENTER);

  // just the A4 was left as it sounded better when the sampler repitched the open A
  let sampler = new Tone.Sampler({
    // G3: "sounds/G.m4a",
    // A3: "sounds/G1.m4a",
    // B3: "sounds/G2.m4a",
    // C4: "sounds/G3.m4a",
    // D4: "sounds/D.m4a",
    // E4: "sounds/D2.m4a",
    // "F#4": "sounds/D3.m4a",
    // G4: "sounds/D3.m4a",
    A4: "sounds/D4.m4a",
    // B4: "sounds/A1.m4a",
    // C5: "sounds/A2.m4a",
    // D5: "sounds/A3.m4a",
    // E5: "sounds/E.m4a",
    // "F#5": "sounds/E1.m4a",
    // "G#5": "sounds/E2.m4a",
    // A5: "sounds/E3.m4a",
    // B5: "sounds/E4.m4a",
  });

  let voiceSampler = new Tone.Sampler({
    G3: "voice/Voice_G3.m4a",
    A3: "voice/Voice_A3.m4a",
    B3: "voice/Voice_B3.m4a",
    C4: "voice/Voice_C.m4a",
    D4: "voice/Voice_D.m4a",
    E4: "voice/Voice_E.m4a",
    "F#4": "voice/Voice_FSharp.m4a",
    G4: "voice/Voice_G.m4a",
    A4: "voice/Voice_A.m4a",
    B4: "voice/Voice_B.m4a",
    "C#5": "voice/Voice_CSharp.m4a",
    D5: "voice/Voice_D.m4a",
    E5: "voice/Voice_E.m4a",
    "F#5": "voice/Voice_FSharp.m4a",
    "G#5": "voice/Voice_GSharp.m4a",
    A5: "voice/Voice_A.m4a",
    B5: "voice/Voice_B.m4a",
  });
  voiceSampler.toMaster();

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
    new FingerPosition("G", 255, sampler, voiceSampler),
    new FingerPosition("G1", 350, sampler, voiceSampler),
    new FingerPosition("G2", 412, sampler, voiceSampler),
    new FingerPosition("G3", 450, sampler, voiceSampler),
    new FingerPosition("G4", 511, sampler, voiceSampler),
  ];

  DFingerPositions = [
    new FingerPosition("D", 255, sampler, voiceSampler),
    new FingerPosition("D1", 350, sampler, voiceSampler),
    new FingerPosition("D2", 412, sampler, voiceSampler),
    new FingerPosition("D3", 450, sampler, voiceSampler),
    new FingerPosition("D4", 511, sampler, voiceSampler),
  ];

  AFingerPositions = [
    new FingerPosition("A", 255, sampler, voiceSampler),
    new FingerPosition("A1", 350, sampler, voiceSampler),
    new FingerPosition("A2", 412, sampler, voiceSampler),
    new FingerPosition("A3", 450, sampler, voiceSampler),
    new FingerPosition("A4", 511, sampler, voiceSampler),
  ];

  EFingerPositions = [
    new FingerPosition("E", 255, sampler, voiceSampler),
    new FingerPosition("E1", 350, sampler, voiceSampler),
    new FingerPosition("E2", 412, sampler, voiceSampler),
    new FingerPosition("E3", 450, sampler, voiceSampler),
    new FingerPosition("E4", 511, sampler, voiceSampler),
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
  sustainButton.position(1033, 120);
  sustainButton.addClass("button");
  sustainButton.mousePressed(sustainModeToggle);

  singButton = createButton("sing mode");
  singButton.position(1033, 200);
  singButton.addClass("button");
  singButton.mousePressed(handleSingToggle);

  // Create styled sustain button
  // Record button with icon
  recordButton = createButton("");
  recordButton.position(1040, 290);
  recordButton.addClass("button");
  recordButton.addClass("icon-button");
  recordButton.addClass("record-button");
  recordButton.mousePressed(handleRecord);

  // Play button with icon
  playButton = createButton("");
  playButton.position(1105, 290);
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
    1095,
    72,
    controlsText.width * 0.7,
    controlsText.height * 0.7
  );

  // Violin
  image(
    violinImg,
    250,
    height / 2,
    violinImg.width * 1.835,
    violinImg.height * 1.825
  );

  if (currentFingerPosition == null) {
    // Instruction box
    stroke(0);
    strokeWeight(3);
    fill(color(125, 236, 240));
    rect(30, 30, 150, 90, 8); // Added rounded corners (8px radius)

    // Draw text
    noStroke();
    fill(0);
    textSize(16);
    textAlign(CENTER, TOP);
    textFont("Arial");
    text("Select a finger position on the violin to begin", 32, 45, 140);
  }

  image(stave, 740, 190, stave.width * 0.5, stave.height * 0.5);

  // Draw glowing yellow border if stavePos not selected
  if (currentFingerPosition && !currentStavePosition) {
    stroke(255, 215, 0, 150); // Yellow with some transparency
    strokeWeight(6);
    noFill();
    rect(550, 38, 380, 302, 5); // Box around stave area
  }

  image(letterBox, 740, 520, letterBox.width * 0.5, letterBox.height * 0.5);
  if (currentFingerPosition && !currentLetter) {
    stroke(255, 215, 0, 150); // Yellow with some transparency
    strokeWeight(6);
    noFill();
    rect(550, 369, 380, 302, 5); // Box around letter area
  }

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

  // for debugging
  // noStroke();
  // fill(0);
  // text(mouseX + " " + mouseY, mouseX, mouseY);
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

  // Ignore clicks in the controls panel (right side of screen) - this is because p5 handles buttons separately i've discovered
  if (mouseX >= 1000) {
    return;
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
    scheduleReset();
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
    string.onClick(singMode);
    const finger = string.getClickedFinger();
    if (finger) clickedFinger = finger;
    // recording logic
    if (recordOn && finger && finger.isUnlocked) {
      recordedNotes.push(finger);
    }
  }

  // If we clicked a different finger than before, clear the current stave and letter
  if (clickedFinger && clickedFinger !== currentFingerPosition) {
    currentStavePosition = null;
    currentLetter = null;
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

      // Clear current selections (removes yellow border highlights)
      currentStavePosition = null;
      currentLetter = null;

      // If no finger is selected, also clear currentFingerPosition
      // This hides yellow borders and shows the instruction box again
      if (!clickedFinger) {
        currentFingerPosition = null;
      }
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

  // Clear current selections
  currentStavePosition = null;
  currentLetter = null;

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
    currentFingerPosition.unlock(singMode);
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
    currentStavePosition = null;
    currentLetter = null;
    resetTimeout = null;
  }, 5000); // delay so user can see the green correct state ( this was a random time that looked good)
}

function sustainModeToggle() {
  sustainMode = !sustainMode;
  sustainButton.toggleClass("active", sustainMode);
}

function mouseReleased() {
  // Stop sound for all finger positions when mouse is released
  if (!sustainMode) {
    for (const string of strings) {
      string.onRelease(singMode);
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
      if (singMode) {
        note.playVoice();
      }
      setTimeout(() => {
        note.stopSound();
        if (singMode) {
          note.stopVoice();
        }
        index++;
        playNextNote();
      }, 800); // Play each note for 800ms
    } else {
      playButton.removeClass("playing");
      playButton.removeAttribute("disabled");
    }
  };
  playNextNote();

  console.log("Playback complete");
}

function handleSingToggle() {
  singMode = !singMode;
  singButton.toggleClass("active", singMode);
}
