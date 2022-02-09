const fs = require('fs');
const gridCreator = require('./grid_creator.js');

function txtFileReader(file) {
  /*
    Function to parse Sudoku grids
    from input csv files and return
    a 2D grid
  */
  return fs.readFileSync(file, 'utf-8')
    .split('\r').map(elem => elem.split(','));
}

function zeroToOneBased(elem) {
  // Return one based string conversion
  return parseInt(elem, 10) + 1;
}

function calcCellNumber(zeroBasedRow, zeroBasedCol) {
  // Return cell number based on row and column numbers
  return gridCreator.calculateCellNumber(zeroToOneBased(zeroBasedRow),
    zeroToOneBased(zeroBasedCol));
}

function invalidCellValue(cellValue) {
  return ((!cellValue) || (!parseInt(cellValue, 10)));
}

function parseGrid(file) {
  /*
    Return a dictionary mapping
    cell number to cell value. Cells with
    no value are not included as keys of the grid dictionary
  */
  let inputGrid = txtFileReader(file);
  let grid = {};
  for (let zeroBasedRow in inputGrid) {
    for (let zeroBasedCol in inputGrid[zeroBasedRow]) {
      let cellValue = inputGrid[zeroBasedRow][zeroBasedCol];
      if (invalidCellValue(cellValue)) continue;
      grid[calcCellNumber(zeroBasedRow, zeroBasedCol)] = parseInt(cellValue,
        10);
    }
  }
  return grid;

}

module.exports = {
  txtFileReader,
  parseGrid
};
