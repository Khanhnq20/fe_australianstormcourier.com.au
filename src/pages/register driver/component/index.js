import React, { useContext, useRef } from 'react'
import { Row, Col, Form, Button} from 'react-bootstrap';
import { Formik } from "formik";
import * as yup from 'yup';
import '../style/registerDriver.css';
import { AuthContext } from '../../../stores';
import { serialize } from 'object-to-formdata';

import { RiImageEditFill } from 'react-icons/ri';
import { AiFillEye,AiFillEyeInvisible } from  'react-icons/ai';

const PERMIT_FILE_FORMATS = ['image/jpeg', 'image/png', 'image/jpg'];

let registerSchema = yup.object().shape({
    userName: yup.string().required("User Name is required field"),
    phone: yup.string().required("Phone Number is required field"),
    email: yup.string().email().required("Email is required field"),  
    password: yup.string().required("This field is requied").matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
    confirmPassword: yup.string().required("This field is requied").oneOf([yup.ref("password"), null], "Passwords must match"),
    fullName: yup.string().required("Full Name is required field"),
    ABNNumber: yup.number().typeError("ABN Number must be number").required("ABN Number is required field"),
    address: yup.string().required("Full Address is required field"),   
    city: yup.string().required("City is required field"),
    zipCode: yup.number().typeError("Zip code must be number").required("Zip code is required field"),
    vehicles: yup.array().min(1),
    adInfo: yup.string().required("\"Additional Information\" must required"),
    frontDrivingLiense: yup
        .mixed()
        .nullable()
        .required()
        .test(
        'FILE SIZE', 
        'the file is too large', 
        (value) => {
            if (!value) {
                return true;
            }

            return value.size <= 2 * 1024 * 1024;
        })
        .test(
            'FILE FORMAT',
            `the file format should be ${PERMIT_FILE_FORMATS.join()}`,
            (value) => {
                if (!value) {
                    return true;
                }
                return PERMIT_FILE_FORMATS.includes(value.type);
            }
        ),
    backDrivingLiense: yup
        .mixed()
        .nullable()
        .required()
        .test(
        'FILE SIZE', 
        'the file is too large', 
        (value) => {
            if (!value) {
                return true;
            }

            return value.size <= 2 * 1024 * 1024;
        })
        .test(
            'FILE FORMAT',
            `the file format should be ${PERMIT_FILE_FORMATS.join()}`,
            (value) => {
                if (!value) {
                    return true;
                }
                return PERMIT_FILE_FORMATS.includes(value.type);
            }
        ),
    
})

