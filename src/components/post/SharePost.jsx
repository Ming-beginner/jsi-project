import React, {useRef, useEffect} from 'react';
import {useState} from 'react';
import {Form, Modal, Button, OverlayTrigger, Popover} from 'react-bootstrap';

const SharePost = ({handleClose, link}) => {
  const linkRef = useRef();
  const [show, setShow] = useState(false);
  const target = useRef(null);
  const popover = (
    <Popover id='popover-basic' style={{zIndex: 7000}}>
      <Popover.Body>Copied!</Popover.Body>
    </Popover>
  );
  useEffect(() => {
    linkRef.current.focus();
    linkRef.current.select();
    linkRef.current.setSelectionRange(0, 99999);
  }, []);
  const handleCopyLink = () => {
    navigator.clipboard.writeText(linkRef.current.value);
    setShow(!show);
  };
  return (
    <div
      className='position-fixed top-0 bottom-0 end-0 start-0'
      style={{background: 'rgba(0, 0, 0, 0.8)', zIndex: 5000}}
    >
      <Modal show={true} style={{zIndex: 5000}}>
        <Modal.Header closeButton onHide={handleClose}>
          <Modal.Title>Copy post URL</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className='mb-3' controlId='exampleForm.ControlInput1'>
              <Form.Control
                ref={linkRef}
                type='text'
                autoFocus
                readOnly
                value={link}
                onFocus={(e) => e.target.select()}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
          <OverlayTrigger trigger='click' placement='right' overlay={popover}>
            <Button variant='primary' ref={target} onClick={handleCopyLink}>
              Copy link
            </Button>
          </OverlayTrigger>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SharePost;
