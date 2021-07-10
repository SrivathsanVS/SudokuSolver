/*
  Logic functions to update possible values of cells
*/
let gridCreator = require('./grid_creator.js');
let inputHandler = require('./inputHandler.js');

class GridHandler {
  constructor() {
    this.grid = gridCreator.initializeGrid();
    this.boxes = gridCreator.initializeBoxes(this.grid);
    this.rows = gridCreator.initializeRows(this.grid);
    this.cols = gridCreator.initializeCols(this.grid);
    this.emptyCells = 81;
  }
  readGrid(file) {
    let inputGrid = inputHandler.parseGrid(file);
    for (const cellNumber in inputGrid) {
      this.grid[cellNumber].assignValue(inputGrid[cellNumber]);
      this.emptyCells -= 1;
    }
  }
  solveWithoutAssumptions() {

  }
}

module.exports = {
  GridHandler
};
