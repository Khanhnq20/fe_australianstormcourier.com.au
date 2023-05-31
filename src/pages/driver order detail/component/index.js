import React, { useContext, useEffect, useRef } from 'react'
import { Col, Container, Row, Stack } from 'react-bootstrap';
import '../style/orderDetail.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {FaTimes} from 'react-icons/fa';
import { FieldArray, Formik } from 'formik';
import Carousel from 'react-bootstrap/Carousel';
import * as yup from 'yup';
import { Navigate, useParams } from 'react-router-dom';
import { authConstraints, authInstance, config } from '../../../api';
import { RiImageEditFill } from 'react-icons/ri';
import { CustomSpinner } from '../../../layout';
import Modal from 'react-bootstrap/Modal';
import { OrderContext } from '../../../stores';
import { dotnetFormDataSerialize } from "../../../ultitlies";
import moment from 'moment';

const PERMIT_FILE_FORMATS = ['image/jpeg', 'image/png', 'image/jpg'];
let imgSchema = yup.object().shape({
  orderId: yup.number().required(),
  deliveryImages: yup.array().of(
    yup.object().shape({
        file: yup.mixed().required(),
        url: yup.string().required()
    })).min(1).required()
    .test(
      'FILE SIZE', 
      'the file is too large', 
      (files) => {
          if (!files) {
              return true;
          }
          return files.reduce((p,c) => c.file.size + p, 0) <= 2 * 1024 * 1024;
      })
    .test(
        'FILE FORMAT',
        `the file format should be ${PERMIT_FILE_FORMATS.join()}`,
        (files) => {
            if (!files.length) {
                return true;
            }
            return files.every(c => PERMIT_FILE_FORMATS.includes(c.file.type));
        }
    ),
})
let imgDoneSchema = yup.object().shape({
    orderId: yup.number().required(),
    receivedImages: yup.array().of(
      yup.object().shape({
          file: yup.mixed().required(),
          url: yup.string().required()
      })).min(1).required()
      .test(
        'FILE SIZE', 
        'the file is too large', 
        (files) => {
            if (!files) {
                return true;
            }
            return files.reduce((p,c) => c.file.size + p, 0) <= 2 * 1024 * 1024;
        })
      .test(
          'FILE FORMAT',
          `the file format should be ${PERMIT_FILE_FORMATS.join()}`,
          (files) => {
              if (!files.length) {
                  return true;
              }
              return files.every(c => PERMIT_FILE_FORMATS.includes(c.file.type));
          }
      ),
    barcode: yup.number().required("Barcode is required field"),
})

