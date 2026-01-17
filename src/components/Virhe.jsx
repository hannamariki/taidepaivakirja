import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Virhe() {
  return (
    <Box sx={{ textAlign: 'center', marginTop: 4 }}>
      <Typography variant="h4" color="error">Tapahtui virhe!</Typography>
      <Typography variant="h6" color="textSecondary">Valitettavasti jokin meni pieleen.</Typography>
      <Button component={Link} to="/" variant="contained" color="primary" sx={{ marginTop: 2 }}>
        Palaa etusivulle
      </Button>
    </Box>
  );
}

export default Virhe;
