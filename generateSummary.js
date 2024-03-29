// generateSummary.js


const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

require('dotenv').config();


// Define your API endpoint and key securely
const API_KEY = process.env.API_KEY; // Securely manage your API key

const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent';

const generateSummary = async () => {
  // Define prompts for different aspects of the financial report
  const prompts = [
    "Analyze the image and extract general information about the report date, company name, and reporting period.",
    'Summarize the Profit and Loss Data insights',
    'Write me income data in dictionary format without extra characters',
    "Please extract the department names and their respective gross profit amounts from the provided image and format the data into dictionary 'department' keys and 'grossProfit' values without extra characters"
    // "Extract the total sales for each department from the P&L sheet, structure this information in a JSON format for visualization.",
    // "Dynamically identify and extract the gross profit amounts for each department and encode this data in for charting and analysis in dictionary",
    // "Retrieve detailed expenses from the P&L sheet, categorizing them by type (Maintenance, Wages, Utilities, etc.), and present in JSON format for cost analysis",
    // "Calculate the profit margin for each department using sales and gross profit data, and structure the results in a JSON object for margin analysis.",
    // "Collect sales and purchase costs for each department from the P&L sheet, then create a JSON object to compare these figures in a visualization.",
    // "Extract beginning and ending inventory values, compute the inventory turnover rate, and organize these metrics in a JSON structure for inventory analysis.",
    // "Identify rebates received by department, extract these values, and encode them in a JSON object for analyzing the impact of rebates on sales.",
    // "Separately extract sales data for lottery tickets, structure it in a JSON format, and use this data to assess the performance of lottery sales."
    // 'Generate Gross profit Bar Chart by department: This chart would be a bar chart that shows the gross profit for each department. This would be calculated by subtracting the cost of goods sold from the revenue for each department.'
    // Add more prompts as needed for department breakdown, additional income streams, etc.
  ];

  const imagePath = path.join(__dirname, 'api/data', 'file.png');
  const imageBase64 = fs.readFileSync(imagePath, 'base64');
  let results = {};

  for (const prompt of prompts) {
    const requestBody = {
      "contents": [{
        "parts": [
          { "text": prompt },
          { "inlineData": { "mimeType": "image/png", "data": imageBase64 } }
        ]
      }]
    };

    try {
      const response = await fetch(`${API_ENDPOINT}?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      results[prompt] = data; // Store the result with the prompt as the key
    } catch (error) {
      console.error(`Error processing prompt "${prompt}":`, error);
      // Handle error appropriately
    }
  }

  // console.log('Compiled results:', JSON.stringify(results, null, 2));
  return results;
};





 module.exports = generateSummary
