import * as React from "react";
import { Modal } from "./Modal";

declare global {
  interface Window {
    ZXing: any;
  }
}

interface Props {
  open: boolean;
  handleCloseScanner: () => void;
  callback: (msg: string) => void;
}

class ZXingScanner extends React.Component<Props> {
  private videoRef: HTMLVideoElement | null = null;
  private codeReader: any;
  private stream: MediaStream | null = null;
  private videoTrack: MediaStreamTrack | null = null;
  private animationFrameId: number | null = null;

  state = {
    maxZoom: 1,
    currentZoom: 1,
  };

  componentDidMount() {
    if (window.ZXing) {
      this.codeReader = new window.ZXing.BrowserMultiFormatReader();
    } else {
      console.error("ZXing library not loaded");
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.open && this.props.open) {
      this.startCamera(); // start camera when modal opens
    }
    if (prevProps.open && !this.props.open) {
      this.stopCamera(); // stop camera when modal closes
    }
  }

  startCamera = () => {
    this.stopCamera();
    const constraints = { facingMode: "environment" };
    navigator.mediaDevices
      .getUserMedia({ video: constraints })
      .then((stream) => {
        this.stream = stream;
        // Assign stream to video element
        this.videoRef!.srcObject = stream;
        // Wait for video element to be ready
        this.videoRef!.onloadedmetadata = () => {
          this.videoRef!.play().catch((e) => {
            console.error("Error trying to play video:", e);
          });
          this.videoTrack = stream.getVideoTracks()[0];

          // Check zoom capabilities
          const capabilities = this.videoTrack.getCapabilities() as {
            zoom?: { max: number; min: number; step: number };
          };
          if ("zoom" in capabilities) {
            this.setState({ maxZoom: capabilities.zoom!.max });
          }

          this.detectBarcode();
        };
      })
      .catch((err) => {
        console.error("Error accessing camera:", err);
      });
  };

  detectBarcode = () => {
    if (!this.videoRef || !this.codeReader) return;

    const hints = new Map();
    hints.set(window.ZXing.DecodeHintType.POSSIBLE_FORMATS, [
      window.ZXing.BarcodeFormat.CODE_39,
    ]);
    this.decodeLoop(this.videoRef, hints);
  };

  decodeLoop = (video: HTMLVideoElement, hints: Map<any, any>) => {
    this.animationFrameId = requestAnimationFrame(() => {
      this.codeReader
        .decodeFromVideoElement(video, hints)
        .then((result: any) => {
          console.log("Decoded:", result.text);
          this.props.callback("Decoded:" + result.text);
          // Keep scanning, or call stopCamera() if only one detection is desired
        })
        .catch(() => {
          // no barcode detected
        })
        .finally(() => {
          this.decodeLoop(video, hints);
        });
    });
  };

  stopCamera() {
    if (this.videoRef) {
      this.videoRef.srcObject = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }

  componentWillUnmount() {
    this.stopCamera();
  }

  handleZoomChange = (zoomLevel: number) => {
    if (this.videoTrack && "applyConstraints" in this.videoTrack) {
      const capabilities = this.videoTrack.getCapabilities() as {
        zoom?: { max: number; min: number; step: number };
      };
      if (capabilities.zoom) {
        const newZoom = Math.max(
          this.state.currentZoom,
          Math.min(capabilities.zoom!.max, zoomLevel)
        );
        (this.videoTrack as any)
          .applyConstraints({ advanced: [{ zoom: newZoom }] })
          .then(() => {
            this.setState({ currentZoom: newZoom });
            console.log(`Zoom set to ${newZoom}`);
          })
          .catch((err) => console.error("Zoom applyConstraints error:" + err));
      }
    }
  };

  render() {
    const { open, handleCloseScanner } = this.props;
    return (
      <Modal open={open} hideModal={handleCloseScanner}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <video
            ref={(el) => (this.videoRef = el)}
            autoPlay
            muted
            style={{ width: "300px" }}
          />
          {/* Optional zoom controls */}
          <div style={{ marginTop: "10px" }}>
            <button
              onClick={() => {
                const newZoom = Math.min(
                  this.state.maxZoom,
                  this.state.currentZoom + 0.5
                );
                this.handleZoomChange(newZoom);
              }}
              disabled={this.state.currentZoom >= this.state.maxZoom}
            >
              Zoom In
            </button>
            <button
              onClick={() => {
                const newZoom = Math.max(1, this.state.currentZoom - 0.5);
                this.handleZoomChange(newZoom);
              }}
              disabled={this.state.currentZoom <= 1}
            >
              Zoom Out
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default ZXingScanner;
