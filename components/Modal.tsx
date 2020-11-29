import { ReactElement } from "react";
import { Platform } from "react-native";

export default Platform.OS !== "web"
  ? require("react-native").Modal
  : require("./WebModal").default;
