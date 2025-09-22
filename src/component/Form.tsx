import { ErrorMessage, Field, Formik } from "formik";
import * as React from "react";
import { Button } from "./Button";
import ButtonGroup from "./ButtonGroup";

const Error = ({ name }) => (
  <ErrorMessage name={name}>
    {(msg) => <div style={{ color: "red" }}>{msg}</div>}
  </ErrorMessage>
);

const TextInput = (props) => (
  <div>
    <Field {...props} rows={2} /> <Error name={props.name} />
  </div>
);

const DropDown = ({ name, options = [], disabled = false }) => {
  return (
    <div>
      <Field name={name} component="select" disabled={disabled}>
        <option value=""></option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Field>
      <Error name={name} />
    </div>
  );
};

const renderInputs = (fields: any[], values) => {
  return (
    <div style={{ display: "grid", justifyContent: "center", gap: 8 }}>
      {fields.map((field) => {
        const disabled =
          !["assetNo", "inventoryNo"].includes(field.name) && !values.assetNo;
        return (
          <div
            key={field.name}
            style={{ display: "flex", alignItems: "center" }}
          >
            <label
              htmlFor={field.name}
              style={{ width: "100px", marginRight: "8px", fontWeight: "bold" }}
            >
              {field.label}:
            </label>
            {field.type === "input" || field.type === "textarea" ? (
              <TextInput
                name={field.name}
                disabled={field.disabled || disabled}
                component={field.type}
              />
            ) : field.type === "dropdown" ? (
              <DropDown
                name={field.name}
                options={field.options}
                disabled={field.disabled || disabled}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

const renderButtons = (buttons: any[], values) => {
  return (
    <ButtonGroup>
      {buttons.map((btn, i) => (
        <Button
          key={i}
          label={btn.label}
          onClick={() => {
            values.submitAction = btn.value;
            if (btn.onClick) btn.onClick();
          }}
          buttonStyle="main"
          disabled={btn.disabled}
          type={btn.type}
          value={btn.value}
        />
      ))}
    </ButtonGroup>
  );
};

const Form = ({
  initialValues,
  fields,
  buttons,
  onSubmit,
  validate,
  onFormikReady,
}) => {
  return (
    <Formik
      validate={validate}
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize={true}
    >
      {(formikHelpers) => {
        const { handleSubmit, values } = formikHelpers;
        if (onFormikReady) {
          onFormikReady(formikHelpers);
        }
        return (
          <form onSubmit={handleSubmit}>
            {renderInputs(fields, values)}
            {renderButtons(buttons, values)}
          </form>
        );
      }}
    </Formik>
  );
};

export default Form;
