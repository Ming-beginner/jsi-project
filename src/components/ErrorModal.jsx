import React, {useState, useEffect} from 'react';
import {Modal, Button} from 'react-bootstrap';
import clsx from 'clsx';

const ErrorModal = ({error}) => {
    const [show, setShow] = useState(false);
    useEffect(() => {
        setShow(!!error);
    }, [error]);
    error = error ? error.code.split('/')[1].split('-').join(' ') : null;
    const handleClose = () => setShow(false);
    return (
        <div
            className={clsx(
                'position-fixed top-0 bottom-0 start-0 end-0 d-flex justify-content-center align-content-center',
                {'d-none': !show}
            )}
            style={{background: 'rgba(0, 0, 0, 0.8)', zIndex: 4000}}
        >
            <Modal show={show} onHide={handleClose} style={{zIndex: 4000}}>
                <Modal.Header closeButton>
                    <Modal.Title style={{color: 'red'}}>Error!</Modal.Title>
                </Modal.Header>
                <Modal.Body>{error}</Modal.Body>
                <Modal.Footer>
                    <Button variant='warning' onClick={handleClose}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ErrorModal;
