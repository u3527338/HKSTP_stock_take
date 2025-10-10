import * as _ from "lodash";
import * as React from "react";
import { CUSTODIAN, ITEM_STATUS, STOCK_TAKE_SHEET_ITEM } from "../constants";
import {
  getFromStorage,
  getScannedCount,
  updateScanStatus,
  updateStorage,
} from "../function/helper";
import BarcodeScanner from "./BarcodeScanner";
import Form from "./Form";
import Text from "./Text";
import { showToast } from "./ToastProvider";

interface Props {
  locationToScan: { location: string; scanQty: number };
  onBack: () => void;
}

interface States {
  startScan: boolean;
  scannedItem: any;
  scannedCount: number;
}

class ScanForm extends React.Component<Props, States> {
  constructor(props) {
    super(props);
    this.state = {
      startScan: false,
      scannedItem: null,
      scannedCount: getScannedCount(this.props.locationToScan.location),
    };
  }

  formikApi = null;

  handleFormikReady = (formikHelpers) => {
    this.formikApi = formikHelpers;
  };

  render() {
    const { locationToScan, onBack } = this.props;
    const { startScan, scannedCount } = this.state;

    const initialValues = {
      location: locationToScan.location,
      assetNo: "",
      inventoryNo: "",
      description: "",
      custodian: "",
      status: "",
      remark: "",
      submitAction: "",
    };

    const addStockTakeSheet = (values) => {
      const { scannedItem } = this.state;
      if (!scannedItem) return;
      const formData = {
        Invnr: values.inventoryNo,
        Txt50: values.description,
        Ord41: values.custodian,
        Status: values.status,
        Remark: values.remark,
      };
      const newItem = {
        ..._.pick(scannedItem, STOCK_TAKE_SHEET_ITEM),
        ...formData,
      };
      updateStorage(
        "CREATE_STOCK_TAKE",
        (d) => ({
          ...d,
          [`${scannedItem.Anln1}-${scannedItem.Anln2}`]: newItem,
        }),
        "object"
      );
      updateStorage("SHEET_DATA", (d) =>
        d.map((i) =>
          `${i.Anln1}-${i.Anln2}` ===
          `${scannedItem.Anln1}-${scannedItem.Anln2}`
            ? {
                ...i,
                ...formData,
                ScanQty: "1",
              }
            : i
        )
      );
      updateScanStatus();
      this.setState({
        scannedCount: getScannedCount(this.props.locationToScan.location),
      });
      showToast("Saved", "success");
    };

    const handleSubmit = ({ submitAction, ...values }) => {
      if (submitAction === "save") {
        addStockTakeSheet(values);
        onBack();
      } else if (submitAction === "saveNext") {
        addStockTakeSheet(values);
        this.formikApi?.resetForm();
      }
    };

    const openScanner = (startScan) => {
      this.setState({ startScan });
    };

    const checkItem = (scannedItem) => {
      if (!scannedItem) console.log("No item found");
      this.setState({ scannedItem });
    };

    const handleScannedCode = (code) => {
      const items = getFromStorage("SHEET_DATA");
      const item = items.find((i) => `${i.Anln1}-${i.Anln2}` === code);
      checkItem(item);
      if (this.formikApi && item) {
        this.formikApi.setValues({
          assetNo: `${item.Bukrs}-${item.Anln1}-${item.Anln2}`,
          inventoryNo: item.Invnr,
          description: item.Txt50,
          custodian: item.Ord41,
          status: item.Status,
          remark: item.Remark,
        });
      }
      openScanner(false);
    };

    return (
      <div>
        <Form
          title="Stock Take - Scan"
          initialValues={initialValues}
          fields={[
            {
              type: "input",
              label: "Location",
              name: "location",
              disabled: true,
            },
            { type: "input", label: "Asset No", name: "assetNo" },
            { type: "input", label: "Inventory No", name: "inventoryNo" },
            {
              type: "textarea",
              label: "Description",
              name: "description",
            },
            {
              type: "dropdown",
              label: "Custodian",
              name: "custodian",
              options: Object.entries(CUSTODIAN).map(([key, value]) => ({
                label: value,
                value: key,
              })),
            },
            {
              type: "dropdown",
              label: "Status",
              name: "status",
              options: Object.entries(ITEM_STATUS)
                .map(([key, value]) => ({
                  label: value,
                  value: key,
                }))
                .filter((option) => option.label !== ITEM_STATUS[0]),
            },
            {
              type: "textarea",
              label: "Remark",
              name: "remark",
            },
          ]}
          footers={
            <Text bold>
              Scanned: {scannedCount} / Total: {locationToScan.scanQty}
            </Text>
          }
          buttons={[
            {
              label: "Back",
              onClick: onBack,
            },
            { label: "Save", type: "submit", value: "save" },
            { label: "Save & Next Item", type: "submit", value: "saveNext" },
            {
              label: "Scan",
              onClick: () => {
                openScanner(true);
              },
            },
          ]}
          onSubmit={handleSubmit}
          validate={(values) => {
            const errors: any = {};
            const requiredFields = {
              assetNo: "Asset No is required",
              inventoryNo: "Inventory No is required",
              status: "Status is required",
              remark: "Remark is required",
            };
            Object.entries(requiredFields).map(([key, value]) => {
              if (!values[key]) {
                errors[key] = value;
              }
            });
            return errors;
          }}
          onFormikReady={this.handleFormikReady}
        />
        <BarcodeScanner
          open={startScan}
          handleCloseScanner={() => {
            handleScannedCode("41002815-0");
          }}
          callback={(code) => {
            handleScannedCode(code);
          }}
        />
      </div>
    );
  }
}

export default ScanForm;
