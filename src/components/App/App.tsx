import React, { useEffect, useState, ReactText } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
//import './App.css';
import TableSelect from '../TableSelect'
import BuildingsTable from '../BuildingsTable';
import BuildingInfoPane from '../BuildingInfoPane';
import BuildingInfoDrawer from '../BuildingInfoDrawer';
import NavBar from '../NavBar';

function App() {
  // const [tableName, setTableName] = useState('buildings');
  const [selectedBuildingId, setSelectedBuildingId] = useState<number>();

 /*  function handleTableChange(tableName: string) {
    setTableName(tableName);
  } */

  function handleSelectRow(rowId: number) {
    setSelectedBuildingId(rowId);
  }

  return (
    <Container>
      <Box mt={3}>
        <Grid container spacing={3}>
          <Grid item xs>
            <Typography variant="h2" gutterBottom>
              LCA Tool - GUI
              </Typography>
          </Grid>
        </Grid>
      </Box>
      <Grid container spacing={3}>        
        <Grid item xs={12} md={10}>
          <BuildingsTable /* tableName={tableName} */ onSelectRow={handleSelectRow} />
        </Grid>
        <Grid item xs>
          {/* <TableSelect tableName={tableName} onChange={handleTableChange} /> */}
          <p>Click on a row to see the building elements related to it.</p>
        </Grid>
      </Grid>

      <BuildingInfoPane selectedBuildingId={selectedBuildingId} />
      {/* <BuildingInfoDrawer selectedBuildingId={selectedBuildingId} /> */}
    </Container>
  );
}

export default App;