import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import clsx from 'clsx';

const Loading = ({isLoading}) => {
    return (
        <div
            className={clsx(
                'justify-content-center align-items-center position-fixed start-0 end-0 top-0 bottom-0',
                {'d-none': !isLoading},
                {'d-flex': isLoading}
            )}
            style={{background: 'rgba(0, 0, 0, 0.8)', zIndex: 4000}}
        >
            <Spinner
                animation='border'
                role='status'
                variant='primary'
                style={{height: 100, width: 100}}
            >
                <span className='visually-hidden'>Loading...</span>
            </Spinner>
        </div>
    );
};

export default Loading;
