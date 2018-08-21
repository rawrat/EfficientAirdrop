var HDWalletProvider = require("truffle-hdwallet-provider");

require('babel-register');
require('babel-polyfill');

//ADD YOUR OWN MNEMONIC (and keep it secret so don't push it to a repo)

var mnemonic = "";

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*",
      from: "0x814522b9eb8bb1a46bbda84270554c14523e2f84"
    },

    rinkeby: {
        provider: function() {
          return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/")
        },
        network_id: 4,
        gas: 7000000
    },

    ropsten: {
        provider: function() {
          return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/")
        },
        network_id: 3,
        gas: 7000000
    }

  },

  mocha: {
    enableTimeouts: false
  }

};