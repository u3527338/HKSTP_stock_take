import { MODULE_COMMON } from "../constants";

const isScriptLoaded = (id: string, type) => {
  var scripts = document.getElementsByTagName(type);
  for (var i = scripts.length; i--; ) {
    if (scripts[i].id == id) return true;
  }
  return false;
};

export const loadScript = ({ id, src }) => {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) {
      resolve(""); // already loaded
      return;
    }
    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.onload = () => resolve("");
    script.onerror = () => reject(new Error(`Failed to load script ${src}`));
    document.head.appendChild(script);
  });
};

export const loadStyleSheet = ({ id, href }) => {
  if (isScriptLoaded(id, "link")) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.id = id;
  document.body.appendChild(link);
};

export const loadResources = (resources) => {
  const promises = resources.map((res) => {
    if (res.type === "script") {
      return loadScript({ id: res.id, src: res.src });
    } else if (res.type === "style") {
      return loadStyleSheet({ id: res.id, href: res.href });
    }
    return Promise.reject(new Error("Unknown resource type"));
  });
  return Promise.all(promises);
};

export const getCurrentUser = (context: CodeInContext) => {
  const common = context.modules[MODULE_COMMON];
  const { AkContext } = common;
  const user = AkContext.getUser();
  return { id: user.AccountID, username: user.Name_CN, email: user.Email };
};

export const generateUUID = () => Math.random().toString(36).substring(2, 9);

export enum AppMode {
  MENU = "menu",
  DOWNLOAD = "download",
  STOCK_TAKE = "stock_take",
  SYNC = "sync",
}

export const isItemScanned = (status) => !!status && parseInt(status) !== 0;

export const formatAssetSubNo = (numStr) => numStr.padStart(4, "0");

export const getScannedCount = (location) => {
  const items = JSON.parse(localStorage.getItem("SHEET_DATA")) || [];
  const scannedItems: any[] = items.filter(
    (item) => item.Stort === location && isItemScanned(item.Status)
  );
  return scannedItems.length;
};

export const updateDownloadStatus = (dataToDownload: any[]) => {
  const locationData = JSON.parse(localStorage.getItem("LOCATION_DATA")) || [];
  const preDownloadedList =
    JSON.parse(localStorage.getItem("STOCK_TAKE_DATA")) || [];
  localStorage.setItem(
    "LOCATION_DATA",
    JSON.stringify(
      locationData.map((l) => {
        return {
          ...l,
          Downloaded: dataToDownload
            .concat(preDownloadedList)
            .map((_d) => _d.Stort)
            .includes(l.Stort),
        };
      })
    )
  );
};

export const updateScanStatus = () => {
  const locationData = JSON.parse(localStorage.getItem("LOCATION_DATA")) || [];
  localStorage.setItem(
    "LOCATION_DATA",
    JSON.stringify(
      locationData.map((l) => ({
        ...l,
        Scanned: getScannedCount(l.Stort),
      }))
    )
  );
  updateDownloadedScanStatus();
};

export const updateDownloadedScanStatus = () => {
  const locationData = JSON.parse(localStorage.getItem("LOCATION_DATA")) || [];
  localStorage.setItem(
    "STOCK_TAKE_DATA",
    JSON.stringify(locationData.filter((r) => r.Downloaded))
  );
};
