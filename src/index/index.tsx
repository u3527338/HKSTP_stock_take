import * as React from "react";
import DisplayControl from "../component/DisplayControl";
import Text from "../component/Text";
import ToastProvider from "../component/ToastProvider";
import { COLOR_MAIN } from "../constants";
import {
  addCameraPermissionListener,
  AppMode,
  getCurrentUser,
} from "../function/helper";
import { useContext } from "../hook/useContext";
import Download from "../screen/Download";
import Menu from "../screen/Menu";
import StockTake from "../screen/StockTake";
import Sync from "../screen/Sync";

export const css = `
  .no-display {
    display: none !important;
  }

  .app-title {
    color: ${COLOR_MAIN} !important;
    margin-bottom: 8px !important;
    text-decoration: underline !important;
  }
`;

export const resourcesToLoad = [
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
  {
    type: "script",
    id: "xlsx",
    src: "https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js",
  },
];

interface Props {
  context: CodeInContext;
}

class Application extends React.Component<Props, {}> {
  constructor(props, context) {
    super(props, context);
  }

  componentWillMount(): void {
    const { setAppMode } = useContext(this.props.context);
    setAppMode(AppMode.MENU);
  }

  componentDidMount(): void {
    addCameraPermissionListener();
  }

  componentWillUnmount(): void {
    addCameraPermissionListener(false);
  }

  render() {
    const { context } = this.props;
    const { getAppMode, getConfig } = useContext(context);

    return (
      <div>
        <DisplayControl />
        <style>{css}</style>
        <div style={{ margin: "30px 0px" }}>
          {getAppMode === AppMode.MENU && <Menu context={context} />}
          {getAppMode === AppMode.DOWNLOAD && <Download context={context} />}
          {getAppMode === AppMode.STOCK_TAKE && <StockTake context={context} />}
          {getAppMode === AppMode.SYNC && <Sync context={context} />}
        </div>
        <div style={{ display: "inline-grid" }}>
          <Text>Email: {getCurrentUser(context).email}</Text>
          <Text>Last Sync Time: {getConfig()?.lastSync}</Text>
        </div>
      </div>
    );
  }
}

export class CodeInApplication implements CodeInComp {
  render(context: CodeInContext, fieldsValues: any, readonly: boolean) {
    return (
      <ToastProvider position="top-center">
        <Application context={context} />
      </ToastProvider>
    );
  }

  requiredFields() {
    return ["appMode", "config"];
  }

  inputParameters() {
    return [];
  }
}
