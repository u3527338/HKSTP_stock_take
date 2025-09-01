import * as React from "react";
import { AppMode } from "../function/helper";
import { useContext } from "../hook/useContext";
import { Button } from "./Button";
import ButtonGroup from "./ButtonGroup";

const MenuButtons = {
  [AppMode.DOWNLOAD]: { label: "Download Stock Take List" },
  [AppMode.STOCK_TAKE]: { label: "Stock Take" },
  [AppMode.SYNC]: { label: "Sync Stock Take Result" },
};

const Menu = ({ context }) => {
  const { setAppMode } = useContext(context);

  return (
    <div>
      <p>Stock Take Application</p>
      <ButtonGroup style={{ flexDirection: "column" }}>
        {Object.entries(MenuButtons).map(
          ([key, value]: [AppMode, { label: string }]) => (
            <Button
              key={key}
              label={value.label}
              onClick={() => {
                setAppMode(key);
              }}
              buttonStyle="main"
            />
          )
        )}
      </ButtonGroup>
    </div>
  );
};

export default Menu;
