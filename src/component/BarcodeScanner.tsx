import * as React from "react";
import { checkCameraPermission } from "../function/helper";
import { Modal } from "./Modal";
import { showToast } from "./ToastProvider";

declare global {
  interface Window {
    Quagga: any;
  }
}

interface Props {
  open: boolean;
  handleCloseScanner: () => void;
  callback: (msg: string) => void;
}

class BarcodeScanner extends React.Component<Props, {}> {
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

    if (!window.Quagga) {
      console.error("Quagga library not loaded");
      return;
    }

    checkCameraPermission(() => {
      this.initQuagga();
    });
  };

  stopScanner = () => {
    if (window.Quagga && this.isScannerRunning) {
      window.Quagga.stop();
      this.isScannerRunning = false;
    }
  };

  initQuagga = () => {
    window.Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: document.querySelector("#reader"), // your scanner container
          constraints: {
            facingMode: "environment",
          },
        },
        decoder: {
          readers: ["code_39_reader"],
        },
      },
      (err) => {
        if (err) {
          console.error("Quagga init error:", err);
          return;
        }
        window.Quagga.start();
        this.isScannerRunning = true;
        window.Quagga.onDetected(this.onDetected);
      }
    );
  };

  onDetected = (data: any) => {
    if (data && data.codeResult && data.codeResult.code) {
      const scannedCode: string = data.codeResult.code;
      showToast(`Barcode ${scannedCode} detected`);
      this.props.callback(scannedCode.split("-").slice(1).join("-"));
      this.stopScanner();
    }
  };

  componentWillUnmount() {
    this.stopScanner();
  }

  render() {
    const { open, handleCloseScanner } = this.props;
    return (
      <Modal open={open} hideModal={handleCloseScanner}>
        <div>
          <div id="reader" />
        </div>
      </Modal>
    );
  }
}

export default BarcodeScanner;
