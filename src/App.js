import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { contractAbi, contractAddress } from './Constant/constant';
import Login from './Components/Login';
import Finished from './Components/Finished';
import Connected from './Components/Connected';
import './App.css';


function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [votingStatus, setVotingStatus] = useState(true);
  const [remainingTime, setRemainingTime] = useState(0);
  const [candidates, setCandidates] = useState([]);
  const [number, setNumber] = useState('');
  const [canVote, setCanVote] = useState(false);

  // Utility to create a contract instance
  function getContract(signerOrProvider) {
    return new ethers.Contract(contractAddress, contractAbi, signerOrProvider);
  }

  useEffect(() => {
    if (window.ethereum) {
      const initProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(initProvider);
      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  useEffect(() => {
    if (provider && account) {
      getCandidates();
      getRemainingTime();
      getCurrentStatus();
      checkCanVote();
    }
  }, [provider, account]);

  const checkCanVote = useCallback(async () => {
    if (!provider || !account) return;
    const signer = provider.getSigner();
    const contractInstance = getContract(signer);

    try {
      const voteStatus = await contractInstance.voters(account);
      setCanVote(voteStatus);
    } catch (err) {
      console.error('Error in checkCanVote:', err);
    }
  }, [provider, account]);

  const vote = async () => {
    if (!provider) return;
    const signer = provider.getSigner();
    const contractInstance = getContract(signer);

    try {
      const tx = await contractInstance.vote(number);
      await tx.wait();
      checkCanVote(); // Update after voting
    } catch (err) {
      console.error('Error in vote:', err);
    }
  };

  const getCandidates = async () => {
    if (!provider) return;
    const contractInstance = getContract(provider);

    try {
      const candidates = await contractInstance.getAllVotesOfCandidates();
      setCandidates(candidates);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  const getCurrentStatus = async () => {
    if (!provider) return;
    const contractInstance = getContract(provider);

    try {
      const status = await contractInstance.getVotingStatus();
      setVotingStatus(status);
    } catch (err) {
      console.error('Error in getCurrentStatus:', err);
    }
  };

  const getRemainingTime = async () => {
    if (!provider) return;
    const contractInstance = getContract(provider);

    try {
      const time = await contractInstance.getRemainingTime();
      setRemainingTime(parseInt(time.toString(), 10));
    } catch (err) {
      console.error('Error in getRemainingTime:', err);
    }
  };

  function handleAccountsChanged(accounts) {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      checkCanVote();
    } else {
      setIsConnected(false);
      setAccount(null);
    }
  }

  async function connectToMetamask() {
    if (window.ethereum) {
      try {
        const initProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(initProvider);
        await initProvider.send("eth_requestAccounts", []);
        const signer = initProvider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        setIsConnected(true);
        checkCanVote();
      } catch (err) {
        console.error('Error in connectToMetamask:', err);
      }
    } else {
      console.error("Metamask is not detected in the browser");
    }
  }

  function handleNumberChange(e) {
    setNumber(e.target.value);
  }

  return (
    <div className="App">
      {votingStatus ? (
        isConnected ? (
          <Connected
            account={account}
            candidates={candidates}
            remainingTime={remainingTime}
            number={number}
            handleNumberChange={handleNumberChange}
            voteFunction={vote}
            showButton={canVote}
          />
        ) : (
          <Login connectWallet={connectToMetamask} />
        )
      ) : (
        <Finished />
      )}
    </div>
  );
}

export default App;
