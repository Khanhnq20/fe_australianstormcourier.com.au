import { FieldArray, Formik } from "formik";
import * as yup from 'yup';
import Form from 'react-bootstrap/Form';
import React,{ useContext, useRef } from 'react'
import {RiImageEditFill} from 'react-icons/ri';
import { Button, Col, InputGroup, Modal, Row, Spinner } from "react-bootstrap";
import { AuthContext, OrderContext } from "../../../stores";
import '../style/createProduct.css'
import moment from 'moment';
import { dotnetFormDataSerialize } from "../../../ultitlies";
import Barcode from "react-barcode";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const PERMIT_FILE_FORMATS = ['image/jpeg', 'image/png', 'image/jpg'];

let orderSchema = yup.object().shape({
    senderId: yup.string().required(),
    sendingLocation: yup.object().shape({
        unitNumber: yup.string().required("Unit Number is required"),
        streetNumber: yup.string().required("Street Number is required"),
        streetName: yup.string().required("Street Name is required"),
        suburb: yup.string().required("Suburb is required"),
        state: yup.string().required("State is required"),
        postCode: yup.number().required("Post code is required"),
    }),
    destination: yup.string().required("Destination is required"),
    receiverName: yup.string().required("Receiver Name is required"),
    receiverPhone: yup.string().required("Receiver Phone is required"),
    deliverableDate: yup.date().required(),
    timeFrame: yup.string()
        .test(
            "TIME INCORRECT", 
            "The time format is incorrect", 
            value =>{
                var timeFrames = value?.split("-");
                return timeFrames.length === 2;
            }
        ).test(
            "TIME EXCEEDED", 
            "The time of end should be larger than start", 
            value =>{
                var timeFrames = value.split("-");
                var start = moment(timeFrames[0], "HH:mm");
                var end = moment(timeFrames[1], "HH:mm");
                return end.diff(start) > 0; 
            }
        ),
    vehicles: yup.array().of(yup.string()).min(1),
    orderItems: yup.array().of(
        yup.object().shape({
            itemName: yup.string().required("Item Name is required field"),
            itemCharcode: yup.number().default(Math.floor(Math.random() * (999999 - 100000 + 1) + 100000)), 
            itemDescription: yup.string().nullable(),
            quantity: yup.number().positive().min(1, "Quantity should be larger then 1 and least than 10").max(10, "Quantity should be larger then 1 and least than 10").required("Quantity is required field"),
            weight: yup.number().positive().required("Weight is required field"),
            startingRate: yup.number().positive().required("Starting Rate is required field"),
            packageType: yup.string().required("Package Type is required field"),
            productPictures: yup.array()
                .of(
                    yup.object().shape({
                        file: yup.mixed().required(),
                        url: yup.string().required()
                    })).min(1, "Adding more pictures for product").required("Adding more pictures for product")
                .test(
                'FILE SIZE', 
                'the file collection is too large', 
                (files) => {
                    if (!files) {
                        return true;
                    }
                    return files.reduce((p,c) => c.file.size + p, 0) <= 2 * 1024 * 1024;
                })
                .test(
                    'FILE FORMAT',
                    `the file format should be ${PERMIT_FILE_FORMATS.join()}`,
                    (files) => {
                        if (!files.length) {
                            return true;
                        }
                        return files.every(c => PERMIT_FILE_FORMATS.includes(c.file.type));
                    }
                ),
        })
    )
});

