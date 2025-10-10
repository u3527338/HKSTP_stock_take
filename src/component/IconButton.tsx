import * as React from "react";
import { BUTTON_ICON } from "../constants";

export const IconButton = ({
  icon,
  disabled = false,
  loading = false,
  onClick = () => {},
  className = "",
  buttonStyle = null,
  style = null,
  size = 16,
  color = null,
}) => {
  const combinedClassName = `${
    disabled || buttonStyle ? "" : "icon-button"
  } ${className}`.trim();

  const loadingAnimationStyle = loading
    ? { animation: "spin 1s linear infinite" }
    : {};

  return (
    <div
      style={{
        cursor: disabled ? "auto" : "pointer",
        width: "fit-content",
        opacity: disabled ? 0.5 : 1,
        ...buttonStyle,
      }}
      onClick={() => {
        if (disabled) return;
        onClick();
      }}
    >
      <i
        className={`${
          loading ? BUTTON_ICON.LOADING : icon
        } ${combinedClassName}`}
        style={{
          ...loadingAnimationStyle,
          ...style,
          fontSize: size,
          color,
        }}
      />
    </div>
  );
};
