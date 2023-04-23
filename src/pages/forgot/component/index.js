import React, { useState } from 'react';
import * as yup from 'yup';
import '../../login/style/login.css';
import { Formik } from "formik";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

let forgotSchema = yup.object().shape({
    email: yup.string().email('This field must be email type').required("Email is required field"),
    code: yup.number().typeError('This field must be number').required("Code is required field")
})
export default function Index() {
    const [step, setStep] = useState(0);
    return (
        <>   
            <div className='container p-5'>
                <div>
                    <div>
                        <h3 className='reg-header txt-center'>Forgot password</h3>
                        <p className='txt-center'>Enter your email to verify 
                        the process, we will send a verification code to your email</p>
                    </div>
                <Formik
                    initialValues={{
                        email:'',
                        code: ''
                    }}
                    isInitialValid={false}
                    validationSchema={forgotSchema}
                    onSubmit={(values) =>{
                        console.log(values);
                    }}
                >
                {({touched, errors, handleSubmit,values, isValid, handleChange,handleBlur}) =>{
                    return( 
                        <Form className='form' onSubmit={handleSubmit}>
                            <Form.Group className="form-group" >
                                <div  className='mb-2'>
                                    <Form.Label className='label'>{!step ? "Email" : "Code"}</Form.Label>
                                    <p className='asterisk'>*</p>
                                </div>
                                {!step ? <Form.Control
                                    type="text"
                                    name={"email"}
                                    placeholder="Enter Your Email"
                                    isInvalid={touched.email && !!errors.email}
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                /> : <Form.Control
                                    type="text"
                                    name={"code"}
                                    placeholder="Enter Your Code"
                                    value={values.code}
                                    isInvalid={touched.code && !!errors.code}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />}
                                <Form.Control.Feedback type="invalid">{!step ? errors.email : errors.code}</Form.Control.Feedback>
                            </Form.Group>
                        {!step ? <Button variant="warning" style={{backgroundColor:"#f2a13b",border:'none'}} disabled={!values.email} onClick={() => setStep(1)} className={`my-btn-yellow my-2`}>Forget password</Button> 
                        : <Button variant="warning" type='submit' style={{backgroundColor:"#f2a13b",border:'none'}} disabled={!values.code} className={`my-btn-yellow my-2`}>Submit</Button>}
                    </Form>
                )}}
                </Formik>
                </div>
            </div>
        </>
  )
}

