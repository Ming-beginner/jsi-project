import React from 'react';
import {Close} from '@mui/icons-material';
import ImageGallery from 'react-image-gallery';

const PostPopup = ({images, index, handleClose}) => {
  return (
    <div
      className='position-fixed top-0 bottom-0 start-0 end-0'
      style={{zIndex: 200, background: 'rgba(0, 0, 0, 0.8)'}}
    >
      <div
        className='ms-auto rounded-circle p-1 cursor-pointer position-absolute top-0 end-0 m-2'
        style={{
          aspectRatio: '1/1',
          background: '#e4e6eb',
          zIndex: 1000,
        }}
        onClick={() => {
          console.log('close');
          handleClose();
        }}
      >
        <Close />
      </div>
      <ImageGallery
        items={images.map((image) => ({
          original: image,
          thumbnail: image,
        }))}
        startIndex={index}
        useBrowserFullscreen={true}
      />
    </div>
  );
};

export default PostPopup;
