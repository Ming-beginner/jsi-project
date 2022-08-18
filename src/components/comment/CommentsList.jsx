import React, {useRef, useState} from 'react';
import CreateComment from './CreateComment';
import Comment from './Comment';

const CommentsList = ({comments, post}) => {
  const [parentId, setParentId] = useState(null);
  const getReplies = (parentId) => comments[parentId];
  return (
    <div className='position-relative bg-white mt-2'>
      <div className='w-100 bg-white mb-2'>
        <CreateComment postId={post.id} parentId={parentId} />
      </div>
      <div className='w-100 p-2'>
        {comments[null]
          ? comments[null].map((comment, index) => {
              return (
                <Comment
                  setParentId={setParentId}
                  key={index}
                  rootComment={comment}
                  rootCommentId={comment.id}
                  getReplies={getReplies}
                />
              );
            })
          : ''}
      </div>
    </div>
  );
};

export default CommentsList;
