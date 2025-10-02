import * as React from "react";
import { COLOR_MAIN } from "../constants";

const Text = ({ children }) => {
  return <span style={{ color: COLOR_MAIN }}>{children}</span>;
};

export default Text;
