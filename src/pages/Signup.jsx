import React from 'react';
import {Link} from 'react-router-dom';
import {LoginWithGoogle} from '../components'
import {SignupForm} from '../components'

const Signup = () => {
  return (
    <div 
      className='position-fixed fixed-top fixed-bottom d-flex justify-content-center align-items-center w-100 bg-white'
      style={{overflow:'scroll'}}
    >
      <div
        className='d-flex flex-column justify-content-center align-items-center w-100'
        style={{background: 'var(--bg-color)', maxWidth: 800, height: 'max-content'}}
      >
        <SignupForm/>
        <p>Already have an account? <Link to='/login'>Login</Link></p>
        <hr className='mb-3' style={{width: '50%'}} />
        <LoginWithGoogle />
      </div>
    </div>
  )
}

export default Signup