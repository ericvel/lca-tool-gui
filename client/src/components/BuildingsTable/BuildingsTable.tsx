import React, { useState, useEffect, useCallback, ReactText } from "react";
import { useSelector, useDispatch } from "react-redux";
import allActions from "redux/actions";
import { IRootState } from "redux/reducers";

import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

import {
  SortingState,
  IntegratedSorting,
  SearchState,
  SelectionState,
  IntegratedFiltering,
  DataTypeProvider,
} from "@devexpress/dx-react-grid";
import {
  Grid,
  Toolbar,
  SearchPanel,
  TableHeaderRow,
  ColumnChooser,
  TableColumnVisibility,
  Table,
  VirtualTable,
  TableSelection,
  TableFixedColumns,
} from "@devexpress/dx-react-grid-material-ui";
import { Template, TemplatePlaceholder } from "@devexpress/dx-react-core";
import _ from "lodash";
import classNames from "clsx";

import {
  DecimalTypeProvider,
  SortLabel,
} from "components/TableUtilities/Formatters";
import ColumnData from "./ColumnData";
import LoadingIndicator from "components/LoadingIndicator";
import AlertSnackbar from "components/AlertSnackbar";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    selected: {
      backgroundColor: "#EEEEEE",
    },
    customRow: {
      "@supports (-webkit-backdrop-filter: none) or (backdrop-filter: none)": {
        "&:hover": {
          cursor: "pointer",
          "& > *": {
            backdropFilter: "brightness(97%)",
          },
          "& .buildingTableFixedCell": {
            filter: "brightness(97%)",
          },
        },
      },
      // fallback for Firefox (not supporting backdrop-filter)
      "@supports not ((-webkit-backdrop-filter: none) or (backdrop-filter: none))": {
        "&:hover": {
          cursor: "pointer",
          backgroundColor: "#F6F6F6",
          "& .buildingTableFixedCell": {
            backgroundColor: "#F6F6F6",
          },
        },
      }
    },
  })
);

const getRowId = (row: any) => row[Object.keys(row)[0]];
const Root = (props: any) => (
  <Grid.Root {...props} style={{ height: "100%" }} />
);

const CustomTableRow = (props: any) => {
  const {
    className,
    highlighted,
    selectByRowClick,
    onToggle,
    ...restProps
  } = props;
  const classes = useStyles();

  return (
    <Table.Row
      {...restProps}
      className={classNames(
        { [classes.selected]: highlighted, [classes.customRow]: true },
        className
      )}
      onClick={(e: any) => {
        if (!selectByRowClick) return;
        e.stopPropagation();
        onToggle();
      }}
    />
  );
};

const CustomFixedCell = ({ ...props }: any) => (
  <TableFixedColumns.Cell {...props} className='buildingTableFixedCell' />
);

const getHiddenColumnsFilteringExtensions = (hiddenColumnNames: string[]) =>
  hiddenColumnNames.map((columnName) => ({
    columnName,
    predicate: () => false,
  }));

