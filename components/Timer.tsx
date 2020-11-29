import React, { useEffect, useState } from "react";
import { Text } from "react-native";

interface TimerProps {
  start: boolean;
  style: { fontSize: number };
}

const Timer = (props: TimerProps) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (props.start) {
      setSeconds(0);
      const timer = setInterval(
        () => setSeconds((seconds) => seconds + 1),
        1000
      );
      return () => clearInterval(timer);
    }
  }, [props.start]);

  return <Text style={props.style}>{seconds}</Text>;
};

export default Timer;
