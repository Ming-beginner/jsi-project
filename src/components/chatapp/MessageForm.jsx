import React, {useRef} from 'react';
import {FileUpload, Send} from '@mui/icons-material';
import {InputGroup, Form} from 'react-bootstrap';

const MessageForm = ({handleSubmit, message, setMessage, setImg}) => {
    const sendBtnRef = useRef();
    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendBtnRef.current.click();
        }
    };
    return (
        <Form
            className='d-flex pt-4 px-4 pb-2 position-fixed bottom-0 end-0 border border-top bg-white message-form'
            style={{width: 'calc(100vw - 413px)'}}
            onSubmit={() => {
                return false;
            }}
        >
            <div style={{height: 35}}>
                <label htmlFor='img' className='cursor-pointer'>
                    <FileUpload fontSize='large' sx={{color: '#0088ff'}} />
                </label>
                <Form.Control
                    type='file'
                    id='img'
                    accept='image/*'
                    style={{display: 'none'}}
                    onChange={(e) => {
                        const img = e.target.files[0];
                        img.preview = URL.createObjectURL(img);
                        setImg(img)
                    }}
                />
            </div>
            <InputGroup className='mb-3 mx-3 d-flex align-items-center'>
                <Form.Control
                    placeholder='Enter message'
                    aria-label='Message'
                    aria-describedby='basic-addon1'
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value);
                    }}
                    autoFocus
                    onKeyPress={handleEnter}
                />
            </InputGroup>
            <div
                className='cursor-pointer send-btn'
                style={{height: 35}}
                ref={sendBtnRef}
                onClick={handleSubmit}
            >
                <Send fontSize='large' sx={{color: '#0088ff'}} />
            </div>
        </Form>
    );
};

export default MessageForm;
