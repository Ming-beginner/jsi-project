import React from 'react';
import {LoginForm} from '../components';
import {Link} from 'react-router-dom'
import {LoginWithGoogle} from '../components'

const Login = () => {
  return (
    <div className='position-fixed fixed-top d-flex justify-content-center align-items-center w-100 vh-100 bg-white'>
      <div
        className='d-flex flex-column justify-content-center align-items-center w-100'
        style={{background: 'var(--bg-color)', maxWidth: 500, height: 'max-content'}}
      >
        <LoginForm/>
        <p>Do not have an account? <Link to='/signup'>Sign up</Link></p>
        <hr className='mb-3' />
        <LoginWithGoogle />
      </div>
    </div>
  )
}

export default Login