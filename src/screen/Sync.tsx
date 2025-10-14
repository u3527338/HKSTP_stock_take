import * as React from "react";
import { Button } from "../component/Button";
import ButtonGroup from "../component/ButtonGroup";
import Table from "../component/Table";
import {
  AppMode,
  getBoolStatus,
  getDateTime,
  getFromStorage,
  updateSyncStatus
} from "../function/helper";
import { useContext } from "../hook/useContext";

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
    const STOCK_TAKE_DATA = getFromStorage("STOCK_TAKE_DATA");
    this.state = {
      data: STOCK_TAKE_DATA,
      syncData: [],
    };
  }

  updateSyncList = (dataToSync: any[]) => {
    updateSyncStatus(dataToSync);
    const locationData = getFromStorage("STOCK_TAKE_DATA");
    this.setState({ data: locationData });
  };

  render() {
    const { context } = this.props;
    const { data, syncData } = this.state;
    const { setAppMode, setConfig } = useContext(context);

    const syncStockTakeList = (all: boolean = false) => {
      const stockTakeData = getFromStorage("CREATE_STOCK_TAKE", "object");
      const selectedDataToSync = syncData.map((s) => s.Stort);
      const n_sheet = Object.entries(stockTakeData).map(
        ([key, value]) => value
      );
      const filtered_n_sheet = n_sheet.filter((sheet: any) =>
        selectedDataToSync.includes(sheet.Stort)
      );
      const body = {
        countid: "",
        n_errmsg: "",
        n_sheet: all ? n_sheet : filtered_n_sheet,
      };
      console.log(body);
      this.updateSyncList(all ? data : syncData);
      setConfig({ lastSync: getDateTime() });
    };

    const columns = [
      { title: "Location", field: "Stort" },
      {
        title: "Location Description",
        field: "Ktext",
        responsive: 2,
        minWidth: 250,
      },
      { title: "Scanned", field: "Scanned" },
      { title: "Total Item", field: "ScanQty" },
      { title: "Synced", field: "Synced" },
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
        disabled: data.length === 0,
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
            Synced: getBoolStatus(d.Synced),
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