function OrderDetail(){
  const [_, {putPrepareOrder, putDeliveryOrder, putReceiveOrder, putCancelOrder}] = useContext(OrderContext);
  const [result, setResult] = React.useState(null);
  const [loading,setLoading] = React.useState(true);
  const imgDelivery = useRef();
  const [error, setError] = React.useState("");
  const {id} = useParams();

    useEffect(() =>{
      refresh();
    }, [id]);

    function refresh(){
      setLoading(true);
      authInstance.get([authConstraints.driverRoot, authConstraints.getAllOrderInfo].join('/'), {
        headers: {
          'Authorization': [config.AuthenticationSchema, localStorage.getItem(authConstraints.LOCAL_KEY)].join(" ")
        },
        params: {
          orderId: id
        }
      }).then(response =>{
        if(response.data?.successed){
          setResult(response.data?.result);
        }
        setLoading(false);
      }).catch(error =>{
        if(error.message === "Axios Error" && error.code === 403){
          setError("Forbiden");
        }
        setLoading(false);
      });
    }

    if(loading) return (
      <Container>
        <CustomSpinner></CustomSpinner>
      </Container>);

    if(error === "Forbiden"){
      return (<Navigate to="/driver/order"></Navigate>);
    }

    return(
        <div>
          <div>
            <p className='product-detail-header'>Details</p>
          </div>
          <div>
            {/* Display order information  */}
            <div>
              <p className='product-content-title mb-3'>Order Information</p>
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
                              {"000000".substring(0, 6 - result?.order?.id?.toString().length) + result?.order?.id}
                            </p>
                        </div>
                        <div className='product-label-info'>
                            <p className='product-label'>
                              Sender Full Name
                            </p>
                            <p className='product-content'>
                              {result?.sender?.name}
                            </p>
                        </div>
                        <div className='product-label-info'>
                            <p className='product-label'>
                              Phone number
                            </p>
                            <p className='product-content'>
                              {result?.sender?.phoneNumber}
                            </p>
                        </div>
                        <div className='product-label-info'>
                            <p className='product-label'>
                              Email
                            </p>
                            <p className='product-content'>
                            {result?.sender?.email}
                            </p>
                        </div>
                        <div className='product-label-info'>
                            <p className='product-label'>
                              ABNnumber
                            </p>
                            <p className='product-content'>
                              {result?.sender?.abnNumber || "Not yet"}
                            </p>
                        </div>
                        <div className='product-label-info'>
                            <p className='product-label'>
                              Receiver Full Name
                            </p>
                            <p className='product-content'>
                              {result?.order?.receiverName}
                            </p>
                        </div>
                        <div className='product-label-info'>
                            <p className='product-label'>
                              Phone number
                            </p>
                            <p className='product-content'>
                              {result?.order?.receiverPhone}
                            </p>
                        </div>
                      </div>
                  </div>
                </Col>
                <Col>
                    <div>
                      <div className='product-label-info'>
                            <p className='product-label-fit'>
                              Total
                            </p>
                            <p className='product-content'>
                              {result?.order?.total} AUD
                            </p>
                        </div>
                        <div className='product-label-info'>
                            <p className='product-label-fit'>
                              Status
                            </p>
                            <p className='content-green'>
                              {result?.order?.status}
                            </p>
                        </div>
                        <div className='product-label-info'>
                            <p className='product-label-fit'>
                              Additional Information
                            </p>
                            <p className='product-content'>
                              {result?.order?.adInfo || "Nothing"}
                            </p>
                        </div>
                    </div>
                </Col>
            </Row>
            {/* It includes before delivering and after prepared process + delivery pictures and cancelled reason */}
            <Row>
              <p className='product-content-title my-3'>Order</p>
              <Col>
                  {/* The order must be larger than "prepared" status to display the process of driver */}
                  { 
                    result?.order?.status &&  ( result?.order?.status === "Prepared"   || 
                                                result?.order?.status === "Delivering" || 
                                                result?.order?.status === "Completed"  || 
                                                result?.order?.status === "Cancelled"  )? 
                      (<Process 
                        orderId={result?.orderId}
                        putDeliveryOrder={() => putDeliveryOrder(result?.orderId)}
                        putReceiveOrder={putReceiveOrder}
                        putCancelOrder={() => putCancelOrder(result?.orderId)}
                        preparedTime={moment().format("HH : mm, dd MMM YYYY")}
                        deliveryTime={moment().format("HH : mm, dd MMM YYYY")}
                        completedTime={moment().format("HH : mm, dd MMM YYYY")}
                        cancelledTime={moment().format("HH : mm, dd MMM YYYY")}
                        orderStatus={
                        result?.order?.status === "Prepared" ? 0 :
                        result?.order?.status === "Delivering" ? 1 : 
                        result?.order?.status === "Completed" ? 2 :
                        result?.order?.status === "Cancelled" ? 3 :
                        3
                        }>{2}</Process>) : 
                    (<div className='order-letter-form py-4'>
                      {/* otherwise driver send delivery images to confirm their ready */}
                      <div>
                        <Formik 
                          initialValues={
                            {
                              orderId: result?.orderId,
                              deliveryImages: []
                            }
                          }
                          validationSchema={imgSchema}
                          onSubmit={values =>{
                            const formData = dotnetFormDataSerialize({
                                ...values,
                                deliveryImages: values.deliveryImages.map(item => item?.file)
                            }, {
                              indices: true,
                              dotsForObjectNotation: true
                            });
                            putPrepareOrder(formData);
                          }}
                        >
                          {({errors,isValid,handleSubmit,handleBlur,values}) =>{
                            return(
                              <Form onSubmit={handleSubmit}>
                                <div className='txt-center'>
                                <FieldArray name='deliveryImages' render={(arrayHelpers) =>{
                                  return <>
                                    <Row>
                                      {values?.deliveryImages?.map(({url}, ind) =>(<Col sm={3}>
                                        <div className='img-front-frame' style={{margin:'0 auto'}} onClick={() => imgDelivery.current.click()}>
                                          <div className='background-front'>
                                              <RiImageEditFill style={{position:'relative',color:'gray',fontSize:'50px',opacity:'70%'}}></RiImageEditFill>
                                              <p className='driving-txt'>Post the Image</p>
                                          </div>
                                          <img className='img-front' src={url || 'https://tinyurl.com/5ehpcctt'}/>
                                        </div>
                                        <Button variant='danger' onClick={() => arrayHelpers.remove(ind)}>Remove</Button>
                                      </Col>))}
                                      <Col sm={6} className='img-front-frame' style={{margin:'0 auto'}} onClick={() => imgDelivery.current.click()}>
                                        <div className='background-front'>
                                            <RiImageEditFill style={{position:'relative',color:'gray',fontSize:'50px',opacity:'70%'}}></RiImageEditFill>
                                            <p className='driving-txt'>Post the Image</p>
                                        </div>
                                        <img className='img-front' src={'https://tinyurl.com/5ehpcctt'}/>
                                      </Col>
                                    </Row>
                                    <div>
                                      <Form.Control type="file" id="driver_image_front" name="deliveryImages" ref={imgDelivery} 
                                        multiple
                                        accept="image"
                                        isInvalid={!!errors?.deliveryImages}
                                        onBlur={handleBlur}
                                        onChange={(e) =>{
                                          const files = e.target.files;
                                            for (var i = 0; i < files.length; i++) { 
                                                //for multiple files          
                                                (function(file) {                                        
                                                    const fileReader = new FileReader();
                                                    fileReader.onload = function(e) {  
                                                        // get file content  
                                                        fileReader.addEventListener("loadend", (e)=>{
                                                            arrayHelpers.push({
                                                                file,
                                                                url: fileReader.result
                                                            });
                                                        })
                                                    }
                                                    fileReader.readAsDataURL(file);
                                                })(files[i]);
                                            }
                                        }}/>
                                      <Form.Control.Feedback type="invalid">{errors?.deliveryImages}</Form.Control.Feedback>
                                    </div>
                                  </>
                                }}/>
                                  
                                <p className='order-txt-letter txt-center py-3 px-5'> 
                                  Please send package image when you received it from the sender to start delivery process.
                                </p>
                                
                                <div style={{margin:'0 auto'}}>
                                  <Button 
                                    type="submit"
                                    className='my-btn-yellow mx-2' 
                                    disabled={!isValid && !values.deliveryImages?.length} 
                                  >Start</Button>
                                </div>
                                </div>
                              </Form>
                            )
                          }}
                        </Formik>
                      </div>
                    </div>)
                  }
              </Col>
            </Row>
          </div>
        </div>
    )
}

