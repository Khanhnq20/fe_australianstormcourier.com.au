import { Formik } from "formik";
import * as yup from 'yup';
import Form from 'react-bootstrap/Form';
import React,{ useRef } from 'react'
import {RiImageEditFill} from 'react-icons/ri';
import Dropdown from 'react-bootstrap/Dropdown';
import { Button } from "react-bootstrap";
let productSchema = yup.object().shape({
    name: yup.string().required("Name is required field"),
    weight: yup.number().typeError("Weight must be number").required("Weight is required field"),
    productName: yup.string().required("Quantity is required field"),
    from: yup.string().required("From is required field"),
    to: yup.string().required("to is required field"),
    description: yup.string().required("description is required field"),
})
function ProductCreate(){
    const product_img_ipt = useRef();
    const [imgUrlBack,setImgUrlBack] = React.useState();
    return(
    <Formik
        initialValues={{
            productName:'',
            weight:'',
            quantity:'',
            sendingLocation:'',
            destination:'',
            startRates:'',
            selectedRates:'',
            description:''
        }} 
        validationSchema={productSchema}
    >
    {({touched, errors, handleSubmit, handleChange, handleBlur, isValid,values}) =>{
        return(
            <>   
                <div className='p-3'>
                        <Form onSubmit={handleSubmit}>
                            <div className='form-order'>
                                {/* Product Name  */}
                                <Form.Group>
                                    <div className='mb-2'>
                                        <Form.Label className='label'>Name</Form.Label>
                                        <p className='asterisk'>*</p>
                                    </div>
                                    <Form.Control
                                        type="text"
                                        name="productName"
                                        placeholder="Enter Product Name"
                                        isInvalid={touched.name && errors.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                                </Form.Group>
                                {/* Status */}
                                {/* <Form.Group>
                                    <div className='mb-2'>
                                        <Form.Label className='label'>Status</Form.Label>
                                        <p className='asterisk'>*</p>
                                    </div>
                                    <DropDownStatus></DropDownStatus>
                                </Form.Group> */}
                                {/* Weight */}
                                <Form.Group>
                                    <div className='mb-2'>
                                        <Form.Label className='label'>Weight (pound) </Form.Label>
                                        <p className='asterisk'>*</p>
                                    </div>
                                    <Form.Control
                                        type="text"
                                        name="weight"
                                        placeholder="Enter product's weight"
                                        isInvalid={touched.weight && errors.weight}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.weight}</Form.Control.Feedback>
                                </Form.Group>
                                {/* Quantity */}
                                <Form.Group>
                                    <div className='mb-2'>
                                        <Form.Label className='label'>Quantity</Form.Label>
                                        <p className='asterisk'>*</p>
                                    </div>
                                    <Form.Control
                                        type="text"
                                        name="quantity"
                                        placeholder="Enter product's quantity"
                                        isInvalid={touched.quantity && errors.quantity}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.quantity}</Form.Control.Feedback>
                                </Form.Group>
                                {/* Sending Location */}
                                <Form.Group>
                                    <div className='mb-2'>
                                        <Form.Label className='label'>From</Form.Label>
                                        <p className='asterisk'>*</p>
                                    </div>
                                    <Form.Control
                                        type="text"
                                        name="from"
                                        placeholder="Enter sendding location"
                                        isInvalid={touched.form && errors.from}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.from}</Form.Control.Feedback>
                                </Form.Group>
                                {/* Destination */}
                                <Form.Group>
                                    <div className='mb-2'>
                                        <Form.Label className='label'>To</Form.Label>
                                        <p className='asterisk'>*</p>
                                    </div>
                                    <Form.Control
                                        type="text"
                                        name="to"
                                        placeholder="Enter destination"
                                        isInvalid={touched.to && errors.to}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.to}</Form.Control.Feedback>
                                </Form.Group>
                                {/* Start shipping rate */}
                                <Form.Group>
                                    <div className='mb-2'>
                                        <Form.Label className='label'>Starting shipper rates</Form.Label>
                                        <p className='asterisk'>*</p>
                                    </div>
                                    <Form.Control
                                        type="text"
                                        name="shipperRates"
                                        placeholder="Enter..."
                                        isInvalid={touched.shipperRates && errors.shipperRates}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.shippingRates}</Form.Control.Feedback>
                                </Form.Group>
                                {/* Selected shipping rate */}
                                <Form.Group>
                                    <div className='mb-2'>
                                        <Form.Label className='label'>Selected shipper rates</Form.Label>
                                        <p className='asterisk'>*</p>
                                    </div>
                                    <Form.Control
                                        type="text"
                                        name="shippingRates"
                                        placeholder="Enter..."
                                        isInvalid={touched.shippingRates && errors.shippingRates}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.shippingRates}</Form.Control.Feedback>
                                </Form.Group>
                                {/* Description */}
                                <Form.Group className="form-group">
                                    <div  className='mb-2'>
                                        <Form.Label className='label'>Description</Form.Label>
                                        <p className='asterisk'>*</p>
                                    </div>
                                    <div className='product-rate-form'>
                                        <div className='frame-pass' style={{flexGrow:'1'}}>
                                        <Form.Control
                                            type={'text'} 
                                            as="textarea" rows={3}
                                            style={{position:'relative',background:'#fafafa'}}
                                            isInvalid={touched.description && errors.description}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="Fill rate (rate must be number)"
                                            name="rate"/>
                                        </div>
                                    </div>
                                </Form.Group>
                                {/* Product Image */}
                                <Form.Group>
                                    <div className='mb-2'>
                                        <Form.Label className='label'>Product images</Form.Label>
                                        <p className='asterisk'>*</p>
                                    </div>
                                    <div className='back-up'>
                                        <div className='img-front-frame' onClick={() => product_img_ipt.current.click()}>
                                            <div className='background-front'>
                                                <RiImageEditFill style={{position:'relative',color:'gray',fontSize:'50px',opacity:'70%'}}></RiImageEditFill>
                                                <p className='driving-txt'>Change driving license</p>
                                            </div>
                                            <img className='img-front' src={imgUrlBack || 'https://tinyurl.com/5ehpcctt'}/>
                                        </div>
                                        <input type="file" id="driver_image_back" name="fileBack" ref={product_img_ipt} 
                                                isInvalid={!!errors.fileImageBack}
                                                onChange={(e) =>{
                                                    const file = e.target.files[0];

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
                                <Button type="submit" variant="warning" className='my-btn-yellow'>Post your product</Button>
                            </div>
                        </Form>

                </div>
            </>
    )}}
    </Formik>
    )
}

function DropDownStatus() {
    const [state,setState] = React.useState(true);
    return (
        <Dropdown className='reg-dr'>
            <Dropdown.Toggle className='dr-btn' id="dropdown-basic">
                {state === true ? "Looking for driver" : "Active"}
            </Dropdown.Toggle>
    
            <Dropdown.Menu className='w-100'>
                <Dropdown.Item onClick={()=>setState(true)}>Looking for driver</Dropdown.Item>
                <Dropdown.Item onClick={() => setState(false)}>Actived</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default function Index(){
    return(
        <ProductCreate></ProductCreate>
    )
}