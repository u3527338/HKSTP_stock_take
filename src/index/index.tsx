import * as React from "react";
import Download from "../component/Download";
import Menu from "../component/Menu";
import { AppMode, loadResources } from "../function/helper";
import { useContext } from "../hook/useContext";
import { useHttpRequest } from "../hook/useHttpRequest";
import { LOCATION_DATA, SHEET_DATA } from "../constants";
import StockTake from "../component/StockTake";

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
    const { setAppMode } = useContext(this.props.context);
    loadResources(resourcesToLoad).then(() => {
      this.setState({ loadScript: true });
      setAppMode(AppMode.MENU);
      localStorage.setItem(
        "LOCATION_DATA",
        JSON.stringify(
          LOCATION_DATA.StockTakeLocationSet.StockTakeLocation.map((l) => ({
            ...l,
            Downloaded: false,
          }))
        )
      );
      localStorage.setItem(
        "SHEET_DATA",
        JSON.stringify(SHEET_DATA.StockTakeSheetSet.StockTakeSheet)
      );
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

  componentWillUnmount(): void {}

  render() {
    const { context } = this.props;
    const { loadScript } = this.state;
    if (!loadScript) return <div></div>;
    const { getAppMode } = useContext(context);

    return (
      <div>
        {getAppMode === AppMode.MENU && <Menu context={context} />}
        {getAppMode === AppMode.DOWNLOAD && <Download context={context} />}
        {getAppMode === AppMode.STOCK_TAKE && <StockTake context={context} />}
      </div>
    );
  }
}

export class CodeInApplication implements CodeInComp {
  render(context: CodeInContext, fieldsValues: any, readonly: boolean) {
    return <Application context={context} />;
  }

  requiredFields() {
    return ["appMode"];
  }

  inputParameters() {
    return [];
  }
}
