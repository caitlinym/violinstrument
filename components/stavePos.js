// there is an instance for each line or space
// stores the y position and left and right x bounds
// check if the mouse is within the x bounds and some dist from y

class StavePos {
  constructor(fingerName, y) {
    // to handle open strings
    this.fingerNames = Array.isArray(fingerName) ? fingerName : [fingerName];
    this.y = y;
    this.hovered = false;
    this.clicked = false;
    this.isCorrect = false;
  }

  checkHover(mx, my) {
    this.hovered = mx >= 680 && mx <= 874 && abs(my - this.y) < 5.5;
  }

  display() {
    if (this.clicked && this.isCorrect) {
      fill(0, 255, 0);
      ellipse(748, this.y, 35, 26);
    } else if (this.clicked) {
      fill(0);
      ellipse(748, this.y, 35, 26);
    } else if (this.hovered) {
      fill(0, 0, 0, 150);
      ellipse(748, this.y, 35, 26);
    }
  }

  onClick() {
    if (this.hovered) {
      this.clicked = !this.clicked;
    } else if (this.clicked) {
      this.clicked = false;
    }
  }

  reset() {
    this.clicked = false;
    this.isCorrect = false;
  }

  setCorrectFor(fingerName) {
    if (this.fingerNames.includes(fingerName)) {
      this.clicked = true;
      this.isCorrect = true;
    }
  }

  checkCorrectness(fingerName) {
    this.isCorrect = this.fingerNames.includes(fingerName);
  }

  matchesFingerName(fingerName) {
    return this.fingerNames.includes(fingerName);
  }
}
