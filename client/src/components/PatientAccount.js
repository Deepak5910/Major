import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Web3 from 'web3';
import DocumentRegistry from '../DocumentRegistry.json';
import '../App.css';
import patientIcon from '../img/patient.png'; // Import patient icon image

const patientAddress = 'ahsdhghdgha';

function Patient() {
  const [files, setFiles] = useState([]);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [uploadedDocuments, setUploadedDocuments] = useState([]); // State to hold details of uploaded documents
  const [publicAddress, setPublicAddress] = useState(""); // State variable to hold the MetaMask public address

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const w3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        setWeb3(w3);

        const networkId = await w3.eth.net.getId();
        const deployedNetwork = DocumentRegistry.networks[networkId];
        const docContract = new w3.eth.Contract(
          DocumentRegistry.abi,
          deployedNetwork && deployedNetwork.address
        );
        setContract(docContract);

        // Fetch MetaMask public address
        const accounts = await w3.eth.getAccounts();
        setPublicAddress(accounts[0] || "");
      } else {
        console.error('MetaMask not detected');
      }
    };

    initWeb3();
  }, []);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    try {
      const uploadedDocs = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post('http://localhost:5000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        const ipfsHash = response.data.ipfsHash;

        // Store IPFS hash in blockchain
        await contract.methods.addDocument(ipfsHash).send({ from: (await web3.eth.getAccounts())[0] });

        console.log('Uploaded IPFS Hash:', ipfsHash);

        // Fetch document details from IPFS and add to uploadedDocs array
        uploadedDocs.push({ ipfsHash, fileName: file.name });
      }

      // Update uploaded documents state by concatenating new uploaded documents with existing ones
      setUploadedDocuments([...uploadedDocuments, ...uploadedDocs]);

      // Retrieve existing uploaded documents from local storage
      const existingUploadedDocs = JSON.parse(localStorage.getItem('uploadedDocuments')) || [];

      // Store uploaded documents in local storage by concatenating new and existing documents
      localStorage.setItem('uploadedDocuments', JSON.stringify([...existingUploadedDocs, ...uploadedDocs]));
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="container">
      <div className="patient-account">
        <div className="patient-icon-container">
          <img src={patientIcon} alt="Patient Icon" className="patient-icon" />
        </div>
        <div className="patient-details-box">
          <p>Patient Name: Mr. Rahul Kumar</p>
          <p>Age: 22</p>
          <p>Gender: Male</p>
          {/* Add more patient details as needed */}
          {publicAddress && <p>Public Address: {publicAddress}</p>}
        </div>

        <div className="file-box">
          <input type="file" onChange={handleFileChange} multiple />
          <input type="text" placeholder='Doctor Public address'></input>
          <button onClick={handleUpload}>Upload</button>
        </div>

        {/* Display document details in a separate box */}
        {uploadedDocuments.length > 0 && (
          <div className="document-details-box">
            <h2>Uploaded Documents</h2>
            <table className="files-table">
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>IPFS Hash</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                {uploadedDocuments.map((document, index) => (
                  <tr key={index}>
                    <td>{document.fileName}</td>
                    <td>{document.ipfsHash}</td>
                    <td>
                      <a href={`http://localhost:8080/ipfs/${document.ipfsHash}`} target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Patient;
