import * as _ from "lodash";
import * as React from "react";
import { Button } from "../component/Button";
import ButtonGroup from "../component/ButtonGroup";
import ScanForm from "../component/ScanForm";
import Table from "../component/Table";
import { ITEM_STATUS } from "../constants";
import {
  AppMode,
  formatAssetSubNo,
  formatTimestampString,
  getFromStorage,
  isItemScanned,
} from "../function/helper";
import { useContext } from "../hook/useContext";

interface Props {
  context: CodeInContext;
}

interface States {
  data: any[];
  selectedLocation: any[];
  itemListData: any[];
  locationToScan: { location: string; description: string; scanQty: number };
}

class StockTake extends React.Component<Props, States> {
  constructor(props) {
    super(props);
    const STOCK_TAKE_DATA = getFromStorage("STOCK_TAKE_DATA");
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
      {
        title: "Location Description",
        field: "Ktext",
        responsive: 2,
        minWidth: 250,
      },
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
      { title: "Last Scanned", field: "LastScan" },
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
          const sheetData = getFromStorage("SHEET_DATA");
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
              description: selectedLocation[0].Ktext,
              scanQty: parseInt(selectedLocation[0].ScanQty),
            },
          });
        },
        disabled: !selectedLocation.length,
      },
    };

    const exportData = () => {
      const keyMap = {
        Anln1: "Asset Number",
        Anln2: "Sub Code",
        Countid: "Count ID",
        ScanQty: "Scan Quantity",
        Ernam: "User",
        Invnr: "Inventory Number",
        Ktext: "Location Description",
        Ord41: "Custodian",
        Stort: "Location",
        Txt50: "Description",
        LastScan: "Last Scan",
      };
      console.log(itemListData);
      const data = itemListData.map(
        ({ Apdat, Bukrs, Aedat, Ord42, Approver, AssetNo, ...d }) =>
          _.mapKeys(
            {
              ...d,
              Status: ITEM_STATUS[d.Status],
              Erdat: formatTimestampString(d.Erdat),
              LastScan: formatTimestampString(d.LastScan),
            },
            (value, key) => keyMap[key] || key
          )
      );
      const worksheet = window.XLSX.utils.json_to_sheet(data);
      const workbook = window.XLSX.utils.book_new();
      window.XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      const excelBuffer = window.XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "data.xlsx";

      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    const itemListButtons = {
      export: {
        label: "Export",
        onClick: exportData,
        disabled: false,
      },
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
                  id="stock_take"
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
                  id="stock_take-item_list"
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
              this.setState({
                locationToScan: null,
                selectedLocation: [],
                data: getFromStorage("STOCK_TAKE_DATA"),
              });
            }}
          />
        )}
      </div>
    );
  }
}

export default StockTake;
