import React, { useRef } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Formik } from "formik";
import * as yup from 'yup';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import '../style/registerDriver.css';
import Button from 'react-bootstrap/Button';


let registerSchema = yup.object().shape({
    fullName: yup.string().required("Full Name is required field"),
    phoneNumber: yup.number().typeError("Phone Number must be number").required("Phone Number is required field"),
    email: yup.string().email().required("Email is required field"),
    address: yup.string().required("Full Address is required field"),   
    abn: yup.number().typeError("ABN must be number").required("ABN is required field"),
    fileImageFront: yup.mixed().required("You haven't import the Image"),
    fileImageBack: yup.mixed().required("You haven't import the Image")
})
const vehicles = ['Bicycle','Motorbike','Car(Hatchback)','4x4 Wagon','Van',
                    'SmallTruck (1 - 3 ton)','Scooter','Car (Sedan)','Car (Wagon)',
                    'Ute','Medium Van (1 - 3 ton)','Other'];

export default function Register() {
    const f_driver_img_ipt = useRef();
    const b_driver_img_ipt = useRef();
    const [imgUrlFront,setImgUrlFront] = React.useState();
    const [imgUrlBack,setImgUrlBack] = React.useState();
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
                <div className='container p-5'>
                    <Row>
                        <Col sm='12' lg='6'>   
                            <div className='py-5'>
                                <img width={'100%'} src='https://australianstormcourier.com.au/wp-content/uploads/2023/04/cv.png' />
                            </div>
                        </Col>
                        <Col>
                            <div>
                                <div>
                                    <h3 className='reg-header txt-center'>REGISTER DRIVER</h3>
                                    <p className='txt-center'>Lets get started.</p>
                                </div>
                                <Form className='reg-form'>
                                        <Form.Group className="form-group" >
                                            <Form.Label className='label'>Full name</Form.Label>
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
                                            <Form.Label className='label'>Phone Number</Form.Label>
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
                                        <Form.Group className="form-group" >
                                            <Form.Label className='label'>Email</Form.Label>
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
                                        <Form.Group className="form-group" >
                                            <Form.Label className='label'>Full Address</Form.Label>
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
                                            <Form.Label className='label'>ABN</Form.Label>
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
                                        <Form.Group className="form-group" >
                                            <Form.Label className='label'>GST</Form.Label>
                                            <DropDownGST></DropDownGST>
                                        </Form.Group>
                                        
                                        <Form.Group className="form-group" >
                                            <Form.Label className='label py-3 mb-0'>Driving License (Front and Back)</Form.Label>
                                            <div className='front-up'>
                                                <div>
                                                    <h5>Front</h5>
                                                </div>
                                                <div className='img-front' onClick={() => f_driver_img_ipt.current.click()}>
                                                    <img width={'150px'} src={imgUrlFront || 'https://cdn.pixabay.com/photo/2017/11/10/05/24/add-2935429_960_720.png'}/>
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
                                                    <h5>Back</h5>
                                                </div>
                                                <div className='img-front' onClick={() => b_driver_img_ipt.current.click()}>
                                                    <img width={'150px'} src={imgUrlBack || 'https://cdn.pixabay.com/photo/2017/11/10/05/24/add-2935429_960_720.png'}/>
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
                                            <Form.Label className='label'>Vehicles</Form.Label>
                                            <div className='list-vehicle'>
                                                {vehicles.map((item,index) => {
                                                    return(
                                                        <div key={index}>
                                                            <Form.Check
                                                                type={'checkbox'}
                                                                id={`default-checkbox`}
                                                                label={item}
                                                            />
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </Form.Group>
                                        <Button variant="warning" className='w-100 my-btn-yellow my-4'>SUBMIT</Button>
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
  
        <Dropdown.Menu className='w-100'>
          <Dropdown.Item onClick={()=>setState(true)}>Yes</Dropdown.Item>
          <Dropdown.Item onClick={() => setState(false)}>No</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }