import * as React from "react";
import { LoadingSpinner } from "./LoadingSpinner";

const css = (loading) => `    
  .pagecraftform {
    opacity: ${loading ? "0.5" : "1"}
  }
`;

export const LoadingOverlay = ({ context, height = 400, loading = false }) => {
  if (!loading) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // backgroundColor: "rgba(0, 0, 0, 0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      <style>{css(loading)}</style>
      <LoadingSpinner context={context} height={height} />
    </div>
  );
};
