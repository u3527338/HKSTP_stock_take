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
      { title: "Location", field: "stort" },
      {
        title: "Location Description",
        field: "ktext",
        responsive: 2,
        minWidth: 250,
      },
      { title: "Scanned", field: "Scanned" },
      { title: "Total Item", field: "scan_qty" },
    ];
    const itemListColumns = [
      {
        title: "Asset No.",
        field: "assetNo",
        formatter: (cell, params) => {
          const item = cell.getRow().getData();
          return `${item.bukrs}-${item.anln1}-${formatAssetSubNo(item.anln2)}`;
        },
      },
      { title: "Inventory No.", field: "invnr" },
      { title: "Description", field: "txt50" },
      { title: "Remark", field: "remark" },
      {
        title: "status",
        field: "status",
        formatter: (cell, params) => {
          const value = cell.getValue();
          return ITEM_STATUS[value];
        },
      },
      {
        title: "Scanned",
        field: "Scanned",
        formatter: (cell, params) => {
          const value = cell.getRow().getData().status;
          return isItemScanned(value) ? "Yes" : "No";
        },
      },
      { title: "Last Scanned", field: "LastScan" },
    ];

    const getItemsByLocation = (selectedLocation: any[]) => {
      const sheetData = getFromStorage("SHEET_DATA");
      const itemListData = sheetData.filter((sd) =>
        selectedLocation.some(
          (sl) => sd.stort === sl.stort && sd.ktext === sl.ktext
        )
      );
      return itemListData;
    };

    const exportData = (selectedLocation: any[]) => {
      const keyMap = {
        anln1: "Asset Number",
        anln2: "Sub Code",
        countid: "Count ID",
        scan_qty: "Scan Quantity",
        Ernam: "User",
        invnr: "Inventory Number",
        ktext: "Location Description",
        ord41: "Custodian",
        stort: "Location",
        txt50: "Description",
        LastScan: "Last Scan",
      };
      const data = getItemsByLocation(selectedLocation).map(
        ({ apdat, bukrs, aedat, ord42, approver, assetNo, ...d }) =>
          _.mapKeys(
            {
              ...d,
              status: ITEM_STATUS[d.status],
              erdat: formatTimestampString(d.erdat),
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

    const buttons = {
      back: {
        label: "Back",
        onClick: () => {
          setAppMode(AppMode.MENU);
        },
        disabled: false,
      },
      export: {
        label: "Export",
        onClick: () => {
          exportData(data);
        },
        disabled: !data.length,
      },
      item_list: {
        label: "Item List",
        onClick: () => {
          const itemListData = getItemsByLocation(selectedLocation);
          this.setState({ itemListData });
        },
        disabled: !selectedLocation.length,
      },
      scan: {
        label: "Scan",
        onClick: () => {
          this.setState({
            locationToScan: {
              location: selectedLocation[0].stort,
              description: selectedLocation[0].ktext,
              scanQty: parseInt(selectedLocation[0].scan_qty),
            },
          });
        },
        disabled: !selectedLocation.length,
      },
    };

    const itemListButtons = {
      export: {
        label: "Export",
        onClick: () => {
          exportData(selectedLocation);
        },
        disabled: !selectedLocation.length,
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
