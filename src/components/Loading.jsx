import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import clsx from 'clsx';

const Loading = (isLoading) => {
  return (
    <div 
        className={clsx('d-flex justify-content-center align-items-center position-fixed top-0 bottom-0 start-0, end-0', {'d-none': !isLoading})}
        style={{background:'rgba(0, 0, 0, 0.8)'}}
    >
        <Spinner variant='primary'>
            <span className='visually-hidden'>Loading...</span>
        </Spinner>
    </div>
  )
}

export default Loading