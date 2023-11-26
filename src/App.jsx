import React, { useState, useEffect } from 'react';
import './styles.css';


function App() {
  const [cryptoData, setCryptoData] = useState([]);
  const [gecerlisayfa, setGecerlisayfa] = useState(1);
  const [aramaKelimesi, setAramaKelimesi] = useState('');
  const sayfasayisi = 10;

  const fetchData = async () => {
    try {
      const response = await fetch('https://api.coinlore.net/api/tickers/');
      const data = await response.json();
      setCryptoData(data.data);
    } catch (error) {
      console.error('Kripto verisi getirme hatası:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toplamsayfa = () => cryptoData.length / sayfasayisi;

  const sayfayidegistir = (yenisayfa) => {
    if (yenisayfa > 0 && yenisayfa <= toplamsayfa()) {
      setGecerlisayfa(yenisayfa);
    }
  };

  const kriptoParalariFiltrele = () => {
    return cryptoData.filter((crypto) =>
      crypto.name.toLowerCase().includes(aramaKelimesi.toLowerCase())
    );
  };

  const sayfayihazirlaAramaSonucu = () => {
    const filtrelenmisCryptoData = kriptoParalariFiltrele();
    const baslangic = (gecerlisayfa - 1) * sayfasayisi;
    const bitis = baslangic + sayfasayisi;
    return filtrelenmisCryptoData.slice(baslangic, bitis);
  };

  const ilkUcHaneAl = (sayi) => {
    const bes = sayi.slice(12,15)
    const dort = sayi.slice(9, 12)
    const uc = sayi.slice(6, 9)
    const iki = sayi.slice(3, 6)
    const bir = sayi.slice(0, 3)
    
    const yenisayi = `${bir}  ${iki}  ${uc}  ${dort}  ${bes}`
    return yenisayi
  };
  
  return (
    <div className='container'>
      <h1 className='title'>Crypto Prices</h1>
      <div className="arama-container">
        <label>Search:</label>
        <input
          type="text"
          value={aramaKelimesi}
          onChange={(e) => setAramaKelimesi(e.target.value)}
        />
      </div>
      <table className='crypto-table'>
        <thead className='thead-container'>
          <tr>
            <th>Id</th>
            <th>Symbol</th>
            <th>Name</th>
            <th>Price (USD)</th>
            <th>Change (24h)</th>
            <th>Change (1h)</th>
            <th>Change (7d)</th>
            <th>Market Value</th>
          </tr>
        </thead>
        <tbody>
          {sayfayihazirlaAramaSonucu().map((crypto, index) => (
            <tr key={index}>
              <td>{(gecerlisayfa - 1) * sayfasayisi + index + 1}</td>
              <td>
                <strong className='symbol'>{crypto.symbol}</strong>
              </td>
              <td><strong>({crypto.name})</strong></td>
              <td><strong>${crypto.price_usd}</strong></td>
              <td style={{color : crypto.percent_change_24h > 0 ? 'green' : 'red'}}><strong>{crypto.percent_change_24h}%</strong></td>
              <td style={{color : crypto.percent_change_1h > 0 ? 'green' : 'red'}}><strong>{crypto.percent_change_1h}%</strong></td>
              <td style={{color : crypto.percent_change_7d > 0 ? 'green' : 'red'}}><strong>{crypto.percent_change_7d}%</strong></td>
              <td><strong>${ilkUcHaneAl(crypto.market_cap_usd)}</strong></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='sayfalandirma'>
        <button onClick={() => sayfayidegistir(gecerlisayfa - 1)} disabled={gecerlisayfa === 1}>
          Back
        </button>
        <span>Sayfa {gecerlisayfa} / {toplamsayfa()}</span>
        <button onClick={() => sayfayidegistir(gecerlisayfa + 1)} disabled={gecerlisayfa === toplamsayfa()}>
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
