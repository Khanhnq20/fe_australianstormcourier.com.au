import React, { useContext, useEffect, useRef } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import '../style/orderDetail.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FieldArray, Formik } from 'formik';
import * as yup from 'yup';
import { Navigate, useParams } from 'react-router-dom';
import { authConstraints, authInstance, config } from '../../../api';
import { RiImageEditFill } from 'react-icons/ri';
import { CustomSpinner } from '../../../layout';
import Modal from 'react-bootstrap/Modal';
import { OrderContext } from '../../../stores';
import { dotnetFormDataSerialize } from "../../../ultitlies";

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
  const [_, {putDeliveryOrder,putReceiveOrder}] = useContext(OrderContext);
  const [process,setProcess] = React.useState(false);
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
            <Row>
              <p className='product-content-title my-3'>Order</p>
              <Col>
                  {
                    result?.order?.status && 
                    ( result?.order?.status === "Prepared"   || 
                      result?.order?.status === "Delivering" || 
                      result?.order?.status === "Completed"  )? <Process>{2}</Process> : 
                    <div className='order-letter-form py-4'>
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

                            putDeliveryOrder(formData);
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
                                              <p className='driving-txt'>Change the Image</p>
                                          </div>
                                          <img className='img-front' src={url || 'https://tinyurl.com/5ehpcctt'}/>
                                        </div>
                                        <Button onClick={() => arrayHelpers.remove(ind)}>Remove</Button>
                                      </Col>))}
                                      <Col sm={6} className='img-front-frame' style={{margin:'0 auto'}} onClick={() => imgDelivery.current.click()}>
                                        <div className='background-front'>
                                            <RiImageEditFill style={{position:'relative',color:'gray',fontSize:'50px',opacity:'70%'}}></RiImageEditFill>
                                            <p className='driving-txt'>Change the Image</p>
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
                    </div>
                  }
              </Col>
            </Row>
          </div>
        </div>
    )
}

function Process({children}){
    const [active,setActive] = React.useState(1);
    const [cancel,setCancel] = React.useState(false);
    const [complete,setComplete] = React.useState(false);
    const [modalShow, setModalShow] = React.useState(false);
    const [imgD,setImgD] = React.useState();
    const imgDone = useRef();
    const [stepTemplate, setTemplate] = React.useState([
      "Prepare", "Ordering", "Delivering", "Completed"
    ]);

    return(
      <>
        {cancel 
          ? 
          <StatusFail></StatusFail>
          :
          <div>
            <div className='product-label-info'>
                <p className='product-label-fit'>
                  Status
                </p>
                <p className='content-yellow'>
                  In processing
                </p>
            </div>
            <div className='product-label-info' style={{alignItems:'unset'}}>
                <div className='process-form'>
                  <p className='product-label-fit py-2'>
                    Process
                  </p>  
                  <div>
                    <section class="step-wizard">
                      <ul className='order-progress'>
                        {stepTemplate.map((template,index) =>{
                          return (<li className='order-progress-item' key={index} data-active={index <= active}>
                            <div class="progress-circle"></div>
                            <div class="progress-label">
                                <h2 className='progress-txt-header'>
                                {template}
                                </h2>
                                <p>At 9PM, the driver requested to deliver the good</p>
                            </div>
                          </li>)
                        })}
                        
                      </ul>
                    </section>
                  </div>
                  <div>
                  {/* Delivery Success */}
                    <button className='my-btn-yellow mx-5 my-2' onClick={()=>{
                      setComplete(true);
                    }}>Next Step</button>
                    <Modal
                      size="md"
                      aria-labelledby="contained-modal-title-vcenter"
                      centered
                      show={complete}
                      >
                      <Modal.Header>
                        <Modal.Title className='txt-center w-100'>
                          Confirm Your Action
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <Formik 
                        initialValues={
                          {
                            imgComplete: null,
                            barcode:null
                          }
                        }
                        validationSchema={imgDoneSchema}
                        >
                          {({errors,touched,setFieldValue,values,handleChange,handleBlur}) =>{
                            return(
                              <div>
                                <div className='txt-center'>
                                  <div className='img-front-frame' style={{margin:'0 auto'}} onClick={() => imgDone.current.click()}>
                                      <div className='background-front'>
                                          <RiImageEditFill style={{position:'relative',color:'gray',fontSize:'50px',opacity:'70%'}}></RiImageEditFill>
                                          <p className='driving-txt'>Change the Image</p>
                                      </div>
                                      <img className='img-front' src={imgD || 'https://tinyurl.com/5ehpcctt'}/>
                                  </div>
                                  <Form.Control type="file" id="driver_image_front" name="imgComplete" ref={imgDone} 
                                    isInvalid={touched.imgComplete && !!errors?.imgComplete}
                                    onChange={(e) =>{
                                        const file = e.target.files[0];
                                        setFieldValue(e.target.name, file, true);
                                        
                                        const fileReader = new FileReader();
                                        if(file){
                                            fileReader.addEventListener("loadend", (e)=>{
                                                setImgD(fileReader.result);
                                            })
                                            fileReader.readAsDataURL(file);
                                          }
                                      }}
                                  />
                                  <Form.Control.Feedback type="invalid">{errors?.imgComplete}</Form.Control.Feedback>
                                </div>
                                <div>
                                  <Form.Group className="form-group px-4" >
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
                                </div>
                              </div>
                            )
                          }}
                        </Formik>
                      </Modal.Body>
                      <Modal.Footer>
                        <div className='txt-center w-100'>
                          <button className='my-btn-gray mx-4' onClick={() => {setComplete(false)}}>Cancel</button>
                          <button className='my-btn-yellow mx-4'>Done</button>
                        </div>
                      </Modal.Footer>
                    </Modal>
                  </div>
                </div>
            </div>
            <div className='product-label-info py-3' style={{alignItems:'unset'}}>
                <p className='product-label-fit py-1'>
                  Delivery pictures
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
            <div className='product-label-info py-3' style={{alignItems:'unset'}}>
                <p className='product-label-fit py-1'>
                  Cancel Order
                </p>
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
                      <button className='my-btn-red mx-4' onClick={() => {setCancel(true)}}>Yes</button>
                    </div>
                  </Modal.Footer>
                </Modal>
            </div>
          </div>
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
