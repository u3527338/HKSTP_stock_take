import * as React from "react";
import Download from "../screen/Download";
import Menu from "../screen/Menu";
import StockTake from "../screen/StockTake";
import Sync from "../screen/Sync";
import { LOCATION_DATA, SHEET_DATA } from "../constants";
import { AppMode, loadResources } from "../function/helper";
import { useContext } from "../hook/useContext";
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
    const { setAppMode } = useContext(this.props.context);
    loadResources(resourcesToLoad).then(() => {
      this.setState({ loadScript: true });
      setAppMode(AppMode.MENU);
      if (!localStorage.getItem("LOCATION_DATA")) {
        localStorage.setItem(
          "LOCATION_DATA",
          JSON.stringify(
            LOCATION_DATA.StockTakeLocationSet.StockTakeLocation.map((l) => ({
              ...l,
              Downloaded: false,
            }))
          )
        );
      }
      if (!localStorage.getItem("SHEET_DATA")) {
        localStorage.setItem(
          "SHEET_DATA",
          JSON.stringify(SHEET_DATA.StockTakeSheetSet.StockTakeSheet)
        );
      }
    });
  }

  componentDidMount(): void {
    const { getToken, getLocation } = useHttpRequest(this.props.context);
    const fetchToken = async () => {
      const response = await getToken();
      console.log(response);
    };
    const fetchLocation = async () => {
      const response = await getLocation();
    };
    fetchToken();
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
        {getAppMode === AppMode.SYNC && <Sync context={context} />}
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