function Process({orderStatus, orderId, deliveryImages = [], putDeliveryOrder, putReceiveOrder,putCancelOrder, preparedTime, deliveryTime, completedTime, cancelledTime}){
    const [active] = React.useState(orderStatus);
    const [complete,setComplete] = React.useState(false);
    const [modalShow, setModalShow] = React.useState(false);
    const [slider,setSlider] = React.useState(false);
    const imgDone = useRef();
    const [stepTemplate] = React.useState([
      "Prepared", "Delivering", "Completed", "Cancelled"
    ]);

    return(
      <>
        {/* Cancellation status*/}
        {stepTemplate[active] === "Cancelled" 
          ? <StatusFail></StatusFail>
          : 
          (<div>
              {/* Agreed to delivery */}
              {/* Status of delivery */}
              <div className='product-label-info'>
                  <p className='product-label-fit'>
                    Status
                  </p>
                  <p className='content-yellow'>
                    {stepTemplate?.[active]}
                  </p>
              </div>
              {/* Process of delivery */}
              <div className='product-label-info' style={{alignItems:'unset'}}>
                <div className='process-form'>
                  <p className='product-label-fit py-2'>
                    Process
                  </p>  

                  <section class="step-wizard">
                    <ul className='order-progress'>
                      {stepTemplate.map((template,index) =>{
                        return (<li className='order-progress-item' key={index} data-active={index <= active}>
                          <div class="progress-circle"></div>
                          <div class="progress-label">
                              <h2 className='progress-txt-header'>
                                {template}
                              </h2>
                              <p>
                                {
                                  template === "Prepared" ? 
                                  `At ${preparedTime} ready to delivering` :
                                  template === "Delivering" ?
                                  `At ${deliveryTime} delivering` :
                                  template === "Completed" ?
                                  `At ${completedTime} completed` :
                                  `At ${cancelledTime} cancelled`
                                }
                              </p>
                          </div>
                        </li>)
                      })}
                    </ul>
                  </section>

                <div>
                  {/* Delivery Success */}
                    {!active ? 
                      (<button className='my-btn-yellow mx-5 my-2' onClick={()=>{
                        putDeliveryOrder();
                      }}>Start Deliver Now</button>)
                    : <button className='my-btn-yellow mx-5 my-2' onClick={()=>{
                      setComplete(true);
                    }}>Next Step</button>}

                    {/* Modal show form to submit the received package */}
                    <Modal
                      size="md"
                      aria-labelledby="contained-modal-title-vcenter"
                      centered
                      show={complete}
                      onHide={() => setComplete(false)}
                      >
                      <Modal.Header closeButton>
                        <Modal.Title className='txt-center w-100'>
                          Confirm Your Action
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <Formik 
                          initialValues={
                            {
                              orderId: orderId,
                              receivedImages: [],
                              barcode: null
                            }
                          }
                          validationSchema={imgDoneSchema}
                          onSubmit={values => {
                            const formData = dotnetFormDataSerialize({
                                ...values,
                                receivedImages: values.receivedImages.map(item => item?.file)
                            }, {
                              indices: true,
                              dotsForObjectNotation: true
                            });

                            putReceiveOrder(formData);
                          }}
                        >
                          {({errors,touched,values,handleSubmit,handleChange,handleBlur}) =>{
                            return(
                              <Form onSubmit={handleSubmit}>
                                <Form.Group className='txt-center'>
                                  <FieldArray name='receivedImages' render={(arrayHelpers) =>{
                                    return <>
                                      <Row style={{flexDirection:'column'}}>
                                        {/* ReceivedImages have been in showcase  */}
                                        {values?.receivedImages?.map(({url}, ind) =>(<Col sm={8} style={{margin:'0 auto'}}>
                                          <div className='img-front-frame' style={{margin:'0 auto',maxWidth:'unset'}} onClick={() => imgDone.current.click()}>
                                            <div className='background-front' style={{maxWidth:'470px'}}>
                                                <RiImageEditFill style={{position:'relative',color:'gray',fontSize:'50px',opacity:'70%'}}></RiImageEditFill>
                                                <p className='driving-txt'>Post the Image</p>
                                            </div>
                                            <img className='img-front' src={url || 'https://tinyurl.com/5ehpcctt'}/>
                                          </div>
                                          <Button variant='danger' onClick={() => arrayHelpers.remove(ind)}>Remove</Button>
                                        </Col>))}

                                        {/* A trigger button to upload new receivedImages */}
                                        <Col sm={8} style={{margin:'0 auto'}}>
                                          <div className='img-front-frame' style={{margin:'0 auto',maxWidth:'unset'}} onClick={() => imgDone.current.click()}>
                                            <div className='background-front'>
                                                <RiImageEditFill style={{position:'relative',color:'gray',fontSize:'50px',opacity:'70%'}}></RiImageEditFill>
                                                <p className='driving-txt'>Post the Image</p>
                                            </div>
                                            <img className='img-front' src={'https://tinyurl.com/5ehpcctt'}/>
                                          </div>
                                        </Col>
                                      </Row>

                                      <Form.Group>
                                        <Form.Control type="file" id="driver_image_front" name="deliveryImages" ref={imgDone} 
                                          multiple
                                          accept="image"
                                          isInvalid={!!errors?.deliveryImages}
                                          onBlur={handleBlur}
                                          onChange={(e) =>{
                                            const files = e.target.files;
                                              for (var i = 0; i < files.length; i++) { 
                                                  //for multiple files          
                                                  (function(file) {                                        
                                                      const fileReader = new FileReader();
                                                      fileReader.onload = function(e) {  
                                                          // get file content  
                                                          fileReader.addEventListener("loadend", (e)=>{
                                                              arrayHelpers.push({
                                                                  file,
                                                                  url: fileReader.result
                                                              });
                                                          })
                                                      }
                                                      fileReader.readAsDataURL(file);
                                                  })(files[i]);
                                              }
                                          }}/>
                                        <Form.Control.Feedback type="invalid">{errors?.deliveryImages}</Form.Control.Feedback>
                                      </Form.Group>
                                    </>
                                  }}/>
                                </Form.Group>
                                
                                <Form.Group className="form-group" >
                                  <div className='mb-2'>
                                      <Form.Label className='label'>Barcode</Form.Label>
                                      <p className='asterisk'>*</p>
                                  </div>
                                  <Form.Control
                                      type="number"
                                      name="barcode"
                                      placeholder="Enter The Barcode"
                                      isInvalid={touched.barcode && errors.barcode}
                                      onBlur={handleBlur}
                                      onChange={handleChange}
                                  />
                                  <Form.Control.Feedback type="invalid">{errors.barcode}</Form.Control.Feedback>
                                </Form.Group>

                                <Stack direction='horizontal' gap={5} style={{justifyContent: 'right'}} className='w-100'>
                                  <button type='submit' className='my-btn-yellow'>Done</button>
                                </Stack>
                              </Form>
                            )
                          }}
                        </Formik>
                      </Modal.Body>
                    </Modal>
                  </div>
                </div>
              </div>
              {/* Showcase of deliveryImages */}
              <div className='product-label-info py-3' style={{alignItems:'unset'}}>
                  <p className='product-label-fit py-1'>
                    Delivery pictures
                  </p>
                  <div>
                    <div className='img-front-frame'  style={{padding:'10px 0 '}} onClick={()=>{setSlider(true)}}>
                        <div className='background-front'>
                            <div style={{position:'relative',color:'gray',fontSize:'50px',opacity:'70%'}}>{deliveryImages?.length}</div>
                            <p className='driving-txt'>view image</p>
                        </div>
                        <img className='img-front' src={deliveryImages?.[0] || 'https://tinyurl.com/5ehpcctt'}/>
                    </div>
                    <div>
                        {
                            slider 
                            ? 
                            <div>
                                <Modal
                                        size="lg"
                                        aria-labelledby="contained-modal-title-vcenter"
                                        centered
                                        show={slider}
                                        >
                                        <Modal.Header>
                                            <Modal.Title className='txt-center w-100' onClick={()=>{setSlider(false)}}>
                                                <div style={{textAlign:'right'}}>
                                                    <FaTimes style={{color:'grey',cursor:'pointer'}}></FaTimes>
                                                </div>
                                            </Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body className='link-slider'>
                                            <Carousel>
                                                {deliveryImages?.split?.("[space]")?.map((url,index) =>{
                                                    return <Carousel.Item style={{borderLeft:'none'}} key={index}>
                                                        <img
                                                        className="w-100"
                                                        src={url}
                                                        alt="First slide"
                                                        />
                                                        <Carousel.Caption>
                                                        </Carousel.Caption>
                                                    </Carousel.Item>
                                                })}
                                            </Carousel>
                                        </Modal.Body>
                                    </Modal>
                            </div>
                            :
                            <></>
                        }
                    </div>
                </div>
              </div>
              {/* Trigger to cancel and confirm cancellation */}
              {(stepTemplate[active] !== "Cancelled" && stepTemplate[active] !== "Completed") &&
                (<div className='product-label-info py-3' style={{alignItems:'unset'}}>
                    <div>
                      <button className='my-btn-red'  onClick={() => setModalShow(true)}>Cancel</button>
                    </div>
                    <Modal
                      size="sm"
                      aria-labelledby="contained-modal-title-vcenter"
                      centered
                      show={modalShow}
                    >
                      <Modal.Header>
                        <Modal.Title className='txt-center w-100'>
                          Confirm Your Action
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <p className='txt-center' style={{margin:'0'}}> 
                          Are you sure to cancel this order?
                        </p>
                      </Modal.Body>
                      <Modal.Footer>
                        <div className='txt-center w-100'>
                          <button className='my-btn-gray mx-4' onClick={() => {setModalShow(false)}}>No</button>
                          <button className='my-btn-red mx-4' onClick={() => {
                            putCancelOrder();
                            setModalShow(false);
                          }}>Yes</button>
                        </div>
                      </Modal.Footer>
                    </Modal>
                </div>)}
          </div>)
        }
      </>
    )
}

