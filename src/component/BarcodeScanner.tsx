import * as React from "react";

declare global {
  interface Window {
    Html5Qrcode: any;
  }
}

// Define supported formats manually
const Html5QrcodeSupportedFormats = {
  EAN_13: 1,
  CODE_39: 2,
  CODE_128: 3,
  QR_CODE: 4,
  // add other formats as needed
};

interface Props {
  callback: (msg: string) => void;
}

class BarcodeScanner extends React.Component<Props, {}> {
  html5Qrcode: any = null;

  startScanner = () => {
    if (!window.Html5Qrcode) {
      console.error("Html5Qrcode library not loaded");
      return;
    }

    // If there's already an active scanner, stop it before starting a new one
    if (this.html5Qrcode) {
      this.html5Qrcode
        .stop()
        .then(() => {
          this.html5Qrcode = null;
          this.initScanner();
        })
        .catch(() => {
          // If stopping fails, still try to reinitialize
          this.html5Qrcode = null;
          this.initScanner();
        });
    } else {
      this.initScanner();
    }
  };

  initScanner = () => {
    this.html5Qrcode = new window.Html5Qrcode("reader");
    const formats = [
      Html5QrcodeSupportedFormats.EAN_13,
      Html5QrcodeSupportedFormats.CODE_39,
      Html5QrcodeSupportedFormats.CODE_128,
    ];

    this.html5Qrcode
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          formatsToSupport: formats,
        },
        (decodedText: string, decodedResult: any) => {
          this.props.callback(`Detected: ${decodedText}`);

          // Stop after detection
          this.html5Qrcode
            .stop()
            .then(() => {
              console.log("Scanner stopped after detection");
              this.html5Qrcode = null; // clear instance so it can restart later
            })
            .catch((err: any) => {
              console.error("Failed to stop scanner:", err);
            });
        }
      )
      .then(() => {
        console.log("Scanner started");
      })
      .catch((err: any) => {
        console.error("Error starting scanner:", err);
      });
  };

  componentWillUnmount() {
    if (this.html5Qrcode) {
      this.html5Qrcode.stop().catch((err: any) => {
        console.error("Failed to stop scanner on unmount:", err);
      });
    }
  }

  render() {
    return (
      <div>
        <button onClick={this.startScanner}>Start Scan</button>
        <div id="reader" style={{ width: 300, height: 200 }} />
      </div>
    );
  }
}

export default BarcodeScanner;