function RegisterDriver() {
    const [{vehicles}, {
        signupDriver
    }] = useContext(AuthContext);
    const f_driver_img_ipt = useRef();
    const b_driver_img_ipt = useRef();
    const [imgUrlFront,setImgUrlFront] = React.useState();
    const [imgUrlBack,setImgUrlBack] = React.useState();
    const [showPass,setShowPass] = React.useState(false);
    const [showPassConfirm,setShowPassConfirm] = React.useState(false);
    const [next,setNext] = React.useState(true);
    const showPassHandler = () => {
        setShowPass(e=>!e);
    }
    const showPassConfirmHandler = () => {
        setShowPassConfirm(e=>!e);
    }
 return (
    <Formik
        initialValues={{
            userName:'',
            phone:'',
            email:'',
            password:'',
            confirmPassword: '',
            fullName:'',
            ABNNumber:'',
            address:'',
            city:'',
            zipCode:0,
            frontDrivingLiense: null,
            backDrivingLiense: null,
            vehicles: [],
            adInfo: ''
        }}
        validationSchema={registerSchema}
        onSubmit={(values) =>{
            const formData = serialize(values, {
                indices: true,
                dotsForObjectNotation: true
            });
            signupDriver(formData);
        }}>
    {
        ({values,touched, errors, setFieldValue, handleSubmit, handleChange, handleBlur,isValid}) =>{
            const permitedNext = touched.userName && !errors.userName
                && touched.phone && !errors.phone
                && touched.email && !errors.email
                && touched.password && !errors.password;

            return ( 
                <>
                    <h3 className='ui-header p-3'>Become driver</h3>
                    <div className='container p-5'>
                        <Form className='form' onSubmit={handleSubmit}>
                        <Row>
                            <Col className={next ? "step1-show" : "step1-hide"}>
                                {/* UserName */}
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
                                        value={values.userName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.userName}</Form.Control.Feedback>
                                </Form.Group>
                                {/* Email */}
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
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                </Form.Group>
                                
                                {/* Password */}
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
                                
                                {/* Confirm Password */}
                                <Form.Group className="form-group">
                                    <div className='mb-2'>
                                        <Form.Label className='label'>Confirm Password</Form.Label>
                                        <p className='asterisk'>*</p>
                                    </div>
                                    <div className='frame-pass'>
                                        <Form.Control
                                            type={showPassConfirm ? 'text' : 'password'} 
                                            name="confirmPassword"
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
                                {/* Phone */}
                                <Form.Group className="form-group" >
                                    <div className='mb-2'>
                                        <Form.Label className='label'>Phone Number</Form.Label>
                                        <p className='asterisk'>*</p>
                                    </div>
                                    <Form.Control
                                        type="text"
                                        name="phone"
                                        placeholder="Enter Your Full Address"
                                        isInvalid={touched.phoneNumber && errors.phoneNumber}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.phoneNumber}</Form.Control.Feedback>
                                </Form.Group>

                                <Button variant="warning" disabled={!permitedNext} onClick={()=>setNext(e => !e)} className='my-btn-yellow'>Next</Button>
                            </Col>

                            <Col className={!next ? "step2-show" : "step2-hide"}>
                                    <Button type="submit" variant="warning" onClick={()=> setNext(e => !e)} className='my-btn-yellow mb-4'>Back</Button>
                                        {/* Full Name */}
                                        <Form.Group className="form-group" >
                                            <div className='mb-2'>
                                                <Form.Label className='label'>Full name</Form.Label>
                                                <p className='asterisk'>*</p>
                                            </div>
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
                                        
                                        {/* ABN Number */}
                                        <Form.Group className="form-group" >
                                            <div className='mb-2'>
                                                <Form.Label className='label'>ABN Number</Form.Label>
                                                <p className='asterisk'>*</p>
                                            </div>
                                            <Form.Control
                                                type="text"
                                                name="ABNNumber"
                                                placeholder="Enter Your ABN Number"
                                                isInvalid={touched.ABNNumber && errors.ABNNumber}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.ABNNumber}</Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group className="form-group" >
                                            <div className='mb-2'>
                                                <Form.Label className='label'>Address</Form.Label>
                                                <p className='asterisk'>*</p>
                                            </div>
                                            <Form.Control
                                                type="text"
                                                name="address"
                                                placeholder="Enter Your Address"
                                                isInvalid={touched?.address && !!errors?.address}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors?.address}</Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group className="form-group" >
                                            <div className='mb-2'>
                                                <Form.Label className='label'>City</Form.Label>
                                                <p className='asterisk'>*</p>
                                            </div>
                                            <Form.Control
                                                type="text"
                                                name="city"
                                                placeholder="Enter Your City"
                                                isInvalid={touched?.city && !!errors?.city}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors?.city}</Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group className="form-group" >
                                            <div className='mb-2'>
                                                <Form.Label className='label'>Zip code</Form.Label>
                                                <p className='asterisk'>*</p>
                                            </div>
                                            <Form.Control
                                                type="text"
                                                name="zipCode"
                                                placeholder="Enter Your Zipcode"
                                                isInvalid={touched.zipCode && !!errors?.zipCode}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors?.zipCode}</Form.Control.Feedback>
                                        </Form.Group>
                                        {/* Driving Liense Images */}
                                        <Form.Group className="form-group" >
                                            <div className='mb-2'>
                                                <Form.Label className='label py-3 mb-2'>Driving License (Front and Back)</Form.Label>
                                                <p className='asterisk'>*</p>
                                            </div>
                                            <div className='front-up'>
                                                <h6>Front</h6>
                                                <div className='img-front-frame' onClick={() => f_driver_img_ipt.current.click()}>
                                                    <div className='background-front'>
                                                        <RiImageEditFill style={{position:'relative',color:'gray',fontSize:'50px',opacity:'70%'}}></RiImageEditFill>
                                                        <p className='driving-txt'>Change driving license</p>
                                                    </div>
                                                    <img className='img-front' src={imgUrlFront || 'https://tinyurl.com/5ehpcctt'}/>
                                                </div>
                                                <input type="file" id="driver_image_front" name="frontDrivingLiense" ref={f_driver_img_ipt} 
                                                    isInvalid={!!errors?.frontDrivingLiense}
                                                    onChange={(e) =>{
                                                        const file = e.target.files[0];
                                                        setFieldValue(e.target.name, file, true);
                                                        
                                                        const fileReader = new FileReader();
                                                        if(file){
                                                            fileReader.addEventListener("loadend", (e)=>{
                                                                setImgUrlFront(fileReader.result);
                                                            })
                                                            fileReader.readAsDataURL(file);
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div className='back-up'>
                                                <div>
                                                    <h6>Back</h6>
                                                </div>
                                                <div className='img-front-frame' onClick={() => b_driver_img_ipt.current.click()}>
                                                    <div className='background-front'>
                                                        <RiImageEditFill style={{position:'relative',color:'gray',fontSize:'50px',opacity:'70%'}}></RiImageEditFill>
                                                        <p className='driving-txt'>Change driving license</p>
                                                    </div>
                                                    <img className='img-front' src={imgUrlBack || 'https://tinyurl.com/5ehpcctt'}/>
                                                </div>
                                                
                                                <input type="file" id="driver_image_back" name="backDrivingLiense" ref={b_driver_img_ipt} 
                                                    isInvalid={!!errors?.backDrivingLiense}
                                                    onChange={(e) =>{
                                                            const file = e.target.files[0];
                                                            setFieldValue(e.target.name, file, true);

                                                            const fileReader = new FileReader();

                                                            if(file){
                                                                fileReader.addEventListener("loadend", (e)=>{
                                                                    setImgUrlBack(fileReader.result);
                                                                })
                                                                fileReader.readAsDataURL(file);
                                                            }
                                                        }}
                                                />
                                            </div>
                                        </Form.Group>
                                        {/* Vehicles */}
                                        <Form.Group className="form-group" >
                                            <div className='mb-2'>
                                                <Form.Label className='label'>Vehicles</Form.Label>
                                                <p className='asterisk'>*</p>
                                            </div>
                                            <div className='list-vehicle'>
                                                {vehicles.map((item,index) => {
                                                    return(
                                                        <div key={index}>
                                                            <label class="fr-checkbox mb-2">
                                                                <input type="checkbox" name="vehicles" value={item?.id} onChange={handleChange} onBlur={handleBlur}/>
                                                                <span className="checkmark"></span>
                                                                <span className='txt-checkbox' style={{fontWeight:'500'}}>{item?.name}</span>
                                                            </label>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </Form.Group>

                                        <Form.Group className="form-group" >
                                            <div className='mb-2'>
                                                <Form.Label className='label'>Additional Information</Form.Label>
                                                <p className='asterisk'>*</p>
                                            </div>
                                            <Form.Control
                                                type="text"
                                                style={{background:'#fafafa'}}
                                                name="adInfo"
                                                as="textarea" rows={3}
                                                placeholder="Enter Your Additional Information"
                                                isInvalid={touched.city && errors.city}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
                                        </Form.Group>

                                        <Button type="submit" variant="warning" style={{backgroundColor:"#f2a13b",border:'none'}} disabled={!isValid} className='my-btn-yellow my-2'>Submit</Button>
                            </Col>
                        </Row>
                        </Form>
                    </div>
                </>
            )
        }
    }
    </Formik>)
}

export default function Index(){
return(
        <RegisterDriver></RegisterDriver>
)}