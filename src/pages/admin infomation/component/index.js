import React from 'react'
import { Formik } from "formik";
import * as yup from 'yup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { AuthContext } from '../../../stores';
import { Col, Row } from 'react-bootstrap';

let registerSchema = yup.object().shape({
    fullName: yup.string().required("Full Name is required field"),
    userName: yup.string().required("User Name is required field"),
    phoneNumber: yup.number().typeError("Phone Number must be number").required("Phone Number is required field"),
    email: yup.string().email().required("Email is required field"),
    address: yup.string().required("Full Address is required field"),   
})

function AdminInformation() {
    const [date,setDate] = React.useState(new Date());
    const [authState, {updateProfile}] = React.useContext(AuthContext);

    return (
        <div>
            <h3 className='ui-header'>Information</h3>
            <Row>
                <Col>
                    <div style={{padding:'35px'}}>
                        <div className='product-label-info'>
                            <p className='product-label'>
                              Full Name
                            </p>
                            <p className='product-content'>
                              07731158000
                            </p>
                        </div>
                        <div className='product-label-info'>
                            <p className='product-label'>
                              User name
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
                              turly@gmail.com
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
                              Address
                            </p>
                            <p className='product-content'>
                              07731158000
                            </p>
                        </div>
                    </div>    
                </Col>
                <Col>
                    <Formik
                        initialValues={{
                            id: authState?.accountInfo?.id,
                            fullName: authState?.accountInfo?.name,
                            userName: authState?.accountInfo?.username,
                            email:authState?.accountInfo?.email,
                            phoneNumber: authState?.accountInfo?.phoneNumber,
                            address: authState?.accountInfo?.address
                        }}
                        validationSchema={registerSchema}
                        enableReinitialize={true}
                        onSubmit={(values) =>{
                            
                            updateProfile({
                                fullName: values.fullName,
                                userName: values.userName,
                                phone: values.phoneNumber,
                                address: values.address
                            }, values.id);
                        }}
                    >
                    {({touched, errors, handleSubmit, handleChange, handleBlur,values}) =>{
                        return(
                            <>   
                                <div className='p-2'>
                                    <div>
                                        <div>
                                        </div>
                                        <Form className='form' onSubmit={handleSubmit}>
                                            <Form.Group className="form-group" >
                                                    <div className='mb-2'>
                                                        <Form.Label className='label'>Full name</Form.Label>
                                                        <p className='asterisk'>*</p>
                                                    </div>
                                                    <Form.Control
                                                        type="text"
                                                        name="fullName"
                                                        placeholder="Enter Your Full Name"
                                                        value={values.fullName}
                                                        isInvalid={touched.userName && errors.userName}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    />
                                                    <Form.Control.Feedback type="invalid">{errors.userName}</Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group className="form-group" >
                                                    <div className='mb-2'>
                                                        <Form.Label className='label'>User name</Form.Label>
                                                        <p className='asterisk'>*</p>
                                                    </div>
                                                    <Form.Control
                                                        type="text"
                                                        name="userName"
                                                        placeholder="Enter Your Full Name"
                                                        value={values.userName}
                                                        isInvalid={touched.userName && errors.userName}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    />
                                                    <Form.Control.Feedback type="invalid">{errors.userName}</Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group className="form-group" >
                                                <div  className='mb-2'>
                                                    <Form.Label className='label'>Email</Form.Label>
                                                    <p className='asterisk'>*</p>
                                                </div>
                                                <Form.Control
                                                    type="text"
                                                    name="email"
                                                    disabled
                                                    value={values.email}
                                                    className='ui-email-input'
                                                    placeholder="Enter Your Email"
                                                    isInvalid={touched.email && errors.email}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group className="form-group" >
                                                <div className='mb-2'>
                                                    <Form.Label className='label'>Phone Number</Form.Label>
                                                    <p className='asterisk'>*</p>
                                                </div>
                                                <Form.Control
                                                    type="text"
                                                    name="phoneNumber"
                                                    placeholder="Enter Your Full Address"
                                                    value={values.phoneNumber}
                                                    isInvalid={touched.phoneNumber && errors.phoneNumber}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.phoneNumber}</Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group className="form-group" >
                                                <div className='mb-2'>
                                                    <Form.Label className='label'>Address</Form.Label>
                                                    <p className='asterisk'>*</p>
                                                </div>
                                                <Form.Control
                                                    type="text"
                                                    name="address"
                                                    placeholder="Enter Your Full Address"
                                                    value={values.address}
                                                    isInvalid={touched.address && errors.address}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                                            </Form.Group>
                                            <Button variant="warning" type="submit" className='my-btn-yellow'>Update</Button>
                                        </Form>
                                    </div>
                                </div>
                            </>
                    )}}
                    </Formik>
                </Col>
            </Row>
        </div>
    )
}

export default function Index(){
    return(
        <div>
            <AdminInformation></AdminInformation>
        </div>
    )
}