import * as React from "react";
import { LoadingSpinner } from "./LoadingSpinner";

export const LoadingOverlay = ({ context, height = 400 }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      <LoadingSpinner context={context} height={height} />
    </div>
  );
};
