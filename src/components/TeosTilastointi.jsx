import React, { useState, useEffect } from 'react';  // Tuodaan useState
import { PieChart } from '@mui/x-charts';
import { getTeokset } from './teokset'; 

function TeosTilastointi() {

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
    }, []);  // Tyhjä riippuvuuslista, vain ensimmäinen renderöinti

    // Lasketaan teosten määrät vuosittain
    const yearCount = teokset.reduce((acc, teos) => {
        if (teos.paiva) {
            // Käytetään suoraan Date-objektia, koska päivämäärä on muodossa 'YYYY-MM-DD'
            const date = new Date(teos.paiva);
            const year = date.getFullYear();
            if (!isNaN(year)) {
                acc[year] = (acc[year] || 0) + 1;
            }
        }
        return acc;
    }, {});

    // Muutetaan objekti taulukoksi Pie Chartia varten
    const data = Object.entries(yearCount).map(([year, count]) => ({
        id: year,
        value: count,
        label: `${year}: ${count}`,
    }));

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF5577'];

    return (
        <div>
            <h2>Teokset vuosittain</h2>
            {data.length > 0 ? (
                <PieChart
                    series={[{ data: data }]}
                    colors={COLORS}
                    width={400}
                    height={400}
                />
            ) : (
                <p>Ei dataa saatavilla</p>
            )}
        </div>
    );
}

export default TeosTilastointi;
