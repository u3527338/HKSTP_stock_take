import * as React from "react";
import { AppMode, getScannedCount } from "../function/helper";
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
  syncData: any[];
}

class Sync extends React.Component<Props, States> {
  constructor(props) {
    super(props);
    const LOCATION_DATA =
      JSON.parse(localStorage.getItem("LOCATION_DATA")) || [];
    this.state = {
      data: LOCATION_DATA,
      syncData: [],
    };
  }

  updateStockTakeList = (dataToSync: any[]) => {
    localStorage.setItem("STOCK_TAKE_DATA", JSON.stringify(dataToSync));
  };

  updateSyncList = (dataToSync: any[]) => {
    const { data } = this.state;
    const refreshData = data.map((d) => ({
      ...d,
      Scanned: 0,
      Synced: dataToSync.map((_d) => _d.Stort).includes(d.Stort),
    }));
    localStorage.setItem("LOCATION_DATA", JSON.stringify(refreshData));
    this.setState({ data: refreshData });
  };

  render() {
    const { context } = this.props;
    const { data, syncData } = this.state;
    const { setAppMode } = useContext(context);

    const syncStockTakeList = (all: boolean = false) => {
      const data = JSON.parse(localStorage.getItem("CREATE_STOCK_TAKE")) || {};
      const n_sheet = Object.entries(data).map(([key, value]) => value);
      const selectedDataToSync = syncData.map((s) => s.Stort);
      const filtered_n_sheet = n_sheet.filter((sheet: any) =>
        selectedDataToSync.includes(sheet.Stort)
      );
      const body = {
        countid: "",
        n_errmsg: "",
        n_sheet: all ? n_sheet : filtered_n_sheet,
      };
      console.log(body);
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
      sync_all: {
        label: "Sync All",
        onClick: () => {
          syncStockTakeList(true);
        },
        disabled: false,
      },
      sync: {
        label: "Sync",
        onClick: () => {
          syncStockTakeList();
        },
        disabled: !syncData.length,
      },
    };

    const onRowSelected = (data) => {
      this.setState({ syncData: data });
    };

    return (
      <div>
        <Table
          id="sync"
          context={context}
          title="Sync Stock Take Result"
          data={data.map((d) => ({
            ...d,
            Status: d.Synced ? "Synced" : "Not Yet Synced",
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

export default Sync;
