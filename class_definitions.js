const setOperations = require('./set_operations.js');


class Cell {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.box = 1 + parseInt((col - 1) / 3, 10) +
      (3 * (parseInt((row - 1) / 3, 10)));
    this.cellNumber = calculateCellNumber(row, col);
    this.value = undefined;
    this.possibleValues = new Set(POSSIBLE_VALUES);
    this.notPossibleValues = new Set([]);
    this.isFilled = false;
  }

  assignValue(value) {
    this.value = value;
    this.possibleValues = new Set([]);
    this.isFilled = true;
  }

  updatePossibleValues(set) {
    let derivedPossibilities = setOperations.difference(new Set(POSSIBLE_VALUES),
      this.notPossibleValues);
    this.possibleValues = setOperations.intersection(derivedPossibilities, set);
  }

  updateNotPossibleValues(set) {
    this.notPossibleValues = setOperations.union(this.notPossibleValues, set);
  }
}

class CellGroup {
  constructor(id, cellObj) {
    this.containedCells = cellObj;
    this.id = id;
    [this.filledCells, this.emptyCells] = this.categorizeCells();
    this.missingValues = this.initializeMissingValues();
    this.notPossibleValues = this.deriveNotPossibleValues();
    this.initializeCellValuePossibilities();
  }

  categorizeCells() {
    let emptyCellArray = [];
    let filledCellArray = [];
    this.containedCells.forEach(cell => {
      if (!cell.isFilled) {
        emptyCellArray.push(cell);
      } else {
        filledCellArray.push(cell);
      }
    });
    return [emptyCellArray, filledCellArray];
  }

  initializeMissingValues() {
    let existingValues = [];
    this.filledCells.forEach(cell => existingValues.push(cell.value));
    return new Set(existingValues);
  }

  deriveNotPossibleValues() {
    return setOperations.difference(new Set(POSSIBLE_VALUES),
      this.missingValues);
  }

  initializeCellValuePossibilities() {
    for (let cell in this.emptyCells) {
      cell.updateNotPossibleValues(this.notPossibleValues);
      let commonMissing = new Set(POSSIBLE_VALUES);
      for (let otherCell in this.emptyCells) {
        if (otherCell.cellNumber === cell.cellNumber) continue;
        commonMissing = setOperations.intersection(commonMissing,
          otherCell.notPossibleValues);
      }
      cell.updatePossibleValues(commonMissing);
    }
  }

  updateAfterCellFill(cell) {
    this.filledCells = this.includeCell(cell);
    this.emptyCells = this.removeCell(cell);
    this.notPossibleValues = setOperations.union(this.notPossibleValues,
      cell.value);
    this.missingValues = setOperations.difference(this.missingValues,
      cell.value);

  }


}
