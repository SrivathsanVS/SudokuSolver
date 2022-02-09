/*
  Logic functions to update possible values of cells
*/
let gridCreator = require('./grid_creator.js');
let inputHandler = require('./inputHandler.js');
let setOps = require('./set_operations.js');

class GridHandler {
  constructor() {
    this.grid = gridCreator.initializeGrid();
    this.boxes = gridCreator.initializeBoxes(this.grid);
    this.rows = gridCreator.initializeRows(this.grid);
    this.cols = gridCreator.initializeCols(this.grid);
    this.emptyCells = new Set(Array.from({length: 81}, (_, num) => num + 1));
    this.assumptionError = false;
    this.assumptionArray = [];
  }

  fillCell(cell, value) {
    cell.assignValue(value);
    gridCreator.fillCellBlock.call(this.boxes[cell.box], value);
    gridCreator.fillCellBlock.call(this.cols[cell.col], value);
    gridCreator.fillCellBlock.call(this.rows[cell.row], value);
    this.emptyCells = setOps.difference(this.emptyCells,
      new Set([cell.cellNumber]));
  }

  copyGrid() {
    let newGrid = new GridHandler();
    for (let cellNumber in this.grid) {
      let cell = this.grid[cellNumber];
      let copyCell = newGrid.grid[cellNumber];
      if (!cell.isFilled) continue;
      newGrid.fillCell(copyCell, cell.value);
    }
    return newGrid;
  }

  readGrid(file) {
    let inputGrid = inputHandler.parseGrid(file);
    for (const cellNumber in inputGrid) {
      this.fillCell(this.grid[cellNumber], inputGrid[cellNumber]);
    }
  }

  displayGrid() {
    console.log(`${this.grid[1].returnDispVal()} : ${this.grid[2].returnDispVal()} : ${this.grid[3].returnDispVal()} | ${this.grid[4].returnDispVal()} : ${this.grid[5].returnDispVal()} : ${this.grid[6].returnDispVal()} | ${this.grid[7].returnDispVal()} : ${this.grid[8].returnDispVal()} : ${this.grid[9].returnDispVal()}`);
    console.log(`${this.grid[10].returnDispVal()} : ${this.grid[11].returnDispVal()} : ${this.grid[12].returnDispVal()} | ${this.grid[13].returnDispVal()} : ${this.grid[14].returnDispVal()} : ${this.grid[15].returnDispVal()} | ${this.grid[16].returnDispVal()} : ${this.grid[17].returnDispVal()} : ${this.grid[18].returnDispVal()}`);
    console.log(`${this.grid[19].returnDispVal()} : ${this.grid[20].returnDispVal()} : ${this.grid[21].returnDispVal()} | ${this.grid[22].returnDispVal()} : ${this.grid[23].returnDispVal()} : ${this.grid[24].returnDispVal()} | ${this.grid[25].returnDispVal()} : ${this.grid[26].returnDispVal()} : ${this.grid[27].returnDispVal()}`);
    console.log(`---------------------------------`);
    console.log(`${this.grid[28].returnDispVal()} : ${this.grid[29].returnDispVal()} : ${this.grid[30].returnDispVal()} | ${this.grid[31].returnDispVal()} : ${this.grid[32].returnDispVal()} : ${this.grid[33].returnDispVal()} | ${this.grid[34].returnDispVal()} : ${this.grid[35].returnDispVal()} : ${this.grid[36].returnDispVal()}`);
    console.log(`${this.grid[37].returnDispVal()} : ${this.grid[38].returnDispVal()} : ${this.grid[39].returnDispVal()} | ${this.grid[40].returnDispVal()} : ${this.grid[41].returnDispVal()} : ${this.grid[42].returnDispVal()} | ${this.grid[43].returnDispVal()} : ${this.grid[44].returnDispVal()} : ${this.grid[45].returnDispVal()}`);
    console.log(`${this.grid[46].returnDispVal()} : ${this.grid[47].returnDispVal()} : ${this.grid[48].returnDispVal()} | ${this.grid[49].returnDispVal()} : ${this.grid[50].returnDispVal()} : ${this.grid[51].returnDispVal()} | ${this.grid[52].returnDispVal()} : ${this.grid[53].returnDispVal()} : ${this.grid[54].returnDispVal()}`);
    console.log(`---------------------------------`);
    console.log(`${this.grid[55].returnDispVal()} : ${this.grid[56].returnDispVal()} : ${this.grid[57].returnDispVal()} | ${this.grid[58].returnDispVal()} : ${this.grid[59].returnDispVal()} : ${this.grid[60].returnDispVal()} | ${this.grid[61].returnDispVal()} : ${this.grid[62].returnDispVal()} : ${this.grid[63].returnDispVal()}`);
    console.log(`${this.grid[64].returnDispVal()} : ${this.grid[65].returnDispVal()} : ${this.grid[66].returnDispVal()} | ${this.grid[67].returnDispVal()} : ${this.grid[68].returnDispVal()} : ${this.grid[69].returnDispVal()} | ${this.grid[70].returnDispVal()} : ${this.grid[71].returnDispVal()} : ${this.grid[72].returnDispVal()}`);
    console.log(`${this.grid[73].returnDispVal()} : ${this.grid[74].returnDispVal()} : ${this.grid[75].returnDispVal()} | ${this.grid[76].returnDispVal()} : ${this.grid[77].returnDispVal()} : ${this.grid[78].returnDispVal()} | ${this.grid[79].returnDispVal()} : ${this.grid[80].returnDispVal()} : ${this.grid[81].returnDispVal()}`);
  }

