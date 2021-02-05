import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IRootState } from "redux/reducers";
import allActions from "redux/actions";

import {
  Theme,
  createStyles,
  makeStyles,
  withStyles,
  emphasize,
} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import HomeIcon from "@material-ui/icons/Home";
import Paper from "@material-ui/core/Paper";
import Switch from "@material-ui/core/Switch";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

import MaterialsView from "../MaterialsView";
import ElementsTable from "./ElementsTable";
import ElementsChart from "./ElementsChart";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    breadCrumbs: {
      marginBottom: theme.spacing(2),
    },
    chart: {
      // height: 600,
      padding: theme.spacing(2),
    },
    elementTable: {
      padding: theme.spacing(2),
    },
  })
);

const StyledBreadcrumb = withStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.grey[100],
    height: theme.spacing(3),
    color: theme.palette.grey[800],
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.grey[300],
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(theme.palette.grey[300], 0.12),
    },
  },
}))(Chip) as typeof Chip; // TypeScript only: need a type cast here because https://github.com/Microsoft/TypeScript/issues/26591

const BuildingElementsView = (props: any) => {
  const dispatch = useDispatch();
  const buildingElements = useSelector(
    (state: IRootState) => state.buildingElements
  );
  const materialInventory = useSelector(
    (state: IRootState) => state.materialInventory
  );
  const selectedBuildingElement = useSelector(
    (state: IRootState) => state.selectedBuildingElement
  );
  const elementRoute = useSelector(
    (state: IRootState) => state.buildingElementRoute
  );
  const displayMode = useSelector((state: IRootState) => state.displayMode);

  useEffect(() => {
    const rootElement = buildingElements.find(
      (element: IBuildingElement) => element.hierarchy === 0
    );
    if (rootElement !== undefined) {
      dispatch(
        allActions.elementAndMaterialActions.selectBuildingElement(rootElement)
      );
      dispatch(
        allActions.elementAndMaterialActions.setElementRoute([rootElement])
      );
    }
  }, []);

  const getChildElements = (parentElement: IBuildingElement) => {
    const childElements = buildingElements.filter(
      (element) => element.idparent === parentElement.idlevels
    );
    if (childElements !== undefined) {
      return childElements;
    }

    return [];
  };

  const getElementMaterials = (parentElement: IBuildingElement) => {
    const elementMaterials = materialInventory.filter(
      (material) =>
        material.idbuilding_elements === parentElement.idbuilding_elements
    );
    if (elementMaterials !== undefined) {
      return elementMaterials;
    }

    return [];
  };

  const handleBreadcrumbClick = (index: number) => {
    var tempRoute = elementRoute.slice(0, index + 1);
    dispatch(
      allActions.elementAndMaterialActions.selectBuildingElement(
        tempRoute[tempRoute.length - 1]
      )
    );
    dispatch(allActions.elementAndMaterialActions.setElementRoute(tempRoute));
  };

  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [clearedRow, setClearedRow] = useState<string | null>(null);

  const handleRowHover = (elementName: string) => {
    setHoveredRow(elementName);
  };

  const handleRowClearHover = (elementName: string) => {
    setClearedRow(elementName);
  };

  const childElements = getChildElements(selectedBuildingElement);

  const classes = useStyles();

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Breadcrumbs aria-label='breadcrumb' className={classes.breadCrumbs}>
            {elementRoute.map((element, index) => (
              <StyledBreadcrumb
                key={index}
                label={element.name}
                variant='default'
                icon={
                  element.idlevels === 0 ? (
                    <HomeIcon fontSize='small' />
                  ) : undefined
                }
                onClick={() => handleBreadcrumbClick(index)}
              />
            ))}
          </Breadcrumbs>
        </Grid>
        <Grid item xs={12}>
          {childElements?.length > 0 ? (
            displayMode == "table" ? (
              <Paper>
                <ElementsTable />
              </Paper>
            ) : (
              <Paper>
                <ElementsChart />
              </Paper>
            )
          ) : (
            <MaterialsView />
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default BuildingElementsView;
