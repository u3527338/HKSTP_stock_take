import * as React from "react";
import { AppMode } from "../function/helper";
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

    const syncStockTakeList = (all: boolean) => {
      const dataToSync = all ? data : _.intersectionBy(data, syncData, "Stort");
      this.updateStockTakeList(dataToSync);
      this.updateSyncList(dataToSync);
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
          console.log("sync all");
        },
        disabled: false,
      },
      sync: {
        label: "Sync",
        onClick: () => {
          console.log("sync");
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