  updatePossibleValuesOfCells() {
    for (let cellNumber of this.emptyCells) {
      let cell = this.grid[cellNumber];
      cell.updatePossibleValues(this.boxes[cell.box].existingValues,
        this.cols[cell.col].existingValues, this.rows[cell.row].existingValues);
      if (cell.hasUniquePossibleValue()) {
        this.fillCell(cell, cell.returnUniquePossibleValue());
      }
      if (cell.hasInvalidState()) this.assumptionError = true;
    }
  }

  searchCellBlockForUniquePossibility(block) {
    for (let num of block.missingValues) {
      let count = 0;
      let specialCell = {};
      for (let cellNumber in block.cells) {
        let cell = block.cells[cellNumber];
        if (cell.isFilled) continue;
        if (count > 1) break;
        if (cell.possibleValues.has(num)) {
          count += 1;
          specialCell = cell;
        }
      }
      if (count === 1) this.fillCell(specialCell, num);
      if (count === 0) this.assumptionError = true;
    }
  }

  solveWithoutAssumptions() {
    let numEmptyCells = this.emptyCells.size;
    let updatedNumOfEmptyCells = numEmptyCells - 1; // random start value
    let iterationCount = 1;
    while (updatedNumOfEmptyCells < numEmptyCells) {
      if (this.assumptionError) break;
      this.updatePossibleValuesOfCells();
      for (let num = 1; num < 10; num++) {
        this.searchCellBlockForUniquePossibility(this.boxes[num]);
        this.searchCellBlockForUniquePossibility(this.cols[num]);
        this.searchCellBlockForUniquePossibility(this.rows[num]);
      }
      numEmptyCells = updatedNumOfEmptyCells;
      updatedNumOfEmptyCells = this.emptyCells.size;
      numEmptyCells = Math.max(numEmptyCells, updatedNumOfEmptyCells);
      console.log(`Iteration ${iterationCount}: Original grid - ${numEmptyCells}, Updated grid - ${updatedNumOfEmptyCells}`);
      iterationCount++;
    }
  }

  gridIsFilled() {
    return (this.emptyCells.size === 0);
  }

  chooseCell() {
    for (let num = 2; num < 10; num++) {
      for (let cellNumber of this.emptyCells) {
        let cell = this.grid[cellNumber];
        if (cell.possibleValues.size === num) return cell;
      }
    }
    console.log('Error!');
    return -1;
  }

  makeAssumption() {
    let cellChoice = this.chooseCell();
    let possibilities = [...cellChoice.possibleValues];
    this.assumptionArray.push({cell: cellChoice,
      possibilities: possibilities,
      grid: this.copyGrid()});
    console.log(`Assumption level: ${this.assumptionArray.length}`);
    console.log(`Assumption for cell ${cellChoice.cellNumber}`);
    console.log(` -> Possibilities : ${[...cellChoice.possibleValues].join(', ')}`);
    console.log(' -> Assuming : ', possibilities[0]);
    this.fillCell(cellChoice, possibilities[0]);
  }

  restoreGridToPreviousState(referenceGrid) {
    this.grid = referenceGrid.grid;
    this.boxes = referenceGrid.boxes;
    this.rows = referenceGrid.rows;
    this.cols = referenceGrid.cols;
    this.emptyCells = referenceGrid.emptyCells;
  }

  rotateAssumptionArray(assumption) {
    if (assumption.possibilities.length > 1) {
      assumption.possibilities = assumption.possibilities.slice(1);
      this.assumptionArray[this.assumptionArray.length - 1] = assumption;
    } else {
      this.assumptionArray.pop();
    }
  }

  rectifyAssumption() {
    let assumption = this.assumptionArray[this.assumptionArray.length - 1];
    let previousAssumption = assumption.cell.value;
    this.rotateAssumptionArray(assumption);
    let cellVal = assumption.possibilities[0];
    console.log(`Correcting assumption for ${assumption.cell.cellNumber}`);
    console.log(`Previous assumption: ${previousAssumption}, changing to ${cellVal}`);
    console.log('Per current assumption: ');
    this.displayGrid();
    this.restoreGridToPreviousState(assumption.grid);
    console.log('After rectification: ');
    this.fillCell(this.grid[assumption.cell.cellNumber], cellVal);
    this.displayGrid();
    this.assumptionError = false;
  }

  solve() {
    while (!this.gridIsFilled()) {
      this.solveWithoutAssumptions();
      if (!this.gridIsFilled() && !this.assumptionError) this.makeAssumption();
      if (!this.gridIsFilled() &&
        this.assumptionError &&
        (this.assumptionArray.length === 0)) {
        console.log('\nErroneous input! Aborting\n');
      }
      if (!this.gridIsFilled() &&
        this.assumptionError) this.rectifyAssumption();
    }
    console.log('Solved Grid : ');
    this.displayGrid();
  }
}

module.exports = {
  GridHandler
};

// testing
let grid = new GridHandler();
grid.readGrid('examples/expert/expert_5.csv');
console.log('Input Grid: \n');
grid.displayGrid();
console.log('\nSolving Grid: \n');
grid.solve();
