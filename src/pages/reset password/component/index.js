import React from 'react';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import '../../register user/style/registerUser.css';
import { Formik } from "formik";
import * as yup from 'yup';
import {AiFillEye,AiFillEyeInvisible} from  'react-icons/ai';

let loginSchema = yup.object().shape({
    password: yup.string().required("This field is requied").matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
    passwordConfirm: yup.string().required("This field is requied").oneOf([yup.ref("password"), null], "Passwords must match")   
})

export default function Index() {
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
            password:'',
            passwordConfirm:''
        }}
        isInitialValid={false}  
        validationSchema={loginSchema}
    >
    {({touched, errors, handleSubmit, handleChange, handleBlur, isValid,values}) =>{
        return(
            <>   
                <div className='container p-5'>
                    <div>
                        <div>
                            <h3 className='reg-header txt-center'>Reset Password</h3>
                            <p className='txt-center'>Set the new password for your account 
                            so you can login and access all the features</p>
                        </div>
                        <Form className='form'>
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
                            <Button variant="warning" style={{backgroundColor:"#f2a13b",border:'none'}} disabled={!isValid} className={`my-btn-yellow my-3`}>Update</Button>
                        </Form>
                    </div>
                </div>
            </>
    )}}
    </Formik>
  )
}
