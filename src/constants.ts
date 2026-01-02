export const MODULE_COMMON = "common";

export const COLOR_MAIN = "#FF6E10";

export const STATUS = {
  NOT_SCANNED: "Not Scanned",
  PASS: "Pass",
  BROKEN: "Broken",
  OTHERS: "Others",
  WRONG_LOCATION: "Wrong Location",
};

export const ITEM_STATUS = {
  0: STATUS.NOT_SCANNED,
  1: STATUS.PASS,
  // 2: "Additional",
  3: STATUS.BROKEN,
  4: STATUS.OTHERS,
  5: STATUS.WRONG_LOCATION,
};

export enum BUTTON_ICON {
  LOADING = "fa-solid fa-spinner-third",
  REMOVE = "fa-solid fa-circle-xmark",
  BARCODE = "fa-solid fa-barcode",
  SEARCH = "fa-solid fa-magnifying-glass",
}

export enum CUSTODIAN {
  AAVE = "AAVE",
  AVM = "AVM",
  BB = "BB",
  BMT = "BMT",
  CCC = "CCC",
  CCWB = "CCWB",
  CLUB = "CLUB",
  CWC = "CWC",
  DH = "DH",
  DS = "DS",
  DSC = "DSC",
  DT = "DT",
  FMAC = "FMAC",
  FMDT = "FMDT",
  FMIC = "FMIC",
  FMIN = "FMIN",
  FMMC = "FMMC",
  FMME = "FMME",
  FMPM = "FMPM",
  FMSP = "FMSP",
  FMSX = "FMSX",
  GE = "GE",
  GT = "GT",
  HGBA = "HGBA",
  HILB = "HILB",
  HR = "HR",
  IFAC = "IFAC",
  INAR = "INAR",
  INB = "INB",
  INC = "INC",
  IT = "IT",
  LA = "LA",
  MKT = "MKT",
  "N/A" = "N/A",
  ODS = "ODS",
  OP = "OP",
  PD = "PD",
  RG = "RG",
  SC = "SC",
  SCPS = "SCPS",
  SHE = "SHE",
  SPIL = "SPIL",
  STPF = "STPF",
  SUST = "SUST",
  TONE = "TONE",
  WINC = "WINC",
}

export const STOCK_TAKE_SHEET_ITEM = [
  "bukrs",
  "countid",
  "anln1",
  "anln2",
  "txt50",
  "invnr",
  "ord41",
  "ord42",
  "stort",
  "ktext",
  "status",
  "remark",
];
