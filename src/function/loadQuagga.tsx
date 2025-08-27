import { loadScript } from "./helper";

export class CodeInApplication implements CodeInComp {
  async execute(context: CodeInContext, fieldsValues: any) {
    loadScript({
      id: "html5-qrcode",
      src: "https://unpkg.com/html5-qrcode@2.0.6/dist/html5-qrcode.min.js",
    });
  }

  requiredFields() {
    return [];
  }

  requiredModules() {
    return [];
  }
}
