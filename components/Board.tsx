import React, { useEffect, useRef, useState } from "react";
import Cell from "./Cell";
import { CellState, CellType, Coordinates } from "../types";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

const Board: React.FC = () => {
  const [rows] = useState(10);
  const [columns] = useState(10);
  const [mines] = useState(10);
  const [board, setBoard] = useState<CellType[][]>([]);
  const [valuesGenerated, setValuesGenerated] = useState(false);
  const [exploded, setExploded] = useState(false);
  const [won, setWon] = useState(false);
  const [revealedCells, setRevealedCells] = useState(0);
  const [flaggedCells, setFlaggedCells] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const windowsDimensions = useWindowDimensions();

  // Start a new game at the first render
  useEffect(() => {
    startGame();
  }, []);

  // Compute the sum of cells that are revealed when the board is updated
  useEffect(() => {
    setRevealedCells(
      board
        .map(
          (row) =>
            row.filter((cell) => cell.state === CellState.REVEALED).length
        )
        .reduce((a, b) => a + b, 0)
    );
  }, [board]);

  // Check whether all safe cells have been revealed
  useEffect(() => {
    if (revealedCells === rows * columns - mines) {
      setWon(true);
    }
  }, [revealedCells]);

  // Stop the timer when the game is over
  useEffect(() => {
    if (won || exploded) setTimerActive(false);
  }, [won, exploded]);

  // Set remaining mine cells as flagged once the game is finished
  // (if the player has found all safe cells, then the remaining cells are mine cells)
  useEffect(() => {
    if (won) {
      setBoard(([...board]) => {
        return board.map((row) =>
          row.map((cell) => {
            if (cell.value === "mine") {
              cell.state = CellState.FLAGGED;
            }
            return cell;
          })
        );
      });
    }
  }, [won]);

  // Start the timer
  useEffect(() => {
    if (timerActive) {
      const timer = setInterval(
        () => setSeconds((seconds) => seconds + 1),
        1000
      );

      return () => {
        clearInterval(timer);
      };
    }
  }, [timerActive]);

  const startGame = () => {
    setBoard([]); // TODO: create the initial board
    setValuesGenerated(false);
    setExploded(false);
    setRevealedCells(0);
    setWon(false);
    setSeconds(0);
    setTimerActive(false);
  };

  // Update the board to reveal a cell
  const revealCell = (cell: Coordinates) => {
    const [row, column] = cell;
    // Update the board
    setBoard(([...board]) => {
      board[row][column].state = CellState.REVEALED;
      return board;
    });
  };

  const handleLeftClick = (row: number, column: number) => () => {
    // Populate the board and start the timer if it is the first click
    let currentBoard = board;
    if (!valuesGenerated) {
      //TODO: generate mines and values
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

    revealCell([row, column]);

    if (cellData.value === 0) {
      //TODO: reveal the neighborhood of the cell
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

  const isGameOver = () => won || exploded;

  return (
    <View style={[styles.container, { width: windowsDimensions.width }]}>
      <View style={styles.header}>
        <View style={{ alignItems: "flex-start" }}>
          <Text style={styles.headerText}>{seconds}</Text>
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
                gameOver={isGameOver()}
                onLeftClick={handleLeftClick(rowIndex, columnIndex)}
                onRightClick={handleRightClick(rowIndex, columnIndex)}
              />
            ))}
          </View>
        ))}
      </View>
      <View style={styles.footer} />
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
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-around",
    height: 35,
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
  footer: {
    height: 35,
  },
});

export default Board;
