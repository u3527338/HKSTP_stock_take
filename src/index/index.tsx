import * as React from "react";
import BarcodeScanner from "../component/BarcodeScanner";
import { useState } from "../function/helper";
import { Button } from "../component/Button";

interface States {
  msg: string;
  open: boolean;
}

class Application extends React.Component<{}, States> {
  constructor(props, context) {
    super(props, context);
    this.state = {
      msg: null,
      open: false,
    };
  }

  render() {
    const [msg, setMsg] = useState(this, "msg");
    const [open, setOpen] = useState(this, "open");

    const handleCode = (msg) => {
      setMsg(msg);
      setOpen(false);
    };

    return (
      <div>
        {msg && (
          <div>
            <span>{msg}</span>
          </div>
        )}
        <Button
          onClick={() => {
            setOpen(!open);
          }}
          label="Start Scan"
          buttonStyle="main"
        />
        <BarcodeScanner
          open={open}
          handleCloseScanner={() => {
            setOpen(false);
          }}
          callback={handleCode}
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
