import React, { useEffect } from 'react'
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import '../style/orderDetail.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Navigate, useParams } from 'react-router-dom';
import { authConstraints, authInstance, config } from '../../../api';

function OrderDetail(){
    const [process,setProcess] = React.useState(false);
    const [result, setResult] = React.useState(null);
    const [loading,setLoading] = React.useState(true);
    const [error, setError] = React.useState("");
    const {id} = useParams();

    useEffect(() =>{
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
    }, [id]);

    if(loading) return (
    <Container>
      <Spinner></Spinner>
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
                              {result?.sender?.abnNumber}
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
                              {result?.order?.adInfo}
                            </p>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row>
              <p className='product-content-title my-3'>Order</p>
              <Col>
                  {
                    process ? <Process>{2}</Process> : 
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
                      <Button className='my-btn-yellow mx-2' onClick={()=>{setProcess(e=>!e)}}>Start</Button>
                      <Button className='my-btn-gray mx-2'>False</Button>
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
    const [stepTemplate, setTemplate] = React.useState([
      "Prepare", "Ordering", "Delivering", "Completed"
    ]);

    return(
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
        </div>
        <div className='product-label-info' style={{alignItems:'unset'}}>
            <p className='product-label-fit py-2'>
              Process
            </p> 
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
      </div>
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
                <div  className='mb-2'>
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
                          placeholder="Fill rate (rate must be number)"
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
