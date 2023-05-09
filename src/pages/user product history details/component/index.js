import React from 'react'
import { Col, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Formik } from 'formik';
import * as yup from 'yup';

function OrderDetail(){
    const [process,setProcess] = React.useState(false);

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
                            <p className='content-green'>
                              Looking for a driver
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
                <Process>{2}</Process>  
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
            {/* <GoogleMapReact
              defaultCenter={this.props.center}
              defaultZoom={this.props.zoom}
              yesIWantToUseGoogleMapApiInternals
              onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
            >
              <AnyReactComponent
                lat={59.955413}
                lng={30.337844}
                text="My Marker"
              />
            </GoogleMapReact> */}
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
  return (<>
        <OrderDetail></OrderDetail>
  </>
  )
}
