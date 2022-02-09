const setOperations = require('./set_operations.js');

const POSSIBLE_VALUES = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

class GridProperties {
  // Grid Property class
  constructor(gridLength) {
    this.NO_ROWS = gridLength;
    this.NO_COLS = gridLength;
    this.BOX_LENGTH = Math.sqrt(gridLength);
    this.POSSIBLE_VALUES = this.possibleValues();
  }

  calculateBoxNumber(row, col) {
    return 1 + parseInt((col - 1) / this.BOX_LENGTH, 10) +
      (this.BOX_LENGTH * (parseInt((row - 1) / this.BOX_LENGTH, 10)));
  }

  calculateCellNumber(row, col) {
    return (this.NO_ROWS * (row - 1)) + col;
  }

  possibleValues() {
    let possibilities = new Array(this.NO_ROWS).fill(0);
    possibilities = possibilities.map((_, index) => 1 + index);
    return new Set(possibilities);
  }
}

class Cell {
  // Cell class
  constructor(row, col, gridProps) {
    this.row = row;
    this.col = col;
    this.box = gridProps.calculateBoxNumber(row, col);
    this.cellNumber = gridProps.calculateCellNumber(row, col);
    this.value = undefined;
    this.theoreticalPossibilities = gridProps.POSSIBLE_VALUES;
    this.possibleValues = POSSIBLE_VALUES;
    this.notPossibleValues = new Set([]);
    this.isFilled = false;
  }

  resetCell() {
    this.value = undefined;
    this.isFilled = false;
  }

  assignValue(value) {
    this.value = value;
    this.possibleValues = new Set([]);
    this.isFilled = true;
  }

  returnDispVal() {
    if (!this.isFilled) {
      return ' ';
    }
    return this.value;
  }

  updatePossibleValues(boxExistingVals, colExistingVals, rowExistingVals) {
    let unionNotPossibleValues = setOperations.union(setOperations.union(boxExistingVals,
      colExistingVals), rowExistingVals);
    this.possibleValues = setOperations.difference(POSSIBLE_VALUES,
      unionNotPossibleValues);
  }

  hasUniquePossibleValue() {
    return (this.possibleValues.size === 1);
  }

  hasInvalidState() {
    return (this.possibleValues.size === 0) && (!this.isFilled);
  }

  returnUniquePossibleValue() {
    if (this.hasUniquePossibleValue()) return [...this.possibleValues][0];
    return undefined;
  }
}

module.exports = {
  GridProperties,
  Cell
};
