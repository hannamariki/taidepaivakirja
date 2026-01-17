import { useState } from 'react';
import DatePicker from 'react-datepicker'; 
import 'react-datepicker/dist/react-datepicker.css';
import {TextField, Button, Typography, Box, Stepper, Step, StepLabel,} from '@mui/material';
import { addTeos } from './teokset';
//Stepper askel askeleelta etenemiseen
//Step jokaisen askeleen esittämiseen
//StepLabel askeleen nimen näyttämiseen



const askeleet = ['Teoksen tiedot', 'Tekniset tiedot', 'Lisätietoja' ];

function Teoslomake(setTeokset) {
  const [askel, setAskel] = useState(0); //asetetaan tila seuraavaan vaiheeseen siirtymiselle
  const [date, setDate] = useState(new Date());
  const [teos, setTeos] = useState({
    nimi: '',
    paiva: '',
    tekniikka: '',
    paletti: '',
    koko: '',
    sijainti: '',
    arvio: '',
    muistiinpanot: '',
    versio: '',
    viittaukset: '',
    avainsanat: '',
    kuva: '',
  

  });
  const [viesti, setViesti] = useState('');

 const muutaTeos = (e) =>{ 
  setTeos(
    {...teos, [e.target.name]: e.target.value})
  if(teos.nimi.length > 0){
  setViesti('');
  }
 }

const lisaaKuva = (e) => {
  setTeos({...teos, kuva: e.target.files[0]});
}

 const lisaaTeos = async () => {
  if (teos.nimi.length === 0 && askel === 0) {
    setViesti('Teoksen nimi on pakollinen tieto');
    return;
  }
  if (askel === askeleet.length - 1) {
    try {
      const formData = new FormData();
      Object.keys(teos).forEach((key) => {
        if (key === 'kuva' && teos.kuva) {
          formData.append(key, teos.kuva); 
        } else {
          formData.append(key, teos[key]);
        }
      });

      

      // Lähetetään uusi teos palvelimelle
      const response = await addTeos(formData);
      if (response.status === 200) {
        setViesti('Teos lisätty onnistuneesti');
      
      
        setTeos({
          nimi: '',
          paiva: '',
          tekniikka: '',
          paletti: '',
          koko: '',
          sijainti: '',
          muistiinpanot: '',
          versio: '',
          viittaukset: '',
          avainsanat: '',
          kuva: '',
        });
      

        setAskel(0); // Palataan ensimmäiseen vaiheeseen
      } else {
        setViesti('Teoksen lisäys epäonnistui: ' + response.message);
      }
    } catch (error) {
      setViesti('Virhe lisäyksessä: ' + error.message);
    }

  }else{
    setAskel((prevAskel) => prevAskel + 1); //siirrytään seuraavaan vaiheeseen 
    setViesti('');
  }
 };

 const takaisin = () => {
  setAskel((prevAskel) => prevAskel -1); //siirrytään takaisin
 }

  return (
    <Box sx={{ width: '50%', margin: '40px auto', padding: 2, boxShadow: 3, backgroundColor: 'white' }}>
    <Typography variant="h4" gutterBottom>
      Teoslomake
    </Typography>
      
    <Stepper activeStep={askel}> 
        {askeleet.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel> 
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {askel === 0 && ( // Ensimmäinen vaihe
          <>
          <TextField label= "Teoksen nimi" name='nimi' value={teos.nimi} onChange={ (e) => muutaTeos(e)} variant ="outlined" fullWidth/>           
          
            <Typography variant="body1" gutterBottom>Päivämäärä</Typography>
            <DatePicker 
                selected={date} 
                onChange={(date) => {
                  setDate(date); 
                  setTeos({ ...teos, paiva: date.toISOString().split('T')[0] }); // Päivämäärän asettaminen teokseen
                }} // Asetetaan valittu päivämäärä
                dateFormat="yyyy.MM.dd" // Muotoilua
                placeholderText="Valitse päivämäärä" // Paikkateksti
              />

             <TextField label="Työn sijainti" name='sijainti' value={teos.sijainti} onChange={muutaTeos} variant="outlined" fullWidth multiline maxRows={10}/>
          </>
        )}

        {askel === 1 && ( //toinen vaihe
           <>
            <TextField label="Tekniikka" name='tekniikka' value={teos.tekniikka} onChange={muutaTeos} variant="outlined" fullWidth multiline maxRows={10}/>

            <TextField label="Väripaletti" name='paletti' value={teos.paletti} onChange={muutaTeos} variant="outlined" fullWidth multiline maxRows={10}/>

            <TextField label="Työn koko" name='koko' value={teos.koko} onChange={muutaTeos} variant="outlined" fullWidth/>
          
          </>
        )}

  
        {askel === 2 && ( //kolmas vaihe 
          <>
            <TextField label="Muistiinpanot" name='muistiinpanot' value={teos.muistiinpanot} onChange={muutaTeos} variant="outlined" fullWidth multiline maxRows={10} />

            <TextField label="Viittaukset" name='viittaukset' value={teos.viittaukset} onChange={muutaTeos} variant="outlined" fullWidth multiline maxRows={10}/>

            <TextField label="Avainsanat" name='avainsanat' value={teos.avainsanat} onChange={muutaTeos} variant="outlined" fullWidth multiline maxRows={10}/>

            <input
              accept="image/*"
              style={{ display: 'none' }} // Piilotetaan tiedostokenttä
              id="raised-button-file"
              type="file"
              onChange={lisaaKuva} // Käsitellään tiedoston muutosta
            />
            <label htmlFor="raised-button-file">
              <Button variant="contained" component="span">
                Lisää kuva
              </Button>
            </label>
          </>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button disabled={askel === 0} onClick={takaisin}>
            Takaisin
          </Button>
        <Button onClick={lisaaTeos}>
          {askel === askeleet.length -1 ? 'Lisää' : 'Seuraava'}
        </Button>
      </Box>
   
      {viesti && <Typography variant="body1" color="success.main">{viesti}</Typography>}
      </Box>
      </Box>
  );
}

export default Teoslomake;
