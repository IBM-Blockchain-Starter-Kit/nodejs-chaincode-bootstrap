[![Build Status](https://travis-ci.org/IBM-Blockchain-Starter-Kit/nodejs-chaincode-bootstrap.svg?branch=master)](https://travis-ci.org/IBM-Blockchain-Starter-Kit/nodejs-chaincode-bootstrap)

# Chaincode (TypeScript/Node.js) scaffolding repository for Blockchain Starter Kit

## Chaincode Development Instructions
* The [my-asset](/src/my-asset) directory is provided as a chaincode component example. You can keep or modify this provided chaincode component as you like.

## Chaincode Deployment Instructions
Populate the [deployment configuration](deploy_config.json) JSON file with information about network targets, including organizations, channels, and peers. Please note that included in this repository, there is a deployment configuration example file with the default network architecture to install and instantiate the asset chaincode component on a Hyperledger Fabric network.

## Environment
We have successfully tested and deployed this scaffolding chaincode component on [Hyperledger Fabric v1.4.4](https://hyperledger-fabric.readthedocs.io/en/release-1.4/releases.html).