import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Typography, Container } from '@mui/material';
import TabMUI from './navigation/Tab';
import Etusivu from './components/Etusivu';
import Teoslista from './components/Teoslista';
import TeosTilastointi from './components/TeosTilastointi';
import GalleriaSivu from './components/GalleriaSivu';
import TeoslistaHaku from './components/TeoslistaHaku';
import Teoslomake from './components/Teoslomake';
import MuokkaaTeos from './components/MuokaaTeos';
import { getTeokset } from './components/teokset';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000', // Musta
    },
    secondary: {
      main: '#D8CBAE', // Beige
    },
    background: {
      default: '#FFFFFF', // Valkoinen 
    },
  },
  typography: {
    fontFamily: "'PT Sans Narrow', 'serif'", 
  },
});

function App() {
  const [teokset, setTeokset] = useState([]); 
  

  // Haetaan teokset palvelimelta
  useEffect(() => {
    const fetchTeokset = async () => {
      const result = await getTeokset();  
      console.log(result); 
      if (result.status === 200) {
        setTeokset(result.data);  
      } else {
        console.error(result.message);  
      }
    };
    fetchTeokset();
  }, []);


  const router = createBrowserRouter([ 
    {
      element: <TabMUI />,
      children: [
        {
          path: '/', 
          element: <Etusivu />,
        },
        {
          path: 'galleriaSivu', 
          element: <GalleriaSivu teokset={teokset}/>,
        },
        {
          path: 'lisaaTeos', 
          element: <Teoslomake setTeokset={setTeokset} />,
        },
        {
          path: 'tilastointi', 
          element: <TeosTilastointi teokset={teokset} />,
        },
        {
          path: 'muokkaa/:id', 
          element: <MuokkaaTeos teokset={teokset} />,
        },
        {
          path: 'teoslista', 
          element: <Teoslista teokset={teokset} setTeokset={setTeokset} /> ,  
        },
      ],
    }
  ]);

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Typography variant="h2" align="center" sx={{ fontFamily: "'Dancing Script',  'cursive'", mt: 4 }} >
          Digitaalinen Taidepäiväkirja
        </Typography>
        <RouterProvider router={router} />
      </Container>
    </ThemeProvider>
  );
}

export default App;