function ItemCreation({name, index, touched, errors, values, handleChange, handleBlur, isValid}){
    const product_img_ipt = useRef();
    const [authState] = useContext(AuthContext);
    
    return (
        <>
            {/* Item Name  */}
            <Form.Group className="mb-3">
                <div className='mb-2'>
                    <Form.Label className='label'>Item Name</Form.Label>
                    <p className='asterisk'>*</p>
                </div>
                <Form.Control
                    type="text"
                    name={`${name}.itemName`}
                    placeholder="Enter Product Name"
                    isInvalid={touched.orderItems?.[index].itemName && errors.orderItems?.[index].itemName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                <Form.Control.Feedback type="invalid">{errors.orderItems?.[index].itemName}</Form.Control.Feedback>
            </Form.Group>
            {/* Item BarCode  */}
            <Form.Group className="mb-3">
                <div className='mb-2'>
                    <Form.Label className='label'>Barcode</Form.Label>
                    <p className='asterisk'>*</p>
                </div>
                <Barcode value={values.orderItems[index].itemCharCode.toString()}></Barcode>
            </Form.Group>
            {/* Item Description  */}
            <Form.Group className="mb-3">
                <div className='mb-2'>
                    <Form.Label className='label'>Product Description</Form.Label>
                    <p className='asterisk'>*</p>
                </div>
                <Form.Control
                    as="textarea"
                    row="3"
                    placeholder="Enter Product Description"
                    name={`${name}.itemDescription`}
                    isInvalid={touched.orderItems?.[index]?.itemDescription && !!errors.orderItems?.[index]?.itemDescription}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                <Form.Control.Feedback type="invalid">{errors?.orderItems?.[index]?.itemDescription}</Form.Control.Feedback>
            </Form.Group>
            {/* Quantity and Weight */}
            <Row>
                <Col>
                    {/* Quantity  */}
                    <Form.Group className="mb-3">
                        <div className='mb-2'>
                            <Form.Label className='label'>Quantity</Form.Label>
                            <p className='asterisk'>*</p>
                        </div>
                        <Form.Control
                            type="number"
                            className="product-form-input"
                            min={0}
                            max={10}
                            name={`${name}.quantity`}
                            placeholder="Enter Quantity"
                            isInvalid={touched?.orderItems?.[index].quantity && !!errors?.orderItems?.[index].quantity}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        <Form.Control.Feedback type="invalid">{errors?.orderItems?.[index].quantity}</Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    {/* Weight  */}
                    <Form.Group className="mb-3">
                        <div className='mb-2'>
                            <Form.Label className='label'>Weight</Form.Label>
                            <p className='asterisk'>*</p>
                        </div>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                name={`${name}.weight`}
                                placeholder="Enter item weight"
                                isInvalid={touched?.orderItems?.[index]?.weight && !!errors?.orderItems?.[index]?.weight}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                aria-describedby="weight"
                            />
                            <InputGroup.Text id="weight">Kilogram</InputGroup.Text>
                            <Form.Control.Feedback type="invalid">{errors?.orderItems?.[index]?.weight}</Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                </Col>
            </Row>
            {/* Product Pictures & Shipping Rate & PackageType & Vehicles*/}
            <Row>
                {/* Product pictures */}
                <Col>
                    <Form.Group className="mb-3">
                        <div className='mb-2'>
                            <Form.Label className='label'>Product Images</Form.Label>
                            <p className='asterisk'>*</p>
                        </div>
                        <div className='back-up'>
                            <FieldArray name={`${name}.productPictures`} 
                                render={(arrayHelpers) =>{
                                return (<>
                                    <Form.Control type="file" id="driver_image_back" 
                                        ref={product_img_ipt} 
                                        multiple
                                        isInvalid={!!errors?.orderItems?.[index]?.productPictures}
                                        onChange={(e) =>{
                                            const files = e.target.files;
                                            for (var i = 0; i < files.length; i++) { 
                                                //for multiple files          
                                                (function(file) {                                        
                                                    const fileReader = new FileReader();
                                                    fileReader.onload = function(e) {  
                                                        // get file content  
                                                        fileReader.addEventListener("loadend", (e)=>{
                                                            arrayHelpers.push({
                                                                file,
                                                                url: fileReader.result
                                                            });
                                                        })
                                                    }
                                                    fileReader.readAsDataURL(file);
                                                })(files[i]);
                                            }}}
                                            accept="img"
                                        />
                                    <Form.Control.Feedback type="invalid">{errors?.orderItems?.[index]?.productPictures}</Form.Control.Feedback>
                                    <Row style={{flexDirection:'column'}}>
                                        {
                                            values?.orderItems?.[index]?.productPictures?.map?.((picture,ind) =>{
                                                return (
                                                    <Col key={ind}>
                                                        <div className='img-front-frame'>
                                                            <div className='background-front'>
                                                                <RiImageEditFill style={{position:'relative',color:'gray',fontSize:'50px',opacity:'70%'}}></RiImageEditFill>
                                                                <p className='driving-txt'>Change Product Images</p>
                                                            </div>
                                                            <img className='img-front' src={picture?.url || 'https://tinyurl.com/5ehpcctt'}/>
                                                        </div>
                                                        <Button variant="danger" onClick={() => arrayHelpers.remove(ind)}>Remove</Button>
                                                        {errors?.orderItems?.[index]?.productPictures?.[ind]?.file}
                                                    </Col>
                                                    )
                                                })
                                        }
                                        <Col>
                                            <div className='img-front-frame' onClick={() => product_img_ipt.current.click()}>
                                                <div className='background-front'>
                                                    <RiImageEditFill style={{position:'relative',color:'gray',fontSize:'50px',opacity:'70%'}}></RiImageEditFill>
                                                    <p className='driving-txt'>Change Product Images</p>
                                                </div>
                                                <img className='img-front' src={'https://tinyurl.com/5ehpcctt'}/>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Form.Control type="file" id="driver_image_back" 
                                        ref={product_img_ipt} 
                                        multiple
                                        isInvalid={!!errors?.productPictures}
                                        onChange={(e) =>{
                                            const files = e.target.files;
                                            for (var i = 0; i < files.length; i++) { 
                                                //for multiple files          
                                                (function(file) {                                        
                                                    const fileReader = new FileReader();
                                                    fileReader.onload = function(e) {  
                                                        // get file content  
                                                        fileReader.addEventListener("loadend", (e)=>{
                                                            arrayHelpers.push({
                                                                file,
                                                                url: fileReader.result
                                                            });
                                                        })
                                                    }
                                                    fileReader.readAsDataURL(file);
                                                })(files[i]);
                                            }
                                        }}
                                        accept="img"
                                    />
                                    <Form.Control.Feedback type="invalid">{errors?.productPictures}</Form.Control.Feedback>
                                </>)
                                }}
                            />
                        </div>
                    </Form.Group>
                </Col>
                
                {/* Shipping Rate & Package Type & Vehicles */}
                <Col>
                    {/* Start shipping rate */}
                    <Form.Group className="mb-3">
                        <div className='mb-2'>
                            <Form.Label className='label'>Your preference rate</Form.Label>
                            <p className='asterisk'>*</p>
                        </div>
                        <Form.Control
                            type="number"
                            name={`${name}.startingRate`}
                            placeholder="Enter your shipping rate"
                            value={values?.orderItems?.[index]?.startingRate}
                            isInvalid={touched?.orderItems?.[index]?.startingRate && !!errors?.orderItems?.[index]?.startingRate}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        <Form.Control.Feedback type="invalid">{errors?.orderItems?.[index]?.startingRate}</Form.Control.Feedback>
                    </Form.Group>

                    {/* Vehicles */}
                    <Form.Group className="form-group" >
                        <div className='mb-2'>
                            <Form.Label className='label'>Vehicles</Form.Label>
                            <p className='asterisk'>*</p>
                        </div>
                        <div className='list-vehicle'>
                            {authState.vehicles.map((item,index) => {
                                return(
                                    <div key={index}>
                                        <label className="fr-checkbox mb-2">
                                            <input type="checkbox" 
                                                name="vehicles" 
                                                value={item?.id} 
                                                onChange={handleChange} 
                                                onBlur={handleBlur}
                                                />
                                            <span className="checkmark"></span>
                                            <span className='txt-checkbox' style={{fontWeight:'500'}}>{item?.name}</span>
                                        </label>
                                    </div>
                                )
                            })}
                        </div>
                        <p className="content-red mt-2">
                            {errors?.vehicles}
                        </p>
                    </Form.Group>

                    {/* Package Type */}
                    <Form.Group className="mb-3">
                        <div className='mb-2'>
                            <Form.Label className='label'>Package Type</Form.Label>
                            <p className='asterisk'>*</p>
                        </div>

                        <Form.Select
                            type="string"
                            name={`${name}.packageType`}
                            placeholder="Select your type of package"
                            isInvalid={touched?.orderItems?.[index]?.packageType && !!errors?.orderItems?.[index]?.packageType}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            defaultValue={values?.['orderItems']?.[index]?.packageType}
                        >
                            {authState?.packageTypes?.map((type,index) =>{
                                return <option key={index} value={type}>{type}</option>
                            })}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors?.orderItems?.[index]?.packageType}</Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
        </>
    )
}

