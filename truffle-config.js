const path = require("path");
require('./client/node_modules/dotenv').config();


module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
  },
  compilers: {
    solc: {
      version: "0.8.6"
    }
  }

};
