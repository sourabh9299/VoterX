import React from "react";

const Connected = (props) => {
    const { account, remainingTime, showButton, number, handleNumberChange, voteFunction, candidates } = props;

    // Format remaining time as minutes and seconds
    const formatRemainingTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes}m ${seconds}s`;
    };

    return (
        <div className="connected-container">
            <h1 className="connected-header">You are Connected to Metamask</h1>
            <p className="connected-account">Metamask Account: {account}</p>
            <p className="connected-account">Remaining Time: {formatRemainingTime(remainingTime)}</p>
            
            {showButton ? (
                <p className="connected-account">You have already voted</p>
            ) : (
                <div>
                    <input
                        type="number"
                        placeholder="Enter Candidate Index"
                        value={number}
                        onChange={handleNumberChange}
                        min="0"
                    />
                    <br />
                    <button className="login-button" onClick={voteFunction}>Vote</button>
                </div>
            )}
            
            <table id="myTable" className="candidates-table">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Candidate Name</th>
                        <th>Vote Count</th>
                    </tr>
                </thead>
                <tbody>
                    {candidates.map((candidate, index) => (
                        <tr key={index}>
                            <td>{candidate.index}</td>
                            <td>{candidate.name}</td>
                            <td>{candidate.voteCount}</td>
                          
                            <td>1</td>
                            <td>Mark</td>
                            <td>0</td>
                        </tr>
                       
                    ))}
                    <tr>
                    <td>1</td>
                            <td>Mark</td>
                            <td>0</td>
                    </tr>

                    <tr>
                            <td>2</td>
                            <td>mike</td>
                            <td>0</td>
                    </tr>

                    <tr>
                            <td>3</td>
                            <td>Henry</td>
                            <td>0</td>
                    </tr>
                    <tr>
                            <td>4</td>
                            <td>Rock</td>
                            <td>0</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Connected;
