interface IBuilding {
  idbuildings: number;
  building_identifier: string;
  building_name: string;
  project: string;
  country: string;
  city: string;
  typology: string;
  construction_type: string;
  lifetime: number;
  floor_area: number;
  A1A3: ?number;
  A4: ?number;
  B4_m: ?number;
  B4_t: ?number;
  /* built_status
    energy_ambition_level
    calculation_method
    main_data_source
    study_type
    study_year
    lifetime
    floor_area
    A1A3
    A4
    B4_m
    B4_t
    GWP_B6
    GWP_B7
    heated_volume
    area_footprint
    area_roof
    area_wall
    area_windowAndDoor
    heatloss_number
    comments */
}

interface IBuildingElement {
  idbuilding_elements: number;
  idlevels: number;
  name: string;
  A1A3: ?number;
  A4: ?number;
  B4_m: ?number;
  B4_t: ?number;
  hierarchy: number;
  idparent: ?number;
}

interface IMaterialInventory {
  idmaterialInventory: number;
  parentId: number;
  name: string;
  quantity: number;
  FU: string;
  A1A3: ?number;
  A4: ?number;
  B4_m: ?number;
  B4_t: ?number;
  RSL_mi: ?number;
  idbuilding_elements: number;
  buildingElementName: string;
  materialCat: string;
  sourceType: string;
  source: string;
  dataType: string;
  dataYear?: string;
  density: ?number;
  EEf_A1A3: number;
  RSL: ?number;
  country: string?;
  city: string?;
  comments: ?string;
}

interface IMaterialTableParentRow {
  idmaterials: number;
  name: string;
  materialCat: string;
  sourceType: string;
  A1A3: ?number;
  A4: ?number;
  B4_m: ?number;
  B4_t: ?number;
  RSL_mi: ?number;
  source: string;
  dataType: string;
  dataYear?: string;
  density: ?number;
  EEf_A1A3: number;
  RSL: ?number;
  comments: ?string;
  parentId: null;
}

interface IMaterialTableChildRow {
  idmaterialInventory: number;
  name: string;
  quantity: number;
  FU: string;
  A1A3: ?number;
  A4: ?number;
  B4_m: ?number;
  B4_t: ?number;
  RSL_mi: ?number;
  buildingElementName: string;
  parentId: number;
}

type IMaterialTableRow = IMaterialTableParentRow | IMaterialTableChildRow;

interface ISingleChartDataItem {
  lcaPhase: string;
  gwp: number;
}

interface ICompareChartDataItem {
  name: string;
  identifier: string;
  a1a3: number;
  a4: number;
  b4m: number;
  b4t: number;
}
/* 
interface IElementChartDataItem {
  name: string;
  id: string;
  A1A3: number;
  A4: number;
  B4_m: number;
  B4_t: number;
}
 */
/* 
interface IMaterialChartDataItem {
  name: string;
  id: string;
  A1A3: number;
  A4: number;
  B4_m: number;
  B4_t: number;
  materialCat: string;
}
 */
interface IChartDataItem {
  name: string;
  id: string;
  A1A3: number;
  A4: number;
  B4_m: number;
  B4_t: number;
  materialCat: string;
}

interface ISimulationData {
  inventoryId: number;
  simulatedFields: { fieldName: string; simulatedValue: string | number }[];
}
