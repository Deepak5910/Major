// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DocumentRegistry {
    struct Patient {
        string name;
        uint256 age;
        string gender;
        address patientAddress;
        string[] documents;
    }

    mapping(address => Patient) public patients;

    function addPatient(string memory _name, uint256 _age, string memory _gender) external {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(_age > 0, "Age must be greater than 0");
        require(bytes(_gender).length > 0, "Gender cannot be empty");
        
        patients[msg.sender] = Patient(_name, _age, _gender, msg.sender, new string[](0));
    }

    function addDocument(string memory _document) external {
        require(bytes(_document).length > 0, "Document cannot be empty");
        
        patients[msg.sender].documents.push(_document);
    }

    function getPatientInfo() external view returns (string memory, uint256, string memory, string[] memory) {
        Patient storage patient = patients[msg.sender];
        return (patient.name, patient.age, patient.gender, patient.documents);
    }
}
