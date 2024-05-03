/*
     pubsub.js file: Implemente PubNub (equivalent to PubSub on cloud)
     
     The PubNub is used for realtime publish, subscribe adn broadcasting
     using messaging API.

*/

const PubNub = require("pubnub");


const credentials = {
    publishKey: "pub-c-2bb4daad-e7cd-4003-88f0-80d8666f739f",
    subscribeKey: "sub-c-045ed9bc-997f-11ec-879a-86a1e6519840",
    secretKey: "sec-c-ZmY2ZGI2ZTItOTcwOS00YTMxLTllOWItOTE3N2YwYmZhNDZk"
};

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: "BLOCKCHAIN",
    TRANSACTION: 'TRANSACTION'
}

class PubSub{
    constructor({blockchain, transactionPool, wallet}){
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
     
        this.pubnub = new PubNub(credentials);

        this.pubnub.subscribe({channels: Object.values(CHANNELS)});

        this.pubnub.addListener(this.listener());
    }

    broadcastChain() {
     this.publish({
       channel: CHANNELS.BLOCKCHAIN,
       message: JSON.stringify(this.blockchain.chain)
     });
   }
 
   broadcastTransaction(transaction) {
     this.publish({
       channel: CHANNELS.TRANSACTION,
       message: JSON.stringify(transaction)
     });
   }

    subscribeToChannels(){
        this.pubnub.subscribe({
            channels: [Object.values(CHANNELS)]
        });
    }
    listener() {
     return {
       message: messageObject => {
         const { channel, message } = messageObject;
 
         console.log(`Message received. Channel: ${channel}. Message: ${message}`);
         const parsedMessage = JSON.parse(message);
 
         switch(channel) {
           case CHANNELS.BLOCKCHAIN:
             this.blockchain.replaceChain(parsedMessage, true, () => {
               this.transactionPool.clearBlockchainTransactions(
                 { chain: parsedMessage.chain }
               );
             });
             break;
           case CHANNELS.TRANSACTION:
             if (!this.transactionPool.existingTransaction({
               inputAddress: this.wallet.publicKey
             })) {
               this.transactionPool.setTransaction(parsedMessage);
             }
             break;
           default:
             return;
         }
       }
     }
   }
    publish({channel, message}){
        this.pubnub.publish({ message, channel })
        .catch(error => {  // catch the errors
          console.log(error);
        });;
        

    }


}

module.exports = PubSub;