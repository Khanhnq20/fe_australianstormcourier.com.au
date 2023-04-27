import React from 'react'
import { Sidebar } from '../../../layout'
import { Col, Row } from 'react-bootstrap';
import '../style/orderDetail.css';
import Button from 'react-bootstrap/Button';
import { NavLink } from 'react-router-dom';

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
              <p className='product-content-title my-3'>Order</p>
              <Col>
                  <div className='order-letter-form py-4'>
                    <div>
                        <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.375 52.5H135.625V135.625H4.375V52.5Z" fill="#78A0D4"/>
                            <path d="M78.75 94.0625L135.625 52.5L70 4.375L4.375 52.5L61.25 94.0625H78.75Z" fill="#5E87CA"/>
                            <path d="M61.25 94.0625L24.0625 66.8872V21.875H115.938V66.8872L78.75 94.0625H61.25Z" fill="#E2E7F6"/>
                            <path d="M100.643 78.0653V21.875H24.0625V66.8872L52.2812 87.5H87.7187L100.643 78.0653Z" fill="#F2F2F2"/>
                            <path d="M4.375 135.625L70 87.5L135.625 135.625" fill="#93BEE5"/>
                            <path d="M70 65.625C79.665 65.625 87.5 57.79 87.5 48.125C87.5 38.46 79.665 30.625 70 30.625C60.335 30.625 52.5 38.46 52.5 48.125C52.5 57.79 60.335 65.625 70 65.625Z" fill="#4D8C28"/>
                            <path d="M69.9998 30.625C66.803 30.6231 63.6668 31.4973 60.932 33.1529C58.1973 34.8084 55.9686 37.1818 54.4883 40.0152C53.0079 42.8485 52.3324 46.0334 52.5352 49.2238C52.7381 52.4142 53.8115 55.4879 55.6388 58.1109C59.0067 60.4568 63.0923 61.5435 67.1806 61.1807C71.2688 60.818 75.0993 59.0289 78.0015 56.1267C80.9037 53.2245 82.6927 49.3941 83.0555 45.3058C83.4182 41.2175 82.3316 37.1319 79.9857 33.7641C77.0578 31.7183 73.5716 30.6224 69.9998 30.625Z" fill="#559B2D"/>
                            <path d="M65.6252 56.8747C65.0451 56.8746 64.4888 56.644 64.0786 56.2338L59.7036 51.8588L62.7967 48.7656L65.6252 51.5941L77.2036 40.0156L80.2967 43.1088L67.1717 56.2338C66.7616 56.644 66.2053 56.8746 65.6252 56.8747Z" fill="#F2F2F2"/>
                            <path d="M45.9375 72.1875H80.9375V76.5625H45.9375V72.1875Z" fill="#C8CDED"/>
                            <path d="M85.3125 72.1875H94.0625V76.5625H85.3125V72.1875Z" fill="#C8CDED"/>
                        </svg>
                    </div>
                    <div>
                        <p className='order-txt-letter txt-center p-3'> 
                            Sender has agreed to let you deliver and has paid for the system.
                              Please start the shipment quickly, when you receive the goods, press start.
                        </p>
                    </div>
                    <div style={{margin:'0 auto'}}>
                      <NavLink to='/driver/order/detail/process'>
                        <Button className='my-btn-yellow mx-2'>Start</Button>
                      </NavLink>
                      <Button className='my-btn-gray mx-2'>False</Button>
                    </div>
                  </div>
              </Col>
            </Row>
          </div>
        </div>
    )
}

export default function Index() {
  return (<>
    <Sidebar>
        <OrderDetail></OrderDetail>
    </Sidebar>
  </>
  )
}
