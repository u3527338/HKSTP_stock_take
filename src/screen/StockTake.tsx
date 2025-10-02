import * as React from "react";
import { Button } from "../component/Button";
import ButtonGroup from "../component/ButtonGroup";
import ScanForm from "../component/ScanForm";
import Table from "../component/Table";
import { ITEM_STATUS } from "../constants";
import {
  AppMode,
  formatAssetSubNo,
  isItemScanned
} from "../function/helper";
import { useContext } from "../hook/useContext";

interface Props {
  context: CodeInContext;
}

interface States {
  data: any[];
  selectedLocation: any[];
  itemListData: any[];
  locationToScan: { location: string; scanQty: number; scanned: number };
}

class StockTake extends React.Component<Props, States> {
  constructor(props) {
    super(props);
    const STOCK_TAKE_DATA =
      JSON.parse(localStorage.getItem("STOCK_TAKE_DATA")) || [];
    this.state = {
      data: STOCK_TAKE_DATA,
      selectedLocation: [],
      itemListData: [],
      locationToScan: null,
    };
  }

  render() {
    const { context } = this.props;
    const { data, selectedLocation, itemListData, locationToScan } = this.state;
    const { setAppMode } = useContext(context);

    const columns = [
      { title: "Location", field: "Stort" },
      { title: "Location Description", field: "Ktext" },
      { title: "Scanned", field: "Scanned" },
      { title: "Total Item", field: "ScanQty" },
    ];
    const itemListColumns = [
      {
        title: "Asset No.",
        field: "AssetNo",
        formatter: (cell, params) => {
          const item = cell.getRow().getData();
          return `${item.Bukrs}-${item.Anln1}-${formatAssetSubNo(item.Anln2)}`;
        },
      },
      { title: "Inventory No.", field: "Invnr" },
      { title: "Description", field: "Txt50" },
      { title: "Remark", field: "Remark" },
      {
        title: "Status",
        field: "Status",
        formatter: (cell, params) => {
          const value = cell.getValue();
          return ITEM_STATUS[value];
        },
      },
      {
        title: "Scanned",
        field: "Scanned",
        formatter: (cell, params) => {
          const value = cell.getRow().getData().Status;
          return isItemScanned(value) ? "Yes" : "No";
        },
      },
      { title: "Last Saved", field: "LastSaved" },
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
        onClick: () => {
          const selectedLocation = this.state.selectedLocation[0];
          const sheetData = JSON.parse(localStorage.getItem("SHEET_DATA"));
          const itemListData = sheetData.filter(
            (sd) =>
              sd.Stort === selectedLocation.Stort &&
              sd.Ktext === selectedLocation.Ktext
          );
          this.setState({ itemListData });
        },
        disabled: !selectedLocation.length,
      },
      scan: {
        label: "Scan",
        onClick: () => {
          this.setState({
            locationToScan: {
              location: selectedLocation[0].Stort,
              scanQty: parseInt(selectedLocation[0].ScanQty),
              scanned: parseInt(selectedLocation[0].Scanned),
            },
          });
        },
        disabled: !selectedLocation.length,
      },
    };

    const itemListButtons = {
      back: {
        label: "Back",
        onClick: () => {
          this.setState({ itemListData: [], selectedLocation: [] });
        },
        disabled: false,
      },
    };

    const onRowSelected = (data) => {
      this.setState({ selectedLocation: data });
    };

    return (
      <div>
        {!locationToScan && (
          <div>
            {!itemListData.length && (
              <div>
                <Table
                  context={context}
                  title="Stock Take"
                  data={data}
                  columns={columns}
                  onRowSelected={onRowSelected}
                  multiRowSelection={false}
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
            )}
            {itemListData.length > 0 && (
              <div>
                <Table
                  context={context}
                  title="Stock Take - Item List"
                  data={itemListData}
                  columns={itemListColumns}
                  rowSelectable={false}
                />
                <ButtonGroup>
                  {Object.entries(itemListButtons).map(([key, value]) => (
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
            )}
          </div>
        )}
        {locationToScan && (
          <ScanForm
            key={locationToScan.location}
            locationToScan={locationToScan}
            onBack={() => {
              this.setState({ locationToScan: null });
            }}
          />
        )}
      </div>
    );
  }
}

export default StockTake;
