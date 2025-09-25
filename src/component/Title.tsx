import * as React from "react";
import Center from "./Center";

const Title = ({ title, ...props }) => (
  <Center>
    <h2 className="app-title" {...props}>
      {title}
    </h2>
  </Center>
);

export default Title;
