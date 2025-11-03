// parameters: xStart, xEnd, topRow, filePath
// check if hovering in the region : if so, somehow send the filePath to the main program
// checkHover returns boolean. if true set the main filepath to this.filePath

class Letter {
  constructor(name, xStart, xEnd, topRow) {
    this.name = name;
    this.xStart = xStart;
    this.xEnd = xEnd;
    this.topRow = topRow;
    this.hovered = false;
    this.clicked = false;
    this.isCorrect = false;

    if (this.topRow) {
      this.yStart = 474;
      this.yEnd = 523;
    } else {
      this.yStart = 544;
      this.yEnd = 592;
    }
  }

  checkHover(mx, my) {
    this.hovered =
      mx >= this.xStart &&
      mx <= this.xEnd &&
      my >= this.yStart &&
      my <= this.yEnd;
    return this.hovered;
  }

  onClick() {
    if (this.hovered) {
      this.clicked = !this.clicked;
    } else if (this.clicked) {
      this.clicked = false;
    }
  }

  getClickedLetterName() {
    if (this.clicked) {
      return this.name;
    }
  }

  reset() {
    this.clicked = false;
    this.isCorrect = false;
  }

  setCorrectFor(noteName) {
    if (this.name === noteName) {
      this.clicked = true;
      this.isCorrect = true;
    }
  }

  checkCorrectness(noteName) {
    this.isCorrect = this.name === noteName;
  }
}
