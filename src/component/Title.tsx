import * as React from "react";
import Center from "./Center";

const Title = ({ title }) => (
  <Center>
    <h2 style={{ textDecoration: "underline" }}>{title}</h2>
  </Center>
);

export default Title;
