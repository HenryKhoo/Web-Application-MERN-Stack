import React from "react"

// stateless functional style
const Transaction = ({transaction}) => {
    const {input, outputMap} = transaction;
    const recipients = Object.keys(outputMap);
    return(
        <div className="Transaction">
            <div>From: {`${input.address.substring(0,30)}...`} | Initial Amount : {input.amount}</div>
            {
                recipients.map(recipent =>(
                        <div key= {recipent}>
                            To:{`${recipent.substring(0,30)}...`} | Sent: {outputMap[recipent]}
                        </div>
                ))
            }
        </div>

    )
}
export default Transaction;