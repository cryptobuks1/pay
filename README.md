# GENTRION
[Gentrion](https://gentrion.io/) is Infrastructure to build cryptocurrency and blockchain-based applications for the next generation of financial technology.

## Core Technology

It was developed using the Zcash, Bitcore, and Nomad Coin modules in the Node.JS environment.
Following technologies are used in this project (some are omitted)
- Node.js
- React.js
- Koa
- Express
- MongoDB
- Mongoose
- expo
- create-react-app


## Getting started

Before you begin you'll need to have Node.js v8 installed. There are several options for installation. One method is to use nvm to easily switch between different versions, or download directly from Node.js.


### Installing

1. Install global dependencies

    ```
    npm install -g pm2
    npm install -g nodemon
    ```

2. Clone the project from the github repository

    ```
    git clone git@github.com:gentrion/pay.git
    ```
3. Install local dependencies

    Project for the client and the server separated in two different directories. 
    ```
    cd account
    npm install
    cd ../explorer
    npm install
    cd ../blockchain-node
    npm install
    cd ../mobile-wallet
    npm install
    ```
4. Input the values for the envioronment variables.

    ```
    account/.env
    blockchain-node/.env
    ```

### Development

For the development environment, you have to run two kind of scripts.

1. `npm run dev` from **account**  (*MongoDB must be installed.)
2. `npm start` from **explorer**
3. `npm run dev:super` from **blockchain-node**
4. `npm run dev:bp` from **blockchain-node**
5. `npm run dev:chain` from **blockchain-node**
6. `Start in Expo XDE` from **mobile-wallet**


### Build or Run

1. `npm run server` from **account**  (*PM2 must be installed.)
2. `npm build` from **explorer**
3. `npm run server:super` from **blockchain-node**  (*PM2 must be installed.)
4. `npm run server:bp` from **blockchain-node**
5. `npm run server:chain` from **blockchain-node**
6. `Build in Expo XDE` from **mobile-wallet**

## Questions?

If you have any questions, leave an email to gentlemars09@gmail.com

## License

Code released under the MIT license.
Copyright 2018 Gentlemars, Inc. Gentrion is a trademark maintained by GentrionPay, Inc.
