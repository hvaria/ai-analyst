import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';

const DataDisplayComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCSVData = async () => {
      setLoading(true);
      try {
        // Replace 'your-csv-file-url.csv' with the actual URL to your CSV file
        const response = await axios.get('https://docs.google.com/spreadsheets/d/1iTaoABS_6zHA-yOv8fUiKhJ-9DTI0rYJ864hSVz6qvo/edit?usp=sharing.csv', {
          responseType: 'blob', // important for parsing the CSV file correctly
        });

        Papa.parse(response.data, {
          header: true,
          complete: (results) => {
            setData(results.data);
            setLoading(false);
          },
          error: (error) => {
            setError(error);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error('Error fetching CSV:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchCSVData();
  }, []);

  if (loading) return <div>Loading data...</div>;
  if (error) return <div>Error loading data</div>;

  // Display your data here
  return (
    <div>
      <h2>CSV Data</h2>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            {/* Adjust the fields according to your CSV's header names */}
            Date: {item.Date}, Gallons Sold: {item['Gallons Sold']}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DataDisplayComponent;
