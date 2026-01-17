const express = require('express');
const app = express();

const path = require('path'); 
app.use(express.json());

let helmet = require('helmet');

app.use(helmet({ crossOriginResourcePolicy: false }));


app.use(express.urlencoded({ limit: '5mb', extended: true }));

const cors = require('cors');

app.use(cors());

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('teokset.db');

app.listen(8080, () => {
    console.log('Node toimii localhost:8080');
});

app.get('/', (req, res) => {
    return res.status(200).json({ message: 'Toimii' });
});

app.get('/teos/all', (req, res) => {
    db.all('select * from teos', (error, result) => {
        if (error) {
            console.log(error.message);
            return res.status(400).json({ message: error.message });
        }

        return res.status(200).json(result);
    });
});

app.get('/teos/one/:id', (req, res) => {
    let id = req.params.id;

    db.get('select * from teos where id = ?', [id], (error, result) => {
        if (error) {
            console.log(error.message);
            return res.status(400).json({ message: error.message });
        }

     
        if (typeof (result) == 'undefined') {
            return res.status(404).json({ message: 'Haettua teosta ei ole' });
        }

        return res.status(200).json(result);
    });
});

app.get('/teos/kuvat', (req, res) => {
    db.all('select kuva  from teos where kuva IS NOT NULL', (error, result) => {
        if (error) {
            console.log(error.message);
            return res.status(400).json({ message: error.message });
        }

        return res.status(200).json(result);
    });
});

app.delete('/teos/delete/:id', (req, res) => {
    let id = req.params.id;
    if (!id) {
        return res.status(400).json({ message: 'Teoksen ID on puutteellinen' });
    }
  
    db.run('delete from teos where id = ?', [id], function (error) {
        if (error) {
            console.log(error.message);
            return res.status(400).json({ message: error.message });
        }

        if (this.changes === 0) {
            console.log('Ei poistettavaa');
            return res.status(404).json({ message: 'Ei poistettavaa teosta' });
        }

        return res.status(200).json({  message: 'Teos poistettu', changes: this.changes });
    });
});

const multer = require('multer');



const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './images'); 
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname); 
    }
});

const upload = multer({ storage: storage })

app.post('/teos/add', upload.single('kuva'), (req, res) => {
    console.log('Received file', req.file);

    let teos = req.body;

    let kuvaNimi = null;
    if (req.file) {
        kuvaNimi = req.file.originalname;
        console.log('File name:',kuvaNimi)
    }

    db.run('insert into teos (nimi, paiva, tekniikka, paletti, koko, sijainti, muistiinpanot, versio, viittaukset, avainsanat, kuva) values (?, ?, ?, ?, ?, ?, ?,?,?,?,?)',
        [teos.nimi, teos.paiva, teos.tekniikka, teos.paletti, teos.koko, teos.sijainti, teos.muistiinpanot, teos.versio, teos.viittaukset, teos.avainsanat, kuvaNimi], (error) => {

            if (error) {
                console.log(error.message);
                return res.status(400).json({ message: error.message });
            }
             
            return res.status(200).json({count: 1});
        });
});

app.put('/teos/update', (req, res) => {
    let teos = req.body;
    

    db.run('update teos set nimi=?, paiva=?, tekniikka=?, paletti=?, koko=?, sijainti=?, muistiinpanot=?, versio=?, viittaukset=?, avainsanat=? where id=?',
        [teos.nimi, teos.paiva, teos.tekniikka, teos.paletti, teos.koko, teos.sijainti, teos.muistiinpanot, teos.versio, teos.viittaukset, teos.avainsanat, teos.id], (error) => {

            if (error) {
                console.log(error.message);
                return res.status(400).json({ message: error.message });
            }

            return res.status(200).json({ count: 1 });
        });
});

const fs = require('fs');
const imagesDir = path.join(__dirname, 'images');

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
  console.log('Images directory created');
}

app.use('/images', express.static(path.join(__dirname, 'images')));


app.get('/images/:imageName', (req, res) => {
    const imagePath = path.join(__dirname, 'images', req.params.imageName);
    
    fs.exists(imagePath, (exists) => {
        if (!exists) {
            return res.status(404).json({ message: 'Image not found' });
        }
        res.sendFile(imagePath);
    });
});

app.get('/download/:nimi', (req, res) => {
    let file = './images/' + req.params.nimi;
    res.download(file);
});


app.get('*', (req, res) => {
    return res.status(404).json({ message: 'Ei pyydettyä palvelua' });
});
