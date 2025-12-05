import BackspaceIcon from "@mui/icons-material/Backspace";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { DataGrid } from "@mui/x-data-grid";
import PropTypes from "prop-types";
import { useCallback, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import DateRangeFilter from "../dateRangeFilter/DateRangeFilter";
import "./table.css";

const Table = ({ columns, data }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    return searchTerm
      ? data.filter((row) => {
          const name = row?.customerName ?? row?.name ?? "";
          return name && name.toLowerCase().includes(searchTerm.toLowerCase());
        })
      : data;
  }, [searchTerm, data]);

  const rowsWithId = useMemo(() => {
    return filteredData.map((row) => ({
      ...row,
      internalId: uuid(),
    }));
  }, [filteredData]);

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  return (
    <div className="table-main-container">
      <div className="table-filter-container">
        <div className="table-input-filter-container">
          <TextField
            label="Filter by Customer Name"
            variant="outlined"
            className="custom-textfield"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Button
            variant="contained"
            disabled={!searchTerm}
            onClick={clearSearch}
            data-testid="clear-search-button"
          >
            <BackspaceIcon />
          </Button>
        </div>
        <DateRangeFilter />
      </div>
      <div className="table-container">
        <DataGrid
          rows={rowsWithId}
          columns={columns}
          pageSizeOptions={[10, 25, 75]}
          getRowId={(row) => row.internalId}
          disableColumnMenu
          disableColumnResize
          disableRowSelectionOnClick
          autoHeight
          showColumnVerticalBorder={false}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
                page: 0,
              },
            },
          }}
          className="custom-grid"
          sx={{
            "& .MuiDataGrid-columnSeparator": {
              display: "none",
            },
            "& .MuiDataGrid-columnHeaderTitleContainer": {
              justifyContent: "space-between",
            },
            "& .MuiDataGrid-row": {
              backgroundColor: "#f5f5f5",
              transition: "background-color 0.2s ease",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#e0e7ff",
            },
          }}
        />
      </div>
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      flex: PropTypes.number,
    })
  ).isRequired,

  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Table;
