const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const xlsx = require('node-xlsx').default;
const generateSummary = require('./generateSummary');

require('dotenv').config();
const API_KEY = process.env.API_KEY;



const app = express();
app.use(express.json());


// Serve static files from the "api/data" directory
app.use('/api/data', express.static(path.join(__dirname, 'api/data')));



const port = process.env.PORT || 3000;

app.use(cors());

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'api/data/'); // Set the destination folder for uploads
  },
  filename: (req, file, cb) => {
    // Get the file extension
    const ext = path.extname(file.originalname);
    // Save the file with the name 'file' and the original extension
    cb(null, `file${ext}`);
  }
});



// File filter to only allow image uploads
const fileFilter = (req, file, cb) => {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false); 
  }
};

const upload = multer({ 
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'api/data/'); // Set the destination folder for uploads
    },
    filename: (req, file, cb) => {
      // Get the file extension
      const ext = path.extname(file.originalname);
      // Save the file with the name 'file' and the original extension
      cb(null, `file${ext}`);
    }
  }),
  limits: { fileSize: 1000000 }, // 1MB
  fileFilter: (req, file, cb) => {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false); 
    }
  }
});
// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Endpoint to handle file uploads and process data
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    console.log("Upload successful", req.file.path);
    // File processing code has been removed. Now, the endpoint only saves the file.
    res.json({ success: true, message: "File uploaded successfully" });
  } else {
    console.log("Upload failed", req);
    res.status(400).json({ success: false, message: "File upload failed" });
  }
});




app.get('/api/summary/file.json', async (req, res) => {
    const jsonFilePath = path.join(__dirname, 'api/data', 'file.json'); // Static filename used

    try {
        
        const summary = await generateSummary();
        fs.writeFileSync(jsonFilePath, JSON.stringify(summary, null, 2));
        // const x = await generateImage();
        res.json(summary); // Send back the summary or a part of it as needed
    } catch (error) {
        // Here, catch both file reading and summary generation errors
        console.error('Error generating summary:', error);
        res.status(500).send('Error generating summary.');
    }
});




const axios = require('axios');
const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent';


const https = require('https');
// const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta2/models/gemini-pro-vision:generateMessage?key=AIzaSyANLE4EA-Lyr24W1SatgI2fr24UvvFzcLY';

app.post('/api/chatbot', async (req, res) => {
  const { question } = req.body;
  console.log(question);
  try {
    // Read the image file and convert it to a base64-encoded string
    const imagePath = 'api/data/file.png'; // Replace with the path to your image file
    const imageBase64 = fs.readFileSync(imagePath, 'base64');

    // Construct the request payload
    const requestBody = {
      "contents": [{
        "parts": [
          { "text": question },
          { "inlineData": { "mimeType": "image/png", "data": imageBase64 } }
        ]
      }]
    };

    // Send the request to the GeminiPro Vision API
    const response = await fetch(`${API_ENDPOINT}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiResponse = await response.json();
    console.log(apiResponse);

    // Process the API's response and extract the generated content
    // const generatedContent = apiResponse["${question}"].candidates[0].content.parts[0].text;
    
    // Assuming apiResponse has the structure you've indicated in the error message:
    const generatedContent = apiResponse.candidates[0].content.parts[0].text;





    // Format the response in a business analyst style
    const chatbotResponse = `As a business analyst, I would say: ${generatedContent}`;

    // Send the response back to the frontend
    res.json({ answer: chatbotResponse });
  } catch (error) {
    console.error('Error processing chatbot query:', error);
    res.status(500).json({ error: 'An error occurred while processing the chatbot query' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
