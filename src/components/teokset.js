import axios from 'axios';

let palvelin = 'http://localhost:8080/';

export const getTeokset = async () => {
  try {
    const response = await axios.get(palvelin + 'teos/all');
    console.log(response)
    return (response);
  } catch (error) {
    return ({ status: 400, message: 'Haku ei onnistunut: ' + error.message });
  }
  
}

export const addTeos = async (teos) => {
  try {
    const response = await axios.post(palvelin + 'teos/add', teos, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return (response);

  } catch (error) {
    return ({ status: 400, message: 'Lisäys ei onnistunut: ' + error.message });
  }
}

export const updateTeos = async (teos) => {
  try {
      const response = await axios.put(palvelin + 'teos/update', teos, {
       headers: { 'Content-Type': 'application/json' }  
     }); 
    return response;

  } catch (error) {
    return { status: 400, message: 'Lisäys ei onnistunut: ' + error.message };
  }
}

export const deleteTeos = async (id) => {
  try {
    const response = await axios.delete(palvelin + 'teos/delete/' + id);
    return (response);
  } catch (error) {
    console.error('Poistovirhe:', error.response || error.message);
    return { status: error.response?.status || 400, message: 'Poisto ei onnistunut: ' + (error.response?.data?.message || error.message) };
  }
};