let rateSchema = yup.object().shape({
  reason: yup.string().required("Rate is required field")
})

function StatusFail(){
  return(
    <div>
      <div className='product-label-info'>
        <p className='product-label-fit'>
          Status
        </p>
        <p className='content-red'>
          Fail
        </p>
    </div>
    <Formik
      initialValues={{
        reason:''
      }}
      validationSchema={rateSchema}
    >
      {({touched, errors, handleSubmit, handleChange, handleBlur}) =>{
        return(
          <Form>
              <Form.Group className="form-group">
                <div className='mb-2'>
                    <Form.Label className='product-label-fit my-0'>Reason fail</Form.Label>
                </div>
                <div className='product-rate-form'>
                    <div className='frame-pass' style={{flexGrow:'1'}}>
                      <Form.Control
                          type={'text'} 
                          as="textarea" rows={3}
                          style={{position:'relative',background:'#fafafa'}}
                          isInvalid={touched.reason && errors.reason}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter Your Reason"
                          name="rate"/>
                    </div>
                </div>
              </Form.Group>
              <Button variant="warning" className='my-btn-yellow'>Submit</Button>
          </Form>
        )
      }}
    </Formik>
    </div>
  )
}

export default function Index() {
  const params = useParams();

  if(params?.id){
    return (<>
      <OrderDetail></OrderDetail>
    </>)
  }
  return <Navigate to="/driver/order"></Navigate>
}
