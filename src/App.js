import React, { useState } from 'react';
import './App.css';
// import { fetchCSVData } from './api'; // Adjust the import path as needed
import DataDisplayComponent from './index';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleButtonClick = async (queryType) => {
    setLoading(true);
    setData(null);
    setError(null);

    try {
      // Assuming your backend endpoints are named similarly to the queryType
      const jsonData = await fetchCSVData(queryType);
      setData(jsonData);
      console.log(jsonData); // For demonstration purposes
    } catch (err) {
      setError(`Failed to fetch data for ${queryType}: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Gas Station Dashboard</h1>
        <button onClick={() => handleButtonClick('totalFuelSales')}>Total Fuel Sales</button>
        <button onClick={() => handleButtonClick('totalStoreSales')}>Total Store Sales</button>
        <button onClick={() => handleButtonClick('profitMargin')}>Profit Margin</button>
        {/* Add more buttons for each functionality */}
      </header>
      <main>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {data && (
          <div>
            <h2>Data Loaded</h2>
            {/* Render your data here. Example: */}
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
