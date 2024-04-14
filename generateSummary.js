// generateSummary.js


const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const API_KEY = process.env.API_KEY;
// require('dotenv').config();


// Define your API endpoint and key securely
// const API_KEY = process.env.API_KEY; // Securely manage your API key
// const API_KEY = 'AIzaSyANLE4EA-Lyr24W1SatgI2fr24UvvFzcLY'

const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent';

const generateSummary = async () => {
  // Define prompts for different aspects of the financial report
  const prompts = [
    "Analyze the image and extract general information about the report date, company name, and reporting period.",
    'Summarize the Profit and Loss Data insights',
    'Write me income data in dictionary format without extra characters',
    "Please extract the department names and their respective gross profit amounts from the provided image and format the data into dictionary 'department' keys and 'grossProfit' values without extra characters",
    'Analyze the image and give me only revenue summary',
    'Analyze the image and write me only revenue sumamary analysis',
    'Analyze the image and give me only cost of goods summary',
    'Analyze the image and give me only detailed cost of goods analysis',
    'Analyze the image and give me only expense summary',
    'Analyze the image and give me only detailed expense analysis',
    'Analyze the image and give me only Profit summary',
    'Analyze the image and give me only detailed Profit analysis'
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
