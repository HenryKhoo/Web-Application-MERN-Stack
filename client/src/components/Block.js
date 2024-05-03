import React, {Component} from "react";
import {Button} from "react-bootstrap";
import Transaction from "./Transaction";

class Block extends Component{
    state = { displayTransaction: false };

    toggleTransaction = () =>{
        this.setState({displayTransaction: !this.state.displayTransaction});
    }

    get displayTransaction(){
        const {data} = this.props.block;

        const stringifiedData = JSON.stringify(data);

        const dataDisplay = stringifiedData.length > 35 ? 
        `${stringifiedData.substring(0,70)}...`:
            stringifiedData;

        if(this.state.displayTransaction){
            return(
                <div>
                    {
                        data.map(transaction => (
                            <div key={transaction.id}>
                            <hr/>
                                <Transaction transaction={transaction}/>
                            </div>
                        ))
                    }
                    <div style={{ 
                        width: "100%", 
                        display: 'flex', 
                        justifyContent: 'center', 
                        margin: "1%"}}>
                    <Button 
                        type="button"
                        className="button_style"
                        variant="contained"
                        color="primary"
                        size="medium"
                        bsStyle="danger" 
                        onClick={this.toggleTransaction}
                        > 
                            Show Less
                    </Button>
                    </div>
                </div>
                
                
            )
        }

        return  (
        <div>
        Data: {dataDisplay} 

        <br/>
        <div style={{ 
            width: "100%", 
            display: 'flex', 
            justifyContent: 'center', 
            margin: "1%"}}>
            <Button 
                type="button"
                className="button_style"
                variant="contained"
                color="primary"
                size="medium"
                bsStyle="danger" 
                onClick={this.toggleTransaction}
            > 
                Show More
            </Button>
            </div>
           
        </div>
        );

    }

    render(){
        const {timestamp, hash} = this.props.block;

        const hashDisplay = `${hash.substring(0,15)}...`;



        return (
            <div className="Block">
                <div className="hash">Hash: {hash}</div>
                <div>Timestamp: {new Date(timestamp).toLocaleString()}</div>
                {this.displayTransaction}
            </div>
        )
    }
}

export default Block;