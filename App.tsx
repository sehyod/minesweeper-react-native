import React from "react";
import { Platform, StyleSheet, StatusBar, View } from "react-native";
import Board from "./components/Board";

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.statusBar}>
        <StatusBar translucent barStyle="light-content" />
      </View>
      <Board />
    </View>
  );
}

const STATUSBAR_HEIGHT = Platform.OS === "ios" ? 20 : StatusBar.currentHeight;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
});
