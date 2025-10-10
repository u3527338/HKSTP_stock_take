import { showToast } from "../component/ToastProvider";
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
  const items = getFromStorage("SHEET_DATA");
  const scannedItems: any[] = items.filter(
    (item) => item.Stort === location && isItemScanned(item.Status)
  );
  return scannedItems.length;
};

export const updateDownloadStatus = (dataToDownload: any[]) => {
  const preDownloadedList = getFromStorage("STOCK_TAKE_DATA");
  updateStorage("LOCATION_DATA", (d) =>
    d.map((l) => ({
      ...l,
      Downloaded: dataToDownload
        .concat(preDownloadedList)
        .map((_d) => _d.Stort)
        .includes(l.Stort),
    }))
  );
};

export const updateScanStatus = () => {
  updateStorage("LOCATION_DATA", (d) =>
    d.map((l) => ({ ...l, Scanned: getScannedCount(l.Stort) }))
  );
  updateStockTakeData();
};

export const updateSyncStatus = (dataToSync: any[]) => {
  updateStorage("LOCATION_DATA", (d) =>
    d.map((l) => ({
      ...l,
      Synced: dataToSync.map((_d) => _d.Stort).includes(l.Stort) || l.Synced,
    }))
  );
  updateStockTakeData();
};

export const updateStockTakeData = () => {
  updateStorage(["LOCATION_DATA", "STOCK_TAKE_DATA"], (d) =>
    d.filter((r) => r.Downloaded)
  );
};

type NAME =
  | "LOCATION_DATA"
  | "STOCK_TAKE_DATA"
  | "SHEET_DATA"
  | "CREATE_STOCK_TAKE";

export const getFromStorage = (
  name: NAME,
  type: "list" | "object" = "list"
) => {
  const fallback = type === "list" ? [] : {};
  return JSON.parse(localStorage.getItem(name)) || fallback;
};

export const setToStorage = (name: NAME, value) => {
  localStorage.setItem(name, JSON.stringify(value));
};

export const updateStorage = (
  name: NAME[] | NAME,
  func: (d) => any,
  type: "list" | "object" = "list"
) => {
  let keys: NAME[] = typeof name === "string" ? [name, name] : name;
  const rawData = getFromStorage(keys[0], type);
  localStorage.setItem(keys[1], JSON.stringify(func(rawData)));
};

export const addCameraPermissionListener = (activate = true) => {
  navigator.permissions.query({ name: "camera" }).then((permissionStatus) => {
    permissionStatus.onchange = activate
      ? () => {
          showToast(`Camera permission ${permissionStatus.state}`, "info");
        }
      : null;
  });
};

export const checkCameraPermission = (startScanner) => {
  navigator.permissions.query({ name: "camera" }).then((permissionStatus) => {
    if (permissionStatus.state === "granted") {
      startScanner();
    } else {
      showToast("Camera access is required", "error");
    }
  });
};
