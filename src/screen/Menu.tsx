import * as React from "react";
import { Button } from "../component/Button";
import ButtonGroup from "../component/ButtonGroup";
import Center from "../component/Center";
import { LoadingOverlay } from "../component/LoadingOverlay";
import Title from "../component/Title";
import {
  AppMode,
  fetchInfo,
  loadResources,
  resetApp,
} from "../function/helper";
import { useContext } from "../hook/useContext";
import { resourcesToLoad } from "../index";

const MenuButtons = {
  [AppMode.DOWNLOAD]: { label: "Download Stock Take List" },
  [AppMode.STOCK_TAKE]: { label: "Stock Take" },
  [AppMode.SYNC]: { label: "Sync Stock Take Result" },
};

interface Props {
  context: CodeInContext;
}

interface States {
  loading: boolean;
  loadScript: boolean;
}

class Menu extends React.Component<Props, States> {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: false,
      loadScript: false,
    };
  }

  fetchData = () => {
    fetchInfo(this.props.context, (loading) => {
      this.setState({ loading });
    });
  };

  componentWillMount(): void {
    loadResources(resourcesToLoad).then(() => {
      this.setState({ loadScript: true });
    });
  }

  componentDidMount(): void {
    this.fetchData();
  }

  render() {
    const { context } = this.props;
    const { loadScript, loading } = this.state;
    const { setAppMode } = useContext(context);

    return (
      <div>
        <LoadingOverlay context={context} loading={!loadScript || loading} />
        <Center style={{ flexDirection: "column" }}>
          <Title title="Stock Take Application" style={{ fontSize: "24px" }} />
          <ButtonGroup style={{ flexDirection: "column" }}>
            {Object.entries(MenuButtons).map(
              ([key, value]: [AppMode, { label: string }]) => (
                <Button
                  key={key}
                  label={value.label}
                  onClick={() => {
                    setAppMode(key);
                  }}
                  buttonStyle="main"
                  style={{ width: "100%" }}
                />
              )
            )}
            <Button
              label="Reset Data"
              onClick={() => {
                resetApp(context);
                this.fetchData();
              }}
              buttonStyle="main"
              style={{ width: "100%" }}
            />
          </ButtonGroup>
        </Center>
      </div>
    );
  }
}

export default Menu;
