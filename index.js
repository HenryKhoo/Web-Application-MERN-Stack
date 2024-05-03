/*
    index.js file: Handle app startup and routing.

*/

const bodyParser = require("body-parser");
const express = require("express");
const request = require("request");
const path = require("path");
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const Blockchain = require("./blockchain");
const PubSub = require("./app/pubsub");
const TransactionPool = require("./wallet/transaction-pool");
const Wallet = require("./wallet");
const TransactionMiner = require("./app/transaction-miner");
const mongoose = require('mongoose');
const connectDB = require("./db/mydb");
var cors = require('cors');
connectDB();

var user = require("./models/user")




const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({blockchain, transactionPool, wallet});
const transactionMiner = new TransactionMiner({blockchain, transactionPool, wallet, pubsub});

const isDevelopment = process.env.ENV === 'development';
const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;


const app = express();


const corsOptions = {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204,
  "allowedHeaders": ["Content-Type"]
}

setTimeout(()=>pubsub.broadcastChain(), 1000);
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: false
}));
app.use(express.static(path.join(__dirname, "client/dist")));

app.get("/api/blocks", async (req, res)=>{
    res.json(blockchain.chain);

});

app.get("/api/blocks/length", (req, res)=>{
    res.json(blockchain.chain.length);
});

app.get("/api/blocks/:id", (req, res)=>{
   const {id} = req.params;
   const {length} = blockchain.chain;

   const blocksReversed = blockchain.chain.slice().reverse();

   let startIndex = (id-1) *5;
   let endIndex = id * 5;

   startIndex = startIndex < length ? startIndex : length;
   endIndex = endIndex < length ? endIndex : length;

   res.json(blocksReversed.slice(startIndex, endIndex));
});

app.post("/api/mine", (req,res)=>{
    const { data } = req.body;

    blockchain.addBlock({data});

    pubsub.broadcastChain();

    res.redirect('/api/blocks');

});

app.post("/api/transact", (req,res)=>{
  
      const {amount, recipient} = req.body;   
        let transaction = transactionPool
            .existingTransaction({inputAddress: wallet.publicKey}); 

        try{
            if(amount === 0 ){
              res.status(400).json({
                errorMessage: `The amount must be more than 0!`,
                status: false
              });
            } else if(amount === "" || recipient === ""){
              res.status(400).json({
                errorMessage: `Enter all the fields!`,
                status: false
              });
            }else{
                if(transaction){
                  transaction.update({senderWallet: wallet,recipient,amount});
                  
                }
                else{
                    transaction = wallet.createTransaction({recipient, amount});
                }
                transactionPool.setTransaction(transaction);
                pubsub.broadcastTransaction(transaction);
                console.log("here here")
                console.log(transaction);
                console.log("bla blalalala")
                res.json({ message: 'Transaction successfully registered.',type:"success", transaction, status: true});
            }
          }catch(error){
            return res.status(400).json({
              message: error.message,
              status: false})
        }


})

//transaction pool map for recording all the transactions 
app.get("/api/transaction-pool-map", (req,res)=>{
    res.json(transactionPool.transactionMap);

});

//mine the transactions that are accepted
app.get("/api/mine-transactions",(req,res)=>{
    try {

      //res.status(200).json({});
      transactionMiner.mineTransactions();
      
      res.json(blockchain.chain);
      console.log("here here here")
      console.log(blockchain.chain);
      console.log("bla blalalala blaaaa")
      res.redirect(req.protocol + '://' + req.get('/api/blocks'));    
      

    } catch (error) {
      return res.status(400).json({
        message: error.message,
        status: false})
    }

})


//public address is visible for the owner and the sender
app.get("/api/wallet-info", (req,res)=>{
    const address = wallet.publicKey;

    res.json({address,
        balance: Wallet.calculateBalance({chain: blockchain.chain, address })
    });
});

app.get("/api/known-addresses", (req,res) =>{
    const addressMap = {};

    for (let block of blockchain.chain){
        for (let transaction of block.data){
            const recipient = Object.keys(transaction.outputMap);

            recipient.forEach(recipient => addressMap[recipient] = recipient);
        }
    }
    res.json(Object.keys(addressMap));
});

app.get("/api/app", (req, res)=>{

    res.sendFile(path.join (__dirname, "client/dist/index.html"));
})


