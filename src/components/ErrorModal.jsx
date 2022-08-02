import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import clsx from 'clsx'

const ErrorModal = ({error}) => {
  return (
    <div 
        className={clsx('position-fixed top-0 bottom-0 start-0 end-0 d-flex justify-content-center align-content-center',{'d-none': !error})}
        style={{background: 'rgba(0, 0, 0, 0.8)'}}
    >
        <Modal.Dialog>
            <Modal.Header closeButton>
                <Modal.Title>Error!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{error}</p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant='primary'>OK</Button>
            </Modal.Footer>
        </Modal.Dialog>
    </div>
  )
}

export default ErrorModal