import * as React from "react";
import { AppMode, isItemScanned } from "../function/helper";
import { useContext } from "../hook/useContext";
import { Button } from "../component/Button";
import Table from "../component/Table";
import ButtonGroup from "../component/ButtonGroup";
import * as _ from "lodash";

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
    const LOCATION_DATA =
      JSON.parse(localStorage.getItem("LOCATION_DATA")) || [];
    this.state = {
      data: LOCATION_DATA,
      downloadData: [],
    };
  }

  updateDownloadedList = (dataToDownload: any[]) => {
    const { data } = this.state;
    const refreshData = data.map((d) => {
      const items = JSON.parse(localStorage.getItem("SHEET_DATA")) || [];
      const scannedItems: any[] = items.filter(
        (item) => item.Stort === d.Stort && isItemScanned(item.Status)
      );
      return {
        ...d,
        Scanned: scannedItems.length,
        Downloaded: dataToDownload.map((_d) => _d.Stort).includes(d.Stort),
      };
    });
    localStorage.setItem("LOCATION_DATA", JSON.stringify(refreshData));
    localStorage.setItem(
      "STOCK_TAKE_DATA",
      JSON.stringify(refreshData.filter((r) => r.Downloaded))
    );
    this.setState({ data: refreshData });
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
      { title: "Location Description", field: "Ktext" },
      { title: "Total Item", field: "ScanQty" },
      { title: "Status", field: "Status" },
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
          context={context}
          title="Download Stock Take List"
          data={data.map((d) => ({
            ...d,
            Status: d.Downloaded ? "Downloaded" : "Not Yet Downloaded",
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
