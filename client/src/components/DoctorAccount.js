import React, { useEffect, useState } from 'react';
import patientIcon from '../img/doctor.png'; // Import patient icon image
import Web3 from 'web3';

const patientAddress = "ajhjhgahdghafhgda";

function Doctor() {
  const [documents, setDocuments] = useState([]);
  const [publicAddress, setPublicAddress] = useState(""); // State variable to hold the MetaMask public address

  useEffect(() => {
    // Fetch uploaded documents from local storage
    const storedDocuments = JSON.parse(localStorage.getItem('uploadedDocuments')) || [];
    setDocuments(storedDocuments);

    // Fetch MetaMask public address
    const fetchPublicAddress = async () => {
      if (window.ethereum) {
        const w3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const accounts = await w3.eth.getAccounts();
        setPublicAddress(accounts[0] || ""); // Set public address to the first account if available
      } else {
        console.error('MetaMask not detected');
      }
    };

    fetchPublicAddress();
  }, []);

  const handleViewFile = (ipfsHash) => {
    // Open the file using the local IPFS gateway
    window.open(`http://localhost:8080/ipfs/${ipfsHash}`, '_blank');
  };

  const handleRemoveFile = (index) => {
    // Copy the documents array
    const updatedDocuments = [...documents];
    // Remove the document at the specified index
    updatedDocuments.splice(index, 1);
    // Update the state and local storage
    setDocuments(updatedDocuments);
    localStorage.setItem('uploadedDocuments', JSON.stringify(updatedDocuments));
  };

  return (
    <div className="container">
      <div className="patient-account">
        <div className="patient-icon-container">
          <img src={patientIcon} alt="Patient Icon" className="patient-icon" />
        </div>
        <div className="patient-details-box">
          <p>Patient Name: Dr. Nimish Saket</p>
          <p>Mob No: +919876353563</p>
          <p>specialty: Orthopedics</p>
          <p>
            Public Address: {publicAddress}
          </p>
          {/* Add more patient details as needed */}
        </div>

        <table className="files-table">
          <thead>
            <tr>
              <th>File Name</th>
              <th>IPFS Hash</th>
              <th>View</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((document, index) => (
              <tr key={index}>
                <td>{document.fileName}</td>
                <td>{document.ipfsHash}</td>
                <td>
                  <button onClick={() => handleViewFile(document.ipfsHash)}>View File</button>
                </td>
                <td>
                  <button onClick={() => handleRemoveFile(index)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Doctor;
