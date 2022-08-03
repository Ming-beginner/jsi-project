import React, {useEffect} from 'react';
import {useSignInWithEmailAndPassword} from 'react-firebase-hooks/auth';
import {useNavigate} from 'react-router-dom'
import {Form, Button} from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';
import { auth } from '../../firebase';
import Loading from '../Loading';
import ErrorModal from '../ErrorModal';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/imgs/logo.png';

const LoginForm = () => {
  const [
    signInWithEmailAndPassword,
    user,
    loading,
    error,
  ] = useSignInWithEmailAndPassword(auth);
  const {setCurrentUser} = useAuth();
  const navigate = useNavigate();
  const loginSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(8, 'Password must be at least 8 characters long').required('Password is required')
  });
  useEffect(()=>{
    if(user){
      setCurrentUser(user.user);
      navigate('/');
    }
  })
  console.log(error);
  return (
    <div 
      className='d-flex justify-content-center align-items-center flex-column px-5 py-3 w-100'
    >
      <Loading isLoading={loading} />
      <ErrorModal error={error} />
      <div className='d-flex flex-column justify-content-center align-items-center'>
        <img src={logo} alt='logo' height={100} width='100' />
        <h1 className='mt-4'>Log in</h1>
      </div>
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={values => {
         signInWithEmailAndPassword(values.email, values.password)
       }}
        validationSchema={loginSchema}
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
              <Form noValidate onSubmit={handleSubmit} className='w-100 d-flex flex-column'>
                  <Form.Group md='3' controlId='validationFormik05' className='mb-3'>
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
                  <Form.Group md='3' className='mb-3' controlId='validationFormik06'>
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
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.password}
                      </Form.Control.Feedback>
                  </Form.Group>
                  <Button type='submit' className='w-50 align-self-center'>Log in</Button>
              </Form>
        )}
      </Formik>
    </div>
  )
}

export default LoginForm