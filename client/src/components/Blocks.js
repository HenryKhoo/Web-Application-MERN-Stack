import React, {Component} from "react";
import {Button} from "react-bootstrap";
import {Link} from "react-router-dom";
import Block from "./Block";
import logo from "../assets/logo.png";


class Blocks extends Component{
    state= {blocks: [], paginatedId: 1, blocksLength: 0};

    componentDidMount() {
        fetch(`${document.location.origin}/api/blocks/length`)
        .then(response => response.json())
        .then(json => this.setState({blocksLength: json}));
        this.fetchPaginatedBlocks(this.state.paginatedId)();
        document.body.style.background = "#34065b";

    }

    fetchPaginatedBlocks = paginatedId => () =>{
        fetch(`${document.location.origin}/api/blocks/${paginatedId}`)
        .then(response => response.json())
        .then(json => this.setState({blocks: json}));
    }
    
    render(){
        console.log("this.state: ", this.state);
        return(
            <div>
                <div className="menu">
                    <ul>
                        <li><Link to ="/app">Home</Link></li>
                        <li className="active">Blocks</li>
                        <li><Link to ="/conduct-transaction">Conduct a Transaction</Link></li>
                        <li><Link to ="/transaction-pool">Transaction Pool</Link></li>
                    </ul>
                </div>
                <h2 id="uniqueh2">Blocks</h2>
                <div class="Top">
                    {
                        [...Array(Math.ceil(this.state.blocksLength/5)).keys()].map(key =>{
                            const paginatedId = key+1;
                            return (
                                <span key={key} onClick={ this.fetchPaginatedBlocks(paginatedId)}>
                                    <Button id="buttonBlocks" class="active">
                                        {paginatedId}
                                    </Button>{" "}
                                </span>
                            )
                        })
                    }
                </div>

                {
                    this.state.blocks.map(block =>{
                        return(
                            <Block key={block.hash} block={block} />
                        );
                    })
                }
                <br/>
            </div>
        );
    }
    
    
}
export default Blocks;