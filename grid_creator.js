const classes = require('./class_definitions.js');
let setOps = require('./set_operations.js');

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

function fillCellBlock(cellValue) {
  let newSet = new Set([cellValue]);
  this.missingValues = setOps.difference(this.missingValues,
    newSet);
  this.existingValues = setOps.union(this.existingValues, newSet);
}

// Initiate SUDOKU_GRID, BOX, ROW, COL

function initializeGrid() {
  let grid = {};
  let gridProps = new classes.GridProperties(9);
  for (let row = 1; row <= NO_ROWS; row++) {
    for (let col = 1; col <= NO_COLS; col++) {
      grid[calculateCellNumber(row, col)] = new classes.Cell(row, col,
        gridProps);
    }
  }
  return grid;
}

function initializeCols(grid) {
  let cols = {};
  for (let col = 1; col <= NO_COLS; col++) {
    cols[col] = {
      cells: cellsContainedInRowOrColumn(col, 9, 1, grid),
      missingValues: new Set(POSSIBLE_VALUES),
      existingValues: new Set()
    };
  }
  return cols;
}

function initializeBoxes(grid) {
  let boxes = {};
  for (let box = 1; box <= NO_ROWS; box++) {
    boxes[box] = {
      cells: cellsContainedInBox(box, grid),
      missingValues: new Set(POSSIBLE_VALUES),
      existingValues: new Set()
    };
  }
  return boxes;
}

function initializeRows(grid) {
  let rows = {};
  for (let row = 1; row <= NO_ROWS; row++) {
    rows[row] = {
      cells: cellsContainedInRowOrColumn(row, 1, 9, grid),
      missingValues: new Set(POSSIBLE_VALUES),
      existingValues: new Set()
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
  initializeGrid,
  fillCellBlock
};

// testing
// console.log(parseGrid('examples/expert/expert_1.csv'));
