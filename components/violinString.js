class ViolinString {
  constructor(name, x, fingerPositions) {
    this.name = name;
    this.x = x;
    this.hovered = false;
    this.fingerPositions = fingerPositions;
    this.highlightColour = color(255, 244, 78, 150);
  }

  checkHover(mx, my) {
    this.hovered = abs(mx - this.x) < 10 && my > 200 && my < 580;

    // Check each finger position for hover
    for (let f of this.fingerPositions) {
      let d = dist(mx, my, this.x, f.y);
      f.hovered = d < 12; // hover radius
    }
  }

  getNoteName() {
    return this.name;
  }

  display() {
    let clicked = this.fingerPositions.some((f) => f.clicked);
    stroke(this.hovered || clicked ? this.highlightColour : 0);
    strokeWeight(this.hovered || clicked ? 3 : 0);
    line(this.x, 277, this.x, 695);

    if (this.hovered || clicked) {
      noStroke();
      for (let f of this.fingerPositions) {
        if (f.hovered || f.clicked) {
          fill(255, 180, 255, 250);
          ellipse(this.x, f.y, 26);
        } else {
          fill(242, 121, 240, 200);
          ellipse(this.x, f.y, 20);
        }
      }
    }

    for (let f of this.fingerPositions) {
      if (f.isUnlocked) {
        fill(0, 255, 0, 150);
        ellipse(this.x, f.y, 26);
      }
    }
  }

  onClick(singModeActive) {
    for (const f of this.fingerPositions) {
      if (f.hovered) {
        // If it's unlocked and already clicked, don't toggle off
        if (f.isUnlocked && f.clicked) {
          // Just play the sound again, don't toggle
          f.playSound();
          if (singModeActive) {
            f.playVoice();
          }
        } else {
          // Normal toggle behavior
          f.clicked = !f.clicked;

          // Play sound if unlocked or correct
          if (f.isUnlocked || f.isCorrect) {
            f.playSound();
            if (singModeActive) {
              f.playVoice();
            }
          }
        }
      } else if (f.clicked) {
        // Unclick other fingers (including unlocked ones when clicking elsewhere)
        f.clicked = false;
      }
    }
  }

  onRelease(singModeActive) {
    for (const f of this.fingerPositions) {
      if (f.isUnlocked || f.isCorrect) {
        f.stopSound();
        if (singModeActive) {
          f.stopVoice();
        }
      }
    }
  }

  getClickedFinger() {
    return this.fingerPositions.find((f) => f.clicked);
  }
}
