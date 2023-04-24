import React from 'react'
import { Formik } from "formik";
import * as yup from 'yup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {DatePicker} from "antd";
import { Sidebar } from '../../../layout';
import '../style/userInformation.css'

let registerSchema = yup.object().shape({
    fullName: yup.string().required("Full Name is required field"),
    userName: yup.string().required("User Name is required field"),
    phoneNumber: yup.number().typeError("Phone Number must be number").required("Phone Number is required field"),
    email: yup.string().email().required("Email is required field"),
    address: yup.string().required("Full Address is required field"),   
})

function UserInformation() {
    const [date,setDate] = React.useState(new Date());
  return (

    <Formik
    initialValues={{
        fullName:'',
        userName:'',
        email:'asd@gmail.com',
        phoneNumber:0,
        address:''
        }}
        
    validationSchema={registerSchema}
    >
    {({touched, errors, handleSubmit, handleChange, handleBlur,values}) =>{
        return(
            <>   
                <div className='container p-5'>
                    <div>
                        <div>
                            <h3 className='ui-header'>Information</h3>
                        </div>
                        <Form className='form'>
                            <Form.Group className="form-group" >
                                    <div className='mb-2'>
                                        <Form.Label className='label'>Full name</Form.Label>
                                        <p className='asterisk'>*</p>
                                    </div>
                                    <Form.Control
                                        type="text"
                                        name="fullName"
                                        placeholder="Enter Your Full Name"
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
                                    isInvalid={touched.address && errors.address}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="form-group" >
                                <div className='mb-2'>
                                    <Form.Label className='label'>Birthday</Form.Label>
                                    <p className='asterisk'>*</p>
                                </div>
                                <div className='frame-pass'>
                                    <DatePicker 
                                        name='date'
                                        onChange={e => setDate(e)}
                                        style={{display:"block",width:'100%'}}/>
                                </div>
                                <Form.Control.Feedback type="invalid">{errors.date}</Form.Control.Feedback>
                            </Form.Group>
                            <Button variant="warning" className='my-btn-yellow'>Update</Button>
                        </Form>
                    </div>
                </div>
            </>
    )}}
    </Formik>
  )
}

export default function Index(){
    return(
        <div>
            <Sidebar>
                <UserInformation></UserInformation>
            </Sidebar>
        </div>
    )
}