const syncWithRootState = () => {
    request({ url : `${ROOT_NODE_ADDRESS}/api/blocks`}, (error, response,body) => {
        if(!error && response.statusCode === 200){
            const rootChain = JSON.parse(body);

            console.log("replace chain on a sync with", rootChain);
            blockchain.replaceChain(rootChain);
            
        }
    });

    request({url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map`}, (error, response, body)=>{
        if(!error && response.statusCode === 200){
            const rootTransactionPoolMap = JSON.parse(body);

            console.log("replace transaction pool map on a sync with", rootTransactionPoolMap);
            transactionPool.setMap(rootTransactionPoolMap);
        }
    })
};
const dummyTransaction = true;
//if(isDevelopment){
  if(dummyTransaction){
    const walletFoo = new Wallet();
    const walletBar = new Wallet();

    const generateWalletTransaction= ({wallet, recipient, amount}) =>{
        const transaction = wallet.createTransaction({
            recipient, amount, chain: blockchain.chain
        });
        transactionPool.setTransaction(transaction);
    };


    const walletAction = () => generateWalletTransaction({
        wallet, recipient: walletFoo.publicKey, amount: 10
    });

    const walletFooAction = () => generateWalletTransaction({
        wallet: walletFoo, recipient: walletBar.publicKey, amount: 15
    });

    const walletBarAction = () => generateWalletTransaction({
        wallet: walletBar, recipient: wallet.publicKey, amount: 15
    });

    for(let i=0; i<10; i++){
        if (i %3 === 0){
            walletAction();
            walletFooAction();
        }
        else if (i%3 === 1){
            walletAction();
            walletBarAction();
        }
        else{
            walletBarAction();
            walletFooAction();

        }
        transactionMiner.mineTransactions();
    }
}



app.use("/", (req, res, next) => {
    try {
      if (req.path == "/login" || req.path == "/register" || req.path == "/") {
        next();
      } else {
        /* decode jwt token if authorized*/
        jwt.verify(req.headers.token, 'shhhhh11111', function (err, decoded) {
          if (decoded && decoded.user) {
            req.user = decoded;
            next();
          } else {
            return res.status(401).json({
              errorMessage: 'User unauthorized!',
              status: false
            });
          }
        })
      }
    } catch (e) {
      res.status(400).json({
        errorMessage: 'Something went wrong!',
        status: false
      });
    }
  })
  app.get("/", (req, res) => {
    res.status(200).json({
      status: true,
      title: 'Apis'
    });
  });
  
  /* login api */
  app.post("/login", (req, res) => {
    try {
      if (req.body && req.body.username && req.body.password) {
        user.find({ username: req.body.username }, (err, data) => {
          if (data.length > 0) {
  
            if (bcrypt.compareSync(data[0].password, req.body.password)) {
              checkUserAndGenerateToken(data[0], req, res);
            } else {
              res.status(400).json({
                errorMessage: 'Username or password is incorrect!',
                status: false
              });
            }
  
          } else {
            res.status(400).json({
              errorMessage: 'Username or password is incorrect!',
              status: false
            });
          }
        })
      } else {
        res.status(400).json({
          errorMessage: 'Add proper parameter first!',
          status: false
        });
      }
    } catch (e) {
      res.status(400).json({
        errorMessage: 'Something went wrong!',
        status: false
      });
    }
  
  });
  
  /* register api */
  app.post("/register", (req, res) => {
    try {
      if (req.body && req.body.username && req.body.password) {
  
        user.find({ username: req.body.username }, (err, data) => {
  
          if (data.length == 0) {

            let User = new user({
              username: req.body.username,
              password: req.body.password
            });

            User.save((err, data) => {
              console.log(err)
              if (err) {

                res.status(400).json({
                  errorMessage: err,
                  status: false
                });
              } else {

                res.status(200).json({
                  status: true,
                  title: 'Registered Successfully.'
                });
              }
            });
  
          } else {
            res.status(400).json({
              errorMessage: `UserName ${req.body.username} Already Exist!`,
              status: false
            });
          }
        });
  
      } else {
        res.status(400).json({
          errorMessage: 'Add proper parameter first!',
          status: false
        });
      }
    } 
    catch (e) {
      res.status(400).json({
        errorMessage: 'Something went wrong!',
        status: false
      });
    }
  });
  
  function checkUserAndGenerateToken(data, req, res) {
    jwt.sign({ user: data.username, id: data._id }, 'shhhhh11111', { expiresIn: '1d' }, (err, token) => {
      if (err) {
        res.status(400).json({
          status: false,
          errorMessage: err,
        });
      } else {
        res.json({
          message: 'Login Successfully.',
          token: token,
          status: true
        });
      }
    });
  }
  function isEmpty(obj) {
    for(var prop in obj) {
      if(Object.prototype.hasOwnProperty.call(obj, prop)) {
        return false;
      }
    }
  
    return JSON.stringify(obj) === JSON.stringify({});
  }



let PEER_PORT; 

if(process.env.GENERATE_PEER_PORT === "true"){
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = process.env.PORT || PEER_PORT || DEFAULT_PORT;

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)

    if(PORT !== DEFAULT_PORT){
        syncWithRootState();
    }
})