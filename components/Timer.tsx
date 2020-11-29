import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { displayTime } from "../utils/time";

interface TimerProps {
  start: boolean;
  reset: boolean;
  style: { fontSize: number };
}

const Timer = (props: TimerProps) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (props.start) {
      const timer = setInterval(
        () => setSeconds((seconds) => seconds + 1),
        1000
      );
      return () => clearInterval(timer);
    }
  }, [props.start]);

  useEffect(() => {
    if (props.reset) setSeconds(0);
  }, [props.reset]);

  return <Text style={props.style}>{displayTime(seconds)}</Text>;
};

export default Timer;
