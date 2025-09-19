import * as React from "react";
import Form from "./Form";

const ScanForm = ({ locationToScan, onBack }) => {
  const handleSubmit = (values, formikHelpers, event) => {
    console.log(values);
    console.log(event);
    // rest.event contains the native event
    const submitter = event?.nativeEvent?.submitter;
    const action = submitter?.value; // "save" or "saveNext"

    if (action === "save") {
      console.log("save", { values });
      // handle save
    } else if (action === "saveNext") {
      console.log("saveNext", { values });
      // handle save & next
    }
  };
  return (
    <Form
      initialValues={{
        location: locationToScan,
        assetNo: null,
        inventoryNo: null,
        description: null,
        status: "",
        remark: null,
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
        { label: "Scan", onClick: () => {} },
      ]}
      onSubmit={handleSubmit}
      validate={(values) => {
        const errors: any = {};
        if (!values.assetNo) {
          errors.assetNo = "Asset No is required";
        }
        return errors;
      }}
    />
  );
};

export default ScanForm;
