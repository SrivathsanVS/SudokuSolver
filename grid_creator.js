const classes = require('./class_definitions.js');

const NO_ROWS = 9;
const NO_COLS = 9;
const POSSIBLE_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function calculateCellNumber(row, col) {
  return (NO_ROWS * (row - 1)) + col;
}

function cellsContainedInBox(boxNum, grid) {
  let firstCellNumber = [1, 4, 7, 28, 31, 34, 55, 58, 61][boxNum - 1];
  return [grid[firstCellNumber], grid[firstCellNumber + 1],
    grid[firstCellNumber + 2], grid[firstCellNumber + 9],
    grid[firstCellNumber + 10], grid[firstCellNumber + 11],
    grid[firstCellNumber + 18], grid[firstCellNumber + 19],
    grid[firstCellNumber + 20]];
}

function cellsContainedInRowOrColumn(entityNum,
  cellIncrementWithinEntity, cellIncrementBetweenEntities, grid) {
  return Array(9).fill(0).map((_elem, num) => {
    let cellNumber = 1 + ((entityNum - 1) * cellIncrementBetweenEntities) +
      (cellIncrementWithinEntity * num);
    return grid[cellNumber];
  });
}

// Initiate SUDOKU_GRID, BOX, ROW, COL

function initializeGrid() {
  let grid = {};
  for (let row = 1; row <= NO_ROWS; row++) {
    for (let col = 1; col <= NO_COLS; col++) {
      grid[calculateCellNumber(row, col)] = classes.Cell(row, col);
    }
  }
}

function initializeCols(grid) {
  let cols = {};
  for (let col = 1; col <= NO_COLS; col++) {
    cols[col] = {
      cells: cellsContainedInRowOrColumn(col, 9, 1, grid),
      missingValues: new Set(POSSIBLE_VALUES)
    };
  }
  return cols;
}

function initializeBoxes(grid) {
  let boxes = {};
  for (let box = 1; box <= NO_ROWS; box++) {
    boxes[box] = {
      cells: cellsContainedInBox(box, grid),
      missingValues: new Set(POSSIBLE_VALUES)
    };
  }
}

function initializeRows(grid) {
  let rows = {};
  for (let row = 1; row <= NO_ROWS; row++) {
    rows[row] = {
      cells: cellsContainedInRowOrColumn(row, 1, 9, grid),
      missingValues: new Set(POSSIBLE_VALUES)
    };
  }
  return rows;
}

module.exports = {
  NO_ROWS,
  NO_COLS,
  calculateCellNumber,
  initializeRows,
  initializeCols,
  initializeBoxes,
  initializeGrid
};
