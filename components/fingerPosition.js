class FingerPosition {
  constructor(name, y, sampler, pitch) {
    this.y = y;
    this.name = name;
    this.hovered = false;
    this.clicked = false;
    this.isCorrect = false;
    this.sampler = sampler;
    this.isUnlocked = false;
    this.pitches = {
      G1: "A3",
      G2: "B3",
      G3: "C4",
      G4: "D4",
      D: "D4",
      D1: "E4",
      D2: "F#4",
      D3: "G4",
      D4: "A4",
      A: "A4",
      A1: "B4",
      A2: "C#5",
      A3: "D5",
      A4: "E5",
      E: "E5",
      E1: "F#5",
      E2: "G#5",
      E3: "A5",
      E4: "B5",
    };
    this.pitch = this.pitches[this.name];
  }

  playSound() {
    if (this.pitch && this.sampler.loaded) {
      // Sampler will repitch the closest sample
      this.sampler.triggerAttack(this.pitch);
    }
  }

  // playVoice() {
  //   if (this.pitch && this.sampler.loaded) {
  //     this.sampler.triggerAttack(this.pitch);
  //   }
  // }

  stopSound() {
    if (this.pitch && this.sampler.loaded) {
      // Sampler will repitch the closest sample
      this.sampler.triggerRelease(this.pitch);
    }
  }

  reset() {
    if (!this.isUnlocked) {
      this.clicked = false;
      this.isCorrect = false;
    }
  }

  unlock() {
    this.isCorrect = true;
    this.isUnlocked = true;
  }
}
