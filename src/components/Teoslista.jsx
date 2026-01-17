import React, { useState, useEffect } from 'react';
import { ImageList, ImageListItem, ImageListItemBar, Dialog, DialogTitle, DialogContent, Typography, Button, Box,  } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link} from 'react-router-dom';
import { deleteTeos } from './teokset';
import { getTeokset } from './teokset'; 





function Teoslista () {


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

    
const [avaa, setAvaa] = useState (null);


const handleOpen = (teos) => { //popUp-ikkunan avaaminen
    setAvaa(teos);
};

const handleClose = () => { //popUp-ikkunan sulkeminen
    setAvaa(null)
};

const handleDelete = async (id) => {
    const confirmPoisto = window.confirm("Haluatko varmasti poistaa tämän teoksen?");
    if (confirmPoisto) {
        try {
            // Poistetaan teos palvelimelta
            const response = await deleteTeos(id);
            if (response.status === 200) {
                const uusiTeoslista = teokset.filter((teos) => teos.id !== id);
                setTeokset(uusiTeoslista);
                handleClose();
            } else {
                alert('Teoksen poisto epäonnistui: ' + response.message);
            }
        } catch (error) {
            console.error("Poistossa tapahtui virhe:", error);
            alert('Teoksen poisto epäonnistui: ' + error.message);
        }
    }
};
if (!teokset || teokset.length === 0) {
    return <p>Teoksia ei löytynyt</p>;
}
    
        return (
            //Imagelist MUI kirjastosta, joka järjestelee kuvat galleriaksi, kuvat toistaiseksi haetaan public kansiosta
            <div>
                <ImageList cols={3} gap={16}> 
                    {/*3 saraketta, 16 pix välit,
                    teokset.map läy läpi jokaisen teoksen,
                    jokaiselle teokselle luodaan ImageListItem, jonka key-prop on teoksen id,
                    pointer osoittaa että kuvaa voi klikata,
                    ImageListItemBar näyttää teoksen nimen ja päivämään*/}

                    {teokset.map((teos) => (
                        <ImageListItem key = {teos.id} onClick ={() => handleOpen(teos)}>
                        <img
                        src={`http://localhost:8080/images/${teos.kuva}`}
                        alt={teos.nimi}
                        loading="lazy"
                        style={{ cursor: 'pointer' }}
                        onError={(e) => {
                            console.log('Image not found:', e.target.src);
                        }}
/>
                        <ImageListItemBar title ={teos.nimi}
                        subtitle={<span>{teos.paiva}</span>}/>
                        </ImageListItem>
                        
                    )) }
                </ImageList>
                {/*Dialog asettaa popUp-ikkunan */}
                    {avaa &&(
                        <Dialog open= {Boolean(avaa)} onClose={handleClose} maxWidth="md" fullWidth>
                            <DialogTitle>{avaa.nimi}</DialogTitle>
                        <DialogContent dividers>
                        <img src={`http://localhost:8080/images/${avaa.kuva}`} alt={avaa.nimi} style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }} /> {/* antin muokkaus */}
                        <Typography variant="body1" gutterBottom><strong>Päivämäärä:</strong> {avaa.paiva}</Typography>
                        <Typography variant="body1" gutterBottom><strong>Tekniikka:</strong> {avaa.tekniikka}</Typography>
                        <Typography variant="body1" gutterBottom><strong>Väripaletti:</strong> {avaa.paletti}</Typography>
                        <Typography variant="body1" gutterBottom><strong>Koko:</strong> {avaa.koko}</Typography>
                        <Typography variant="body1" gutterBottom><strong>Sijainti:</strong> {avaa.sijainti}</Typography>
                        <Typography variant="body1" gutterBottom><strong>Muistiinpanot:</strong> {avaa.muistiinpanot}</Typography>
                        <Typography variant="body1" gutterBottom><strong>Versio:</strong> {avaa.versio}</Typography>
                        <Typography variant="body1" gutterBottom><strong>Viittaukset:</strong> {avaa.viittaukset}</Typography>
                        <Typography variant="body1" gutterBottom><strong>Avainsanat:</strong> {avaa.avainsanat}</Typography>
                        </DialogContent>
                        <Box display="flex" alignItems="center" justifyContent="center">
                        <Button onClick={handleClose} color="primary">
                            Sulje
                        </Button>
                        <IconButton color='primary' component ={Link} to = {'/muokkaa/' + avaa.id} >
                        <EditIcon/>
                        </IconButton>
                        <IconButton color='secondary' onClick={() => handleDelete(avaa.id)}>
                        <DeleteIcon /> 
                        </IconButton>
                        </Box>
                    </Dialog>
                 )}
             </div>
            );
            }

export default Teoslista;