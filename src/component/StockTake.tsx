import * as React from "react";
import { AppMode } from "../function/helper";
import { useContext } from "../hook/useContext";
import { Button } from "./Button";
import Table from "./Table";
import ButtonGroup from "./ButtonGroup";

interface Props {
  context: CodeInContext;
}

interface States {
  data: any[];
  selectedLocation: any[];
}

class StockTake extends React.Component<Props, States> {
  constructor(props) {
    super(props);
    const STOCK_TAKE_DATA =
      JSON.parse(localStorage.getItem("STOCK_TAKE_DATA")) || [];
    this.state = {
      data: STOCK_TAKE_DATA,
      selectedLocation: [],
    };
  }

  setData(newData) {
    this.setState({ data: newData });
  }

  render() {
    const { context } = this.props;
    const { data, selectedLocation } = this.state;
    const { setAppMode } = useContext(context);

    const columns = [
      { title: "Location", field: "Stort" },
      { title: "Location Description", field: "Ktext" },
      { title: "Scanned", field: "Scanned" },
      { title: "Total Item", field: "ScanQty" },
    ];

    const buttons = {
      back: {
        label: "Back",
        onClick: () => {
          setAppMode(AppMode.MENU);
        },
        disabled: false,
      },
      item_list: {
        label: "Item List",
        onClick: () => {},
        disabled: !selectedLocation.length,
      },
      scan: { label: "Scan", onClick: () => {}, disabled: false },
    };

    const onRowSelected = (data) => {
      this.setState({ selectedLocation: data });
    };

    return (
      <div>
        <Table
          context={context}
          data={data}
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

export default StockTake;
