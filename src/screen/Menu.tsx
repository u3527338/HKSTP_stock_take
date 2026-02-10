import * as React from "react";
import { Button } from "../component/Button";
import ButtonGroup from "../component/ButtonGroup";
import Center from "../component/Center";
import { LoadingOverlay } from "../component/LoadingOverlay";
import { Modal } from "../component/Modal";
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
  open: boolean;
}

class Menu extends React.Component<Props, States> {
  constructor(props, context) {
    super(props, context);
    this.state = { loading: false, loadScript: false, open: false };
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
    const { loadScript, loading, open } = this.state;
    const { setAppMode } = useContext(context);

    const closeConfirmDialog = () => {
      this.setState({ open: false });
    };

    const resetData = () => {
      closeConfirmDialog();
      resetApp(context);
      this.fetchData();
    };

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
              ),
            )}
            <Button
              label="Reset Data"
              onClick={() => {
                this.setState({ open: true });
              }}
              buttonStyle="main"
              style={{ width: "100%" }}
            />
          </ButtonGroup>
        </Center>
        <Modal
          open={open}
          hideModal={closeConfirmDialog}
          showButton={false}
          containerStyle={{ height: "fit-content", width: "fit-content" }}
        >
          <Center style={{ paddingBottom: 12 }}>
            <strong style={{ fontSize: 16, color: "red" }}>
              It will clear all your stock take input.
              <br />
              Are you sure you want to reset?
            </strong>
          </Center>
          <Center style={{ gap: 16 }}>
            <Button
              onClick={closeConfirmDialog}
              label="Close"
              buttonStyle="main"
            />
            <Button onClick={resetData} label="Confirm" buttonStyle="main" />
          </Center>
        </Modal>
      </div>
    );
  }
}

export default Menu;
