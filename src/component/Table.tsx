import * as React from "react";
import { COLOR_MAIN } from "../constants";
import Title from "./Title";

const css = `
  .tabulator-tableholder {
    height: unset !important;
  }

  .tabulator .tabulator-header .tabulator-col {
    background: ${COLOR_MAIN} !important;
    color: white !important;
  }

  .tabulator-row {
    font-weight: 600;
  }

  .tabulator-row:hover {
    background-color: transparent !important;
  }

  .tabulator-row.tabulator-row-even {
    background: rgba(255, 110, 16, 0.1) !important;
  }

  .tabulator-row.tabulator-selected {
    background: rgba(255, 110, 16, 0.5) !important;
  }

  .tabulator .tabulator-footer {
    background: white !important;
  }
`;

declare global {
  interface Window {
    Tabulator: any;
    XLSX: any;
  }
}

interface Props {
  id: string;
  context: CodeInContext;
  title?: string;
  data: any[];
  columns: { title: string; field: string }[];
  rowSelectable?: boolean;
  onRowSelected?: (data: any[]) => void;
  multiRowSelection?: boolean;
}

class Table extends React.Component<Props> {
  containerRef: HTMLDivElement | null = null;
  table: any;
  static defaultProps = {
    rowSelectable: true,
    multiRowSelection: true,
  };

  initTable = () => {
    const { data, columns, onRowSelected } = this.props;
    if (!this.containerRef) {
      console.error("Container ref is null");
      return;
    }
    if (!window.Tabulator) {
      console.error("Tabulator library not loaded");
      return;
    }
    this.table = new window.Tabulator(this.containerRef, {
      data,
      layout: "fitColumns",
      responsiveLayout: true,
      pagination: true,
      paginationSize: 10,
      resizableColumnFit: true,
      columns: columns.map((c) => ({
        minWidth: 100,
        responsive: 0,
        resizable: true,
        ...c,
      })),
      selectableRows: this.props.rowSelectable,
      placeholder: "No data available",
    });

    this.table.on("rowClick", (e, row) => {
      const { rowSelectable, multiRowSelection } = this.props;
      if (!rowSelectable) return;
      if (multiRowSelection) {
        if (row.isSelected()) {
          row.deselect();
        } else {
          row.select();
        }
      } else {
        this.table.getRows().forEach((r) => {
          if (r !== row && r.isSelected()) {
            r.deselect();
          }
        });
        row.select();
      }
    });

    this.table.on("rowSelectionChanged", (data, row) => {
      onRowSelected(data);
    });
  };

  componentDidMount() {
    this.initTable();
  }

  componentDidUpdate(prevProps: Props) {
    if (
      this.table &&
      JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)
    ) {
      this.table.replaceData(this.props.data);
    }
  }

  componentWillUnmount() {
    if (this.table) {
      this.table.destroy();
    }
  }

  render() {
    const { id, title } = this.props;
    return (
      <div>
        <style>{css}</style>
        {title && <Title title={title} />}
        <div id={id} ref={(el) => (this.containerRef = el)} />
      </div>
    );
  }
}

export default Table;
