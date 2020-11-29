import * as React from "react";
import { View, Image, StyleSheet, Pressable, Text } from "react-native";

import { CellState } from "../types";

interface CellProps {
  value: "mine" | number;
  state: CellState;
  won: boolean;
  exploded: boolean;
  onLeftClick: () => void;
  onRightClick: () => void;
}

const Cell = (props: CellProps) => {
  const [cellPressed, setCellPressed] = React.useState(false);

  const gameOver = props.won || props.exploded;

  const handleClick = (longClick: boolean) => () => {
    setCellPressed(false);
    // No action possible if the game is over
    if (gameOver) return;

    if (longClick) {
      // Flag click
      if (props.state === CellState.FLAGGED || props.state === CellState.HIDDEN)
        props.onRightClick();
    } else {
      // Reveal click
      if (props.state === CellState.HIDDEN) props.onLeftClick();
    }
  };

  if (!gameOver) {
    // Normal render
    switch (props.state) {
      case CellState.FLAGGED:
        return (
          <Pressable onLongPress={handleClick(true)}>
            <View style={styles.cell}>
              <Image
                style={styles.icon}
                source={require("../assets/flag.png")}
              />
            </View>
          </Pressable>
        );
      case CellState.REVEALED:
        return (
          <View pointerEvents="none" style={[styles.cell, styles.revealed]}>
            <Text style={styles.value}>{props.value > 0 && props.value}</Text>
          </View>
        );
      case CellState.HIDDEN:
      default:
        return (
          <Pressable
            onPressIn={() => setCellPressed(true)}
            onPress={handleClick(false)}
            onLongPress={handleClick(true)}
          >
            <View
              style={cellPressed ? [styles.cell, styles.pressed] : styles.cell}
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
            <View style={[styles.cell, styles.revealed, styles.error]}>
              <Image
                style={styles.icon}
                source={require("../assets/error.png")}
              />
            </View>
          );
        }
      case CellState.EXPLODED:
        return (
          <View style={[styles.cell, styles.revealed, styles.exploded]}>
            <Image style={styles.icon} source={require("../assets/mine.png")} />
          </View>
        );
      case CellState.REVEALED:
        return (
          <View pointerEvents="none" style={[styles.cell, styles.revealed]}>
            <Text style={styles.value}>{props.value > 0 && props.value}</Text>
          </View>
        );
      case CellState.HIDDEN:
      default:
        if (props.value === "mine") {
          if (props.won)
            return (
              <View style={styles.cell}>
                <Image
                  style={styles.icon}
                  source={require("../assets/flag.png")}
                />
              </View>
            );
          return (
            <View style={[styles.cell, styles.revealed]}>
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
    backgroundColor: "#3fd5f0",
    borderTopColor: "white",
    borderBottomColor: "grey",
    borderLeftColor: "white",
    borderRightColor: "grey",
    borderWidth: 4,
    textAlign: "center",
    padding: 0,
  },
  pressed: {
    borderTopColor: "grey",
    borderLeftColor: "grey",
    padding: 4,
    borderWidth: 1,
  },
  revealed: {
    backgroundColor: "#3fd5f0",
    borderTopColor: "grey",
    borderLeftColor: "grey",
    padding: 4,
    borderWidth: 1,
    textAlignVertical: "center",
  },
  exploded: {
    backgroundColor: "#ff0000",
  },
  error: {
    padding: 0,
  },
  value: {
    height: "100%",
    width: "100%",
    color: "white",
    fontSize: 20,
    textAlign: "center",
  },
  icon: {
    height: "100%",
    width: "100%",
  },
});

export default Cell;
