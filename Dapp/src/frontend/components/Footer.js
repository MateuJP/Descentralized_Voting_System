import React from "react";
import tokenAddress from '../contractsData/MyToken-address.json';
import pollingAddress from '../contractsData/PollingStation-address.json';
import twitterIcon from '../css/twitter.svg';
import instagram from '../css/instagram.svg';
import facebook from '../css/facebook.svg';
import gitHub from '../css/gitHub.svg';
import youtube from '../css/youtube.svg';

const Footer = () => {
    return (
        <footer className="text-center text-lg-start text-dark" style={{ marginTop: "8rem" }}>
            <section className="">
                <div className="container text-center text-md-start mt-5">
                    <div className="row mt-3">
                        <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                            <h6 className="text-uppercase fw-bold">Contracts</h6>
                            <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: "60px", backgroundColor: "#7c4dff", height: "2px" }} />
                            <p>
                                <a href={`https://mumbai.polygonscan.com/address/${tokenAddress.address}`} className="text-dark">Token Contract</a>
                            </p>
                            <p>
                                <a href={`https://mumbai.polygonscan.com/address/${pollingAddress.address}`} className="text-dark">Polling Contract</a>
                            </p>
                            <p>
                                <a href={`https://mumbai.polygonscan.com/address/${pollingAddress.address}#events`} className="text-dark">Event Votes</a>
                            </p>
                        </div>
                        <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                            <h6 className="text-uppercase fw-bold">Follow Us</h6>
                            <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: '60px', backgroundColor: '#7c4dff', height: '2px' }} />
                            <div className="row">
                                <div className="col-6">
                                    <a href="#" className="text-white me-4" style={{ display: 'block' }}>
                                        <img src={twitterIcon} alt="Twitter" width="24" height="24" />
                                    </a>
                                </div>
                                <div className="col-6">
                                    <a href="#" className="text-white me-4" style={{ display: 'block' }}>
                                        <img src={instagram} alt="Instagram" width="24" height="24" />
                                    </a>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <a href="#" className="text-white me-4" style={{ display: 'block' }}>
                                        <img src={facebook} alt="Facebook" width="24" height="24" />
                                    </a>
                                </div>
                                <div className="col-6">
                                    <a href="#" className="text-white me-4" style={{ display: 'block' }}>
                                        <img src={gitHub} alt="GitHub" width="24" height="24" />
                                    </a>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <a href="#" className="text-white me-4" style={{ display: 'block' }}>
                                        <img src={youtube} alt="YouTube" width="24" height="24" />
                                    </a>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </section>

          
        </footer>
    );
};

export default Footer;
