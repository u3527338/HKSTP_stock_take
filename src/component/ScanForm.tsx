import * as _ from "lodash";
import * as React from "react";
import {
  BUTTON_ICON,
  CUSTODIAN,
  ITEM_STATUS,
  STOCK_TAKE_SHEET_ITEM,
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

const formattedCode = (item) => `${item.Anln1}-${item.Anln2}`;

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
      location: locationToScan.location,
      assetNo: "",
      inventoryNo: "",
      description: "",
      custodian: "",
      status: "",
      remark: "",
      submitAction: "",
    };

    const isWrongLocation = (item) => item.Stort !== locationToScan.location;

    const addStockTakeSheet = (values) => {
      const { scannedItem } = this.state;
      if (!scannedItem) return;
      const formData = {
        Invnr: values.inventoryNo,
        Txt50: values.description,
        Ord41: values.custodian,
        Status: values.status,
        Remark: values.remark,
        LastScan: getDateTime(),
      };
      const newItem = {
        ..._.pick(scannedItem, STOCK_TAKE_SHEET_ITEM),
        ...formData,
        Stort: locationToScan.location,
        Ktext: locationToScan.description,
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
                ScanQty: "1",
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
          `Wrong Location. This stock should be at ${item.Stort}`,
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
          assetNo: `${item.Bukrs}-${formattedCode(item)}`,
          inventoryNo: item.Invnr,
          description: item.Txt50,
          custodian: item.Ord41,
          status: isWrongLocation(item)
            ? findKeyByValue(ITEM_STATUS, "Wrong Location")
            : item.Status,
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
            {
              type: "input",
              label: "Asset No",
              name: "assetNo",
              disabled: !!scannedItem,
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
              disabled: true,
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
              disabled: scannedItem?.Stort !== locationToScan?.location,
            },
            {
              type: "textarea",
              label: "Remark",
              name: "remark",
            },
          ]}
          footers={
            <Text bold>
              Scanned: {scannedCount} / Total: {locationToScan?.scanQty}
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
              icon: BUTTON_ICON.BARCODE,
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
