const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 5000;

// Enable CORS
app.use(cors());

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const { path } = file;
    
    // Create FormData object and append file
    const formData = new FormData();
    formData.append('file', fs.createReadStream(path));

    // Make POST request to IPFS API
    const ipfsResponse = await axios.post('http://localhost:5001/api/v0/add', formData, {
      headers: {
        ...formData.getHeaders() // Set Content-Type header correctly
      }
    });

    // Get IPFS hash from response
    const ipfsHash = ipfsResponse.data.Hash;

    res.json({ ipfsHash });
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    res.status(500).json({ error: 'Failed to upload file to IPFS' });
  }
});

app.get('/file/:ipfsHash', async (req, res) => {
  try {
    const { ipfsHash } = req.params;
    
    // Make GET request to IPFS API
    const ipfsResponse = await axios.get(`http://localhost:5001/api/v0/cat?arg=${ipfsHash}`);

    // Send file content as response
    res.send(ipfsResponse.data);
  } catch (error) {
    console.error('Error fetching file from IPFS:', error);
    res.status(500).json({ error: 'Failed to fetch file from IPFS' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
