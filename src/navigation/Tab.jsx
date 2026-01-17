import React, { useState } from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import HomeIcon from '@mui/icons-material/Home';
import Teoslista from '../components/Teoslista';
import TeosTilastointi from '../components/TeosTilastointi';
import Etusivu from '../components/Etusivu';
import TeoslistaHaku from '../components/TeoslistaHaku';
import Teoslomake from '../components/Teoslomake';
import { Link, Outlet } from 'react-router-dom';

import MenuItem from '@mui/material/MenuItem';

function TabMUI({ teokset }) {
  const [value, setValue] = useState(0);

  const handleChange = (e, val) => {
    setValue(newValue);
  }


  return (
    <Box>
      <AppBar position='static' sx={{ backgroundColor: '#FFFFFF' }}>
        <Tabs 
          value={value} 
          onChange={handleChange} 
          textColor="inherit" 
          indicatorColor="secondary" 
          sx={{
            width: '100%', 
            display: 'flex', 
            justifyContent: 'center', 
            '& .MuiTab-root': {
              color: '#000000', 
              '&.Mui-selected': {
                color: '#D8CBAE', // Valittuna oleva väri (beige/hiekka)
              },
            },
          }}
        >
         <MenuItem component={Link} to='/'>
            <Tab label='' icon={<HomeIcon />} />
          </MenuItem>
          <MenuItem component={Link} to='/galleriaSivu'>
            <Tab label='Galleria' />
          </MenuItem>
          <MenuItem component={Link} to='/lisaaTeos'>
            <Tab label='Lisää teos' />
          </MenuItem>
          <MenuItem component={Link} to='/tilastointi'>
            <Tab label='Tilastointi' />
          </MenuItem>
        </Tabs>
      </AppBar>

 
      
      <Outlet /> 
    </Box>
  );
}

export default TabMUI;