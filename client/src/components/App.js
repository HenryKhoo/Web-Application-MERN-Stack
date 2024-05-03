import React, {Component} from "react";
import {Link} from "react-router-dom";
import logo from "../assets/logo.png";
import block from "../assets/landingPage.png";

import {Button} from "react-bootstrap";

class App extends Component {
    state = {walletInfo: {}};
    logOut = () => {
        console.log("Logged out")
        localStorage.setItem('token', null);
        this.props.history.push('/');
        document.body.style.background = "#D7E5F0";

    }
    componentDidMount(){
        fetch(`${document.location.origin}/api/wallet-info`)
        .then(response => response.json())
        .then(json => this.setState({walletInfo: json}));
        document.body.style.background = "#34065b";


    }
    render(){
        const {address, balance } = this.state.walletInfo;
        return(
            <div className="container">
                <div className="menu">
                    <ul>
                        <li className="active">Home</li>
                        <li><Link to ="/blocks">Blocks</Link></li>
                        <li><Link to ="/conduct-transaction">Conduct a Transaction</Link></li>
                        <li><Link to ="/transaction-pool">Transaction Pool</Link></li>
                    </ul>
                </div>
                <div className="banner">
                    <div className="app-text">
                        <h1>Cryptocoin is an open source <br />peer-to-peer digital currency.</h1>
                        <div className="address">
                            <div > Your wallet address: {address}</div>
                            <div>Balance: {balance}</div>
                        </div>
                        <Button
                            className="more-info-btn"
                            variant="contained"
                            size="small"
                            onClick={this.logOut}
                            >
                            Log Out
                        </Button>
                    </div>
                    <div className="app-picture">
                        <img src={block}/>
                    </div>
                </div>
            <br/>
           
            </div>
        );
    }

}

export default App;