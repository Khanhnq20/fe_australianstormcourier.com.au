
import '../../register user/style/registerUser.css';
import React, { useRef } from 'react'
import { Formik } from "formik";
import * as yup from 'yup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {AiFillEye,AiFillEyeInvisible} from  'react-icons/ai';
import {DatePicker} from "antd";
import {AiFillLock} from 'react-icons/ai';
import '../style/login.css'
import { Link } from 'react-router-dom';


export default function Index() {
    const [isValidate,setValidate] = React.useState();
    const [showPass,setShowPass] = React.useState(false); 
    const showPassHandler = () => {
        setShowPass(e=>!e);
    }
  return (

    <Formik
    initialValues={{
        email:'',
        password:''
        }}
    >
    {({touched, errors, handleSubmit,values}) =>{
        if(values.email && values.password !== ''){
            setValidate(false);
        }else{
            setValidate(true);
        }
        return(
            <>   
                <div className='container p-5'>
                    <div>
                        <div>
                            <h3 className='reg-header txt-center'>Login</h3>
                            <h4 className='reg-txt-u txt-center'>Get started with Us</h4>
                            <p className='txt-center'>Register a new membership.</p>
                        </div>
                        <Form className='form'>
                            <Form.Group className="form-group" >
                                <div  className='mb-2'>
                                    <Form.Label className='label'>Email</Form.Label>
                                    <p className='asterisk'>*</p>
                                </div>
                                <Form.Control
                                    type="text"
                                    name="email"
                                    placeholder="Enter Your Email"
                                />
                            </Form.Group>
                            <Form.Group className="form-group">
                                    <div  className='mb-2'>
                                        <Form.Label className='label'>Password</Form.Label>
                                        <p className='asterisk'>*</p>
                                    </div>
                                    <div className='frame-pass'>
                                        <Form.Control
                                            type={showPass ? 'text' : 'password'} 
                                            placeholder="Enter your Password"
                                            name="password"/>
                                            <div className='eyes-pass'>
                                                {showPass ? <AiFillEye onClick={showPassHandler}></AiFillEye> 
                                                : <AiFillEyeInvisible onClick={showPassHandler}></AiFillEyeInvisible>}
                                            </div>
                                    </div>
                            </Form.Group>
                            <div className='log-service'>
                                <label class="fr-checkbox">
                                    <input type="checkbox"/>
                                    <span className="checkmark"></span>
                                    <span className='txt-checkbox'>Remember me</span>
                                </label>
                                <div>
                                    <span className='log-lock-icon'>
                                        <AiFillLock></AiFillLock>
                                    </span>
                                    <span className='log-txt-forgot'>
                                        <Link className='log-link-forgot' to='/forgot'>
                                            Forgot password?
                                        </Link>
                                    </span>
                                </div>
                            </div>
                            <Button variant="warning" style={{backgroundColor:"#f2a13b",border:'none'}} disabled={isValidate} className={`my-btn-yellow my-3`}>Login</Button>
                        </Form>
                    </div>
                </div>
            </>
    )}}
    </Formik>
  )
}

