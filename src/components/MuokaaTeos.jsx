import { useState, useEffect } from 'react';
import { Box, Paper, TextField, Button, Typography, InputLabel } from '@mui/material';
import { useParams, useNavigate } from 'react-router'; 
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import fi from 'date-fns/locale/fi';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import AttachmentIcon from '@mui/icons-material/Attachment';
import { format } from 'date-fns'; 
import { updateTeos } from './teokset';
import { getTeokset } from './teokset'; 

function MuokkaaTeos() {
    const [teokset, setTeokset] = useState([]);  
    const [teos, setTeos] = useState({
        id: null,  
        nimi: '',
        paiva: new Date(),
        tekniikka: '',
        paletti: '',
        koko: '',
        sijainti: '',
        muistiinpanot: '',
        versio: '',
        viittaukset: '',
        avainsanat: '',
        kuva: null
    });
    const [viesti, setViesti] = useState('');
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchTeokset = async () => {
            const result = await getTeokset();
            console.log(result);
            if (result.status === 200) {
                setTeokset(result.data);
                const etsitty = result.data.find((teos) => teos.id === Number(id));
                if (etsitty) {
                    setTeos({
                        id: etsitty.id,
                        nimi: etsitty.nimi,
                        paiva: new Date(etsitty.paiva),
                        tekniikka: etsitty.tekniikka,
                        paletti: etsitty.paletti,
                        koko: etsitty.koko,
                        sijainti: etsitty.sijainti,
                        muistiinpanot: etsitty.muistiinpanot,
                        versio: etsitty.versio,
                        viittaukset: etsitty.viittaukset,
                        avainsanat: etsitty.avainsanat,
                        kuva: etsitty.kuva || null
                    });
                }
            } else {
                console.error(result.message);
            }
        };
        fetchTeokset();
    }, []);  // Tyhjä riippuvuuslista varmistaa, että vain kerran haetaan

    const { id } = useParams();
    
    const muuta = (e) => {
        setTeos({ ...teos, [e.target.name]: e.target.value });
    };

    const muutaKuva = (e) => {
        setTeos({ ...teos, kuva: e.target.files[0] });
    };

    const muutaPaiva = (date) => {
        setTeos({ ...teos, paiva: date });
    };

    const tallennaMuutokset = async () => {
        try {
            const formData = new FormData();
            Object.keys(teos).forEach((key) => {
                if (key === 'paiva') {
                    formData.append(key, format(teos[key], 'yyyy-MM-dd'));
                } else {
                    formData.append(key, teos[key]);
                }
            });

            const response = await updateTeos(formData);
            if (response.status === 200) {
                setViesti('Teos päivitetty onnistuneesti');
                navigate('/galleriaSivu');
            } else {
                setViesti('Päivitys epäonnistui: ' + response.message);
            }
        } catch (error) {
            setViesti('Virhe päivityksessä: ' + error.message);
        }
    };

    const peruuta = (e) => {
        e.preventDefault();
        navigate('/galleriaSivu');
    };

    let kuvaNimi = teos.kuva ? teos.kuva.name : '';

    return (
        <Paper sx={{ padding: '10px', margin: '10px' }}>
            <Box component="form" autoComplete="off" sx={{ '& .MuiTextField-root': { marginBottom: 2 } }}>
                <TextField label="Nimi" name="nimi" value={teos.nimi} onChange={muuta} required fullWidth autoFocus />
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fi}>
                    <DesktopDatePicker
                        label="Päivämäärä"
                        inputFormat="yyyy-MM-dd"
                        value={teos.paiva}
                        onChange={muutaPaiva}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                </LocalizationProvider>
                <TextField label="Tekniikka" name="tekniikka" value={teos.tekniikka} onChange={muuta} required fullWidth />
                <TextField label="Paletti" name="paletti" value={teos.paletti} onChange={muuta} required fullWidth />
                <TextField label="Koko" name="koko" value={teos.koko} onChange={muuta} required fullWidth />
                <TextField label="Sijainti" name="sijainti" value={teos.sijainti} onChange={muuta} required fullWidth />
                <TextField label="Muistiinpanot" name="muistiinpanot" value={teos.muistiinpanot} onChange={muuta} required fullWidth />
                <TextField label="Versio" name="versio" value={teos.versio} onChange={muuta} required fullWidth />
                <TextField label="Viittaukset" name="viittaukset" value={teos.viittaukset} onChange={muuta} required fullWidth />
                <TextField label="Avainsanat" name="avainsanat" value={teos.avainsanat} onChange={muuta} multiline rows="4" fullWidth />
                <input accept="image/*" name="kuva" id="kuva" type="file" onChange={muutaKuva} hidden />
                <InputLabel htmlFor="kuva">
                    <Typography sx={{ display: 'inline' }}>Kuva</Typography>
                    <Button component="span">
                        <AttachmentIcon />
                    </Button>
                    <Typography sx={{ display: 'inline' }}>{kuvaNimi} (kuvaa ei vielä päivitetty)</Typography>
                </InputLabel>
                <Box sx={{ textAlign: 'center' }}>
                    <Button onClick={tallennaMuutokset} variant="contained" color="primary" sx={{ marginRight: 3 }}>
                        Tallenna
                    </Button>
                    <Button onClick={peruuta} variant="contained" color="secondary">
                        Peruuta
                    </Button>
                </Box>
            </Box>
            <Typography sx={{ marginTop: 3 }}>{viesti}</Typography>
        </Paper>
    );
}

export default MuokkaaTeos;
