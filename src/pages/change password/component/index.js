import React, { useState } from 'react';
import * as yup from 'yup';
import { Formik } from "formik";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {AiFillEye,AiFillEyeInvisible} from  'react-icons/ai';
import { Message, Sidebar } from '../../../layout';

let changePasswordSchema = yup.object().shape({
    oldPassword: yup.string().required("This field is requied"),
    password: yup.string().required("This field is requied").matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
    passwordConfirm: yup.string().required("This field is requied").oneOf([yup.ref("password"), null], "Passwords must match")   
})

function ChangePassword() {
    const [showPass,setShowPass] = React.useState(false); 
    const [showPassConfirm,setShowPassConfirm] = React.useState(false);
    const showPassHandler = () => {
        setShowPass(e=>!e);
    }
    const showPassConfirmHandler = () => {
        setShowPassConfirm(e=>!e);
    }
  return (

    <Formik
        initialValues={{
            oldPassword:'',
            password:'',
            passwordConfirm:''
        }}
        isInitialValid={false}  
        validationSchema={changePasswordSchema}
    >
    {({touched, errors, handleSubmit, handleChange, handleBlur, isValid,values}) =>{
        return(
            <>   
                <h3 className='ui-header p-2'>Information</h3>
                <div className='container p-5'>
                    <div>
                        <Form className='form'>
                        <Message.Error>Error</Message.Error>
                            <Form.Group className="form-group">
                                    <div  className='mb-2'>
                                        <Form.Label className='label'>Old Password</Form.Label>
                                        <p className='asterisk'>*</p>
                                    </div>
                                    <div className='frame-pass'>
                                        <Form.Control
                                            type={showPass ? 'text' : 'password'} 
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={touched.oldPassword && errors.oldPassword}
                                            placeholder="Enter your password"
                                            name="oldPassword"/>
                                            <Form.Control.Feedback type="invalid">{errors.oldPassword}</Form.Control.Feedback>
                                            <div className='override-block'></div>
                                            <div className='eyes-pass'>
                                                {showPass ? <AiFillEye onClick={showPassHandler}></AiFillEye> 
                                                : <AiFillEyeInvisible onClick={showPassHandler}></AiFillEyeInvisible>}
                                            </div>
                                    </div>
                            </Form.Group>
                            <Form.Group className="form-group">
                                    <div  className='mb-2'>
                                        <Form.Label className='label'>New Password</Form.Label>
                                        <p className='asterisk'>*</p>
                                    </div>
                                    <div className='frame-pass'>
                                        <Form.Control
                                            type={showPass ? 'text' : 'password'} 
                                            isInvalid={touched.password && errors.password}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="Enter new password"
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
                            <Button variant="warning" style={{backgroundColor:"#f2a13b",border:'none'}} disabled={!isValid} className={`my-btn-yellow my-3`}>Update</Button>
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
        <Sidebar>
            <ChangePassword></ChangePassword>
        </Sidebar>
    )
}