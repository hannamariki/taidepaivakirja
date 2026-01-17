import React, { useState } from 'react';
import Teoslista from './Teoslista';
import TeoslistaHaku from './TeoslistaHaku';


//tämä yhdistää Teoslista ja TeoslistaHaku sivuston reititystä varten

function GalleriaSivu({ teokset }) {
  const [filteredTeokset, setFilteredTeokset] = useState(teokset); // Suodatetut teokset

  return (
    <div>
      <TeoslistaHaku teokset={teokset} setFilteredTeokset={setFilteredTeokset} />
      <Teoslista teokset={filteredTeokset} /> 
    </div>
  );
}

export default GalleriaSivu;