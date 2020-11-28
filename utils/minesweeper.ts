import { CellState, CellType, Coordinates } from "../types";
import { range, shuffle } from "./array";

/**
 * Convert coordinates from n-th cell to [row, column]
 * @param index the index of the cell (the top-left cell is the 0th one, the bottom-right cell is the (rows*columns - 1)-th one)
 * @param columns the number of columns of the board
 *
 * @return [row, column] the coordinates of the cell in the board
 */
export const transformCoordinates = (
  index: number,
  columns: number
): Coordinates => {
  return [Math.floor(index / columns), index % columns];
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
  row: number,
  column: number,
  rows: number,
  columns: number
): Coordinates[] => {
  const neighborhood: Coordinates[] = [];
  for (let i = row - 1; i < row + 2; i++) {
    if (0 <= i && i < rows) {
      for (let j = column - 1; j < column + 2; j++) {
        if ((i !== row || j !== column) && 0 <= j && j < columns)
          neighborhood.push([i, j]);
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
export const createEmptyBoard = (
  rows: number,
  columns: number
): CellType[][] => {
  const cells: CellType[][] = [];
  for (let row = 0; row < rows; row++) {
    const currentRow: CellType[] = [];
    for (let column = 0; column < columns; column++) {
      currentRow.push({ state: CellState.HIDDEN, value: 0 });
    }
    cells.push(currentRow);
  }
  return cells;
};

/**
 * Fill the board with some mines, avoiding the first cell and its neighbors and fill the others cells with their value
 * @param board the empty board to fill
 * @param numberOfMines the number of mines to add
 * @param clickedCell the first cell clicked on to avoid hitting a mine on the first try
 */
export const generateValues = (
  board: CellType[][],
  numberOfMines: number,
  clickedCell: Coordinates
): CellType[][] => {
  const rows = board.length;
  const columns = board[0].length;
  const forbiddenCells = getNeighbors(
    clickedCell[0],
    clickedCell[1],
    rows,
    columns
  ).concat([clickedCell]);
  const forbiddenIndexes = forbiddenCells.map(
    ([row, column]) => row * columns + column
  );
  const availableIndexes = range(rows * columns).filter(
    (index) => !forbiddenIndexes.includes(index)
  );

  // Remove the initial box from the mine position candidates
  //availableIndexes.filter((index) => !forbiddenIndexes.includes(index));

  const minesIndexes = shuffle(availableIndexes).slice(0, numberOfMines);

  for (const mineIndex of minesIndexes) {
    // Add bomb
    const [row, column] = transformCoordinates(mineIndex, columns);
    board[row][column].value = "mine";

    // Update value of adjacent cells
    for (const [i, j] of getNeighbors(row, column, rows, columns)) {
      const cellValue = board[i][j].value;
      if (cellValue !== "mine") {
        board[i][j].value = cellValue + 1;
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
  cell: Coordinates,
  board: CellType[][]
): Coordinates[] => {
  const rows = board.length;
  const columns = board[0].length;
  const visited: { [index: number]: boolean } = {};
  const neighborhood = [cell];
  const queue: Coordinates[] = [];
  visited[cell[0] * columns + cell[1]] = true;
  queue.push(cell);
  while (queue.length > 0) {
    const [row, column] = queue.splice(0, 1)[0];
    getNeighbors(row, column, rows, columns)
      .filter(
        ([neighborRow, neighborColumn]) =>
          !visited[neighborRow * columns + neighborColumn] &&
          board[neighborRow][neighborColumn].state !== CellState.REVEALED
      )
      .forEach(([neighborRow, neighborColumn]) => {
        visited[neighborRow * columns + neighborColumn] = true;
        neighborhood.push([neighborRow, neighborColumn]);
        if (board[neighborRow][neighborColumn].value === 0) {
          queue.push([neighborRow, neighborColumn]);
        }
      });
  }
  return neighborhood;
};
