import React, {Component} from "react";
import {FormGroup, FormControl, Button} from "react-bootstrap";
import {Link} from "react-router-dom";
import history from "../history";
import swal from 'sweetalert';


class ConductTransaction extends Component {
    state = { recipient: "", amount: "", knownAddresses: []};

    componentDidMount(){
        fetch(`${document.location.origin}/api/known-addresses`)
        .then(response => response.json())
        .then(json => this.setState({knownAddresses: json}));
        document.body.style.background = "#34065b";

    }

    updateRecipeint = event =>{
        this.setState({recipient: event.target.value});
    }

    updateAmount = event=>{
        this.setState({amount: Number(event.target.value)});

    }

    conductTransaction = () =>{
        const {recipient, amount} = this.state;
        if(this.state.recipient === ''|| this.state.amount === ''){
            
            swal({
                text: "Recipient/amount field is empty!",
                icon: "error"
              });
        } else{
            
            fetch(`${document.location.origin}/api/transact`, {
                method: "POST",
                headers:{"Content-Type": "application/json"},
                body: JSON.stringify({recipient, amount})
            }) .then(response =>{
                if(response.status === 200){
                    swal({ text: "Transaction Registered", icon: "success", type: "success"});
                    
                    history.push("/transaction-pool");
                } else if(this.state.amount === 0){
                    swal({ text: "Amount must be more than 0!", icon: "error", type: "error"});

                }
                else{
                    swal({ text: "Amount exceed the wallet balance!", icon: "error", type: "error"});
                }
            
            }).catch((err) => {
                if (err.response && err.response.data && err.response.data.errorMessage) {
                swal({
                    text: err.response.data.errorMessage,
                    icon: "error",
                    type: "error"
                });
                }
            });
        }
    }
    render(){
        return(
            <div>
                <div className="menu">
                    <ul>
                        <li><Link to ="/app">Home</Link></li>
                        <li><Link to ="/blocks">Blocks</Link></li>
                        <li className="active">Conduct a Transaction</li>
                        <li><Link to ="/transaction-pool">Transaction Pool</Link></li>
                    </ul>
                </div>
                <div className="Conduct Transaction">

                <h2 id = "uniqueh2">Conduct a Transaction</h2>
                <h3 id = "uniqueh3">Known Addresses</h3>
                {
                    this.state.knownAddresses.map( knownAddress =>{
                        return(
                            <div className="knownAddress">
                                <div key={knownAddress}>
                                    <div>{knownAddress}</div>
                                </div>
                            </div>
                        );
                    })
                }
                <br/>
                <div className="smaller-input">
                <FormGroup>
                    <FormControl  
                        input = "text"
                        autoComplete="off"
                        placeholder="recipient"
                        value={this.state.recipient}
                        onChange={this.updateRecipeint}
                        required
                    />            
                </FormGroup>

                <FormGroup>
                    <FormControl
                        input = "number"
                        autoComplete="off"
                        placeholder="amount"
                        onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                            }
                        }}
                        value={this.state.amount}
                        onChange={this.updateAmount}
                        required
                    />
                </FormGroup>
                </div>
                <div style={{ width: "100%", display: 'flex', justifyContent: 'center' }}>
                    <Button 
                        type="button"
                        className="button_style"
                        variant="contained"
                        color="primary"
                        size="medium"
                        disabled={this.state.recipient === '' && this.state.amount === ''}
                        bsStyle="danger"
                        onClick={this.conductTransaction}
                        >Submit
                    </Button>
                </div>
                </div>
            </div>
        )
    }
};

export default ConductTransaction;