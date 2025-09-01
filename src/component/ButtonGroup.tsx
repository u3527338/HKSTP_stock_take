import * as React from "react";

const ButtonGroup = ({ children, style = {} }) => {
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        justifyContent: "flex-end",
        margin: "8px 0px",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default ButtonGroup;
