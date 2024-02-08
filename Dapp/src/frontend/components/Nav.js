import { Link } from "react-router-dom";
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import '../css/nav.css';
import { useEffect, useState } from "react";
import { ethers } from "ethers";

const Navigation = ({ web3Handler, account, tokenContract }) => {

    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isOwner, setOwner] = useState(false);

    const getBalance = async () => {
        setLoading(true);
        console.log(account);
        const _balance = await tokenContract.balanceOf(account);
        const balance_ether = ethers.utils.formatEther(_balance.toString());
        console.log(balance_ether);
        setBalance(balance_ether);
        setLoading(false);
    }
    const getOwner = async () => {
        setLoading(true);
        const _owner = await tokenContract.owner();
        console.log(_owner);
        console.log(account);
        if (account.toLowerCase() === _owner.toLowerCase()) {
            setOwner(true);
        } else {
            setOwner(false);
        }

    }
    useEffect(() => {
        if (account) {
            getBalance();
            getOwner();
        }
    }, [account, tokenContract]);

    return (
        <Navbar expand="lg" bg="primary" variant="dark">
            <Container>
                <Navbar.Brand>
                    <Link to="/" style={{color : 'white', textDecoration : 'none'}}>&nbsp; Vote Dapp</Link> {/* Agrega el enlace a la página principal */}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar navbar-dark bg-primary" />
                <Navbar.Collapse style={{ justifyContent: 'end' }} id="navbar navbar-dark bg-primary">
                    <Nav className="align-items-center">
                        {isOwner ? <Nav.Link as={Link} to="/adminVotations" style={{ color: 'black' }}>Admin Votations</Nav.Link> : null}
                        {isOwner ? <Nav.Link as = {Link} to="/adminVotation/current" style={{ color: 'black' }}>Admin Current Votation</Nav.Link> : null}

                        {isOwner ? <Nav.Link as = {Link} to="/adminOptions" style={{ color: 'black' }}>Admin Options</Nav.Link> : null}

                        <Nav.Link as={Link} to="/managment" style={{ color: 'black' }}>
                            Buy Tokens
                        </Nav.Link>
                        <Button disabled variant="outline-light" className="link-buttons">
                            {loading ? "Loading..." : balance} Tokens
                        </Button>
                    </Nav>
                    <Nav>
                        {account ? (
                            <Nav.Link
                                href={`https://etherscan.io/address/${account}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="button nav-button btn-sm mx-4">
                                <Button disabled variant="outline-light" className="link-buttons">
                                    {account}
                                </Button>
                            </Nav.Link>
                        ) : (
                            <Button onClick={web3Handler} variant="outline-light" className="link-buttons">
                                Connect Wallet
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Navigation;
