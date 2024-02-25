
import React from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from "axios";

const DateRangeModal = ({
    showForm,
    handleClose,
    handleSubmit,
}) => {

    const [startDate, setStartDate] = React.useState("");
    const [endDate, setEndDate] = React.useState("");
    
    return (
        <Modal show={showForm} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Enter Date Range</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <label>Start Date:</label>
                <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                />

                <label>End Date:</label>
                <input
                type="text"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                />
            </Modal.Body>
        </Modal>
    );
};

export default DateRangeModal;