import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';


const URI = 'http://localhost:8000/appiCCM/';

const AdminOptions = ({ account, tokenContract }) => {
    const [loading, setLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [idOption, setIdOption] = useState(0);
    const [options, setOptions] = useState([]);
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
            await Promise.all([getOwner(), getOptions()]);

            setLoading(false);
        };
        fetchData();
    }, [tokenContract, account]);

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

    const getOptions = async () => {
        try {
            const res = await axios.get(URI + 'getAllOptions');
            setOptions(res.data);
        } catch (error) {
            handleApiError(error);
        }
    }

    const addOption = async () => {
        try {
            setLoading(true);
            const result = await axios.post(URI + 'insertOption', { title: title, description: description })
            handleApiSuccess(result.data);
        } catch (error) {
            handleApiError(error);
        } finally {
            setLoading(false);
        }
    }

    const removeOption = async () => {
        try {
            setLoading(true);
            const result = await axios.delete(URI + `dropOption/${idOption}`)
            handleApiSuccess(result.data);
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
                        <h2>Create Option</h2>
                        <Form className="form-votation">
                            <Form.Group controlId="formTitle">
                                <Form.Label>Title</Form.Label>
                                <Form.Control type="text" placeholder="Enter a Title" onChange={(e) => setTitle(e.target.value)} />
                            </Form.Group>
                            <Form.Group controlId="formTitle">
                                <Form.Label>Description</Form.Label>
                                <Form.Control type="text" placeholder="Enter a Description" onChange={(e) => setDescription(e.target.value)} />
                            </Form.Group>
                            <Button style={{ marginTop: '1rem' }} variant="primary" onClick={addOption}>Create</Button>
                        </Form>
                    </Col>
                    <Col>
                        <h2>Remove Option</h2>
                        <Form className="form-votation">
                            <Form.Group controlId="formIdOptions">
                                <Form.Label>ID Options</Form.Label>
                                <Form.Control as="select" onChange={(e) => setIdOption(e.target.value)}>
                                    <option value="">Select ID Options</option>
                                    {options.map((option) => (
                                        <option value={option.idOption} key={option.idOption}>
                                            {option.title}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Button style={{ marginTop: '1rem' }} variant="primary" onClick={removeOption}>Remove</Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>

    )

}

export default AdminOptions;
