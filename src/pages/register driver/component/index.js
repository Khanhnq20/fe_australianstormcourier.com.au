import React, { useRef } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Formik } from "formik";
import * as yup from 'yup';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import '../style/registerDriver.css';
import Button from 'react-bootstrap/Button';
import {RiImageEditFill} from 'react-icons/ri';
import {AiFillEye,AiFillEyeInvisible} from  'react-icons/ai';


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
    abnNumber: yup.number().typeError("ABN Number must be number").required("ABN Number is required field"),
    address: yup.string().required("Full Address is required field"),   
    city: yup.string().required("City is required field"),
    zipCode: yup.number().typeError("Zip code must be number").required("Zip code is required field"),
    fileImageFront: yup.mixed().required("You haven't import the Image"),
    fileImageBack: yup.mixed().required("You haven't import the Image")
})
const vehicles = ['Bicycle','Motorbike','Car(Hatchback)','4x4 Wagon','Van',
                    'SmallTruck (1 - 3 ton)','Scooter','Car (Sedan)','Car (Wagon)',
                    'Ute','Medium Van (1 - 3 ton)','Other'];

function RegisterDriver() {
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
            fullName:'',
            abnNumber:'',
            address:'',
            city:'',
            zipCode:0
        }}
            
        validationSchema={registerSchema}
        onSubmit={(values) =>{

        }}
    >
    {({touched, errors, handleSubmit, handleChange, handleBlur,isValid}) =>{

        const permitedNext = touched.userName && !errors.userName
            && touched.phone && !errors.phone
            && touched.email && !errors.email
            && touched.password && !errors.password;

        return( 
            <div>
                <h3 className='ui-header p-3'>Become driver</h3>
                <div className='container p-5'>
                    <Row>
                            <Col className={next ? "step1-show" : "step1-hide"}>
                                <Form className='form' onSubmit={handleSubmit}>
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
                                </Form>
                            </Col>
                            <Col className={!next ? "step2-show" : "step2-hide"}>
                                <div>
                                    <div>
                                    </div>
                                    <Form className='reg-form' onSubmit={handleSubmit}>
                                        <Button type="submit" variant="warning" onClick={()=> setNext(e => !e)} className='my-btn-yellow mb-4'>Back</Button>
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
                                            <Form.Group className="form-group" >
                                                <div className='mb-2'>
                                                    <Form.Label className='label'>ABN Number</Form.Label>
                                                    <p className='asterisk'>*</p>
                                                </div>
                                                <Form.Control
                                                    type="text"
                                                    name="abnNumber"
                                                    placeholder="Enter Your Phone Number"
                                                    isInvalid={touched.abnNumber && errors.abnNumber}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.abnNumber}</Form.Control.Feedback>
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
                                                    <Form.Label className='label'>City</Form.Label>
                                                    <p className='asterisk'>*</p>
                                                </div>
                                                <Form.Control
                                                    type="text"
                                                    name="city"
                                                    placeholder="Enter Your Full Address"
                                                    isInvalid={touched.city && errors.city}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
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
                                                    isInvalid={touched.zipCode && errors.zipCode}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.zipCode}</Form.Control.Feedback>
                                            </Form.Group>
                                            
                                            <Form.Group className="form-group" >
                                                <div className='mb-2'>
                                                    <Form.Label className='label py-3 mb-2'>Driving License (Front and Back)</Form.Label>
                                                    <p className='asterisk'>*</p>
                                                </div>
                                                <div className='front-up'>
                                                    <div>
                                                        <h6>Front</h6>
                                                    </div>
                                                    <div className='img-front-frame' onClick={() => f_driver_img_ipt.current.click()}>
                                                        <div className='background-front'>
                                                            <RiImageEditFill style={{position:'relative',color:'gray',fontSize:'50px',opacity:'70%'}}></RiImageEditFill>
                                                            <p className='driving-txt'>Change driving license</p>
                                                        </div>
                                                        <img className='img-front' src={imgUrlFront || 'https://tinyurl.com/5ehpcctt'}/>
                                                    </div>
                                                    <input type="file" id="driver_image_front" name="fileFront" ref={f_driver_img_ipt} 
                                                        isInvalid={!!errors.fileImageFront}
                                                        onChange={(e) =>{
                                                            const file = e.target.files[0];
                                                            // setFieldValue("fileImage", file);
                                                            
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
                                                    <input type="file" id="driver_image_back" name="fileBack" ref={b_driver_img_ipt} 
                                                            isInvalid={!!errors.fileImageBack}
                                                            onChange={(e) =>{
                                                                
                                                                const file = e.target.files[0];
                                                                // setFieldValue("fileImage", file);
                                                                
                                                                const fileReader = new FileReader();
                                                                if(file){
                                                                    fileReader.addEventListener("loadend", (e)=>{
                                                                        setImgUrlBack(fileReader.result);
                                                                    })
                                                                    fileReader.readAsDataURL(file);
                                                                }
                                                            }}
                                                    />
                                                    <input type="file" id="driver_image_back" name="fileBack"/>
                                                </div>
                                            </Form.Group>
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
                                                                    <input type="checkbox"/>
                                                                    <span className="checkmark"></span>
                                                                    <span className='txt-checkbox' style={{fontWeight:'500'}}>{item}</span>
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
                                                    name="city"
                                                    as="textarea" rows={3}
                                                    placeholder="Enter Your Additional Information"
                                                    isInvalid={touched.city && errors.city}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
                                            </Form.Group>
                                            <Button type="submit" variant="warning" style={{backgroundColor:"#f2a13b",border:'none'}} disabled={isValid} className='my-btn-yellow my-2    '>Submit</Button>
                                    </Form>
                                </div>
                            </Col>
                    </Row>
                </div>
            </div>
    )}}
    </Formik>
  )
}

  function DropDownGender() {
    const [state,setState] = React.useState(true);
    return (
      <Dropdown className='reg-dr'>
        <Dropdown.Toggle className='dr-btn' id="dropdown-basic">
            {state === true ? "Male" : "Female"}
        </Dropdown.Toggle>
  
        <Dropdown.Menu className='w-100'>
          <Dropdown.Item onClick={()=>setState(true)}>Male</Dropdown.Item>
          <Dropdown.Item onClick={() => setState(false)}>Female</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

export default function Index(){
return(
        <RegisterDriver></RegisterDriver>
)
}