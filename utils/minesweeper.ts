import { CellState, CellType, Coordinates } from "../types";
import { range, shuffle } from "./array";

/**
 * Convert coordinates from n-th cell to [row, column]
 * @param index the index of the cell (the top-left cell is the 0th one, the bottom-right cell is the (rows*columns - 1)-th one)
 * @param columns the number of columns of the board
 *
 * @return [row, column] the coordinates of the cell in the board
 */
export const getCoordinatesFromIndex = (
  index: number,
  columns: number
): Coordinates => {
  return [Math.floor(index / columns), index % columns];
};

export const getIndexFromCoordinates = (
  [row, column]: Coordinates,
  columns: number
): number => {
  return row * columns + column;
};

/**
 * Get the coordinates of the neighbours of a given cell
 * @param row row of the cell
 * @param column column of the cell
 * @param rows number of rows of the board
 * @param columns number of columns of the board
 *
 * @return the list of coordinates of the neighbors
 */
export const getNeighbors = (
  index: number,
  rows: number,
  columns: number
): number[] => {
  const [row, column] = getCoordinatesFromIndex(index, columns);
  const neighborhood: number[] = [];
  for (let i = row - 1; i < row + 2; i++) {
    if (0 <= i && i < rows) {
      for (let j = column - 1; j < column + 2; j++) {
        if ((i !== row || j !== column) && 0 <= j && j < columns)
          neighborhood.push(getIndexFromCoordinates([i, j], columns));
      }
    }
  }
  return neighborhood;
};

/**
 * Create an empty board of size rows * columns
 * @param rows number of rows of the board
 * @param columns number of columns of the board
 */
export const createEmptyBoard = (rows: number, columns: number): CellType[] => {
  const board: CellType[] = [];
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      board.push({ state: CellState.HIDDEN, value: 0 });
    }
  }
  return board;
};

/**
 * Fill the board with some mines, avoiding the first cell and its neighbors and fill the others cells with their value
 * @param board the empty board to fill
 * @param numberOfMines the number of mines to add
 * @param clickedCell the first cell clicked on to avoid hitting a mine on the first try
 */
export const generateValues = (
  board: CellType[],
  numberOfMines: number,
  clickedCellIndex: number,
  rows: number,
  columns: number
): CellType[] => {
  // Remove the initial cell and its neighbors from the mine position candidates
  const forbiddenCellsIndexes = getNeighbors(
    clickedCellIndex,
    rows,
    columns
  ).concat([clickedCellIndex]);
  const availableIndexes = range(rows * columns).filter(
    (index) => !forbiddenCellsIndexes.includes(index)
  );

  // Select the mines indexes
  const minesIndexes = shuffle(availableIndexes).slice(0, numberOfMines);

  for (const mineIndex of minesIndexes) {
    // Add bomb
    board[mineIndex].value = "mine";

    // Update value of adjacent cells
    for (const neighbor of getNeighbors(mineIndex, rows, columns)) {
      const cellValue = board[neighbor].value;
      if (cellValue !== "mine") {
        board[neighbor].value = cellValue + 1;
      }
    }
  }

  return board;
};

/**
 * Get the neighborhood to reveal when clicking on an empty cell with a BFS
 * @param cell The cell which has been revealed
 * @param board The board, to know whether a cell is empty or not
 *
 * @return the neighborhood to reveal
 */
export const getEmptyNeighborhood = (
  cellIndex: number,
  board: CellType[],
  rows: number,
  columns: number
): number[] => {
  const visited: { [index: number]: boolean } = {};
  const neighborhood = [cellIndex];
  const queue: number[] = [];
  visited[cellIndex] = true;
  queue.push(cellIndex);
  while (queue.length > 0) {
    const index = queue.splice(0, 1)[0];
    getNeighbors(index, rows, columns)
      .filter(
        (neighbor) =>
          !visited[neighbor] && board[neighbor].state !== CellState.REVEALED
      )
      .forEach((neighbor) => {
        visited[neighbor] = true;
        neighborhood.push(neighbor);
        if (board[neighbor].value === 0) {
          queue.push(neighbor);
        }
      });
  }
  return neighborhood;
};
