const setOperations = require('./set_operations.js');

class GridProperties {
  // Grid Property class
  constructor(gridLength) {
    this.NO_ROWS = gridLength;
    this.NO_COLS = gridLength;
    this.BOX_LENGTH = Math.sqrt(gridLength);
  }

  calculateBoxNumber(row, col) {
    return 1 + parseInt((col - 1) / this.BOX_LENGTH, 10) +
      (this.BOX_LENGTH * (parseInt((row - 1) / this.BOX_LENGTH, 10)));
  }

  calculateCellNumber(row, col) {
    return (this.NO_ROWS * (row - 1)) + col;
  }
}

class Cell {
  // Cell class
  constructor(row, col, box, cellNumber, POSSIBLE_VALUES) {
    this.row = row;
    this.col = col;
    this.box = box;
    this.cellNumber = cellNumber;
    this.value = undefined;
    this.theoreticalPossibilities = POSSIBLE_VALUES;
    this.possibleValues = POSSIBLE_VALUES;
    this.notPossibleValues = new Set([]);
    this.isFilled = false;
  }

  assignValue(value) {
    this.value = value;
    this.possibleValues = new Set([]);
    this.isFilled = true;
  }

  updatePossibleValues(set) {
    let derivedPossibilities = setOperations.difference(this.theoreticalPossibilities,
      this.notPossibleValues);
    this.possibleValues = setOperations.intersection(derivedPossibilities, set);
  }

  updateNotPossibleValues(set) {
    this.notPossibleValues = setOperations.union(this.notPossibleValues, set);
  }
}

class CellGroup {
  // CellGroup class
  constructor(id, cellObj, POSSIBLE_VALUES) {
    this.containedCells = cellObj;
    this.id = id;
    [this.filledCells, this.emptyCells] = this.categorizeCells();
    this.theoreticalPossibilities = POSSIBLE_VALUES;
    this.missingValues = this.initializeMissingValues();
    this.notPossibleValues = this.deriveNotPossibleValues();
    this.initializeCellValuePossibilities();
  }

  categorizeCells() {
    let emptyCellObj = {};
    let filledCellObj = {};
    let self = this;
    this.containedCells.keys().forEach(cellNumber => {
      let cell = self.containedCells[cellNumber];
      if (!cell.isFilled) {
        emptyCellObj[cellNumber] = cell;
      } else {
        filledCellObj[cellNumber] = cell;
      }
    });
    return [emptyCellObj, filledCellObj];
  }

  initializeMissingValues() {
    let existingValues = [];
    let self = this;
    this.filledCells.keys().forEach(cellNumber =>
      existingValues.push(self.containedCells[cellNumber].value));
    return new Set(existingValues);
  }

  deriveNotPossibleValues() {
    return setOperations.difference(this.theoreticalPossibilities,
      this.missingValues);
  }

  initializeCellValuePossibilities() {
    let commonMissing = this.theoreticalPossibilities;
    for (let cell in this.emptyCells) {
      cell.updateNotPossibleValues(this.notPossibleValues);
      for (let otherCell in this.emptyCells) {
        if (otherCell.cellNumber === cell.cellNumber) continue;
        commonMissing = setOperations.intersection(commonMissing,
          otherCell.notPossibleValues);
      }
      cell.updatePossibleValues(commonMissing);
    }
  }

  appendToFilledCells(cell) {
    this.filledCells[cell.cellNumber] = cell;
  }

  removeFromEmptyCells(cell) {
    delete this.emptyCells[cell.cellNumber];
  }

  updateAfterCellFill(cell) {
    this.appendToFilledCells(cell);
    this.removeFromEmptyCells(cell);
    this.notPossibleValues = setOperations.union(this.notPossibleValues,
      cell.value);
    this.missingValues = setOperations.difference(this.missingValues,
      cell.value);
  }
}

module.exports = {
  GridProperties,
  Cell,
  CellGroup
};
