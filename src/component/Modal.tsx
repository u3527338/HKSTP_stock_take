import * as React from "react";
import { Button } from "./Button";
import Center from "./Center";

const css = `
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width:100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        z-index: 999;
    }
    .modal-main {
        position:fixed;
        background: white;
        border-radius: 8px;
        padding: 20px;
        height: 70%;
        width: 90%;
        overflow: auto;
    }
    .modal-cart {
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
    }
    .display-block {
        display: block;
    }
    .display-none {
        display: none;
    }
`;

interface CodeProps {
  hideModal: any;
  open: boolean;
  showButton?: boolean;
}

export class Modal extends React.Component<CodeProps> {
  constructor(props, context) {
    super(props, context);
  }

  async componentWillMount() {}

  render() {
    const { open, hideModal, showButton = true, children } = this.props;

    const handleModalClick = (e) => {
      if (e.target.classList.contains("modal") && open) {
        hideModal();
      }
    };

    return (
      <div>
        <style>{css}</style>
        <div
          // onMouseDown={handleModalClick}
          className={open ? "modal display-block" : "modal display-none"}
        >
          <section
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              zIndex: 1,
            }}
            className="modal-main modal-cart"
          >
            <div>{children}</div>
            {showButton && (
              <Center>
                <Button onClick={hideModal} label="Close" buttonStyle="main" />
              </Center>
            )}
          </section>
        </div>
      </div>
    );
  }
}