function BuildingsTable() {
  const dispatch = useDispatch();
  const buildings = useSelector((state: IRootState) => state.buildings);

  const [columns] = useState(ColumnData.columns);
  const [columnExtensions] = useState(ColumnData.columnExtensions);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState<string>();

  const [defaultHiddenColumnNames] = useState(
    ColumnData.defaultHiddenColumnNames
  );
  const [tableColumnVisibilityColumnExtensions] = useState(
    ColumnData.tableColumnVisibilityColumnExtensions
  );
  const [leftColumns] = useState([TableSelection.COLUMN_TYPE, "building_name"]);
  const multipleSwitchChecked = useSelector(
    (state: IRootState) => state.canSelectMultipleBuildings
  );

  const [decimalColumns] = useState([
    "A1A3",
    "A4",
    "B4_t",
    "B4_m",
    "GWP_B6",
    "GWP_B7",
  ]);

  const handleMultipleSwitchChange = () => {
    dispatch(allActions.uiActions.toggleCanSelectMultiple());
    dispatch(allActions.buildingActions.deselectAllBuildings());
    setSelectedRow([]);
  };

  useEffect(() => {
    loadData();
  }, []);

  function handleErrors(response: Response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }

  const loadData = () => {
    if (!loading) {
      setLoading(true);

      var URL = process.env.REACT_APP_API_URI + "/buildings";

      console.log("URL: ", URL);
      fetch(URL)
        .then(handleErrors)
        .then((response) => response.json())
        .then((data) => {
          dispatch(allActions.buildingActions.setBuildings(data));
          setLoading(false);
          console.log("Fetched rows: ", buildings);
        })
        .catch((error) => {
          console.log("Error getting building data:", error);
          setError(error);
          setLoading(false);
        });
    }
  };

  const changeSearchTerm = (value: any) => {
    console.log("Changed search term: ", value);
    setSearchTerm(value);
  };

  // Delays query so it is not fired on every keystroke
  const delayedCallback = useCallback(_.debounce(changeSearchTerm, 300), []);

  // Only search in visible columns
  const [filteringColumnExtensions, setFilteringColumnExtensions] = useState(
    getHiddenColumnsFilteringExtensions(defaultHiddenColumnNames)
  );

  const onHiddenColumnNamesChange = (hiddenColumnNames: string[]) =>
    setFilteringColumnExtensions(
      getHiddenColumnsFilteringExtensions(hiddenColumnNames)
    );

  const [selectedRow, setSelectedRow] = useState<ReactText[]>([]);

  function changeSelection(selection: ReactText[]) {
    // Select one row or multiple rows at a time
    if (!multipleSwitchChecked) {
      const lastSelected = selection.find(
        (selected) => selectedRow.indexOf(selected) === -1
      );

      if (lastSelected !== undefined) {
        setSelectedRow([lastSelected]);

        const rowId = selection[selection.length - 1];
        console.log("Selected row: ", rowId);
        const building = buildings.find(
          (building) => building.idbuildings === rowId
        );
        if (building !== undefined)
          dispatch(allActions.buildingActions.selectBuildings([building]));
      } else {
        // Clear selection by double-click on same row
        setSelectedRow([]);
        dispatch(allActions.buildingActions.deselectAllBuildings());
      }
    } else {
      setSelectedRow(selection);
      const selectedBuildings = buildings.filter((building) =>
        selection.includes(building.idbuildings)
      );
      dispatch(allActions.buildingActions.selectBuildings(selectedBuildings));
    }
  }

  return (
    <Paper style={{ height: "100%" }}>
      <Grid
        rows={buildings}
        columns={columns}
        getRowId={getRowId}
        rootComponent={Root}
      >
        <DecimalTypeProvider for={decimalColumns} />
        <SearchState onValueChange={delayedCallback} />
        <IntegratedFiltering columnExtensions={filteringColumnExtensions} />
        <SortingState />
        <IntegratedSorting />
        <SelectionState
          selection={selectedRow}
          onSelectionChange={changeSelection}
        />
        <VirtualTable height='auto' columnExtensions={columnExtensions} />
        <TableHeaderRow showSortingControls sortLabelComponent={SortLabel} />
        <TableSelection
          selectByRowClick
          highlightRow={true}
          showSelectionColumn={multipleSwitchChecked}
          rowComponent={CustomTableRow}
        />
        <TableFixedColumns
          leftColumns={leftColumns}
          cellComponent={CustomFixedCell}
        />
        <TableColumnVisibility
          defaultHiddenColumnNames={defaultHiddenColumnNames}
          columnExtensions={tableColumnVisibilityColumnExtensions}
          onHiddenColumnNamesChange={onHiddenColumnNamesChange}
        />
        <Toolbar />
        <Template name='toolbarContent'>
          <TemplatePlaceholder />
          <FormControlLabel
            control={
              <Switch
                checked={multipleSwitchChecked}
                onChange={handleMultipleSwitchChange}
                name='checkedB'
                color='primary'
              />
            }
            label='Select multiple'
          />
        </Template>
        <SearchPanel />
        <ColumnChooser />
      </Grid>
      {loading && <LoadingIndicator />}
      {error && (
        <AlertSnackbar
          message="Couldn't load data, the server may be down."
          severity='error'
        />
      )}
    </Paper>
  );
}

export default BuildingsTable;