function OrderCreation(){
    const [authState] = useContext(AuthContext);
    const [orderState, {postOrder}] = useContext(OrderContext);
    const [phoneError ,setPhoneError] = React.useState("");

    return(
        <Formik
            initialValues={{
                senderId: authState.accountInfo?.id,
                sendingLocation: {
                    unitNumber: '',
                    streetNumber: '',
                    streetName: '',
                    suburb: '',
                    state: '',
                    postCode: '',
                },
                destination:'',
                receiverName: '',
                receiverPhone: '',
                deliverableDate: Date.now(),
                timeFrame: '-',
                vehicles: [],
                orderItems: [
                    {
                        itemName: '',
                        itemCharCode: Math.floor(Math.random() * (999999 - 100000 + 1) + 100000), 
                        itemDescription: '',
                        quantity: '',
                        weight: '',
                        startingRate: '',
                        packageType: authState?.packageTypes?.[0],
                        productPictures: []
                    }
                ]
            }} 
            validationSchema={orderSchema}
            onSubmit={(values) =>{
                const handledObjects = {
                    ...values,
                    orderItems: values.orderItems.map(item => ({
                        ...item,
                        productPictures: item.productPictures.map(item => item?.file)
                    }))
                };

                const formData = dotnetFormDataSerialize(handledObjects, {
                    indices: true,
                    dotsForObjectNotation: true
                });

                postOrder(formData);
            }}
        >
        {(formProps) =>{
            const {touched, isValid, errors, setFieldValue, handleSubmit, handleChange, handleBlur,values} = formProps;
            return(   
                <div className='p-3'>
                    <Modal show={orderState.loading} 
                        size="lg"
                        backdrop="static"
                        keyboard={false}
                        centered>
                        <Modal.Body className="text-center">
                            <Spinner className="mb-2"></Spinner> 
                            <h2>Please waiting for us</h2>
                            <p>We are handling your request, <b style={{color: "red"}}>Don't close your device</b></p>
                        </Modal.Body>
                    </Modal>
                    <Form onSubmit={handleSubmit}>
                        <div 
                            // className='form-order'
                        >
                            {/* Sending location & Destination */}
                            {JSON.stringify(errors, 4, 4)}
                            <h3 className="my-3">Order Location</h3>

                            <Row>
                                <Col>
                                    {/* Sending Location */}
                                    <Form.Group>
                                        <div className='mb-2'>
                                            <Form.Label className='label'>Pick Up</Form.Label>
                                            <p className='asterisk'>*</p>
                                        </div>
                                        <div className="pickup-post">
                                            {/* Unit Number */}
                                            <Form.Group>
                                                <Form.Control
                                                    type="text"
                                                    name="sendingLocation.unitNumber"
                                                    placeholder="Enter Unit number (apartment, room,...)"
                                                    isInvalid={touched.sendingLocation?.unitNumber && !!errors?.sendingLocation?.unitNumber}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors?.sendingLocation?.unitNumber}</Form.Control.Feedback>
                                            </Form.Group>

                                            
                                            {/* Street Number */}
                                            <Form.Group>
                                                <Form.Control
                                                    type="text"
                                                    name="sendingLocation.streetNumber"
                                                    placeholder="Enter street number"
                                                    isInvalid={touched.sendingLocation?.streetNumber && !!errors?.sendingLocation?.streetNumber}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors?.sendingLocation?.streetNumber}</Form.Control.Feedback>
                                            </Form.Group>

                                            {/* Street Name */}
                                            <Form.Group>
                                                <Form.Control
                                                    type="text"
                                                    name="sendingLocation.streetName"
                                                    placeholder="Enter Street Name"
                                                    isInvalid={touched.sendingLocation?.streetName && !!errors?.sendingLocation?.streetName}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors?.sendingLocation?.streetName}</Form.Control.Feedback>
                                            </Form.Group>

                                            {/* Suburb */}
                                            <Form.Group>
                                                <Form.Control
                                                    type="text"
                                                    name="sendingLocation.suburb"
                                                    placeholder="Enter Suburb"
                                                    isInvalid={touched.sendingLocation?.suburb && !!errors?.sendingLocation?.suburb}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors?.sendingLocation?.suburb}</Form.Control.Feedback>
                                            </Form.Group>

                                            {/* State */}
                                            <Form.Group>
                                                <Form.Control
                                                    type="text"
                                                    name="sendingLocation.state"
                                                    placeholder="Enter state"
                                                    isInvalid={touched.sendingLocation?.state && !!errors?.sendingLocation?.state}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors?.sendingLocation?.state}</Form.Control.Feedback>
                                            </Form.Group>

                                            {/* State */}
                                            <Form.Group>
                                                <Form.Control
                                                    type="text"
                                                    name="sendingLocation.postCode"
                                                    placeholder="Enter post code"
                                                    isInvalid={touched.sendingLocation?.postCode && !!errors?.sendingLocation?.postCode}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors?.sendingLocation?.postCode}</Form.Control.Feedback>
                                            </Form.Group>
                                        </div>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    {/* Destination */}
                                    <Form.Group>
                                        <div className='mb-2'>
                                            <Form.Label className='label'>Destination</Form.Label>
                                            <p className='asterisk'>*</p>
                                        </div>
                                        <Form.Control
                                            type="text"
                                            name="destination"
                                            placeholder="Enter destination"
                                            isInvalid={touched.destination && errors.destination}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.destination}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            {/* Receiver Information */}
                            <h3 className="my-3">Receiver Information</h3>
                            <Row>
                                <Col>
                                    <Form.Group>
                                        <div className='mb-2'>
                                            <Form.Label className='label'>Receiver Name</Form.Label>
                                            <p className='asterisk'>*</p>
                                        </div>
                                        <Form.Control
                                            type="text"
                                            name="receiverName"
                                            placeholder="Enter Receiver Name"
                                            isInvalid={touched?.receiverName && !!errors?.receiverName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors?.receiverName}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    {/* <Form.Group>
                                        <div className='mb-2'>
                                            <Form.Label className='label'>Receiver Phone</Form.Label>
                                            <p className='asterisk'>*</p>
                                        </div>
                                        <Form.Control
                                            type="text"
                                            name="receiverPhone"
                                            placeholder="Enter Receiver Phone Number"
                                            isInvalid={touched.receiverPhone && !!errors?.receiverPhone}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors?.receiverPhone}</Form.Control.Feedback>
                                    </Form.Group> */}
                                    {/* Phone */}
                                    <Form.Group>
                                        <div className='mb-2'>
                                            <Form.Label className='label'>Phone Number</Form.Label>
                                            <p className='asterisk'>*</p>
                                        </div>
                                        <PhoneInput
                                        country={'au'}
                                        value={values?.phone}
                                        onChange={phone => setFieldValue("receiverPhone", phone)}
                                        onlyCountries={['au', 'vn', 'us']}
                                        preferredCountries={['au']}
                                        placeholder="Enter Receiver Phone number"
                                        autoFormat={true}
                                        isValid={(inputNumber, _, countries) => {
                                            const isValid = countries.some((country) => {
                                                return inputNumber.startsWith(country.dialCode) || country.dialCode.startsWith(inputNumber);
                                            });

                                            setPhoneError('');
                                            
                                            if(!isValid){
                                                setPhoneError("Your phone is not match with dial code");
                                            }

                                            return isValid;
                                        }}
                                        ></PhoneInput>
                                        <Form.Control
                                            type="hidden"
                                            name="receiverPhone"
                                            defaultValue={values?.phone}
                                            isInvalid={!!errors.phone || !!phoneError}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.phone || phoneError}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            {/* Delivery Date */}
                            <h3 className="my-3">Delivery Capability</h3>
                            <Row>
                                <Col>
                                    {/* Deliverable Date */}
                                    <Form.Group>
                                        <div className='mb-2'>
                                            <Form.Label className='label'>Deliverable Date</Form.Label>
                                            <p className='asterisk'>*</p>
                                        </div>
                                        <Form.Control
                                            type="date"
                                            name="deliverableDate"
                                            placeholder="Enter deliverable date"
                                            isInvalid={touched.deliverableDate && !!errors?.deliverableDate}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors?.deliverableDate}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    {/* Time Frame */}
                                    <Form.Group>
                                        <div className='mb-2'>
                                            <Form.Label className='label'>Time Frame From</Form.Label>
                                            <p className='asterisk'>*</p>
                                        </div>
                                        <Form.Control
                                            type="time"
                                            name="timeFrame"
                                            placeholder="Enter time frame start"
                                            isInvalid={touched?.timeFrame && !!errors?.timeFrame}
                                            onChange={(e) =>{
                                                var timeFrames = values[e.target.name].split("-");
                                                
                                                timeFrames[0] = e.target.value;
                                                setFieldValue(e.target.name, timeFrames.join("-"), true);
                                            }}
                                            onBlur={handleBlur}
                                        />
                                        <div className='mb-2'>
                                            <Form.Label className='label'>Time Frame To</Form.Label>
                                            <p className='asterisk'>*</p>
                                        </div>
                                        <Form.Control
                                            type="time"
                                            name="timeFrame"
                                            placeholder="Enter time frame end"
                                            isInvalid={touched.timeFrame && !!errors?.timeFrame}
                                            onChange={(e) =>{
                                                var timeFrames = values[e.target.name].split("-");
                                                
                                                timeFrames[1] = e.target.value;
                                                setFieldValue(e.target.name, timeFrames.join("-"), true);
                                            }}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors?.timeFrame}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* OrderItems */}
                            <h3 className="my-3">Item Information</h3>

                            <FieldArray name="orderItems"
                                render={(arrayHelpers) =>{
                                    return <>
                                        {values.orderItems.map((_,index) =>{
                                            return <ItemCreation key={index} index={index} name={`orderItems[${index}]`} {...formProps}></ItemCreation>
                                        })}
                                    </>
                                }}
                            />

                            <Button type="submit" variant="warning" disabled={!isValid || !!phoneError} className='my-btn-yellow'>Search for driver</Button>
                        </div>
                    </Form>
                </div>)
        }}
        </Formik>
    )
}

export default function Index(){
    return(
        <OrderCreation></OrderCreation>
    )
}