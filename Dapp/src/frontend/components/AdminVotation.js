import React, { useState, useEffect } from "react";
import axios from 'axios';
import Swal from 'sweetalert2';
import '../css/Votation.css'
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


const AdminVotation = ({ tokenContract, Polling, account }) => {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [name, setVotationName] = useState('');
    const [options, setOptions] = useState([]);
    const [votations, setVotations] = useState([]);
    const [idOptions, setIdOptions] = useState(null);
    const [idVotation, setIdVotation] = useState(null);
    const URI = 'http://localhost:8000/appiCCM/';
    const navigate = useNavigate();


    useEffect(() => {
        const getOwner = async () => {
            try {
                const _owner = await tokenContract.owner();
                setIsAdmin(account.toLowerCase() === _owner.toLowerCase());
            } catch (error) {
                console.error(error);
            }
        }

        const fetchData = async () => {
            setLoading(true);
            await Promise.all([getOwner(), getOptions(), getVotations()]);
            setLoading(false);
        };

        fetchData();
    }, []);

    const handleApiSuccess = (message) => {
        Swal.fire({
            icon: 'success',
            width: 800,
            padding: '3rem',
            text: `${message}`,
            backdrop: 'rgba(15,38,68,0.2) left top'
        });
    };

    const handleApiError = (error) => {
        Swal.fire({
            icon: 'error',
            width: 800,
            padding: '3rem',
            text: `${error.message}`,
            backdrop: 'rgba(255,38,68,0.2) left top'
        });
    };

    const createVotation = async () => {
        try {
            setLoading(true);
            let current_date = new Date();
            let year = current_date.getFullYear();
            let month = (current_date.getMonth() + 1).toString().padStart(2, '0');
            let day = current_date.getDate().toString().padStart(2, '0');

            // Formatear la fecha como "year-month-day"
            let formattedDate = `${year}-${month}-${day}`;
            console.log(name)
            console.log(formattedDate)
            const res = await axios.post(URI + 'createVotation', { name_votation: name, date_creation: formattedDate.toString(), is_active: 1, is_closed: 0 });
            handleApiSuccess(res.data);
        } catch (error) {
            handleApiError(error);
        } finally {
            setLoading(false);
        }
    }


    const getOptions = async () => {
        try {
            const res = await axios.get(URI + 'getAllOptions');
            setOptions(res.data);
        } catch (error) {
            handleApiError(error);
        }
    }

    const getVotations = async () => {
        try {
            const res = await axios.get(URI + 'getAllVotations');
            setVotations(res.data);
        } catch (error) {
            handleApiError(error);
        }
    }


    const deletOptionFromVotation = async () => {
        try {
            setLoading(true);
            const res = await axios.post(URI + 'deleteOptionFromVotation', { idVotation: idVotation, idOption: idOptions })
            handleApiSuccess(res.data);
        } catch (error) {
            handleApiError(error)
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
        )
    }
    if (!isAdmin) {
        navigate('/')
        return null;
    }


    return (
        <div style={{ marginTop: "5rem" }}>
            <Container style={{ padding: '1rem' }}>
                <Row>
                    <Col>
                        <h2>Create Votation</h2>
                        <Form className="form-votation" style={{ height: '75%' }}>
                            <Form.Group controlId="formDate">
                                <Form.Label>Votation Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter a Name" onChange={(e) => setVotationName(e.target.value)} />
                            </Form.Group>
                            <Button style={{ marginTop: '1rem' }} variant="primary" onClick={createVotation}>Create</Button>
                        </Form>
                    </Col>

                    <Col>
                        <h2>Remove Option From Votation</h2>
                        <Form className="form-votation" style={{ height: '75%' }}>
                            <Form.Group controlId="formIdOptions">
                                <Form.Label>Votation Name</Form.Label>
                                <Form.Control as="select" onChange={(e) => setIdVotation(e.target.value)}>
                                    <option value="">Select Name Votation</option>
                                    {votations.map((vote) => (
                                        <option value={vote.idVotation} key={vote.idVotation}>
                                            {vote.name_votation}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formIdOptions">
                                <Form.Label>Option Name</Form.Label>
                                <Form.Control as="select" onChange={(e) => setIdOptions(e.target.value)}>
                                    <option value="">Select ID Options</option>
                                    {options.map((option) => (
                                        <option value={option.idOption} key={option.idOption}>
                                            {option.title}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Button style={{ marginTop: '1rem' }} variant="primary" onClick={deletOptionFromVotation}>Delete</Button>
                        </Form>
                    </Col>

                </Row>
                {loading ? (
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                ) : null}
            </Container>
        </div>
    );
}

export default AdminVotation;
