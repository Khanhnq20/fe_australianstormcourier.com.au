import React, { useRef } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Formik } from "formik";
import * as yup from 'yup';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import {RiImageEditFill} from 'react-icons/ri'


let registerSchema = yup.object().shape({
    fullName: yup.string().required("Full Name is required field"),
    abnNumber: yup.number().typeError("ABN Number must be number").required("ABN Number is required field"),
    email: yup.string().email().required("Email is required field"),
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
  return (
    <div>
        <h3 className='ui-header p-3'>Become driver</h3>
        <div className='container p-5'>
            <Row>
                <Col>
                    <div>
                        <div>
                        </div>
                        <div className='reg-form'>
                            <div className='product-label-info'>
                                <p className='product-label'>
                                User Name
                                </p>
                                <p className='product-content'>
                                Tommy
                                </p>
                            </div>
                            <div className='product-label-info'>
                                <p className='product-label'>
                                Full Name
                                </p>
                                <p className='product-content'>
                                Thomas Shelby
                                </p>
                            </div>
                            <div className='product-label-info'>
                                <p className='product-label'>
                                Email
                                </p>
                                <p className='product-content'>
                                peakyblider@gmail.com
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
                                ABN Number
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
                            <div className='product-label-info'>
                                <p className='product-label'>
                                City
                                </p>
                                <p className='product-content'>
                                Birmingham
                                </p>
                            </div>
                            <div className='product-label-info'>
                                <p className='product-label'>
                                Zipcode
                                </p>
                                <p className='product-content'>
                                550000
                                </p>
                            </div>
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
                                    <input type="file" id="driver_image_front" name="fileFront" ref={f_driver_img_ipt}/>
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
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    </div>
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