import * as React from "react";

const secretKeywords = ["hide sesame", "show sesame"];

class DisplayControl extends React.Component {
  inputBuffer: string = "";

  constructor(props) {
    super(props);
    this.inputBuffer = "";
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleKeyDown(event) {
    this.inputBuffer += event.key.toLowerCase();

    for (const keyword of secretKeywords) {
      if (this.inputBuffer.length > keyword.length) {
        this.inputBuffer = this.inputBuffer.slice(-keyword.length);
      }

      if (this.inputBuffer === keyword) {
        this.setVisible(keyword.includes("hide") ? false : true);
        this.inputBuffer = "";
        break;
      }
    }
  }

  setVisible = (visible: boolean) => {
    const header = document.querySelector(".listset-form-header");
    const footer = document.querySelector(".ak-listset-new-navigation-mobile");
    if (visible) {
      if (header) header.classList.remove("no-display");
      if (footer) footer.classList.remove("no-display");
    } else {
      if (header) header.classList.add("no-display");
      if (footer) footer.classList.add("no-display");
    }
  };

  componentDidMount() {
    this.setVisible(false);
    window.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    this.setVisible(true);
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  render() {
    return <div></div>;
  }
}

export default DisplayControl;
