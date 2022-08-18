import React from 'react';
import {v4 as uuidv4} from 'uuid';
import {useState, useEffect, useRef} from 'react';
import {Form, InputGroup} from 'react-bootstrap';
import {FileUpload, Send, Close} from '@mui/icons-material';
import {
  useCurrentUser,
  updateDoc,
  uploadBytes,
  doc,
  storage,
  db,
  ref,
  getDownloadURL,
} from '../../firebase';

const UpdateComment = ({comment, setShowUpdateComment}) => {
  const [content, setContent] = useState('');
  const [img, setImg] = useState();
  const postBtnRef = useRef();
  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      postBtnRef.current.click();
    }
  };
  useEffect(() => {
    setContent(comment.content);
    setImg(comment.image);
  }, []);
  const handleUpdateComment = async () => {
    if (content.length > 0) {
      const commentDoc = doc(db, 'comments', comment.id);
      const commentData = {
        content: content,
        image: null,
        updatedAt: new Date(),
      };
      if (img) {
        if (typeof img === 'object') {
          const imgRef = ref(storage, `${comment.id}-${img.name}`);
          const snap = await uploadBytes(imgRef, img);
          const imgURL = await getDownloadURL(ref(storage, snap.ref.fullPath));
          commentData.image = imgURL;
          URL.revokeObjectURL(img);
        } else {
          commentData.image = img;
        }
        setImg(null);
      }
      await updateDoc(commentDoc, commentData);
      setContent('');
      setShowUpdateComment(false);
    }
  };
  return (
    <div className='w-100'>
      <Form
        className='d-flex flex-column bg-white message-form'
        onSubmit={() => {
          return false;
        }}
        style={{height: 'max-content'}}
      >
        <div className='w-100 d-flex'>
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
                const file = e.target.files[0];
                file.preview = URL.createObjectURL(file);
                setImg(file);
              }}
            />
          </div>
          <InputGroup
            className='mx-3 mb-3 d-flex align-items-center'
            style={{height: 'max-content'}}
          >
            <Form.Control
              placeholder='Write a comment...'
              aria-label='Message'
              aria-describedby='basic-addon1'
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
              autoFocus
              onKeyPress={handleEnter}
            />
          </InputGroup>
          <div
            className='cursor-pointer send-btn'
            style={{height: 35}}
            ref={postBtnRef}
            onClick={handleUpdateComment}
          >
            <Send fontSize='large' sx={{color: '#0088ff'}} />
          </div>
        </div>
        {img && (
          <div
            className='px-2 w-100 bg-white'
            style={{height: 100, width: 'fit-content'}}
          >
            <div className='position-relative' style={{width: 'fit-content'}}>
              <img src={img.preview} alt='' style={{height: 100}} />
              <div
                className='ms-auto rounded-circle p-1 cursor-pointer position-absolute top-0 end-0'
                style={{
                  aspectRatio: '1/1',
                  background: '#e4e6eb',
                }}
                onClick={() => setImg(null)}
              >
                <Close />
              </div>
            </div>
          </div>
        )}
      </Form>
    </div>
  );
};

export default UpdateComment;
