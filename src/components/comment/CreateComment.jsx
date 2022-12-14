import React, {useState, useRef} from 'react';
import {v4 as uuidv4} from 'uuid';
import {Form, InputGroup} from 'react-bootstrap';
import {FileUpload, Send, Close} from '@mui/icons-material';
import {
  useCurrentUser,
  setDoc,
  uploadBytes,
  doc,
  storage,
  db,
  ref,
  getDownloadURL,
} from '../../firebase';
import clsx from 'clsx';

const CreateComment = ({postId, parentId, handleClose}, ref) => {
  const currentUser = useCurrentUser();
  const [comment, setComment] = useState('');
  const [img, setImg] = useState();
  const postBtnRef = useRef();
  const inputRef = useRef();
  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      postBtnRef.current.click();
    }
  };
  const handlePostComment = async () => {
    if (comment.length > 0) {
      let id = uuidv4();
      const commentDoc = doc(db, 'comments', id);
      const commentData = {
        author: {
          avatar: currentUser.photoURL,
          name: currentUser.displayName,
          uid: currentUser.uid,
        },
        content: comment,
        image: null,
        likes: 0,
        likedUsers: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        parentId,
        postId,
        id,
      };
      if (img) {
        const imgRef = ref(storage, `${id}-${img.name}`);
        const snap = await uploadBytes(imgRef, img);
        const imgURL = await getDownloadURL(ref(storage, snap.ref.fullPath));
        commentData.image = imgURL;
        URL.revokeObjectURL(img);
        setImg(null);
      }
      await setDoc(commentDoc, commentData);
      setComment('');
      if (handleClose) handleClose();
    }
  };
  return (
    <div className='w-100'>
      <Form
        className={clsx('d-flex flex-column bg-white message-form pt-2', {
          'border pt-4 px-4 pb-2': parentId === null,
        })}
        onSubmit={() => {
          return false;
        }}
        ref={inputRef}
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
              placeholder={
                parentId !== null ? 'Write a reply...' : 'Write a comment...'
              }
              aria-label='Message'
              aria-describedby='basic-addon1'
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
              }}
              autoFocus
              onKeyPress={handleEnter}
            />
          </InputGroup>
          <div
            className='cursor-pointer send-btn'
            style={{height: 35}}
            ref={postBtnRef}
            onClick={handlePostComment}
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

export default CreateComment;
