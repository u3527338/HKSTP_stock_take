import * as React from "react";
import BarcodeScanner from "../component/BarcodeScanner";

interface States {
  msg: string;
}

class Application extends React.Component<{}, States> {
  constructor(props, context) {
    super(props, context);
    this.state = {
      msg: null,
    };
  }

  render() {
    const { msg } = this.state;
    return (
      <div>
        <span>Scanner</span>
        {msg && (
          <div>
            <span>{msg}</span>
          </div>
        )}
        <BarcodeScanner
          callback={(msg) => {
            this.setState({ msg });
          }}
        />
      </div>
    );
  }
}

export class CodeInApplication implements CodeInComp {
  render(context: CodeInContext, fieldsValues: any, readonly: boolean) {
    return <Application />;
  }

  requiredFields() {
    return [];
  }

  inputParameters() {
    return [];
  }
}
