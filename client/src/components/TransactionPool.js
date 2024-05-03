import React, {Component} from "react"
import {Button} from "react-bootstrap";
import Transaction from "./Transaction";
import {Link} from "react-router-dom";
import history from "../history";
import swal from 'sweetalert';

const POLL_INTERVAL_MS =10000;

class TransactionPool extends Component{
    state = {transactionPoolMap: {}};

    fetchTransactionPoolMap = () =>{
        fetch(`${document.location.origin}/api/transaction-pool-map`)
            .then(response => response.json())
            .then(json => this.setState({transactionPoolMap: json}))
            
    }
    fetchMineTransactions = () =>{
        if (Object.keys(this.state.transactionPoolMap).length === 0) {
            swal({
                text: "No transaction in transaction pool!",
                icon: "error",
                type: "error"
              });
        }
        else{
        fetch(`${document.location.origin}/api/mine-transactions`)
            .then(response =>{
                if(response.status === 200){
                   
                    swal({ text: "Successfully mined the transaction!", icon: "success", type: "success"});
                    history.push("./blocks");
                    console.log("yahoo");
                }
                else{
                    swal({
                        text: "Error to mine the transaction!",
                        icon: "error",
                        type: "error"
                      });
                }
            });
        }
    }

    componentDidMount(){
        document.body.style.background = "#34065b";
        this.fetchTransactionPoolMap();

        this.fetchPoolMapInterval = setInterval(
            ()=> this.fetchTransactionPoolMap(),
            POLL_INTERVAL_MS
        )
    }

    componentWillUnmount(){
        clearInterval(this.fetchPoolMapInterval);

    }

    render(){
        return(
            <div>
                <div className="menu">
                    <ul>
                        <li><Link to ="/app">Home</Link></li>
                        <li><Link to ="/blocks">Blocks</Link></li>
                        <li><Link to ="/conduct-transaction">Conduct a Transaction</Link></li>
                        <li className="active">Transaction Pool</li>
    
                    </ul>
                </div>
                <div className="TransactionPool">
                <h2 id = "uniqueh2">Transaction Pool</h2>
           
                {
                    Object.values(this.state.transactionPoolMap).map(transaction =>{
                        return (
                            <div className="transaction">
                                <div key={transaction.id}>
                                    <Transaction transaction={transaction}/>
                                </div>
                            </div>
                        )
                    })
                }
                <div style={{ width: "100%", display: 'flex', justifyContent: 'center' }}>
                    <Button
                        type= "button"
                        bsStyle="danger"
                        onClick={this.fetchMineTransactions}

                        >
                        Mine the Transaction
                    </Button>
                    </div>
                </div>
            </div>
        )
    }
}

export default TransactionPool;