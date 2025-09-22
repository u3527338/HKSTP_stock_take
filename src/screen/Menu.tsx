import * as React from "react";
import { AppMode } from "../function/helper";
import { useContext } from "../hook/useContext";
import { Button } from "../component/Button";
import ButtonGroup from "../component/ButtonGroup";
import Center from "../component/Center";

const MenuButtons = {
  [AppMode.DOWNLOAD]: { label: "Download Stock Take List" },
  [AppMode.STOCK_TAKE]: { label: "Stock Take" },
  [AppMode.SYNC]: { label: "Sync Stock Take Result" },
};

const Menu = ({ context }) => {
  const { setAppMode } = useContext(context);

  return (
    <Center style={{ flexDirection: "column" }}>
      <h1>Stock Take Application</h1>
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
              style={{ width: "100%" }}
            />
          )
        )}
      </ButtonGroup>
    </Center>
  );
};

export default Menu;
