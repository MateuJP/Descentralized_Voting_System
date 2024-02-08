import './App.css';
import 'bootstrap'
import { Spinner } from 'react-bootstrap';
import { ethers } from 'ethers';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import { useState, useEffect } from 'react';
import TokenAbi from '../contractsData/MyToken.json';
import TokenAddress from '../contractsData/MyToken-address.json';
import PollingAbi from '../contractsData/PollingStation.json';
import PollingAddress from '../contractsData/PollingStation-address.json';

import Navigation from './Nav';
import Home from './Home';
import TokenManagment from './ManageTokens';
import AdminVotation from './AdminVotation';
import AdminOptions from './AdminOptions';
import Footer from './Footer';
import AdminCurrentVotation from './AdminCurrentVotation';

function App() {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [token, setToken] = useState({});
  const [polling, setPolling] = useState({});


  const web3Handler = async () => {
    setLoading(true);
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    console.log(accounts)
    setAccount(accounts[0]);
    localStorage.setItem('wallet', account);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    })

    window.ethereum.on('accountsChanged', async function (accounts) {
      if (accounts[0] !== account) {
        setAccount(accounts[0]);
        await web3Handler();
      }
    })
    loadContracts(signer);
  }

  const loadContracts = async (signer) => {
    const token = new ethers.Contract(TokenAddress.address, TokenAbi.abi, signer);
    setToken(token);
    const polling = new ethers.Contract(PollingAddress.address, PollingAbi.abi, signer);
    setPolling(polling);
    setLoading(false);

  }
  useEffect(() => {
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    if (!isChrome) {
      alert('This dapp only runs on Chrome.');
    }
    if (localStorage.getItem('wallet')) {
      web3Handler();
    }


  }, [])

  return (
    <BrowserRouter>
      <div className='App'>
        <>
          <Navigation web3Handler={web3Handler} account={account} tokenContract={token} />
        </>
        {loading ? (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Connect Wallet...</span>
          </Spinner>
        ) : (
          <Routes>
            <Route path='/' element={<Home token={token} polling={polling} account={account} />} />
            <Route path='/managment' element={<TokenManagment account={account} tokenContract={token} />} />
            <Route path='/adminVotations' element={<AdminVotation tokenContract={token} Polling={polling} account={account} />} />
            <Route path='/adminOptions' element={<AdminOptions account={account} tokenContract={token} />} />
            <Route path='adminVotation/current' element={<AdminCurrentVotation tokenContract={token} Polling={polling} account={account} />} />
          </Routes>

        )}
        <>
          <Footer></Footer>
        </>
      </div>
    </BrowserRouter>
  );




}

export default App;