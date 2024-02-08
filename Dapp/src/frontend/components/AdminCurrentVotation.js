import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../css/Votation.css";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AdminVotation = ({ tokenContract, Polling, account }) => {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [time, setTime] = useState(null);
    const [options, setOptions] = useState([]);
    const [allOptions, setAllOptions] = useState([]);
    const [numOptions, setNumOptions] = useState(null);
    const [idOptions, setIdOptions] = useState(null);
    const [option_id, setOption_id] = useState(null);
    const [currentVotation, setCurrentVotation] = useState([]);
    const URI = "http://localhost:8000/appiCCM/";
    const navigate = useNavigate();

    useEffect(() => {
        const getOwner = async () => {
            try {
                const _owner = await tokenContract.owner();
                setIsAdmin(account.toLowerCase() === _owner.toLowerCase());
            } catch (error) {
                console.error(error);
            }
        };

        const fetchData = async () => {
            setLoading(true);
            await Promise.all([
                getOwner(),
                getCurrentVotation(),
                getAllOptions()

            ]);
            setLoading(false);
        };

        fetchData();
    }, []);



    const handleApiSuccess = (message) => {
        Swal.fire({
            icon: "success",
            width: 800,
            padding: "3rem",
            text: `${message}`,
            backdrop: "rgba(15,38,68,0.2) left top",
        });
    };

    const handleApiError = (error) => {
        Swal.fire({
            icon: "error",
            width: 800,
            padding: "3rem",
            text: `${error.message}`,
            backdrop: "rgba(255,38,68,0.2) left top",
        });
    };

    const closeVotation = async () => {
        try {
            setLoading(true);
            const res = await axios.post(URI + "closeVotation", {
                idVotation: currentVotation.idVotation,
                is_closed: 1,
            });
            await getCurrentVotation();
            handleApiSuccess(res.data);

        } catch (error) {
            handleApiError(error);
        } finally {
            setLoading(false);
        }
    };
    const getCurrentVotation = async () => {
        try {
            const resp = await axios.get(URI + "getCurrentVotation");
            setCurrentVotation(resp.data);
            await getOptionsCurrentVotation(resp.data.idVotation);
        } catch (error) {
            handleApiError(error);
        }
    };

    const getOptionsCurrentVotation = async (idVotation) => {
        try {
            const res = await axios.get(URI + "getAllOptionsFromVotation/" + idVotation);
            console.log("Options", res.data)
            setOptions(res.data);
            setNumOptions(res.data.length);
        } catch (error) {
            handleApiError(error);
        }
    };
    const getAllOptions = async () => {
        try {
            const res = await axios.get(URI + "getAllOptions");
            setAllOptions(res.data);
        } catch (error) {
            handleApiError(error);
        }
    };


    const addOptionsToVotation = async () => {
        try {
            setLoading(true);
            //await getCurrentVotation();
            const res = await axios.post(URI + "identificationOption", {
                idVotation: currentVotation.idVotation,
                idOption: idOptions,
                option_Id: option_id,
            });
            handleApiSuccess(res.data);
            await getOptionsCurrentVotation(currentVotation.idVotation);
        } catch (error) {
            handleApiError(error);
        } finally {
            setLoading(false);
        }
    };
    const deletOptionFromVotation = async () => {
        try {
            setLoading(true);
            const res = await axios.post(URI + "deleteOptionFromVotation", {
                idVotation: currentVotation.idVotation,
                idOption: idOptions,
            });
            handleApiSuccess(res.data);
            await getOptionsCurrentVotation(currentVotation.idVotation);

        } catch (error) {
            handleApiError(error);
        } finally {
            setLoading(false);
        }
    };

    const openVotation = async () => {
        try {
            setLoading(true);
            if (currentVotation.is_closed) {
                const resp = await axios.get(URI + "getCurrentVotation");
                console.log("Current", resp.data.idVotation);
                console.log("hi", numOptions)
                await Polling.setVotation(numOptions, time, resp.data.idVotation);
                Swal.fire({
                    icon: "success",
                    width: 800,
                    padding: "3rem",
                    backdrop: "rgba(15,238,168,0.2) left top no-repeat",
                });

            } else {
                Swal.fire({
                    icon: "error",
                    width: 800,
                    padding: "3rem",
                    text: 'The votation must be closed before opening it',
                    backdrop: "rgba(255,38,68,0.2) left top",
                });
            }

        } catch (error) {
            handleApiError(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
        );
    }
    if (!isAdmin) {
        navigate("/");
        return null;
    }

    return (
        <div style={{ marginTop: "5rem" }}>
            <Container style={{ padding: "1rem" }}>
                <Row>
                    <Col>
                        <h2>Close Votation</h2>
                        <Form className="form-votation">
                            <Form.Group controlId="formIdOptions">
                                <Form.Label>Current Votation</Form.Label>
                                <Form.Control type="text" value={currentVotation.name_votation} disabled></Form.Control>
                            </Form.Group>
                            <Button
                                style={{ marginTop: "1rem" }}
                                variant="primary"
                                onClick={closeVotation}
                            >
                                Close
                            </Button>
                        </Form>
                    </Col>

                    <Col>
                        <h2>Open Votation</h2>
                        <Form className="form-votation">
                            <Form.Group controlId="formTime">
                                <Form.Label>Time</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Time"
                                    onChange={(e) => setTime(e.target.value)}
                                />
                            </Form.Group>
                            <Button
                                style={{ marginTop: "1rem" }}
                                variant="primary"
                                onClick={openVotation}
                            >
                                Open Votation
                            </Button>
                        </Form>
                    </Col>
                </Row>
                <Row>
                    <Col style={{ marginTop: "2rem" }}>
                        <h2>Add Options </h2>
                        <Form className="form-votation">
                            <Form.Group controlId="formIdOptions">
                                <Form.Label>Current Options</Form.Label>
                                <Form.Control
                                    as="select"
                                >
                                    <option value="">View Options</option>
                                    {options.map((option) => (
                                        <option value={option.idOption} key={option.idOption}>
                                            {option.title}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="formIdOptions" style={{ marginTop: '0.5rem' }}>
                                <Form.Label>New Option</Form.Label>
                                <Form.Control
                                    as="select"
                                    onChange={(e) => setIdOptions(e.target.value)}
                                >
                                    <option value="">Select ID Options</option>
                                    {allOptions.map((option) => (
                                        <option value={option.idOption} key={option.idOption}>
                                            {option.title}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formOptionId" style={{ marginTop: '0.5rem' }}>
                                <Form.Label>New Option Order</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter Option ID"
                                    onChange={(e) => setOption_id(e.target.value)}
                                />
                            </Form.Group>
                            <Button
                                style={{ marginTop: "1rem" }}
                                variant="primary"
                                onClick={addOptionsToVotation}
                            >
                                Add Options
                            </Button>
                        </Form>
                    </Col>
                    <Col style={{ marginTop: "2rem" }}>
                        <h2>Remove Option From Votation</h2>
                        <Form className="form-votation">
                            <Form.Group controlId="formIdOptions">
                                <Form.Label>Votation Name</Form.Label>
                                <Form.Control type="text" value={currentVotation.name_votation} disabled />
                            </Form.Group>
                            <Form.Group controlId="formIdOptions">
                                <Form.Label>Option Name</Form.Label>
                                <Form.Control
                                    as="select"
                                    onChange={(e) => setIdOptions(e.target.value)}
                                >
                                    <option value="">Select Current Option</option>
                                    {options.map((option) => (
                                        <option value={option.idOption} key={option.idOption}>
                                            {option.title}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Button
                                style={{ marginTop: "1rem" }}
                                variant="primary"
                                onClick={deletOptionFromVotation}
                            >
                                Delete
                            </Button>
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
};

export default AdminVotation;
