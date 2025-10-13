import * as React from "react";
import Text from "../component/Text";
import ToastProvider from "../component/ToastProvider";
import { COLOR_MAIN, LOCATION_DATA, SHEET_DATA } from "../constants";
import {
  addCameraPermissionListener,
  AppMode,
  generateUUID,
  getCurrentUser,
  getFromStorage,
  loadResources,
  setToStorage,
} from "../function/helper";
import { useContext } from "../hook/useContext";
import { useHttpRequest } from "../hook/useHttpRequest";
import Download from "../screen/Download";
import Menu from "../screen/Menu";
import StockTake from "../screen/StockTake";
import Sync from "../screen/Sync";

const css = `
  .no-display {
    display: none !important;
  }
    
  .akfc-form {
    background-color: lemonchiffon !important;
  }

  .app-title {
    color: ${COLOR_MAIN} !important;
    margin-bottom: 8px !important;
    text-decoration: underline !important;
  }
`;

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
        setToStorage(
          "LOCATION_DATA",
          LOCATION_DATA.StockTakeLocationSet.StockTakeLocation.map((l) => ({
            ...l,
            Downloaded: false,
          }))
        );
      }
      if (!localStorage.getItem("SHEET_DATA")) {
        setToStorage("SHEET_DATA", SHEET_DATA.StockTakeSheetSet.StockTakeSheet);
      }
    });
  }

  componentDidMount(): void {
    const { getInitInfo } = useHttpRequest(this.props.context);
    const fetchInfo = async () => {
      const response = await getInitInfo();
    };
    // fetchInfo();
    addCameraPermissionListener();
  }

  componentWillUnmount(): void {
    addCameraPermissionListener(false);
  }

  render() {
    const { context } = this.props;
    const { loadScript } = this.state;
    if (!loadScript) return <div></div>;
    const { getAppMode } = useContext(context);

    return (
      <div>
        {/* <DisplayControl /> */}
        <style>{css}</style>
        <div style={{ margin: "30px 0px" }}>
          {getAppMode === AppMode.MENU && <Menu context={context} />}
          {getAppMode === AppMode.DOWNLOAD && <Download context={context} />}
          {getAppMode === AppMode.STOCK_TAKE && <StockTake context={context} />}
          {getAppMode === AppMode.SYNC && <Sync context={context} />}
        </div>
        <div style={{ display: "inline-grid" }}>
          <Text>Email: {getCurrentUser(context).email}</Text>
          <Text>Last Sync Time: {getFromStorage("config")?.lastSync}</Text>
        </div>
      </div>
    );
  }
}

export class CodeInApplication implements CodeInComp {
  render(context: CodeInContext, fieldsValues: any, readonly: boolean) {
    return (
      <div>
        <Application context={context} />
        <ToastProvider position="top-center" />
      </div>
    );
  }

  requiredFields() {
    return ["appMode"];
  }

  inputParameters() {
    return [];
  }
}
