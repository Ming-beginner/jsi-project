import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';

const PostImg = ({imgs, handleShowPopup}) => {
  return (
    <Container fluid>
      {imgs.length < 3 && (
        <Row>
          {imgs.map((img, index) => {
            return (
              <Col
                className='p-0'
                key={index}
                onClick={() => handleShowPopup(index)}
              >
                <img className='w-100 cursor-pointer' src={img} alt='' />
              </Col>
            );
          })}
        </Row>
      )}
      {imgs.length > 3 && (
        <>
          <Row>
            {imgs.map((img, index) => {
              if (index < 2) {
                return (
                  <Col
                    className='p-0'
                    key={index}
                    onClick={() => handleShowPopup(index)}
                  >
                    <img className='w-100 cursor-pointer' src={img} alt='' />
                  </Col>
                );
              }
            })}
          </Row>
          <Row>
            {imgs.map((img, index) => {
              if (index > 1 && index < 4) {
                return (
                  <Col
                    className='p-0'
                    key={index}
                    onClick={() => handleShowPopup(index)}
                  >
                    <img className='w-100 cursor-pointer' src={img} alt='' />
                  </Col>
                );
              }
              if (index === 4) {
                return (
                  <Col
                    className='position-relative p-0'
                    onClick={() => handleShowPopup(0)}
                    key={index}
                  >
                    <div className='p-0'>
                      <img className='w-100 cursor-pointer' src={img} alt='' />
                    </div>
                    {imgs.length > 5 && (
                      <>
                        <div
                          className='position-absolute w-100 h-100 top-0 left-0 d-flex justify-content-center align-items-center'
                          style={{
                            background: 'rgba(0, 0, 0, 0.5)',
                            zIndex: 1,
                          }}
                        >
                          <span className='m-0 fs-1 '>+{imgs.length - 5}</span>
                        </div>
                      </>
                    )}
                  </Col>
                );
              }
            })}
          </Row>
        </>
      )}
    </Container>
  );
};

export default PostImg;
