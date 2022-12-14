import React, {useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import {useDropzone} from 'react-dropzone';
import clsx from 'clsx';
import {useUploadFile} from 'react-firebase-hooks/storage';
import {Form, Button} from 'react-bootstrap';
import {Image, Close} from '@mui/icons-material';
import {Link} from 'react-router-dom';
import ErrorModal from '../ErrorModal';
import SuccessModal from '../SuccessModal';
import Loading from '../Loading';
import {
  setDoc,
  db,
  doc,
  Timestamp,
  getDownloadURL,
  storage,
  ref,
} from '../../firebase';

const CreatePost = ({userName, userAvatar, setCreatePostModal, user, post}) => {
  const [audience, setAudience] = useState('public');
  const [postContent, setPostContent] = useState('');
  const [imgContainer, setImgContainer] = useState(false);
  const [images, setImages] = useState(null);
  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const [uploadFile, uploading, snapshot, fileError] = useUploadFile();
  const onDrop = (acceptedFiles) => {
    setImages((images) => {
      if (images) {
        return [
          ...images,
          ...acceptedFiles.map((file) => {
            return Object.assign(file, {
              preview: URL.createObjectURL(file),
            });
          }),
        ];
      } else {
        return acceptedFiles.map((file) => {
          return Object.assign(file, {
            preview: URL.createObjectURL(file),
          });
        });
      }
    });
  };
  const postPost = async () => {
    let id = uuidv4();
    const postRef = doc(db, 'post', id);
    const author = {
      name: user.displayName,
      avatar: user.photoURL,
      uid: user.uid,
    };
    const imageURLs = [];
    const postData = {
      content: postContent,
      images: imageURLs,
      author,
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
      likes: 0,
      audience,
      likedUsers: [],
      id,
    };

    try {
      if (images) {
        for (let i = 0; i < images.length; i++) {
          let imageRef = ref(storage, `postImages/${uuidv4()}`);
          await uploadFile(imageRef, images[i], {
            contentType: 'image/png',
          });
          let downloadUrl = await getDownloadURL(imageRef);
          imageURLs.push(downloadUrl);
          URL.revokeObjectURL(images[i]);
        }
        postData.images = imageURLs;
      }
      await setDoc(postRef, postData);
      setSuccess('Created post successfully!!');
      setImages(false);
    } catch (err) {
      setError(err);
      console.error(err);
    }
  };
  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.png'],
    },
    onDrop,
  });
  const removeImage = (index) => {
    let newImages = [];
    images.forEach((image, i) => {
      if (i !== index) newImages.push(image);
    });
    setImages(newImages);
  };
  return (
    <>
      <ErrorModal error={error || fileError} />
      <Loading isLoading={uploading} />
      <SuccessModal
        success={success}
        callback={() => setCreatePostModal(false)}
      />
      <div
        className='position-fixed top-0 start-0 h-100 w-100 d-flex justify-content-center align-items-center '
        style={{background: 'rgba(200,200,200,0.6)', zIndex: 3000}}
      >
        <div
          className='bg-white ps-2 py-3 rounded-3 create-post-container'
          style={{width: 600, maxHeight: '100vh', overflowY: 'auto'}}
        >
          <div className='d-flex justify-content-center align-items-center pe-2'>
            <p className='fs-4 fw-bold ms-auto'>Create post</p>
            <div
              className='ms-auto rounded-circle p-1 cursor-pointer'
              style={{aspectRatio: '1/1', background: '#e4e6eb'}}
              onClick={() => {
                if (images) {
                  images.forEach((image) => {
                    URL.revokeObjectURL(image);
                  });
                }
                setImages(null);
                setCreatePostModal(false);
              }}
            >
              <Close />
            </div>
          </div>
          <div className='d-flex flex-column'>
            <div className='d-flex align-items-center justify-content-between pe-2'>
              <div className='d-flex justify-content-center align-items-center '>
                <Link to={`/profile/${user.uid}`}>
                  <img
                    src={userAvatar}
                    alt='avatar'
                    className='rounded-circle me-3'
                    height={50}
                    width={50}
                  />
                </Link>
                <p className='fs-4 m-0'>{userName}</p>
              </div>
              <Form.Select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                style={{width: 100}}
              >
                <option value='public'>Public</option>
                <option value='private'>Private</option>
              </Form.Select>
            </div>
            <div className='my-3 overflow-scroll' style={{maxHeight: 450}}>
              <Form.Group
                className='mb-3 '
                controlId='exampleForm.ControlInput1'
              >
                <Form.Control
                  as='textarea'
                  className='border-0 shadow-none'
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder={`What's on your mind, ${userName}`}
                  style={{
                    fontSize: imgContainer ? 15 : 18,
                    height: 300,
                  }}
                />
              </Form.Group>
              {imgContainer && (
                <div className='border rounded-3 p-1'>
                  <div className='d-flex justify-content-center align-items-center mb-3 pb-2 border-bottom w-100'>
                    <p className='fs-4 mb-0 ms-auto'>Add images</p>
                    <div
                      className='ms-auto rounded-circle p-1 cursor-pointer'
                      style={{
                        aspectRatio: '1/1',
                        background: '#e4e6eb',
                      }}
                      onClick={() => {
                        setImgContainer(false);
                        images.forEach((image) => {
                          URL.revokeObjectURL(image);
                        });
                        setImages(null);
                      }}
                    >
                      <Close />
                    </div>
                  </div>
                  <div
                    {...getRootProps()}
                    className='d-flex justify-content-center align-items-center cursor-pointer '
                  >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <p>Drop the files here ...</p>
                    ) : (
                      <p>
                        Drag and drop some files here, or click to select files
                      </p>
                    )}
                  </div>
                  <div className='d-flex flex-wrap'>
                    {images &&
                      images.map((image, index) => {
                        return (
                          <div
                            className='position-relative'
                            style={{
                              width:
                                images.length % 2 === 0
                                  ? '50%'
                                  : index === images.length - 1
                                  ? '100%'
                                  : '50%',
                            }}
                            key={index}
                          >
                            <img src={image.preview} alt='' className='w-100' />
                            <div
                              className='ms-auto rounded-circle p-1 cursor-pointer position-absolute top-0 end-0'
                              style={{
                                aspectRatio: '1/1',
                                background: '#e4e6eb',
                              }}
                              onClick={() => removeImage(index)}
                            >
                              <Close />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
            <div
              className='d-flex justify-content-between align-items-center px-3 py-2 border rounded-3 cursor-pointer me-2'
              onClick={() => setImgContainer(true)}
            >
              <p className='m-0'>Add images to your post</p>
              <div>
                <Image fontSize='large' color='success' />
              </div>
            </div>
            <Button
              variant='primary'
              className={clsx('mt-3 me-2 w-50 align-self-center', {
                'not-allowed': !postContent.length === !images ? !images : null,
              })}
              onClick={() => {
                if (postContent.length || images) {
                  postPost();
                }
              }}
            >
              Post
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
