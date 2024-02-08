import { ethers } from "ethers";
import { useEffect, useState } from "react";
import PollinAddress from '../contractsData/PollingStation-address.json';
import '../css/Manage.css'
import Swal from "sweetalert2";
import { Spinner } from "react-bootstrap";

const TokenManagment = ({ account, tokenContract }) => {
    const [loading, setLoading] = useState(false);
    const [data_loaded, setDataLoaded] = useState(false);
    const [balance, setBalance] = useState(null);
    const [allowed, setAllowed] = useState(null);
    const [price_token, setPriceToken] = useState(null);
    const [circulationToken, setCirculationToken] = useState(null);
    const [balance_dapp_crypto, setBalanceDappCrypto] = useState(null);
    const [balance_tokens_dapp, setBalanceTokensDapp] = useState(null);
    const [amountBuy, setAmountBuy] = useState(null);
    const [amountReturn, setAmountReturn] = useState(null);
    const [amoutToApprove, setAmountApprove] = useState(null);

    const CRYPTO = 'Matic';

    const getInfoAccount = async () => {
        setLoading(true);
        let _balance = await tokenContract.balanceOf(account);
        setBalance(ethers.utils.formatEther(_balance));
        let _allowed = await tokenContract.allowance(account, PollinAddress.address);
        setAllowed(ethers.utils.formatEther(_allowed));
        let _priceToken = await tokenContract.price();
        setPriceToken(ethers.utils.formatEther(_priceToken));
        let _circulationToken = await tokenContract.getCirculationTokens();
        setCirculationToken(ethers.utils.formatEther(_circulationToken));
        let _balance_dapp = await tokenContract.getBalanceContractMatic();
        setBalanceDappCrypto(ethers.utils.formatEther(_balance_dapp));
        let _balance_tokens_dapp = await tokenContract.getBlanceContract();
        setBalanceTokensDapp(ethers.utils.formatEther(_balance_tokens_dapp));
        setDataLoaded(true);
        setLoading(false);
    }

    const buyTokens = async () => {
        try {
            setLoading(true);
            let _price = amountBuy * price_token;
            let _price_wei = ethers.utils.parseEther(_price.toString()).toString();
            let _amount_wei = ethers.utils.parseEther(amountBuy.toString()).toString();
            console.log("Price_ether", _price);
            console.log("Price wei", _price_wei);
            console.log("Amount", _amount_wei)
            const transaction = await tokenContract.buyToken(_amount_wei, { value: _price_wei });

            await transaction.wait();

            Swal.fire({
                icon: 'success',
                title: "Successful Purchase",
                width: 800,
                padding: '3rem',
                backdrop: 'rgba(15,238,168,0.2) left top no-repeat'
            });
            await getInfoAccount();

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error during Purchase',
                width: 800,
                padding: '3rem',
                text: `${error.message}`,
                backdrop: 'rgba(255,38,68,0.2) left top'
            })

        } finally {
            setLoading(false);
        }
    }

    const returnTokens = async () => {
        try {
            setLoading(true);
            let _amount_wei = ethers.utils.parseEther(amountReturn.toString()).toString();
            const transaction = await tokenContract.returnToken(_amount_wei);

            await transaction.wait();
            Swal.fire({
                icon: 'success',
                title: "Tokens Returned Successfully",
                width: 800,
                padding: '3rem',
                backdrop: 'rgba(15,238,168,0.2) left top no-repeat'
            });
            await getInfoAccount();

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error during Tokens return',
                width: 800,
                padding: '3rem',
                text: `${error.data}`,
                backdrop: 'rgba(255,38,68,0.2) left top'
            })

        } finally {
            setLoading(false);
        }
    }
    const approveTokens = async () => {
        try {
            setLoading(true);
            let _approve_wei = ethers.utils.parseEther(amoutToApprove.toString()).toString();
            console.log(_approve_wei);
            console.log(PollinAddress.address)
            await tokenContract.approve(PollinAddress.address, _approve_wei);
            Swal.fire({
                icon: 'success',
                title: "Token Approval Successfully",
                width: 800,
                padding: '3rem',
                backdrop: 'rgba(15,238,168,0.2) left top no-repeat'
            });
            await getInfoAccount();

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error during Tokens Approve',
                width: 800,
                padding: '3rem',
                text: `${error.data}`,
                backdrop: 'rgba(255,38,68,0.2) left top'
            })

        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        if (account && !data_loaded) {
            getInfoAccount();
        }
    }, [])

    if (loading) {
        return (
            <div className="container-fluid mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }
    return (
        <div className="container-fluid">
            <div className="mt-5">
                <h2 className="title">Token Management</h2>
            </div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h3 className="card-title">My Summary</h3>
                                <div className="form-group">
                                    <label>Current Balance</label>
                                    <input className="form-control" disabled value={`${balance} Tokens`} />
                                </div>
                                <div className="form-group">
                                    <label>Approval Tokens Dapp</label>
                                    <input className="form-control" disabled value={`${allowed} Tokens`} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h3 className="card-title">General Information</h3>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <div className="form-group">
                                            <label>Balance Tokens Dapp</label>
                                            <input className="form-control" disabled value={`${balance_tokens_dapp} Tokens`} />
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <div className="form-group">
                                            <label>Circulation Tokens</label>
                                            <input className="form-control" disabled value={`${circulationToken} Tokens`} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <div className="form-group">
                                            <label>Price Tokens</label>
                                            <input className="form-control" disabled value={`${price_token} ${CRYPTO}`} />
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <div className="form-group">
                                            <label>Balance Dapp</label>
                                            <input className="form-control" disabled value={`${balance_dapp_crypto} ${CRYPTO}`} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-fluid">
                <div className="row justify-content-center align-items-center">
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <h3 className="card-title">Buy Tokens</h3>
                                <div className="form-group text-center">
                                    <input type="number" className="form-control mb-3" placeholder="Amount to Buy" onChange={(e) => setAmountBuy(e.target.value)} />
                                    <button className="btn btn-primary" onClick={buyTokens}>Buy</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <h3 className="card-title">Return Tokens</h3>
                                <div className="form-group text-center">
                                    <input type="number" className="form-control mb-3" placeholder="Amount to return" onChange={(e) => setAmountReturn(e.target.value)} />
                                    <button className="btn btn-primary" onClick={returnTokens}>Return</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <h3 className="card-title">Approve Tokens</h3>
                                <div className="form-group text-center">
                                    <input type="number" className="form-control mb-3" placeholder="Amount to Approve" onChange={(e) => setAmountApprove(e.target.value)} />
                                    <button className="btn btn-primary" onClick={approveTokens}>Approve</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}
export default TokenManagment;