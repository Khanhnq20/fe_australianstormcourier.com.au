import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Formik } from "formik";
import * as yup from 'yup';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import '../style/registerDriver.css'


let registerSchema = yup.object().shape({
    fullName: yup.string().required("Full Name is required field"),
    phoneNumber: yup.number().typeError("Phone Number must be number").required("Phone Number is required field"),
    email: yup.string().email().required("Email is required field"),
    address: yup.string().required("Full Address is required field"),   
    abn: yup.number().typeError("ABN must be number").required("ABN is required field"),
})

export default function Register() {
  return (
    <Formik
    initialValues={{
        fullName:''
        }}
        
    validationSchema={registerSchema}
    >
    {({touched, errors, handleSubmit, handleChange, handleBlur}) =>{
        return(
            <>
                    
                <div className='container'>
                    <Row>
                        <Col>   
                            <div>
                                <img src='https://australianstormcourier.com.au/wp-content/uploads/2023/04/cv.png' />
                            </div>
                        </Col>
                        <Col>
                            <div>
                                <Form className="">
                                        <Form.Group className="" >
                                            <Form.Label>Full name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="fullName"
                                                placeholder="Enter Full Name"
                                                isInvalid={touched.fullName && errors.fullName}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.fullName}</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group className="" >
                                            <Form.Label>Phone Number</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="phoneNumber"
                                                placeholder="Enter Your Phone Number"
                                                isInvalid={touched.phoneNumber && errors.phoneNumber}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.phoneNumber}</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group className="" >
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="email"
                                                placeholder="Enter Your Email"
                                                isInvalid={touched.email && errors.email}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group className="" >
                                            <Form.Label>Full Address</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="address"
                                                placeholder="Enter Your Full Address"
                                                isInvalid={touched.address && errors.address}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group className="" >
                                            <Form.Label>ABN</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="abn"
                                                placeholder="Enter Your Full Address"
                                                isInvalid={touched.abn && errors.abn}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.abn}</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group className="" >
                                            <Form.Label>GST</Form.Label>
                                            <DropDownGST></DropDownGST>
                                        </Form.Group>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </div>
            </>
    )}}
    </Formik>
  )
}

function DropDownGST() {
    const [state,setState] = React.useState(true);
    return (
      <Dropdown>
        <Dropdown.Toggle className='dr-btn' id="dropdown-basic">
            {state === true ? "Yes" : "No"}
        </Dropdown.Toggle>
  
        <Dropdown.Menu>
          <Dropdown.Item onClick={()=>setState(true)}>Yes</Dropdown.Item>
          <Dropdown.Item onClick={() => setState(false)}>No</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }