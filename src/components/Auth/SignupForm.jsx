import React, {useState, useEffect} from 'react';
import {
  useCreateUserWithEmailAndPassword,
  useUpdateProfile,
} from 'react-firebase-hooks/auth';
import {useUploadFile} from 'react-firebase-hooks/storage';
import {useNavigate} from 'react-router-dom';
import {Form, Button} from 'react-bootstrap';
import {Formik} from 'formik';
import * as yup from 'yup';
import {
  auth,
  storage,
  ref,
  getDownloadURL,
  useCurrentUser,
  db,
  doc,
  setDoc,
} from '../../firebase';
import Loading from '../Loading';
import ErrorModal from '../ErrorModal';
import logo from '../../assets/imgs/logo.png';
import defaultAvatar from '../../assets/imgs/default-avatar.png';

const SignupForm = () => {
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  const currentUser = useCurrentUser();
  const [uploadFile, uploading, snapshot, fileError] = useUploadFile();
  const [updateProfile, updating, profileError] = useUpdateProfile(auth);
  const [avatar, setAvatar] = useState();
  const [username, setUsername] = useState('user');
  const navigate = useNavigate();
  const updateUserInfo = async () => {
    const avatarRef = ref(storage, `avatar/${user.user.uid}.png`);
    const userDoc = doc(db, 'users', user.user.uid);
    let avatarUrl = defaultAvatar;
    if (avatar) {
      await uploadFile(avatarRef, avatar, {
        contentType: 'image/png',
      });
      const downloadUrl = await getDownloadURL(avatarRef);
      avatarUrl = downloadUrl ? downloadUrl : avatarUrl;
    }

    await updateProfile({displayName: username, photoURL: avatarUrl});
    await setDoc(userDoc, {
      uid: currentUser.uid,
      name: currentUser.displayName,
      email: currentUser.email,
      avatar: avatarUrl,
      isOnline: true,
      bio: '',
    });
    navigate('/');
  };
  const signupSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .required('Password is required'),
    passwordConfirmation: yup
      .string()
      .required('Password confirmation is required')
      .oneOf([yup.ref('password'), null], 'Incorrect password'),
  });
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, []);
  useEffect(() => {
    if (user) {
      updateUserInfo();
    }
  }, [user]);
  return (
    <div className='d-flex justify-content-center align-items-center flex-column px-5 py-3 w-100'>
      <Loading isLoading={loading || uploading || updating} />
      <ErrorModal error={error || fileError || profileError} />
      <div className='d-flex flex-column justify-content-center align-items-center'>
        <img src={logo} alt='logo' height={100} width='100' />
        <h1 className='mt-4'>Sign up</h1>
      </div>
      <Formik
        initialValues={{
          email: '',
          password: '',
          passwordConfirmation: '',
        }}
        onSubmit={(values) => {
          createUserWithEmailAndPassword(values.email, values.password);
        }}
        validationSchema={signupSchema}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          /* and other goodies */
        }) => (
          <Form
            noValidate
            onSubmit={handleSubmit}
            className='w-100 d-flex flex-column'
          >
            <div className='d-flex w-100 flex-column flex-md-row align-items-center me-2'>
              <div className='d-flex flex-column justify-content-center w-100'>
                <Form.Group
                  md='3'
                  controlId='validationFormik03'
                  className='mb-3'
                >
                  <Form.Label>Avatar</Form.Label>
                  <Form.Control
                    type='file'
                    name='avatar'
                    onChange={(e) => {
                      let file = e.target.files[0];
                      setAvatar(file);
                    }}
                    onBlur={handleBlur}
                  />
                </Form.Group>
                <Form.Group
                  md='3'
                  controlId='validationFormik04'
                  className='mb-3'
                >
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='username'
                    name='username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onBlur={handleBlur}
                    isInvalid={!username.length > 0}
                  />
                  <Form.Control.Feedback type='invalid'>
                    Please enter a name
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className='w-100 ms-2'>
                <Form.Group
                  md='3'
                  controlId='validationFormik05'
                  className='mb-3'
                >
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type='email'
                    placeholder='Email'
                    name='email'
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.email && !errors.email}
                    isInvalid={errors.email}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  md='3'
                  className='position-relative mb-3'
                  controlId='validationFormik06'
                >
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder='Password'
                    name='password'
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.password && !errors.password}
                    isInvalid={errors.password}
                  ></Form.Control>

                  <Form.Control.Feedback type='invalid'>
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  md='3'
                  className='mb-3'
                  controlId='validationFormik07'
                >
                  <Form.Label>Password confirmation</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder='Password confirmation'
                    name='passwordConfirmation'
                    value={values.passwordConfirmation}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={
                      touched.passwordConfirmation &&
                      !errors.passwordConfirmation
                    }
                    isInvalid={errors.passwordConfirmation}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {errors.passwordConfirmation}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>
            <Button type='submit' className='w-50 align-self-center'>
              Sign up
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignupForm;
