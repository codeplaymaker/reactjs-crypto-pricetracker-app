import React, { useEffect, useState, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { getCryptoData } from '../services/CryptoService';
import { Link } from 'react-router-dom';
import debounce from 'lodash/debounce';
import logo from '../assets/logo.png';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f0f2f5;
  min-height: 100vh;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const Logo = styled.img`
  width: 100px;
  height: auto;
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-right: 20px;

  @media (max-width: 600px) {
    width: 80px;
    margin-right: 10px;
  }
`;

const Title = styled.h1`
  color: #333;
  font-size: 2rem;
  margin: 0;

  @media (max-width: 600px) {
    font-size: 1.5rem;
  }
`;

const Table = styled.table`
  width: 100%;
  max-width: 1200px;
  border-collapse: collapse;
  margin-bottom: 20px;

  @media (max-width: 600px) {
    width: 100%;
    overflow-x: auto;
    display: block;
  }
`;

const Th = styled.th`
  background-color: #f8f8f8;
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;

  @media (max-width: 600px) {
    padding: 8px;
    font-size: 0.9rem;
  }
`;

const Td = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;

  @media (max-width: 600px) {
    padding: 8px;
    font-size: 0.9rem;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  margin: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  ${({ primary }) =>
    primary
      ? css`
          background-color: white;
          color: #333;
          border: 1px solid #ccc;
        `
      : css`
          background-color: #007bff;
          color: white;
        `}

  @media (max-width: 600px) {
    padding: 8px 16px;
    font-size: 0.9rem;
    margin: 5px;
  }
`;

const Loading = styled.p`
  font-size: 1.2rem;
  color: #333;

  @media (max-width: 600px) {
    font-size: 1rem;
  }
`;

const Error = styled.p`
  font-size: 1.2rem;
  color: #e53935;

  @media (max-width: 600px) {
    font-size: 1rem;
  }
`;

const CryptoList = () => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sortType, setSortType] = useState('market_cap');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCryptoData();
        setCryptos(data);
      } catch (err) {
        console.error('Error fetching crypto data:', err);
        setError('Failed to fetch crypto data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearch(value);
    }, 300),
    []
  );

  const handleSearch = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleSort = (type) => {
    setSortType(type);
  };

  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    setCryptos([]);
    getCryptoData()
      .then(data => setCryptos(data))
      .catch(err => {
        console.error('Error fetching crypto data:', err);
        setError('Failed to fetch crypto data. Please try again later.');
      })
      .finally(() => setLoading(false));
  };

  const filteredCryptos = cryptos
    .filter(crypto => crypto.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortType === 'name') return a.name.localeCompare(b.name);
      if (sortType === 'price') return b.current_price - a.current_price;
      if (sortType === 'market_cap') return b.market_cap - a.market_cap;
      return 0;
    });

  if (loading) return <Loading>Loading...</Loading>;
  if (error) return <Error>{error}</Error>;

  return (
    <Container>
      <Header>
        <Logo src={logo} alt="CryptoOwl Logo" />
        <Title>CryptoOwl</Title>
      </Header>
      <input
        type="text"
        placeholder="Search for a cryptocurrency..."
        onChange={handleSearch}
        style={{ padding: '10px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #ccc', width: '100%', maxWidth: '400px' }}
      />
      <div>
        <Button primary onClick={() => handleSort('name')}>Sort by Name</Button>
        <Button primary onClick={() => handleSort('price')}>Sort by Price</Button>
        <Button primary onClick={() => handleSort('market_cap')}>Sort by Market Cap</Button>
        <Button onClick={handleRefresh}>Refresh</Button>
      </div>
      <Table>
        <thead>
          <tr>
            <Th>#</Th>
            <Th>Coin</Th>
            <Th>Price</Th>
            <Th>24h</Th>
            <Th>24h Volume</Th>
            <Th>Market Cap</Th>
          </tr>
        </thead>
        <tbody>
          {filteredCryptos.map((crypto, index) => (
            <tr key={crypto.id}>
              <Td>{index + 1}</Td>
              <Td>
                <Link to={`/coin/${crypto.id}`} style={{ textDecoration: 'none', color: '#007bff', display: 'flex', alignItems: 'center' }}>
                  <img src={crypto.image} alt={`${crypto.name} logo`} style={{ width: '20px', height: '20px', marginRight: '10px' }} />
                  {crypto.name} ({crypto.symbol.toUpperCase()})
                </Link>
              </Td>
              <Td>${crypto.current_price.toFixed(2)}</Td>
              <Td style={{ color: crypto.price_change_percentage_24h > 0 ? '#4caf50' : '#e53935' }}>
                {crypto.price_change_percentage_24h?.toFixed(2)}%
              </Td>
              <Td>${crypto.total_volume.toLocaleString()}</Td>
              <Td>${crypto.market_cap.toLocaleString()}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default CryptoList;
