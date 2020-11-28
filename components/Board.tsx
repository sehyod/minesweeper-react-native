import React, { useEffect, useState } from "react";
import Cell from "./Cell";
import { CellState, CellType, Coordinates } from "../types";
import {
  Modal,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import {
  createEmptyBoard,
  generateValues,
  getEmptyNeighborhood,
} from "../utils/minesweeper";
import Popup from "./Popup";
import Timer from "./Timer";

const Board: React.FC = () => {
  const [rows] = useState(9);
  const [columns] = useState(9);
  const [mines] = useState(10);
  const [board, setBoard] = useState<CellType[][]>([]);
  const [valuesGenerated, setValuesGenerated] = useState(false);
  const [exploded, setExploded] = useState(false);
  const [won, setWon] = useState(false);
  const [revealedCells, setRevealedCells] = useState(0);
  const [flaggedCells, setFlaggedCells] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const windowsDimensions = useWindowDimensions();

  // Start a new game at the first render
  useEffect(() => {
    resetGame();
  }, []);

  // Check whether all safe cells have been revealed
  useEffect(() => {
    if (revealedCells === rows * columns - mines) {
      setWon(true);
    }
  });

  // Stop the timer when the game is over
  useEffect(() => {
    if (won || exploded) setTimerActive(false);
  }, [won, exploded]);

  const resetGame = () => {
    setValuesGenerated(false);
    setExploded(false);
    setWon(false);
    setTimerActive(false);
    setRevealedCells(0);
    setFlaggedCells(0);
    setBoard(createEmptyBoard(rows, columns));
  };

  // Update the board to reveal a cell
  const revealCell = (cell: Coordinates) => {
    const [row, column] = cell;
    // Update the board
    setRevealedCells((revealedCells) => revealedCells + 1);
    setBoard(([...board]) => {
      board[row][column].state = CellState.REVEALED;
      return board;
    });
  };

  const revealCells = (cells: Coordinates[]) => {
    setRevealedCells((revealedCells) => revealedCells + cells.length);
    setBoard(([...board]) => {
      for (const [row, column] of cells) {
        board[row][column].state = CellState.REVEALED;
      }
      return board;
    });
  };

  const handleLeftClick = (row: number, column: number) => () => {
    // Populate the board and start the timer if it is the first click
    let currentBoard = board;
    if (!valuesGenerated) {
      currentBoard = generateValues(board, mines, [row, column]);
      setBoard(currentBoard);
      setTimerActive(true);
      setValuesGenerated(true);
    }

    const cellData = currentBoard[row][column];

    // Mine found: the game is over
    if (cellData.value === "mine") {
      setExploded(true);
      setBoard(([...board]) => {
        board[row][column].state = CellState.EXPLODED;
        return board;
      });
      return;
    }

    if (cellData.value === 0) {
      revealCells(getEmptyNeighborhood([row, column], currentBoard));
    } else {
      revealCell([row, column]);
    }
  };

  const handleRightClick = (row: number, column: number) => () => {
    const cellHasFlag = board[row][column].state === CellState.FLAGGED;

    // Update the number of flagged cells
    if (cellHasFlag) setFlaggedCells((flaggedCells) => flaggedCells - 1);
    else setFlaggedCells((flaggedCells) => flaggedCells + 1);

    // Update the board with the new flag or the removed flag
    setBoard(([...board]) => {
      board[row][column].state = cellHasFlag
        ? CellState.HIDDEN
        : CellState.FLAGGED;
      return board;
    });
  };

  return (
    <View style={[styles.container, { width: windowsDimensions.width }]}>
      <View style={styles.header}>
        <View style={{ alignItems: "flex-start" }}>
          <Timer start={timerActive} style={styles.headerText} />
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.headerText}>Minesweeper</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.headerText}>{flaggedCells}</Text>
        </View>
      </View>

      <View style={styles.table}>
        {board.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, columnIndex) => (
              <Cell
                key={`${rowIndex}-${columnIndex}`}
                value={cell.value}
                state={cell.state}
                won={won}
                exploded={exploded}
                onLeftClick={handleLeftClick(rowIndex, columnIndex)}
                onRightClick={handleRightClick(rowIndex, columnIndex)}
              />
            ))}
          </View>
        ))}
      </View>
      <View />
      <Modal visible={won || exploded} transparent>
        <Popup
          visible={won || exploded}
          text={won ? "You win!" : "You lose!"}
          onReset={resetGame}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  header: {
    marginTop: 10,
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-around",
    height: 35,
    maxHeight: 35,
  },
  headerText: {
    fontSize: 30,
  },
  table: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
    height: 35,
  },
});

export default Board;
