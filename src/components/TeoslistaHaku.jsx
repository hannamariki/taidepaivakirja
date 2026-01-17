import React, { useState, useEffect } from 'react';
import { ImageList, ImageListItem, ImageListItemBar, Dialog, DialogTitle, DialogContent, Typography, Button, Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';
import './Tyylit.css'; 
import { getTeokset } from './teokset'; 

function TeoslistaHaku() {
    const [hakusana, setHakusana] = useState('');
    const [haetaan, setHaetaan] = useState(false);
    const [avaa, setAvaa] = useState(null);

    const [teokset, setTeokset] = useState([]);  // Teokset-tila
  

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

    const muuta = (e) => {
        setHakusana(e.target.value);
        setHaetaan(false);
    };

    const hae = () => {
        setHaetaan(true);
    };

    const haeTeokset = () => {
        if (haetaan) {
            const filtered = teokset.filter(teos =>
                (teos.nimi && teos.nimi.toLowerCase().includes(hakusana.toLowerCase())) ||
                (teos.paiva && teos.paiva.toLowerCase().includes(hakusana.toLowerCase())) ||
                (teos.tekniikka && teos.tekniikka.toLowerCase().includes(hakusana.toLowerCase())) ||
                (teos.paletti && teos.paletti.toLowerCase().includes(hakusana.toLowerCase())) ||
                (teos.koko && teos.koko.toLowerCase().includes(hakusana.toLowerCase())) ||
                (teos.sijainti && teos.sijainti.toLowerCase().includes(hakusana.toLowerCase())) ||
                (teos.arvio && teos.arvio.toLowerCase().includes(hakusana.toLowerCase())) ||
                (teos.muistiinpanot && teos.muistiinpanot.toLowerCase().includes(hakusana.toLowerCase())) ||
                (teos.versio && teos.versio.toLowerCase().includes(hakusana.toLowerCase())) ||
                (teos.viittaukset && teos.viittaukset.toLowerCase().includes(hakusana.toLowerCase())) ||
                (teos.avainsanat && teos.avainsanat.toLowerCase().includes(hakusana.toLowerCase()))
            );

            if (filtered.length > 0) {
                return (
                    <ImageList cols={3} gap={16}>
                        {filtered.map((teos) => (
                            <ImageListItem key={teos.id} onClick={() => setAvaa(teos)}>
                                <img
                                    src={`http://localhost:8080/images/${teos.kuva}`}
                                    alt={teos.nimi}
                                    loading="lazy"
                                    style={{ cursor: 'pointer' }}
                                />
                                <ImageListItemBar title={teos.nimi} subtitle={<span>{teos.paiva}</span>} />
                            </ImageListItem>
                        ))}
                    </ImageList>
                );
            } else {
                return <p>Ei löytynyt teoksia, jotka vastaavat hakusanaa.</p>;
            }
        }
    };

    const handleClose = () => {
        setAvaa(null);
    };

    const handleDelete = async (id) => {
        const confirmPoisto = window.confirm("Haluatko varmasti poistaa tämän teoksen?");
        if (confirmPoisto) {
            
        }
    };

    return (
        <div>
            {/* Hakukenttä */}
            <div className="hakukentta-container">
                <div className="hakukentta-wrapper">
                    <input
                        type="text"
                        className="hakukentta"
                        placeholder="Hae teoksia..."
                        value={hakusana}
                        onChange={muuta}
                    />
                    <IconButton onClick={hae} className="hae-painike">
                        <SearchIcon />
                    </IconButton>
                </div>
            </div>

            {/* Teosten näyttäminen hakutuloksilla */}
            {haeTeokset()}

            {/* PopUp-ikkuna */}
            {avaa && (
                <Dialog open={Boolean(avaa)} onClose={handleClose} maxWidth="md" fullWidth>
                    <DialogTitle>{avaa.nimi}</DialogTitle>
                    <DialogContent dividers>
                        <img
                            src={`http://localhost:8080/images/${avaa.kuva}`}
                            alt={avaa.nimi}
                            style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }}
                        />
                        <Typography variant="body1" gutterBottom>
                            <strong>Päivämäärä:</strong> {avaa.paiva}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Tekniikka:</strong> {avaa.tekniikka}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Väripaletti:</strong> {avaa.paletti}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Koko:</strong> {avaa.koko}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Sijainti:</strong> {avaa.sijainti}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Muistiinpanot:</strong> {avaa.muistiinpanot}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Versio:</strong> {avaa.versio}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Viittaukset:</strong> {avaa.viittaukset}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Avainsanat:</strong> {avaa.avainsanat}
                        </Typography>
                    </DialogContent>
                    <Box display="flex" alignItems="center" justifyContent="center">
                        <Button onClick={handleClose} color="primary">
                            Sulje
                        </Button>
                        <IconButton color="primary" component={Link} to={'/muokkaa/' + avaa.id}>
                            <EditIcon />
                        </IconButton>
                        <IconButton color="secondary" onClick={() => handleDelete(avaa.id)}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                </Dialog>
            )}
        </div>
    );
}

export default TeoslistaHaku;
