import React from 'react';
import {Link} from 'react-router-dom';
import {Dropdown} from 'react-bootstrap';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import BookmarkRemoveOutlinedIcon from '@mui/icons-material/BookmarkRemoveOutlined';

const SavedPost = ({data, unsavePost, index}) => {
    return (
        <div className='w-100 bg-white d-flex p-3 rounded-3 mb-3'>
            <Link
                to={
                    data.images
                        ? `post/${data.id}:`
                        : `profile/${data.author.uid}`
                }
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
                <div
                    className='w-100 overflow-hidden mt-2'
                    style={{whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}
                >
                    <Link
                        to={`post/${data.id}`}
                        className='text-dark text-decoration-none fw-bold fs-4'
                    >
                        {data.content}
                    </Link>
                </div>
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
                            unsavePost(index);
                        }}
                    >
                        <BookmarkRemoveOutlinedIcon className='me-3' /> Unsave
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
};

export default SavedPost;
