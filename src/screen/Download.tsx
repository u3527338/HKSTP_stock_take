import * as _ from "lodash";
import * as React from "react";
import { Button } from "../component/Button";
import ButtonGroup from "../component/ButtonGroup";
import Table from "../component/Table";
import {
  AppMode,
  getBoolStatus,
  getFromStorage,
  updateDownloadStatus,
  updateScanStatus,
} from "../function/helper";
import { useContext } from "../hook/useContext";

interface Props {
  context: CodeInContext;
}

interface States {
  data: any[];
  downloadData: any[];
}

class Download extends React.Component<Props, States> {
  constructor(props) {
    super(props);
    const LOCATION_DATA = getFromStorage("LOCATION_DATA");
    this.state = {
      data: LOCATION_DATA,
      downloadData: [],
    };
  }

  updateDownloadedList = (dataToDownload: any[]) => {
    updateDownloadStatus(dataToDownload);
    updateScanStatus();
    const locationData = getFromStorage("LOCATION_DATA");
    this.setState({ data: locationData });
  };

  render() {
    const { context } = this.props;
    const { data, downloadData } = this.state;
    const { setAppMode } = useContext(context);
    const downloadStockTakeList = (all: boolean) => {
      const dataToDownload = all
        ? data
        : _.intersectionBy(data, downloadData, "Stort");
      this.updateDownloadedList(dataToDownload);
    };

    const columns = [
      { title: "Location", field: "Stort" },
      {
        title: "Location Description",
        field: "Ktext",
        responsive: 2,
        minWidth: 250,
      },
      { title: "Total Item", field: "ScanQty" },
      { title: "Downloaded", field: "Downloaded" },
    ];

    const buttons = {
      back: {
        label: "Back",
        onClick: () => {
          setAppMode(AppMode.MENU);
        },
        disabled: false,
      },
      download_all: {
        label: "Download All",
        onClick: () => {
          downloadStockTakeList(true);
        },
        disabled: false,
      },
      download: {
        label: "Download",
        onClick: () => {
          downloadStockTakeList(false);
        },
        disabled: !downloadData.length,
      },
    };

    const onRowSelected = (data) => {
      this.setState({ downloadData: data });
    };

    return (
      <div>
        <Table
          id="download"
          context={context}
          title="Download Stock Take List"
          data={data.map((d) => ({
            ...d,
            Downloaded: getBoolStatus(d.Downloaded),
          }))}
          columns={columns}
          onRowSelected={onRowSelected}
        />
        <ButtonGroup>
          {Object.entries(buttons).map(([key, value]) => (
            <Button
              key={key}
              label={value.label}
              onClick={value.onClick}
              buttonStyle="main"
              disabled={value.disabled}
            />
          ))}
        </ButtonGroup>
      </div>
    );
  }
}

export default Download;
