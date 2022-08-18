import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {Dropdown, Modal, Button} from 'react-bootstrap';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import BookmarkRemoveOutlinedIcon from '@mui/icons-material/BookmarkRemoveOutlined';

const SavedPost = ({data, unsavePost, index}) => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to unsave this post?</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant='danger'
            onClick={() => {
              unsavePost(index);
              setShow(false);
            }}
          >
            Unsave
          </Button>
        </Modal.Footer>
      </Modal>
      <div className='w-100 bg-white d-flex p-3 rounded-3 mb-3'>
        <Link
          to={data.images ? `post/${data.id}:` : `profile/${data.author.uid}`}
          className='rounded-4 me-4 border'
        >
          <img
            src={data.images[0] || data.author.avatar}
            alt=''
            height={140}
            width={140}
          />
        </Link>
        <div className='flex-fill d-flex flex-column justify-content-between'>
          <Link
            className='w-100 overflow-hidden mt-2 text-dark text-decoration-none w-100'
            to={`post/${data.id}`}
          >
            <p
              className='fw-bold fs-4 saved-post-overflow w-100 m-0'
              style={{textOverflow: 'ellipsis'}}
            >
              {data.content}
            </p>
          </Link>
          <Link
            to={`profile/${data.author.uid}`}
            className='d-flex mb-3 text-decoration-none align-items-center'
          >
            <img
              src={data.author.avatar}
              alt='avatar'
              className='rounded-circle me-3 border'
              height={40}
              width={40}
            />
            <p className='fs-5 text-dark m-0'>{data.author.name}</p>
          </Link>
        </div>
        <Dropdown>
          <Dropdown.Toggle
            className='bg-transparent border-0 shadow-none p-0'
            id='dropdown-basic'
          >
            <MoreHorizIcon className='text-dark' fontSize='large' />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => {
                setShow(true);
              }}
            >
              <BookmarkRemoveOutlinedIcon className='me-3' /> Unsave
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </>
  );
};

export default SavedPost;
