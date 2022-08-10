import React, {useState, useEffect} from 'react';
import {Modal, Button} from 'react-bootstrap';
import clsx from 'clsx';

const SuccessModal = ({success, callback}) => {
    const [show, setShow] = useState(!!success);
    useEffect(() => {
        setShow(success);
    }, [success]);
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
                    <Modal.Title style={{color: 'green'}}>Sucess</Modal.Title>
                </Modal.Header>
                <Modal.Body>{success}</Modal.Body>
                <Modal.Footer>
                    <Button
                        variant='success'
                        onClick={() => {
                            handleClose();
                            if (callback) callback();
                        }}
                    >
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default SuccessModal;
