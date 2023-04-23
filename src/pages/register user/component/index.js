
import '../style/registerUser.css';
import React from 'react'
import { Formik } from "formik";
import * as yup from 'yup';
import Form from 'react-bootstrap/Form';
import '../../register driver/style/registerDriver.css';
import Button from 'react-bootstrap/Button';
import {AiFillEye,AiFillEyeInvisible} from  'react-icons/ai';
import {DatePicker} from "antd";


let registerSchema = yup.object().shape({
    userName: yup.string().required("Full Name is required field"),
    phoneNumber: yup.number().typeError("Phone Number must be number").required("Phone Number is required field"),
    email: yup.string().email().required("Email is required field"),
    address: yup.string().required("Full Address is required field"),   
    password: yup.string().required("This field is requied").matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
    passwordConfirm: yup.string().required("This field is requied").oneOf([yup.ref("password"), null], "Passwords must match")
})

export default function Index() {
    const [showPass,setShowPass] = React.useState(false);
    const [showPassConfirm,setShowPassConfirm] = React.useState(false);
    const [date,setDate] = React.useState(new Date());
    const showPassHandler = () => {
        setShowPass(e=>!e);
    }
    const showPassConfirmHandler = () => {
        setShowPassConfirm(e=>!e);
    }
  return (

    <Formik
    initialValues={{
        userName:''
        }}
        
    validationSchema={registerSchema}
    >
    {({touched, errors, handleSubmit, handleChange, handleBlur}) =>{
        return(
            <>   
                <div className='container p-5'>
                    <div>
                        <div>
                            <h3 className='reg-header txt-center'>Register</h3>
                            <h4 className='reg-txt-u txt-center'>Get started with Us</h4>
                            <p className='txt-center'>Register a new membership.</p>
                        </div>
                        <Form className='form'>
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
                                    placeholder="Enter Your Email"
                                    isInvalid={touched.email && errors.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="form-group">
                                    <div  className='mb-2'>
                                        <Form.Label className='label'>Password</Form.Label>
                                        <p className='asterisk'>*</p>
                                    </div>
                                    <div className='frame-pass'>
                                        <Form.Control
                                            type={showPass ? 'text' : 'password'} 
                                            isInvalid={touched.password && errors.password}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="Enter your Password"
                                            name="password"/>
                                            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                                            <div className='override-block'></div>
                                            <div className='eyes-pass'>
                                                {showPass ? <AiFillEye onClick={showPassHandler}></AiFillEye> 
                                                : <AiFillEyeInvisible onClick={showPassHandler}></AiFillEyeInvisible>}
                                            </div>
                                    </div>
                            </Form.Group>
                            <Form.Group className="form-group">
                                <div className='mb-2'>
                                    <Form.Label className='label'>Confirm Password</Form.Label>
                                    <p className='asterisk'>*</p>
                                </div>
                                <div className='frame-pass'>
                                    <Form.Control
                                        type={showPassConfirm ? 'text' : 'password'} 
                                        name="passwordConfirm"
                                        placeholder="Enter password again"
                                        isInvalid={touched.passwordConfirm && errors.passwordConfirm}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.passwordConfirm}</Form.Control.Feedback>
                                    <div className='override-block'></div>
                                    <div className='eyes-pass'>
                                        {showPassConfirm ? <AiFillEye onClick={showPassConfirmHandler}></AiFillEye> 
                                        : <AiFillEyeInvisible onClick={showPassConfirmHandler}></AiFillEyeInvisible>}
                                    </div>
                                </div>
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
                            <Button variant="warning" className='my-btn-yellow'>Register</Button>
                        </Form>
                    </div>
                </div>
            </>
    )}}
    </Formik>
  )
}

