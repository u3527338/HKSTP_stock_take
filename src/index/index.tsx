import * as React from "react";
import BarcodeScanner from "../component/BarcodeScanner";
import { Button } from "../component/Button";
import Table from "../component/Table";
import { DATA } from "../constants";
import { loadResources, useState } from "../function/helper";
import { useHttpRequest } from "../hook/useHttpRequest";

const resourcesToLoad = [
  {
    type: "style",
    id: "tabulator-css",
    href: "https://cdn.jsdelivr.net/npm/tabulator-tables@5.4/dist/css/tabulator.min.css",
  },
  {
    type: "script",
    id: "tabulator",
    src: "https://cdn.jsdelivr.net/npm/tabulator-tables@5.4/dist/js/tabulator.min.js",
  },
  {
    type: "script",
    id: "html5-qrcode",
    src: "https://unpkg.com/html5-qrcode@2.0.6/dist/html5-qrcode.min.js",
  },
];

interface Props {
  context: CodeInContext;
}

interface States {
  loadScript: boolean;
  msg: string;
  open: boolean;
}

class Application extends React.Component<Props, States> {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loadScript: false,
      msg: null,
      open: false,
    };
  }

  componentWillMount(): void {
    loadResources(resourcesToLoad).then(() => {
      this.setState({ loadScript: true });
    });
  }

  componentDidMount(): void {
    const { getToken } = useHttpRequest(this.props.context);
    // const fetchToken = async () => {
    //   const response = await getToken();
    //   console.log(response);
    // };
    // fetchToken();
  }

  render() {
    const { context } = this.props;
    const [loadScript, setLoadScript] = useState(this, "loadScript");
    const [msg, setMsg] = useState(this, "msg");
    const [open, setOpen] = useState(this, "open");

    const handleCode = (msg) => {
      setMsg(msg);
      setOpen(false);
    };
    const columns = [
      { title: "Location", field: "Stort" },
      { title: "Location Description", field: "Ktext" },
      { title: "Scanned", field: "Scanned" },
      { title: "Total Item", field: "ScanQty" },
    ];

    if (!loadScript) return <div></div>;
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
        <Table
          context={context}
          data={DATA.StockTakeSheetSet.StockTakeSheet.map((d) => ({
            ...d,
            Scanned: 0,
          }))}
          columns={columns}
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
    return <Application context={context} />;
  }

  requiredFields() {
    return [];
  }

  inputParameters() {
    return [];
  }
}
