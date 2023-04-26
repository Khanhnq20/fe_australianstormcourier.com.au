import React from 'react'
import { Sidebar } from '../../../layout'
import { Col, Row } from 'react-bootstrap';
import '../style/productDetail.css';
import Form from 'react-bootstrap/Form';
import { Formik } from 'formik';
import {FaPenSquare} from 'react-icons/fa';
import Button from 'react-bootstrap/Button';
import * as yup from 'yup';

let rateSchema = yup.object().shape({
  rate: yup.number().typeError("Rate must be number").required("Rate is required field")
})

function ProductDetail(){
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
                              Name
                            </p>
                            <p className='product-content'>
                              Ansel
                            </p>
                        </div>
                        <div className='product-label-info'>
                            <p className='product-label'>
                              Quality
                            </p>
                            <p className='product-content'>
                              07731158000
                            </p>
                        </div>
                        <div className='product-label-info'>
                            <p className='product-label'>
                              From
                            </p>
                            <p className='product-content'>
                              Anselm@gmail.com
                            </p>
                        </div>
                        <div className='product-label-info'>
                            <p className='product-label'>
                              To
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
                            <p className='product-content-light'>
                              Looking for a driver
                            </p>
                        </div>
                        <div className='product-label-info'  style={{alignItems:'unset'}}>
                            <p className='product-label-fit'>
                              Product pictures
                            </p>
                            <div>
                                <div className='img-front-frame'  style={{padding:'10px 0 '}}>
                                    <div className='background-front'>
                                        <div style={{position:'relative',color:'gray',fontSize:'50px',opacity:'70%'}}>4</div>
                                        <p className='driving-txt'>view image</p>
                                    </div>
                                    <img className='img-front' src={'https://tinyurl.com/5ehpcctt'}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row>
              <Col>
                  <div className='py-4'>
                    <div className='product-label-info my' >
                          <p className='product-label-fit'>
                            Status
                          </p>
                          <p className='product-content-light'>
                            Looking for a driver
                          </p>
                      </div>
                      <div>
                          <p>You can get this order fast, enter the price you want to deliver.</p>
                      </div>
                      <div>
                          <Formik
                            initialValues={{
                              rate:''
                            }}
                            validationSchema={rateSchema}
                          >
                            {({touched, errors, handleSubmit, handleChange, handleBlur}) =>{
                              return(
                                <Form>
                                    <Form.Group className="form-group">
                                      <div  className='mb-2'>
                                          <Form.Label className='product-label-fit my-0'>Rate</Form.Label>
                                      </div>
                                      <div className='product-rate-form'>
                                          <div className='frame-pass' style={{maxWidth:'500px',flexGrow:'1'}}>
                                            <Form.Control
                                                type={'text'} 
                                                style={{position:'relative'}}
                                                isInvalid={touched.rate && errors.rate}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="Fill rate (rate must be number)"
                                                name="rate"/>
                                                <div className='override-block' style={{background:'#fafafa'}}></div>
                                                <div className='eyes-pass px-1'>
                                                  $
                                                </div>
                                          </div>
                                          <div>
                                            <FaPenSquare className='rate-icon'></FaPenSquare>
                                          </div>
                                      </div>
                                    </Form.Group>
                                    <Button variant="warning" className='my-btn-yellow'>Register</Button>
                                </Form>
                              )
                            }}
                          </Formik>
                      </div>
                  </div>
              </Col>
            </Row>
          </div>
        </div>
    )
}

export default function Index() {
  return (
    <Sidebar>
        <ProductDetail></ProductDetail>
    </Sidebar>
  )
}
