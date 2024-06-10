import axios from 'axios';

const API_URL = 'https://api.coingecko.com/api/v3';

export const getCryptoData = async () => {
  const cachedData = localStorage.getItem('cryptoData');
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  try {
    const response = await axios.get(`${API_URL}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 50,
        page: 1,
        sparkline: false
      }
    });
    const data = response.data;
    localStorage.setItem('cryptoData', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Error fetching data: ', error);
    throw error;
  }
};
