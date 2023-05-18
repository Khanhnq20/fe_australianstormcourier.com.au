import React from 'react'
import { Col, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { NavLink } from 'react-router-dom';
import '../style/oderProcessDetail.css'

function OrderDetail(){
    return(
        <div>
            <div>
              <p className='product-detail-header'>Details</p>
            </div>
          <div>
            <div>
              <p className='product-content-title mb-3'>Product Information</p>
            </div>
            <Row className='product-form-content'>
                <Col>
                  <div className='product-form-info'>
                      <div>
                        <div className='product-label-info'>
                            <p className='product-label'>
                              ID
                            </p>
                            <p className='product-content'>
                              00001
                            </p>
                        </div>
                        <div className='product-label-info'>
                            <p className='product-label'>
                              Username
                            </p>
                            <p className='product-content'>
                              Ansel
                            </p>
                        </div>
                        <div className='product-label-info'>
                            <p className='product-label'>
                              Phone number
                            </p>
                            <p className='product-content'>
                              07731158000
                            </p>
                        </div>
                        <div className='product-label-info'>
                            <p className='product-label'>
                              Email
                            </p>
                            <p className='product-content'>
                              Anselm@gmail.com
                            </p>
                        </div>
                        <div className='product-label-info'>
                            <p className='product-label'>
                              ABNnumber
                            </p>
                            <p className='product-content'>
                              189795
                            </p>
                        </div>
                      </div>
                  </div>
                </Col>
                <Col>
                    <div>
                      <div className='product-label-info'>
                            <p className='product-label-fit'>
                              Starting shipping rates
                            </p>
                            <p className='product-content'>
                              300$
                            </p>
                        </div>
                        <div className='product-label-info'>
                            <p className='product-label-fit'>
                              Selected shipping rates
                            </p>
                            <p className='product-content'>
                              06785634545$
                            </p>
                        </div>
                        <div className='product-label-info'>
                            <p className='product-label-fit'>
                              Status
                            </p>
                            <p className='order-content-light'>
                              Looking for a driver
                            </p>
                        </div>
                        <div className='product-label-info'>
                            <p className='product-label-fit'>
                              Gender
                            </p>
                            <p className='product-content'>
                              male
                            </p>
                        </div>
                        <div className='product-label-info'>
                            <p className='product-label-fit'>
                              Additional Information
                            </p>
                            <p className='product-content'>
                              Additional Information
                            </p>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row>
            </Row>
          </div>
        </div>
    )
}

export default function Index() {
  return (<>
        <OrderDetail></OrderDetail>
  </>
  )
}

