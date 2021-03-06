import React, { useEffect, useState } from "react";
import Cell from "./Cell";
import { CellState, CellType, Coordinates } from "../types";
import {
  FlatList,
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
import Modal from "./Modal";
import Timer from "./Timer";

const Board: React.FC = () => {
  const [rows] = useState(9);
  const [columns] = useState(9);
  const [mines] = useState(10);
  const [board, setBoard] = useState<CellType[]>([]);
  const [valuesGenerated, setValuesGenerated] = useState(false);
  const [exploded, setExploded] = useState(false);
  const [won, setWon] = useState(false);
  const [revealedCells, setRevealedCells] = useState(0);
  const [flaggedCells, setFlaggedCells] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerReset, setTimerReset] = useState(true);

  const windowsDimensions = useWindowDimensions();

  // Start a new game at the first render
  useEffect(() => {
    resetGame();
  }, []);

  // Check whether all safe cells have been revealed
  useEffect(() => {
    if (revealedCells === rows * columns - mines) {
      setFlaggedCells(mines);
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
    setTimerReset(true);
    setTimerActive(false);
    setRevealedCells(0);
    setFlaggedCells(0);
    setBoard(createEmptyBoard(rows, columns));
  };

  // Update the board to reveal a cell
  const revealCell = (index: number) => {
    // Update the number of revealed cells
    setRevealedCells((revealedCells) => revealedCells + 1);

    setBoard(([...board]) => {
      board[index].state = CellState.REVEALED;
      return board;
    });
  };

  // Update the board to reveal several cells
  const revealCells = (indexes: number[]) => {
    // Update the number of revealed cells
    setRevealedCells((revealedCells) => revealedCells + indexes.length);

    setBoard(([...board]) => {
      for (const index of indexes) {
        board[index].state = CellState.REVEALED;
      }
      return board;
    });
  };

  const handleLeftClick = (index: number) => () => {
    // Populate the board and start the timer if it is the first click
    let currentBoard = board;
    if (!valuesGenerated) {
      currentBoard = generateValues(board, mines, index, rows, columns);
      setBoard(currentBoard);
      setTimerReset(false);
      setTimerActive(true);
      setValuesGenerated(true);
    }

    const cellData = currentBoard[index];

    // Mine found: the game is over
    if (cellData.value === "mine") {
      setExploded(true);
      setBoard(([...board]) => {
        board[index].state = CellState.EXPLODED;
        return board;
      });
      return;
    }

    if (cellData.value === 0) {
      revealCells(getEmptyNeighborhood(index, currentBoard, rows, columns));
    } else {
      revealCell(index);
    }
  };

  const handleRightClick = (index: number) => () => {
    const cellHasFlag = board[index].state === CellState.FLAGGED;

    // Update the number of flagged cells
    if (cellHasFlag) setFlaggedCells((flaggedCells) => flaggedCells - 1);
    else setFlaggedCells((flaggedCells) => flaggedCells + 1);

    // Update the board with the new flag or the removed flag
    setBoard(([...board]) => {
      board[index].state = cellHasFlag ? CellState.HIDDEN : CellState.FLAGGED;
      return board;
    });
  };

  const renderCell = ({ item, index }: { item: CellType; index: number }) => (
    <Cell
      value={item.value}
      state={item.state}
      won={won}
      exploded={exploded}
      onLeftClick={handleLeftClick(index)}
      onRightClick={handleRightClick(index)}
    />
  );

  // Since the layout is the same for each cell,
  // we can "tell" the Flatlist component to avoid some useless computations
  const getItemLayout = (_: CellType[] | null | undefined, index: number) => ({
    length: 35,
    offset: 35 * index,
    index,
  });

  return (
    <View style={[styles.container, { width: windowsDimensions.width }]}>
      <View style={styles.header}>
        <View style={{ alignItems: "center", flex: 1 }}>
          <Timer
            start={timerActive}
            reset={timerReset}
            style={styles.headerText}
          />
        </View>
        <View style={{ alignItems: "center", flex: 2 }}>
          <Text style={styles.headerText}>Minesweeper</Text>
        </View>
        <View style={{ alignItems: "center", flex: 1 }}>
          <Text style={styles.headerText}>{mines - flaggedCells}</Text>
        </View>
      </View>
      <View style={styles.board}>
        <FlatList
          data={board}
          renderItem={renderCell}
          numColumns={columns}
          keyExtractor={(_, index) => index.toString()}
          updateCellsBatchingPeriod={10}
          getItemLayout={getItemLayout}
        />
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
  board: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});

export default Board;
