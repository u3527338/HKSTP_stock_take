import * as React from "react";
import { Button } from "./Button";

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
  data: any[];
  columns: { title: string; field: string }[];
}

class Table extends React.Component<Props> {
  containerRef: HTMLDivElement | null = null;
  table: any;

  initTable = () => {
    const { data, columns } = this.props;
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
      selectableRows: true,
    });

    this.table.on("rowClick", (e, row) => {
      const data = row.getData();
      const isSelected = row.isSelected();

      if (isSelected) {
        row.deselect();
      } else {
        row.select();
      }
    });
  };

  componentDidMount(): void {
    this.initTable();
  }

  componentWillUnmount() {
    if (this.table) {
      this.table.destroy();
    }
  }

  renderToolbar() {
    const helpers = {
      export_csv: {
        label: "Export CSV",
        onClick: () => this.table.download("csv", "data.csv"),
      },
      group_by: {
        label: "Group by",
        onClick: () => this.table.setGroupBy("Stort"),
      },
      clear_grouping: {
        label: "Clear Grouping",
        onClick: () => this.table.setGroupBy(),
      },
      return: {
        label: "Go To Page 1",
        onClick: () => this.table.setPage(1),
      },
      sorting: {
        label: "Sorting",
        onClick: () => this.table.setSort([{ column: "Stort", dir: "asc" }]),
      },
      filter: {
        label: "Filter",
        onClick: () => this.table.setFilter("active", "=", true),
      },
      clear_filter: {
        label: "Clear Filter",
        onClick: () => this.table.clearFilter(),
      },
    };
    return (
      <div style={{ display: "flex", gap: 4, marginBottom: "10px" }}>
        {Object.entries(helpers).map(([key, value]) => (
          <Button
            key={key}
            onClick={value.onClick}
            label={value.label}
            buttonStyle="main"
          />
        ))}
      </div>
    );
  }

  toggleColumn(columnField) {
    const col = this.table.getColumn(columnField);
    if (col.isVisible()) {
      col.hide();
    } else {
      col.show();
    }
  }

  render() {
    return (
      <div>
        <style>{css}</style>
        {this.renderToolbar()}
        <div id="example-table" ref={(el) => (this.containerRef = el)}></div>
      </div>
    );
  }
}

export default Table;
