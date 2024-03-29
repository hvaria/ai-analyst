const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const xlsx = require('node-xlsx').default;
const preprocessData = require('./preprocessData'); // Import the preprocessData function
const generateSummary = require('./generateSummary');



const app = express();

// Serve static files from the "api/data" directory
app.use('/api/data', express.static(path.join(__dirname, 'api/data')));


const port = 3000;

app.use(cors());

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'api/data/'); // Set the destination folder for uploads
  },
  filename: (req, file, cb) => {
    cb(null, 'file.xls');
  }
});

const upload = multer({ storage: storage });

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Endpoint to handle file uploads and process data
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    console.log("Upload successful", req.file.path);

    // Read and process the uploaded file
    try {
      const workSheets = xlsx.parse(fs.readFileSync(req.file.path));
      // console.log(workSheets[0].data);
      const jsonData = preprocessData(workSheets[0].data);

      // Optionally, save the JSON data to a file in the same location
      const jsonFilePath = path.join(__dirname, 'api/data', 'file.json');
      fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));

      res.json({ success: true, message: "File uploaded and processed successfully", data: jsonData });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error processing file.');
    }
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


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
