import * as React from "react";
import { View, Image, StyleSheet, Pressable } from "react-native";

import { CellState } from "../types";

interface CellProps {
  value: "mine" | number;
  state: CellState;
  gameOver: boolean;
  onLeftClick: () => void;
  onRightClick: () => void;
}

const Cell = (props: CellProps) => {
  const [cellPressed, setCellPressed] = React.useState(false);
  const handleClick = (longClick: boolean) => () => {
    // No action possible if the game is over
    if (props.gameOver) return;

    if (longClick) {
      // Flag click
      if (props.state === CellState.FLAGGED || props.state === CellState.HIDDEN)
        props.onRightClick();
    } else {
      // Reveal click
      if (props.state === CellState.HIDDEN) props.onLeftClick();
    }
  };

  if (!props.gameOver) {
    // Normal render
    switch (props.state) {
      case CellState.FLAGGED:
        return (
          <View style={styles.cell}>
            <Image style={styles.icon} source={require("../assets/flag.png")} />
          </View>
        );
      case CellState.REVEALED:
        return (
          <View style={StyleSheet.compose(styles.cell, styles.revealed)}>
            {props.value > 0 && props.value}
          </View>
        );
      case CellState.HIDDEN:
      default:
        return (
          <Pressable
            onPressIn={() => setCellPressed(true)}
            onPressOut={() => setCellPressed(false)}
            onPress={() => console.log("test")}
          >
            <View
              style={
                cellPressed
                  ? StyleSheet.compose(styles.cell, styles.pressed)
                  : styles.cell
              }
            />
          </Pressable>
        );
    }
  } else {
    // Endgame render
    // When the game is over, correct flags stay, incorrect flags are marked as "errors"
    // and remaining mines are revealed
    switch (props.state) {
      case CellState.FLAGGED:
        if (props.value === "mine") {
          return (
            <View style={styles.cell}>
              <Image
                style={styles.icon}
                source={require("../assets/flag.png")}
              />
            </View>
          );
        } else {
          return (
            <View
              style={StyleSheet.compose(
                StyleSheet.compose(styles.cell, styles.revealed),
                styles.error
              )}
            >
              <Image
                style={styles.icon}
                source={require("../assets/error.png")}
              />
            </View>
          );
        }
      case CellState.EXPLODED:
        return (
          <View
            style={StyleSheet.compose(
              StyleSheet.compose(styles.cell, styles.revealed),
              styles.exploded
            )}
          >
            <Image style={styles.icon} source={require("../assets/mine.png")} />
          </View>
        );
      case CellState.REVEALED:
        return (
          <View style={StyleSheet.compose(styles.cell, styles.revealed)}>
            {props.value > 0 && props.value}
          </View>
        );
      case CellState.HIDDEN:
      default:
        if (props.value === "mine") {
          return (
            <View
              style={StyleSheet.compose(
                StyleSheet.compose(styles.cell, styles.revealed),
                styles.exploded
              )}
            >
              <Image
                style={styles.icon}
                source={require("../assets/mine.png")}
              />
            </View>
          );
        } else {
          return <View style={styles.cell} />;
        }
    }
  }
};

const styles = StyleSheet.create({
  cell: {
    width: 35,
    maxWidth: 35,
    height: 35,
    maxHeight: 35,
    fontSize: 30,
    backgroundColor: "#3fd5f0",
    borderTopColor: "white",
    borderBottomColor: "grey",
    borderLeftColor: "white",
    borderRightColor: "grey",
    borderWidth: 4,
    textAlign: "center",
    padding: 0,
    color: "white",
    textAlignVertical: "center",
  },
  pressed: {
    borderTopColor: "grey",
    borderLeftColor: "grey",
    padding: 4,
    borderWidth: 1,
  },
  revealed: {
    width: 35,
    maxWidth: 35,
    height: 35,
    maxHeight: 35,
    backgroundColor: "#3fd5f0",
    borderTopColor: "grey",
    borderLeftColor: "grey",
    padding: 4,
    borderWidth: 1,
  },
  exploded: {
    backgroundColor: "#ff0000",
  },
  error: {
    padding: 0,
    width: 43,
    maxWidth: 43,
    height: 43,
    maxHeight: 43,
  },
  icon: {
    height: "100%",
    width: "100%",
  },
});

export default Cell;
