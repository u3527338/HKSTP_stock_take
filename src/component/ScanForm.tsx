import * as _ from "lodash";
import * as React from "react";
import {
  BUTTON_ICON,
  CUSTODIAN,
  ITEM_STATUS,
  STATUS,
  STOCK_TAKE_SHEET_ITEM
} from "../constants";
import {
  findKeyByValue,
  getDateTime,
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
  locationToScan: { location: string; description: string; scanQty: number };
  onBack: () => void;
}

interface States {
  startScan: boolean;
  scannedItem: any;
  scannedCount: number;
}

const formattedCode = (item) => `${item.anln1}-${item.anln2}`;

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
    const { startScan, scannedCount, scannedItem } = this.state;

    const initialValues = {
      // codeScan: "",
      location: locationToScan.location,
      assetNo: "",
      inventoryNo: "",
      description: "",
      custodian: "",
      status: "",
      remark: "",
      submitAction: "",
    };

    const isWrongLocation = (item) => item.stort !== locationToScan.location;

    const addStockTakeSheet = (values) => {
      const { scannedItem } = this.state;
      if (!scannedItem) return;
      const formData = {
        invnr: values.inventoryNo,
        txt50: values.description,
        ord41: values.custodian,
        status: values.status,
        remark: values.remark,
        LastScan: getDateTime(),
      };
      const newItem = {
        ..._.pick(scannedItem, STOCK_TAKE_SHEET_ITEM),
        ...formData,
        stort: locationToScan.location,
        ktext: locationToScan.description,
      };
      updateStorage(
        "CREATE_STOCK_TAKE",
        (d) => ({
          ...d,
          [formattedCode(scannedItem)]: newItem,
        }),
        "object"
      );
      updateStorage("SHEET_DATA", (d) =>
        d.map((i) =>
          formattedCode(i) === formattedCode(scannedItem)
            ? {
                ...i,
                ...formData,
                scan_qty: "1",
              }
            : i
        )
      );
      updateScanStatus();
      this.setState({
        scannedCount: getScannedCount(this.props.locationToScan.location),
        scannedItem: null,
      });
      showToast("Saved", "success");
    };

    const handleSubmit = ({ submitAction, ...values }) => {
      checkItem(scannedItem);
      if (Object.keys(this.formikApi?.errors).length > 0) return;

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

    const setError = (error) => {
      if (error) {
        this.formikApi?.setErrors({ assetNo: error });
        showToast(error, "error");
      }
    };

    const checkItem = (item) => {
      if (!item) {
        setError("No stock record found");
        return;
      }

      if (isWrongLocation(item)) {
        showToast(
          `Wrong Location. This stock should be at ${item.stort}`,
          "warning"
        );
      }

      const SCANNED = getFromStorage("CREATE_STOCK_TAKE", "object");
      if (Object.keys(SCANNED).includes(formattedCode(item)))
        showToast(
          "This stock has been scanned without synchronizing",
          "warning"
        );

      if (!scannedItem) this.setState({ scannedItem: item });
    };

    const handleScannedCode = (code) => {
      const items = getFromStorage("SHEET_DATA");
      const item = items.find((i) => formattedCode(i) === code);
      checkItem(item);

      if (this.formikApi && item) {
        this.formikApi.setValues({
          // codeScan: code,
          assetNo: `${item.bukrs}-${formattedCode(item)}`,
          inventoryNo: item.invnr,
          description: item.txt50,
          custodian: item.ord41,
          status: isWrongLocation(item)
            ? findKeyByValue(ITEM_STATUS, STATUS.WRONG_LOCATION)
            : item.status === findKeyByValue(ITEM_STATUS, STATUS.NOT_SCANNED)
            ? ""
            : item.status,
          remark: item.remark,
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
            // {
            //   type: "input",
            //   label: "Code Scan",
            //   name: "codeScan",
            //   style: { border: `1px dashed ${COLOR_MAIN}` },
            //   button: { icon: BUTTON_ICON.SEARCH, onClick: handleScannedCode },
            // },
            {
              type: "input",
              label: "Location",
              name: "location",
              disabled: true,
            },
            {
              type: "input",
              label: "Asset No",
              name: "assetNo",
              disabled: true,
            },
            {
              type: "input",
              label: "Inventory No",
              name: "inventoryNo",
              disabled: true,
            },
            {
              type: "textarea",
              label: "Description",
              name: "description",
              disabled: true,
            },
            {
              type: "dropdown",
              label: "Custodian",
              name: "custodian",
              options: Object.entries(CUSTODIAN).map(([key, value]) => ({
                label: value,
                value: key,
              })),
              disabled: (value) => true,
            },
            {
              type: "dropdown",
              label: "status",
              name: "status",
              options: Object.entries(ITEM_STATUS)
                .map(([key, value]) => ({
                  label: value,
                  value: key,
                  disabled: value === STATUS.WRONG_LOCATION,
                }))
                .filter((option) => option.label !== STATUS.NOT_SCANNED),
              disabled: (value) =>
                !scannedItem ||
                value === findKeyByValue(ITEM_STATUS, STATUS.WRONG_LOCATION),
            },
            {
              type: "textarea",
              label: "remark",
              name: "remark",
            },
          ]}
          footers={
            <div style={{ padding: 8 }}>
              <Text bold>
                Scanned: {scannedCount} / Total: {locationToScan?.scanQty}
              </Text>
            </div>
          }
          buttons={[
            {
              label: "Back",
              onClick: onBack,
            },
            {
              label: "Save",
              type: "submit",
              value: "save",
              disabled: !scannedItem,
            },
            {
              label: "Save & Next Item",
              type: "submit",
              value: "saveNext",
              disabled: !scannedItem,
            },
            {
              icon: BUTTON_ICON.BARCODE,
              onClick: () => {
                openScanner(true);
              },
            },
          ]}
          onSubmit={handleSubmit}
          validate={(values) => {
            const errors: any = {};
            const remarkRequired =
              values["status"] === findKeyByValue(ITEM_STATUS, STATUS.OTHERS);
            var requiredFields = {
              assetNo: "Asset No is required",
              status: "Status is required",
            };
            if (remarkRequired) {
              requiredFields["remark"] = "emark is required";
            }
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
            openScanner(false);
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
