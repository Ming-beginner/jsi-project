import React, {useState, useEffect} from 'react';
import {
  DeleteOutline,
  Edit,
  MoreHoriz,
  ThumbUp,
  ThumbUpAltOutlined,
  ModeCommentOutlined,
} from '@mui/icons-material';
import Moment from 'react-moment';
import clsx from 'clsx';
import {
  useCurrentUser,
  updateDoc,
  doc,
  arrayUnion,
  db,
  deleteDoc,
} from '../../firebase';
import {Dropdown} from 'react-bootstrap';
import UpdateComment from './UpdateComment';
import CreateComment from './CreateComment';
import DeleteComment from './DeleteComment';
import SuccessModal from '../SuccessModal';

const Comment = ({setParentId, rootComment, getReplies}) => {
  const replies = getReplies(rootComment.id) || [];
  const currentUser = useCurrentUser();
  const [showReplies, setShowReplies] = useState(false);
  const [showMoreHoriz, setShowMoreHoriz] = useState(false);
  const [showUpdateComment, setShowUpdateComment] = useState(false);
  const [showDeleteComment, setShowDeleteComment] = useState(false);
  const [showRepliesText, setRepliesText] = useState(true);
  const [showCreateReplies, setShowCreateReplies] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    setLikes(rootComment.likes);
    setLiked(rootComment.likedUsers.includes(currentUser.uid));
    setShowMoreHoriz(rootComment.author.uid === currentUser.uid);
  }, [currentUser.uid, rootComment]);
  const updateLike = async (likes, liked) => {
    const likedUsers = rootComment.likedUsers || [];
    await updateDoc(doc(db, 'comments', rootComment.id), {
      likes: likes,
      likedUsers: liked
        ? arrayUnion(currentUser.uid)
        : likedUsers.filter((uid) => uid !== currentUser.uid),
    });
  };
  useEffect(() => {
    updateLike(likes, liked);
  }, [likes, liked]);
  const handleLike = () => {
    if (!liked) {
      setLikes((like) => like + 1);
    } else {
      setLikes((like) => (like > 0 ? like - 1 : like));
    }
    setLiked((liked) => !liked);
  };
  const handleReply = () => {};
  const handleDelete = async () => {
    const commentDoc = doc(db, 'comments', rootComment.id);
    await deleteDoc(commentDoc);
    setDeleteSuccess('Deleted comment successfully!');
    handleCloseDeletePopup();
  };
  const handleCloseDeletePopup = () => {
    setShowDeleteComment(false);
  };
  return (
    <div className='w-100 mb-3'>
      <SuccessModal success={deleteSuccess} />
      <DeleteComment
        show={showDeleteComment}
        handleClose={handleCloseDeletePopup}
        handleDelete={handleDelete}
      />
      <div className='d-flex'>
        <div className='d-flex align-items-start me-1'>
          <img
            src={rootComment.author.avatar}
            alt='user avatar'
            className='rounded-circle border'
            height={40}
            width={40}
          />
        </div>
        <div style={{minWidth: 200, maxWidth: '100%'}}>
          <div
            className='d-flex flex-column rounded-3 p-2 position-relative'
            style={{background: '#f0f2f5'}}
          >
            <p className='m-0 text-dark fw-semibold' style={{fontSize: 13}}>
              {rootComment.author.name}
            </p>
            <p className='m-0 text-breake w-100' style={{fontSize: 15}}>
              {rootComment.content}
            </p>
            {likes > 0 && (
              <div
                className='position-absolute d-flex align-items-center bg-white rounded-5 pe-2 justify-content-center'
                style={{
                  bottom: '-10px',
                  right: 0,
                }}
              >
                <div
                  className='bg-white d-flex justify-content-center align-items-center rounded-circle'
                  style={{
                    aspectRatio: '1/1',
                    height: 25,
                  }}
                >
                  <ThumbUp className='like-active' style={{fontSize: 13}} />
                </div>
                <span style={{fontSize: 13}}>{likes > 1 ? likes : ''}</span>
              </div>
            )}
          </div>
          <div className='d-flex justify-content-start align-items-center w-100'>
            <span
              onClick={handleLike}
              className={clsx('cursor-pointer me-3', {'like-active': liked})}
            >
              {liked ? (
                <ThumbUp
                  className='like-active'
                  style={{color: '#65676B', fontSize: 16}}
                />
              ) : (
                <ThumbUpAltOutlined style={{color: '#65676B', fontSize: 16}} />
              )}
            </span>
            <span
              className='cursor-pointer me-3'
              onClick={() => setShowCreateReplies(!showCreateReplies)}
            >
              <ModeCommentOutlined style={{color: '#65676B', fontSize: 16}} />
            </span>
            <span>
              <Moment fromNow ago style={{fontSize: 10}}>
                {rootComment.updatedAt > rootComment.createdAt
                  ? rootComment.updatedAt.toDate()
                  : rootComment.createdAt.toDate()}
              </Moment>
            </span>
          </div>
          <div className=''>
            {showUpdateComment && (
              <UpdateComment
                comment={rootComment}
                setShowUpdateComment={setShowUpdateComment}
              />
            )}
            {showCreateReplies && (
              <CreateComment
                parentId={rootComment.id}
                postId={rootComment.postId}
                handleClose={() => setShowCreateReplies(false)}
              />
            )}
          </div>
          <div className={clsx('w-100', {'d-none': !showReplies})}>
            {replies.map((reply, index) => {
              return (
                <Comment
                  rootComment={reply}
                  rootCommentId={reply.id}
                  setParentId={setParentId}
                  key={index}
                  getReplies={getReplies}
                />
              );
            })}
          </div>
          {replies.length && showRepliesText ? (
            <span
              className='text-dark underline-on-hover cursor-pointer fw-semibold'
              onClick={() => {
                setShowReplies(true);
                setRepliesText(false);
              }}
              style={{fontSize: 13}}
            >
              Replies
            </span>
          ) : (
            ''
          )}
        </div>
        {showMoreHoriz && (
          <Dropdown className='cursor-pointer'>
            <Dropdown.Toggle
              className='bg-transparent border-0 shadow-none'
              id='dropdown-basic'
            >
              <MoreHoriz className='text-dark' />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setShowUpdateComment(true)}>
                <Edit /> Edit comment
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setShowDeleteComment(true)}>
                <DeleteOutline /> Delete comment
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>
    </div>
  );
};

export default Comment;
