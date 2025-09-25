import * as React from "react";

class DisplayControl extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentWillMount() {
    const header = document.querySelector(".listset-form-header");
    const footer = document.querySelector(".ak-listset-new-navigation-mobile");
    if (!!header) header.classList.add("no-display");
    if (!!footer) footer.classList.add("no-display");
  }

  async componentWillUnmount() {
    const header = document.querySelector(".listset-form-header");
    const footer = document.querySelector(".ak-listset-new-navigation-mobile");
    if (!!header) header.classList.remove("no-display");
    if (!!footer) footer.classList.remove("no-display");
  }

  render() {
    return <div></div>;
  }
}

export default DisplayControl;
