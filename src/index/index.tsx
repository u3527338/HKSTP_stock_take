import * as React from "react";
import { LoadingOverlay } from "../component/LoadingOverlay";
import Text from "../component/Text";
import ToastProvider, { showToast } from "../component/ToastProvider";
import { COLOR_MAIN } from "../constants";
import {
  addCameraPermissionListener,
  AppMode,
  getCurrentUser,
  loadResources,
  setToStorage,
} from "../function/helper";
import { useContext } from "../hook/useContext";
import { useHttpRequest } from "../hook/useHttpRequest";
import Download from "../screen/Download";
import Menu from "../screen/Menu";
import StockTake from "../screen/StockTake";
import Sync from "../screen/Sync";

const css = (loading) => `
  .no-display {
    display: none !important;
  }
    
  .akfc-form {
    background-color: lemonchiffon !important;
    opacity: ${loading ? "0.5" : "1"}
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
  loading: boolean;
  loadScript: boolean;
  msg: string;
  open: boolean;
}

class Application extends React.Component<Props, States> {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: false,
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
    });
  }

  componentDidMount(): void {
    const { getInitInfo } = useHttpRequest(this.props.context);
    const fetchInfo = async () => {
      if (
        !!localStorage.getItem("LOCATION_DATA") &&
        !!localStorage.getItem("SHEET_DATA")
      )
        return;
      this.setState({ loading: true });
      await getInitInfo()
        .then((response: { location; sheet; user }) => {
          if (!localStorage.getItem("LOCATION_DATA")) {
            setToStorage(
              "LOCATION_DATA",
              response.location.StockTakeLocationSet.StockTakeLocation.map(
                (l) => ({
                  ...l,
                  Downloaded: false,
                })
              )
            );
          }
          if (!localStorage.getItem("SHEET_DATA")) {
            setToStorage(
              "SHEET_DATA",
              response.sheet.StockTakeSheetSet.StockTakeSheet
            );
          }
          showToast("Finish fetching data", "success");
        })
        .catch((res) => {
          showToast("Error fetching data", "error");
        })
        .finally(() => {
          this.setState({ loading: false });
        });
    };
    fetchInfo();
    addCameraPermissionListener();
  }

  componentWillUnmount(): void {
    addCameraPermissionListener(false);
  }

  render() {
    const { context } = this.props;
    const { loadScript, loading } = this.state;
    const { getAppMode, getConfig } = useContext(context);

    return (
      <div>
        {/* <DisplayControl /> */}
        <style>{css(loading)}</style>
        {(!loadScript || loading) && <LoadingOverlay context={context} />}
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
