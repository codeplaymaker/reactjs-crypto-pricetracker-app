import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: #333;
  font-size: 2rem;
  margin-bottom: 10px;
`;

const Overview = styled.p`
  color: #666;
  font-size: 1rem;
  margin-bottom: 20px;
`;

const Stat = styled.div`
  margin-bottom: 10px;
  font-size: 1.2rem;
  color: #555;
`;

const Error = styled.p`
  color: #e53935;
  font-size: 1.2rem;
`;

const CoinDetail = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`);
        setCoin(response.data);
      } catch (err) {
        console.error('Error fetching coin data:', err);
        setError('Failed to fetch coin data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCoinData();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <Error>{error}</Error>;

  // Extracting a brief overview from the description
  const overview = coin.description.en.split('. ').slice(0, 2).join('. ') + '.';

  return (
    <Container>
      <Title>{coin.name} ({coin.symbol.toUpperCase()})</Title>
      <Overview>{overview}</Overview>
      <Stat>Current Price: ${coin.market_data.current_price.usd.toLocaleString()}</Stat>
      <Stat>Market Cap: ${coin.market_data.market_cap.usd.toLocaleString()}</Stat>
      <Stat>24h Volume: ${coin.market_data.total_volume.usd.toLocaleString()}</Stat>
      <Stat>Price Change 24h: {coin.market_data.price_change_percentage_24h.toFixed(2)}%</Stat>
      <Stat>Circulating Supply: {coin.market_data.circulating_supply.toLocaleString()} {coin.symbol.toUpperCase()}</Stat>
      <Stat>Max Supply: {coin.market_data.max_supply ? coin.market_data.max_supply.toLocaleString() : 'N/A'}</Stat>
    </Container>
  );
};

export default CoinDetail;
