
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('teokset.db');

db.serialize(() => {

  
    let sql = "CREATE TABLE teos (" +
        "id INTEGER PRIMARY KEY NOT NULL, " +
        "nimi TEXT NOT NULL, " +
        "paiva DATE, " +
        "tekniikka TEXT, " +
        "paletti TEXT, " +
        "koko TEXT," + 
        "sijainti TEXT," +
        "muistiinpanot TEXT," +
        "versio TEXT," +
        "viittaukset TEXT," +
        "avainsanat TEXT," +
        "kuva TEXT )";

    db.run(sql, (error) => {
        if (error) {
            return console.log(error.message);
        }
        console.log("Taulu teos tehtiin");
    });

sql = "INSERT INTO teos (`id`, `nimi`, `paiva`, `tekniikka`, `paletti`, `koko`, `sijainti`, `muistiinpanot`, `versio`, `viittaukset`, `avainsanat`, `kuva`) " +
        "VALUES (1, 'Nimeton', '2022-10-30', 'akvarelli, Arches 300gm/m², 100% puuvilla, puolikarkea. Mattoveitsi', '', '21cm x 30,8 cm', 'Kotona, makuuhuoneen seinällä','Muista miksi maalaat!','1','Tehty Tuusulan opiston akvarelimaalaus kurssilla, ja otettu kirjasta, mutta kirjaa tai teoksen alkuperäistä tekijää en kirjannut ylös','Italia, kanerva, talo, puu, vuoret, akvarelli, Tuusulan opisto', 'Nimetön.jpg')"; 

    db.run(sql, (err) => {
        if (err) {
            return console.log(err.message);
        }
        console.log("Rivi lisättiin");
    });


    sql =  "INSERT INTO teos (`id`, `nimi`, `paiva`, `tekniikka`, `paletti`, `koko`, `sijainti`, `muistiinpanot`, `versio`, `viittaukset`, `avainsanat`, `kuva`) " +
        "VALUES (2, 'MaaJaTaivas', '2023-05-10', 'akvarelli paperille, Arches 300gm/m², 100% puuvilla, puolikarkea. Pyöreä näädänkarvasivellin, koko 10 ja 8. Maskineste', '....', '23cm x 16cm', 'Kotona, arkistokansio','Pilvien maalausta pitää harjoitella lisää','1','Kotokunnas Art, Lumoava luonto akvareilleilla, verkkokurssi, osa 3', 'Taivas, maa, mänty, kanervat, luonto, pilvet, ilta, akvarelit, Kotokunas Art','MaaJaTaivas.jpg')"; 

    db.run(sql, (err) => {
        if (err) {
            return console.log(err.message);
        }
        console.log("Rivi lisättiin");
    });

    sql =  "INSERT INTO teos (`id`, `nimi`, `paiva`, `tekniikka`, `paletti`, `koko`, `sijainti`, `muistiinpanot`, `versio`, `viittaukset`, `avainsanat`, `kuva`) " +
        "VALUES (3, 'Karpassieni', '2023-09-21', 'akvarelli paperille, Arches 300gm/m², 100% puuvilla, puolikarkea. Erikokoisia näädänkarvasiveltimiä. Maskineste', 'raw sienna (SH), brunt sienna (SH), Janes Grey (DS), ultramariini (SH), cadmiun yellow light (SH), cadmiun red (SH)', '23cm x 16cm', 'Kotona, arkistokansio', 'Tarvitsisit jonkun pienemmän välineen maskinesteen lisäämiseen, esim pienempi sivellin tai joku teräväkärkinen pyöreäterä','1','Kotokunnas Art, Ruskaretki paletilla verkkokurssi, osa 2', 'Kärpässieni, sieni, syksy, sienestys, akvarellit, Kotokunas Art', 'Kärpässieni.jpg')"; 

    db.run(sql, (err) => {
        if (err) {
            return console.log(err.message);
        }
        console.log("Rivi lisättiin");
    });

    db.each("SELECT id, nimi FROM teos", function (err, row) {
        if (err) {
            return console.log(err.message);
        }
        console.log(row.id + ", " + row.nimi);
    });


    db.close();
});
