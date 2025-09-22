import * as React from "react";
import Center from "./Center";
import Title from "./Title";

const css = `
  .tabulator-tableholder {
    height: unset !important;
  }
`;

declare global {
  interface Window {
    Tabulator: any;
  }
}

interface Props {
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
      pagination: true,
      paginationSize: 10,
      columns,
      selectableRows: this.props.rowSelectable,
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

  toggleColumn(columnField) {
    // your existing toggleColumn code
  }

  render() {
    const { title } = this.props;
    return (
      <div>
        <style>{css}</style>
        {title && <Title title={title} />}
        <div id="example-table" ref={(el) => (this.containerRef = el)}></div>
      </div>
    );
  }
}

export default Table;
