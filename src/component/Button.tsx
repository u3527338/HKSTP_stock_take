import * as React from "react";
import { COLOR_MAIN } from "../constants";

const css = `
  .btn-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none; /* disables click events */
  }

  .main-btn-bg {
    background-color: ${COLOR_MAIN} !important;
  }
`;

export type BUTTON_STYLE = "main" | "minor";

export const Button = ({
  type = "button",
  buttonStyle,
  onClick,
  disabled = false,
  loading = false,
  label,
  icon,
  value,
  style,
}: {
  type?: string;
  buttonStyle: BUTTON_STYLE;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
  icon?: any;
  value?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <div>
      <style>{css}</style>
      <button
        type={type}
        style={{
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: 700,
          lineHeight: "16px",
          padding: "8px",
          ...style,
        }}
        disabled={disabled || loading}
        value={value}
        className={`${buttonStyle}-btn-bg ${disabled ? "btn-disabled" : ""}`}
        onClick={onClick}
      >
        {label || <i className={icon} />}
      </button>
    </div>
  );
};
