import React, {useEffect, useState} from 'react';
import {
  BookmarkBorderOutlined,
  DeleteOutline,
  Edit,
  MoreHoriz,
  ThumbUp,
  ModeCommentOutlined,
  Share,
  Public,
  LockOutlined,
} from '@mui/icons-material';
import Moment from 'react-moment';
import {
  db,
  collection,
  onSnapshot,
  where,
  query,
  useCurrentUser,
} from '../firebase';

import Dropdown from 'react-bootstrap/Dropdown';

const Post = ({post}) => {
  console.log(post);
  const [comments, setComments] = useState({});
  const [liked, setLiked] = useState(false);
  const currentUser = useCurrentUser();
  useEffect(() => {
    const q = query(collection(db, 'comments'), where('postId', '==', post.id));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const comments = {};
      querySnapshot.forEach((doc) => {
        let comment = doc.data();
        comment.id = doc.id;
        comments[comment.parentId] ||= [];
        comments[comment.parentId].push(comment);
      });
      setComments(comments);
    });
  }, []);
  const updatePost = () => {};
  return (
    <div style={{minWidth: 500}} className='bg-white mb-4'>
      <div>
        <div className='d-flex justify-content-between align-items-center'>
          <div className='d-flex align-items-center px-2'>
            <img
              src={post.author.avatar}
              alt='avatar'
              className='rounded-circle me-2'
              style={{aspectRatio: '1/1 !important'}}
              width={50}
            />
            <div>
              <span className='fs-4'>{post.author.name}</span>
              <div>
                <span className='text-black-50'>
                  <Moment fromNow ago className='me-1'>
                    {post.createdAt.toDate()}
                  </Moment>
                  ·
                  {post.audiance === 'public' ? (
                    <Public style={{fontSize: 15}} className='ms-1' />
                  ) : (
                    <LockOutlined style={{fontSize: 15}} className='ms-1' />
                  )}
                </span>
              </div>
            </div>
          </div>
          <Dropdown>
            <Dropdown.Toggle
              className='bg-white border-0 shadow-none'
              id='dropdown-basic'
            >
              <MoreHoriz className='text-dark' />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>
                <BookmarkBorderOutlined /> Save post
              </Dropdown.Item>
              {
                (post.author.uid = currentUser.uid && (
                  <>
                    <Dropdown.Item>
                      <Edit /> Edit post
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <DeleteOutline /> Delete post
                    </Dropdown.Item>
                  </>
                ))
              }
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className='w-100'>
          <div>
            <p>{post.content}</p>
          </div>
          {post.images.length > 0 && <div></div>}
        </div>
        <div>
          <div></div>
          <div className='d-flex'>
            <div className='flex-grow-1 d-flex justify-content-center alin-items-center p-3'>
              <ThumbUp className='me-2 post-item' />
              like
            </div>
            <div className='flex-grow-1 d-flex justify-content-center alin-items-center p-3'>
              <ModeCommentOutlined className='me-2 post-item' />
              Comments
            </div>
            <div className='flex-grow-1 d-flex justify-content-center alin-items-center p-3'>
              <Share className='me-2 post-item' />
              Share
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Post;
