import * as React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { BUTTON_ICON } from "../constants";
import { IconButton } from "./IconButton";

let toastQueue = [];

export const enqueueToast = (message, type) => {
  toastQueue.push({ message, type });
};

export const flushToastQueue = (addToast) => {
  toastQueue.forEach(({ message, type }) => {
    addToast(message, type);
  });
  toastQueue = [];
};

type ToastType = "success" | "info" | "error";
type Position =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

interface ToastProviderProps {
  position?: Position;
}

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

const styles = (position: Position) => `
.toast-enter {
  opacity: 0;
  transform: translateY(${position.startsWith("top") ? "-20" : "20"}px);
}
.toast-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 300ms, transform 300ms;
}
.toast-exit {
  opacity: 1;
  transform: translateY(0);
}
.toast-exit-active {
  opacity: 0;
  transform: translateY(${position.startsWith("top") ? "-20" : "20"}px);
  transition: opacity 300ms, transform 300ms;
}
`;

const getContainerStyle = (position: Position): React.CSSProperties => {
  const style: React.CSSProperties = {
    position: "fixed",
    zIndex: 9999,
  };

  switch (position) {
    case "top-left":
      style.top = 20;
      style.left = 20;
      break;
    case "top-center":
      style.top = 20;
      style.left = "50%";
      style.transform = "translateX(-50%)";
      break;
    case "top-right":
      style.top = 20;
      style.right = 20;
      break;
    case "bottom-left":
      style.bottom = 20;
      style.left = 20;
      break;
    case "bottom-center":
      style.bottom = 20;
      style.left = "50%";
      style.transform = "translateX(-50%)";
      break;
    case "bottom-right":
      style.bottom = 20;
      style.right = 20;
      break;
    default:
      style.bottom = 20;
      style.left = 20;
  }
  return style;
};

class ToastProvider extends React.Component<
  ToastProviderProps,
  { toasts: Array<Toast> }
> {
  static instance: ToastProvider | null = null;
  private timeoutIds: { [key: number]: number } = {};
  static defaultProps = {
    position: "bottom-left",
  };

  constructor(props) {
    super(props);
    this.state = { toasts: [] };
    ToastProvider.instance = this;
  }

  addToast = (message: string, type: ToastType = "info") => {
    const id = Date.now() + Math.random();

    this.setState((prev) => ({
      toasts: [...prev.toasts, { id, message, type }],
    }));

    this.timeoutIds[id] = window.setTimeout(() => this.removeToast(id), 5000);
  };

  removeToast = (id: number) => {
    this.setState((prev) => ({
      toasts: prev.toasts.filter((t) => t.id !== id),
    }));
    clearTimeout(this.timeoutIds[id]);
    delete this.timeoutIds[id];
  };

  componentDidMount(): void {
    flushToastQueue(this.addToast);
  }

  componentWillUnmount() {
    Object.values(this.timeoutIds).forEach(clearTimeout);
  }

  getBgColor = (type: ToastType) => {
    switch (type) {
      case "success":
        return "#2ecc71";
      case "error":
        return "#e74c3c";
      case "info":
        return "#d1bc33";
      default:
        return "#333";
    }
  };

  render() {
    const { position } = this.props;
    const containerStyle = getContainerStyle(position || "bottom-left");
    return (
      <div style={containerStyle}>
        <style>{styles(position)}</style>
        <TransitionGroup>
          {this.state.toasts.map((t) => (
            <CSSTransition key={t.id} timeout={300} classNames="toast">
              <div
                style={{
                  display: "flex",
                  padding: "12px 16px",
                  borderRadius: "4px",
                  backgroundColor: this.getBgColor(t.type),
                  color: "white",
                  marginBottom: "10px",
                  gap: "20px",
                }}
              >
                {t.message}
                <IconButton
                  icon={BUTTON_ICON.REMOVE}
                  onClick={() => this.removeToast(t.id)}
                />
              </div>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
    );
  }
}

export const showToast = (msg: string, type: ToastType = "info") => {
  const message =
    typeof msg === "string" ? msg ?? "Server Error" : "Server Error";
  if (ToastProvider.instance) {
    ToastProvider.instance.addToast(message, type);
  } else {
    enqueueToast(message, type);
    console.warn("ToastProvider is not mounted yet.");
  }
};

export default ToastProvider;
