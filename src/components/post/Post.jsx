import React, {useEffect, useState} from 'react';
import {
  BookmarkBorderOutlined,
  DeleteOutline,
  Edit,
  MoreHoriz,
  ThumbUp,
  ThumbUpAltOutlined,
  ModeCommentOutlined,
  Share,
  Public,
  LockOutlined,
} from '@mui/icons-material';
import Moment from 'react-moment';
import clsx from 'clsx';
import {
  db,
  collection,
  onSnapshot,
  where,
  query,
  useCurrentUser,
  updateDoc,
  doc,
  arrayUnion,
  orderBy,
} from '../../firebase';
import UpdatePost from './UpdatePost';
import SuccessModal from '../SuccessModal';
import CommentsList from '../comment/CommentsList';
import SharePost from './SharePost';
import {Dropdown, Modal, Button} from 'react-bootstrap';
import {useNavItemContext} from '../../context/navItemContext';
import PostImg from './PostImg';
import PostPopup from './PostPopup';

const Post = ({post, handleDeletePost, index}) => {
  const [comments, setComments] = useState({});
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post?.likes);
  const [seeMore, setSeeMore] = useState(false);
  const [showUpdatePost, setShowUpdatePost] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [savePostSuccess, setSavedPostSuccess] = useState();
  const [share, setShare] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImgPopup, setShowImgPopup] = useState(false);
  const [popupIndex, setPopupIndex] = useState(0);
  const currentUser = useCurrentUser();
  const {activeNavItem} = useNavItemContext();
  const postLink = window.location.hostname + `/post/${post.id}`;
  useEffect(() => {
    const q = query(
      collection(db, 'comments'),
      where('postId', '==', post.id),
      orderBy('updatedAt', 'desc')
    );
    const unsub = onSnapshot(q, (querySnapshot) => {
      const comments = {};
      querySnapshot.forEach((doc) => {
        let comment = doc.data();
        comments[comment.parentId] ||= [];
        comments[comment.parentId].push(comment);
      });
      setComments(comments);
      setLikes(post.likes);
      setLiked(post.likedUsers.includes(currentUser.uid));
    });
    return () => unsub();
  }, []);
  const updateLike = async () => {
    const likedUsers = post.likedUsers || [];
    await updateDoc(doc(db, 'post', post.id), {
      likes: likes,
      likedUsers: liked
        ? arrayUnion(currentUser.uid)
        : likedUsers.filter((uid) => uid !== currentUser.uid),
    });
  };
  useEffect(() => {
    updateLike();
  }, [likes, liked]);
  const handleUpdatePost = () => {
    setShowUpdatePost(true);
  };
  const handleSavePost = async () => {
    await updateDoc(doc(db, 'users', currentUser.uid), {
      saved: arrayUnion(post.id),
    });
    setSavedPostSuccess('Saved post successfully');
  };
  const handleLike = () => {
    if (!liked) {
      setLikes((like) => like + 1);
    } else {
      setLikes((like) => (like > 0 ? like - 1 : like));
    }
    setLiked((liked) => !liked);
  };
  const handleClose = () => {
    setShare(false);
  };
  const handleCloseUpdatePost = () => {
    setShowUpdatePost(false);
  };
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };
  const handleShowPopup = (index) => {
    setPopupIndex(index);
    setShowImgPopup(true);
  };
  const handleClosePopup = () => {
    setShowImgPopup(false);
  };
  return (
    <div
      style={{width: 500, height: 'fit-content'}}
      className='bg-white mb-4 post'
    >
      {showImgPopup && (
        <PostPopup
          images={post.images}
          index={popupIndex}
          handleClose={handleClosePopup}
        />
      )}
      <SuccessModal success={savePostSuccess} />
      {showUpdatePost && (
        <UpdatePost
          post={post}
          handleClose={handleCloseUpdatePost}
          user={currentUser}
        />
      )}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this post?</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button
            variant='danger'
            onClick={() => {
              handleDeletePost(index);
              handleCloseDeleteModal();
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      {share && <SharePost handleClose={handleClose} link={postLink} />}
      <div>
        <div className='d-flex justify-content-between align-items-center'>
          <div className='d-flex align-items-center p-2'>
            <img
              src={post.author.avatar}
              alt='avatar'
              className='rounded-circle me-2 border'
              width={50}
              height={50}
            />
            <div>
              <span className='fs-5'>{post.author.name}</span>
              <div>
                <span className='text-black-50' style={{fontSize: 13}}>
                  {post.updatedAt > post.createdAt ? 'Updated: ' : 'Created: '}
                  <Moment fromNow ago className='me-1'>
                    {post.updatedAt > post.createdAt
                      ? post.updatedAt.toDate()
                      : post.createdAt.toDate()}
                  </Moment>
                  ·
                  {post.audience === 'public' ? (
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
              <Dropdown.Item onClick={handleSavePost}>
                <BookmarkBorderOutlined /> Save post
              </Dropdown.Item>
              {post.author.uid === currentUser?.uid &&
                activeNavItem === 'profile' && (
                  <>
                    <Dropdown.Item onClick={handleUpdatePost}>
                      <Edit /> Edit post
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => setShowDeleteModal(true)}>
                      <DeleteOutline /> Delete post
                    </Dropdown.Item>
                  </>
                )}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className='w-100'>
          <div className='px-3 py-2 '>
            <p
              className={clsx('m-0 mb-3', {'post-overflow': !seeMore})}
              style={{
                fontSize: 15,
                overflow: 'hidden',
                boxSizing: 'content-box',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
              }}
            >
              {post.content}
            </p>
            {post.content.length > 400 && !seeMore && (
              <span
                className='text-dark fw-bold cursor-pointer underline-on-hover mb-3'
                onClick={() => setSeeMore(true)}
              >
                See more
              </span>
            )}
            {post.images.length ? (
              <PostImg
                imgs={post.images}
                handleShowPopup={(index) => handleShowPopup(index)}
              />
            ) : (
              ''
            )}
          </div>
        </div>
        <div>
          <div
            className='d-flex justify-content-between px-3 py-2 text-black-50'
            style={{fontSize: 12}}
          >
            <span
              className={clsx('underline-on-hover cursor-pointer', {
                'like-active': likes,
              })}
            >
              {likes}{' '}
              <ThumbUp className='me-2 post-item ' style={{fontSize: 13}} />
            </span>
            <span
              className='underline-on-hover cursor-pointer'
              onClick={() => setShowComments(!showComments)}
            >
              {Object.values(comments).reduce(
                (total, curr) => total + curr.length,
                0
              )}{' '}
              Comments
            </span>
          </div>
          <div className='d-flex border-top'>
            <div
              className={clsx(
                'flex-grow-1 d-flex justify-content-center alin-items-center p-3 cursor-pointer',
                {'like-active': liked}
              )}
              style={{color: '#65676B'}}
              onClick={handleLike}
            >
              {liked ? (
                <ThumbUp className='me-2 post-item' />
              ) : (
                <ThumbUpAltOutlined className='me-2 post-item' />
              )}
              Like
            </div>
            <div
              className='flex-grow-1 d-flex justify-content-center alin-items-center p-3 cursor-pointer'
              style={{color: '#65676B'}}
              onClick={() => setShowComments(!showComments)}
            >
              <ModeCommentOutlined className='me-2 post-item' />
              Comments
            </div>
            <div
              className='flex-grow-1 d-flex justify-content-center alin-items-center p-3 cursor-pointer'
              style={{color: '#65676B'}}
              onClick={() => setShare(true)}
            >
              <Share className='me-2 post-item' />
              Share
            </div>
          </div>
        </div>
      </div>
      {showComments && <CommentsList comments={comments} post={post} />}
    </div>
  );
};
export default Post;
