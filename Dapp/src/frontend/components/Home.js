import React, { useEffect, useState } from "react";
import '../css/home.css'
import { Button, Spinner } from "react-bootstrap";
import axios from 'axios';
import Swal from "sweetalert2";
import { ethers } from "ethers";
import PollinAddress from '../contractsData/PollingStation-address.json';
const URI = 'http://localhost:8000/appiCCM/';

const Home = ({ token, polling, account }) => {
    const [loading, setLoading] = useState(false);
    const [finish, setIsFinish] = useState(true);
    const [hasVoted, setHasVoted] = useState(false);
    const [option_vote, setVote] = useState(null);
    const [token_amount, setTokensPay] = useState(null);
    const [token_wei, setTokenWei] = useState(null);
    const [options, setOptions] = useState([]);
    const [lastVotation, setLastVotation] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [_options, _price_wei, _isFinish, votes, _voted] = await Promise.all([
                    axios.get(URI + 'getOptionsCurrentVotation'),
                    polling.tokens_for_vote(),
                    polling.endVotation(),
                    finish ? polling.returnAllOptions() : [],
                    polling.has_voted(account),
                ]);

                setOptions(_options.data);
                const _price = ethers.utils.formatEther(_price_wei);
                setTokensPay(_price);
                setTokenWei(_price_wei);
                setIsFinish(_isFinish);
                setLastVotation(votes);
                setHasVoted(_voted);
                console.log(hasVoted);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        setLoading(true);
        fetchData();
        setLoading(false);
    }, []);

    const _vote = async () => {
        try {
            setLoading(true);
            const tx = await token.approve(PollinAddress.address, token_wei);
            await tx.wait();
            const rx = await polling.vote(option_vote);
            await rx.wait();
            Swal.fire({
                icon: 'success',
                title: 'Successful Vote',
                width: 800,
                padding: '3rem',
                backdrop: 'rgba(15,238,168,0.2) left top no-repeat'
            });

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Voting Error',
                width: 800,
                padding: '3rem',
                text: `The following error occurred during voting: ${error.data}`,
                backdrop: 'rgba(255,38,68,0.2) left top'
            });
        } finally {
            setLoading(false);
        }
    }

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
        <div className="container-fluid mt-5">
            <div className="container votation">
                {finish || hasVoted || options.length == 0 ? (
                    <div className="finish-message">
                        {finish ? (
                            <h3>Votation Finisehd</h3>
                        ) : (
                            <h3>You have already voted</h3>
                        )}
                        {
                            options.map((option, index) => {
                                const votes = lastVotation[index].toString() || 0;
                                const totalVotes = lastVotation.reduce((acc, curr) => acc + parseInt(curr), 0);
                                const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
                                return (
                                    <div key={option.option_id} style={{ marginTop: '2rem' }}>
                                        <p>
                                            {option.OPTION.title}: {votes} votos ({percentage.toFixed(2)}%)
                                        </p>
                                        <div className="progress">
                                            <div
                                                className="progress-bar"
                                                role="progressbar"
                                                style={{ width: `${percentage}%` }}
                                                aria-valuenow={percentage}
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                ) : (
                    <div className="accordion" id="accordionExample">
                        <h2>Votation</h2>
                        {options.map((option) => (
                            <div className="accordion-item" key={option.option_id}>
                                <h2 className="accordion-header">
                                    <button
                                        className="accordion-button collapsed"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target={`#collapse${option.option_id}`}
                                        aria-expanded="false"
                                        aria-controls={`collapse${option.option_id}`}
                                    >
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="flexRadioDefault"
                                            id={`flexRadioDefault${option.option_id}`}
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#collapse${option.option_id}`}
                                            aria-expanded="true"
                                            aria-controls={`collapse${option.option_id}`}
                                            value={option.option_id}
                                            onChange={(e) => setVote(e.target.value)}
                                        />
                                        <label className="form-check-label" htmlFor={`flexRadioDefault${option.option_id}`}>
                                            {option.OPTION.title}
                                        </label>
                                    </button>
                                </h2>
                                <div
                                    id={`collapse${option.option_id}`}
                                    className="accordion-collapse collapse"
                                    data-bs-parent="#accordionExample"
                                >
                                    <div className="accordion-body">
                                        <strong>{option.OPTION.description}</strong>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="input-group mb-3" id="inputPay">
                            <span className="input-group-text" id="inputGroup-sizing-default">Tokens to Pay</span>
                            <input
                                type="text"
                                className="form-control"
                                aria-label="Sizing example input"
                                aria-describedby="inputGroup-sizing-default"
                                value={token_amount ? `${token_amount} Tokens` : '0 Tokens'}
                                readOnly
                                style={{ background: 'transparent' }}
                            />
                        </div>
                        <div className="button-vote">
                            <Button onClick={_vote}>Vote</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
