import * as React from "react";
import Form from "./Form";
import BarcodeScanner from "./BarcodeScanner";

interface Props {
  locationToScan: string;
  onBack: () => void;
}

interface States {
  startScan: boolean;
}

class ScanForm extends React.Component<Props, States> {
  constructor(props) {
    super(props);
    this.state = {
      startScan: false,
    };
  }

  formikApi = null;

  handleFormikReady = (formikHelpers) => {
    this.formikApi = formikHelpers;
  };

  render() {
    const { locationToScan, onBack } = this.props;
    const { startScan } = this.state;

    const handleSubmit = ({ submitAction, ...values }) => {
      if (submitAction === "save") {
        console.log("save", { values });
      } else if (submitAction === "saveNext") {
        console.log("saveNext", { values });
      }
    };

    const openScanner = (startScan) => {
      this.setState({ startScan });
    };

    return (
      <div>
        <Form
          initialValues={{
            location: locationToScan,
            assetNo: null,
            inventoryNo: null,
            description: null,
            status: "",
            remark: null,
            submitAction: "",
          }}
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
              label: "Status",
              name: "status",
              options: [
                { label: "Pass", value: "pass" },
                { label: "Broken", value: "broken" },
                { label: "Others", value: "others" },
              ],
            },
            {
              type: "textarea",
              label: "Remark",
              name: "remark",
            },
          ]}
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
            if (!values.assetNo) {
              errors.assetNo = "Asset No is required";
            }
            return errors;
          }}
          onFormikReady={this.handleFormikReady}
        />
        <BarcodeScanner
          open={startScan}
          handleCloseScanner={() => {
            console.log(this.formikApi);
            if (this.formikApi) {
              this.formikApi.setFieldValue("assetNo", "123");
            }
            openScanner(false);
          }}
          callback={(msg) => {
            console.log(msg);
            openScanner(false);
          }}
        />
      </div>
    );
  }
}

export default ScanForm;
