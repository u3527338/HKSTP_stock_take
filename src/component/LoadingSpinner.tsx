import * as React from "react";
import { MODULE_COMMON } from "../constants";

export const LoadingSpinner = ({ context, height = 400 }) => {
  const common = context.modules[MODULE_COMMON];
  const { AkSpin } = common;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: `${height}px`,
      }}
    >
      <AkSpin spinning={true} />
    </div>
  );
};
