import * as React from "react";

const Center = ({ children, style = {} }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      ...style,
    }}
  >
    {children}
  </div>
);

export default Center;
