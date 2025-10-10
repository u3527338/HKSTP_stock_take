import * as React from "react";
import { checkCameraPermission } from "../function/helper";
import { Modal } from "./Modal";
import { Button } from "./Button";

declare global {
  interface Window {
    Html5Qrcode: any;
  }
}

const Html5QrcodeSupportedFormats = {
  EAN_13: 1,
  CODE_39: 2,
  CODE_128: 3,
  QR_CODE: 4,
};

interface Props {
  open: boolean;
  handleCloseScanner: () => void;
  callback: (msg: string) => void;
}

class BarcodeScanner extends React.Component<Props, {}> {
  html5Qrcode: any = null;
  isScannerRunning: boolean;

  constructor(props) {
    super(props);
    this.isScannerRunning = false;
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.open && this.props.open) {
      this.startScanner();
    } else if (prevProps.open && !this.props.open) {
      this.stopScanner();
    }
  }

  startScanner = () => {
    if (this.isScannerRunning) return;

    if (!window.Html5Qrcode) {
      console.error("Html5Qrcode library not loaded");
      return;
    }
    checkCameraPermission(() => {
      if (this.html5Qrcode) {
        this.html5Qrcode
          .stop()
          .then(() => {
            this.html5Qrcode = null;
            this.initScanner();
          })
          .catch(() => {
            this.html5Qrcode = null;
            this.initScanner();
          });
      } else {
        this.initScanner();
      }
    });
  };

  stopScanner = () => {
    if (!window.Html5Qrcode) {
      console.error("Html5Qrcode library not loaded");
      return;
    }
    if (this.html5Qrcode) {
      this.html5Qrcode
        .stop()
        .catch((err: any) => {
          console.error("Failed to stop scanner on unmount:", err);
        })
        .finally(() => {
          this.html5Qrcode = null;
          this.isScannerRunning = false;
        });
    }
  };

  initScanner = () => {
    this.html5Qrcode = new window.Html5Qrcode("reader");
    const formats = [
      Html5QrcodeSupportedFormats.CODE_39,
      // Html5QrcodeSupportedFormats.CODE_128,
    ];

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      formatsToSupport: formats,
    };

    this.html5Qrcode
      .start({ facingMode: "environment" }, config, this.onScanSuccess)
      .then(() => {
        this.isScannerRunning = true;
      })
      .catch((err: any) => {
        console.error("Error starting scanner:", err);
      });
  };

  onScanSuccess = (decodedText: string, decodedResult: any) => {
    this.props.callback(`Detected: ${decodedText}`);
    this.stopScanner();
  };

  componentWillUnmount() {
    this.stopScanner();
  }

  render() {
    const { open, handleCloseScanner } = this.props;
    return (
      <Modal open={open} hideModal={handleCloseScanner}>
        <Button
          label="Test Scan"
          onClick={() => {
            this.props.callback("41002815-0");
          }}
          buttonStyle="main"
        />
        <div>
          <div id="reader" />
        </div>
      </Modal>
    );
  }
}

export default BarcodeScanner;
