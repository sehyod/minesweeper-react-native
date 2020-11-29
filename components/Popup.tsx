import React, { useEffect, useRef } from "react";
import {
  Animated,
  Button,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

interface PopupProps {
  visible: boolean;
  text: string;
  onReset: () => void;
}

const Popup = (props: PopupProps) => {
  const windowsHeight = useWindowDimensions().height;

  const easeOut = useRef(new Animated.Value(windowsHeight / 2)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (props.visible) {
      Animated.sequence([
        Animated.timing(easeOut, {
          toValue: 0,
          duration: 1000,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1.4,
          duration: 250,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 250,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [props.visible]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.popup,
          {
            transform: [
              {
                translateY: easeOut,
              },
              {
                scale,
              },
            ],
          },
        ]}
      >
        <Text style={styles.text}>{props.text}</Text>
        <TouchableOpacity onPress={props.onReset}>
          <View>
            <Text style={styles.button}>Retry</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    backgroundColor: "white",
    width: "80%",
    borderRadius: 10,
    padding: 30,
  },
  text: { fontSize: 25, textAlign: "center", marginBottom: 40 },
  button: {
    fontSize: 20,
    textAlign: "center",
    backgroundColor: "#3fd5f0",
    borderRadius: 50,
    color: "white",
    padding: 10,
  },
});

export default Popup;
