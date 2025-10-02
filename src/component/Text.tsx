import * as React from "react";
import { COLOR_MAIN } from "../constants";

const Text = ({ bold = false, children }) => {
  return (
    <span style={{ color: COLOR_MAIN, fontWeight: bold ? "bold" : "unset" }}>
      {children}
    </span>
  );
};

export default Text;
