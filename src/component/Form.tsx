import { ErrorMessage, Field, Formik } from "formik";
import * as React from "react";
import { Button } from "./Button";
import ButtonGroup from "./ButtonGroup";
import Title from "./Title";
import { COLOR_MAIN } from "../constants";
import { IconButton } from "./IconButton";

const css = `
  form input,
  form textarea,
  form select {
    padding: 4px;
    background-color: white;
    color: #000;
    resize: none;
  }

  form input:disabled,
  form textarea:disabled,
  form select:disabled {
    background-color: #f0f0f0;
  }

  form select option {
    background-color: white;
    color: #000;
  }

  .form-label {
    color: ${COLOR_MAIN};
    font-weight: bold;
  }

  .input-container {
    width: 75%;
  }
`;

const Error = ({ name }) => (
  <ErrorMessage name={name}>
    {(msg) => <div style={{ color: "red" }}>{msg}</div>}
  </ErrorMessage>
);

const TextInput = (props) => (
  <div className="input-container">
    <Field {...props} rows={2} style={{ width: "100%" }} />{" "}
    <Error name={props.name} />
  </div>
);

const DropDown = ({ name, options = [], disabled = false }) => {
  return (
    <div className="input-container">
      <Field
        name={name}
        component="select"
        style={{ width: "100%" }}
        disabled={disabled}
      >
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

const renderInputs = (fields: any[], values, footers) => {
  return (
    <div style={{ display: "grid", justifyContent: "center", gap: 8 }}>
      {fields.map((field) => {
        const disabled =
          !["assetNo", "inventoryNo"].includes(field.name) && !values.assetNo;
        return (
          <div
            key={field.name}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <label
              htmlFor={field.name}
              style={{ width: "100px", marginRight: "8px" }}
              className="form-label"
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
      {footers && <div>{footers}</div>}
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
          icon={btn.icon}
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
  title = "",
  initialValues,
  fields,
  buttons,
  onSubmit,
  validate,
  onFormikReady,
  footers = null,
}) => {
  return (
    <div>
      <style>{css}</style>
      <Formik
        validate={validate}
        initialValues={initialValues}
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        {(formikHelpers) => {
          const { handleSubmit, handleReset, values } = formikHelpers;
          if (onFormikReady) onFormikReady(formikHelpers);
          return (
            <form onReset={handleReset} onSubmit={handleSubmit}>
              {title && <Title title={title} />}
              {renderInputs(fields, values, footers)}
              {renderButtons(buttons, values)}
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default Form;
