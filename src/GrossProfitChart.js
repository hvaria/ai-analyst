// GrossProfitChart.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const GrossProfitChart = ({ grossProfitData }) => {
  const data = Object.entries(grossProfitData).map(([department, grossProfit]) => ({
    department,
    grossProfit,
  }));

  return (
    <BarChart width={500} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="department" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="grossProfit" fill="#8884d8" />
    </BarChart>
  );
};

export default GrossProfitChart;
