import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Cell from "./components/Cell";
import { CellState } from "./types";

export default function App() {
  return (
    <View style={styles.container}>
      <Cell
        value={3}
        state={CellState.HIDDEN}
        gameOver={false}
        onLeftClick={() => null}
        onRightClick={() => null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
