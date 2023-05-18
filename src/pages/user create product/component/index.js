import { FieldArray, Formik } from "formik";
import * as yup from 'yup';
import Form from 'react-bootstrap/Form';
import React,{ useContext, useRef, useState } from 'react'
import {RiImageEditFill} from 'react-icons/ri';
import { Button, Col, InputGroup, Modal, Row, Spinner } from "react-bootstrap";
import { AuthContext, OrderContext } from "../../../stores";
import '../style/createProduct.css'
import moment from 'moment';
import { dotnetFormDataSerialize } from "../../../ultitlies";

const PERMIT_FILE_FORMATS = ['image/jpeg', 'image/png', 'image/jpg'];

let orderSchema = yup.object().shape({
    senderId: yup.string().required(),
    sendingLocation: yup.object().shape({
        unitNumber: yup.number().required("Unit Number is required"),
        streetNumber: yup.number().required("Street Number is required"),
        streetName: yup.string().required("Street Name is required"),
        suburb: yup.string().required("Suburb is required"),
        state: yup.string().required("State is required"),
        postCode: yup.number().required("Post code is required"),
    }),
    destination: yup.string().required(),
    receiverName: yup.string().nullable(),
    receiverPhone: yup.string().required(),
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
            itemCharCode: yup.number().required("Item CharCode is required field"), 
            itemDescription: yup.string().nullable(),
            quantity: yup.number().positive().min(0).max(10).required("Quantity is required field"),
            weight: yup.number().positive().required("Weight is required field"),
            startingRate: yup.number().positive().required("Starting Rate is required field"),
            // selectedRate: yup.number().positive().nullable(),
            packageType: yup.string().required("Package Type is required field"),
            productPictures: yup.array().min(1)
                .test(
                'FILE SIZE', 
                'the file is too large', 
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

function ItemCreation({index, touched, errors, values, handleChange, handleBlur, isValid}){
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
                    name="orderItems[0].itemName"
                    placeholder="Enter Product Name"
                    isInvalid={touched.itemName && errors.itemName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                <Form.Control.Feedback type="invalid">{errors.itemName}</Form.Control.Feedback>
            </Form.Group>
            {/* Item CharCode  */}
            <Form.Group className="mb-3">
                <div className='mb-2'>
                    <Form.Label className='label'>CharCode</Form.Label>
                    <p className='asterisk'>*</p>
                </div>
                <Form.Control
                    type="text"
                    name="orderItems[0].itemCharCode"
                    placeholder="Enter CharCode"
                    isInvalid={touched.itemCharCode && errors.itemCharCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                <Form.Control.Feedback type="invalid">{errors.itemCharCode}</Form.Control.Feedback>
            </Form.Group>
            {/* Item Description  */}
            <Form.Group className="mb-3">
                <div className='mb-2'>
                    <Form.Label className='label'>Product Description</Form.Label>
                </div>
                <Form.Control
                    as="textarea"
                    row="3"
                    name="orderItems[0].itemDescription"
                    isInvalid={touched?.itemDescription && !!errors?.itemDescription}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                <Form.Control.Feedback type="invalid">{errors?.itemDescription}</Form.Control.Feedback>
            </Form.Group>
            {/* Quantity and Weight */}
            <Row>
                <Col>
                    {/* Quantity  */}
                    <Form.Group className="mb-3">
                        <div className='mb-2'>
                            <Form.Label className='label'>Quantity</Form.Label>
                        </div>
                        <Form.Control
                            type="number"
                            className="product-form-input"
                            min={0}
                            max={10}
                            name="orderItems[0].quantity"
                            placeholder="Enter Quantity"
                            isInvalid={touched?.quantity && !!errors?.quantity}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        <Form.Control.Feedback type="invalid">{errors?.quantity}</Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    {/* Weight  */}
                    <Form.Group className="mb-3">
                        <div className='mb-2'>
                            <Form.Label className='label'>Weight</Form.Label>
                        </div>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                name="orderItems[0].weight"
                                placeholder="Enter item weight"
                                isInvalid={touched?.weight && !!errors?.weight}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                aria-describedby="weight"
                            />
                            <InputGroup.Text id="weight">Kilogram</InputGroup.Text>
                            <Form.Control.Feedback type="invalid">{errors?.weight}</Form.Control.Feedback>
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
                            <Form.Label className='label'>Product images</Form.Label>
                            <p className='asterisk'>*</p>
                        </div>
                        <div className='back-up'>
                            <FieldArray name={`orderItems[${index}].productPictures`} 
                                render={(arrayHelpers) =>{
                                return (<>
                                    <Row style={{flexDirection:'column'}}>
                                        <>
                                        {
                                            values?.orderItems?.[index]?.productPictures?.map?.((picture,index) =>{
                                            return (
                                                <Col key={index}>
                                                    <div className='img-front-frame'>
                                                        <div className='background-front'>
                                                            <RiImageEditFill style={{position:'relative',color:'gray',fontSize:'50px',opacity:'70%'}}></RiImageEditFill>
                                                            <p className='driving-txt'>Change Product Images</p>
                                                        </div>
                                                        <img className='img-front' src={picture?.url || 'https://tinyurl.com/5ehpcctt'}/>
                                                    </div>
                                                </Col>
                                                )
                                            })
                                        }
                                        </>
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
                                        isInvalid={!!errors?.orderItems?.[index]?.productPictures}
                                        onChange={(e) =>{
                                            const files = e.target.files;
                                            for (var i = 0; i < files.length; i++) { //for multiple files          
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
                                        />
                                    <Form.Control.Feedback type="invalid">{!!errors?.orderItems?.[index]?.productPictures}</Form.Control.Feedback>
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
                            <Form.Label className='label'>Starting shipper rates</Form.Label>
                            <p className='asterisk'>*</p>
                        </div>
                        <Form.Control
                            type="number"
                            name={`orderItems[${index}].startingRate`}
                            placeholder="Enter your shipping rate"
                            value={values.startingRate}
                            isInvalid={touched.orderItems?.[index].startingRate && errors?.orderItems?.[index]?.startingRate}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        <Form.Control.Feedback type="invalid">{errors?.startingRate}</Form.Control.Feedback>
                    </Form.Group>
                    {/* Selected shipping rate */}
                    {/* <Form.Group className="mb-3">
                        <div className='mb-2'>
                            <Form.Label className='label'>Selected shipper rates</Form.Label>
                            <p className='asterisk'>*</p>
                        </div>
                        <Form.Control
                            type="number"
                            name={`orderItems[${index}].selectedRate`}
                            placeholder="Selecte shipping rate"
                            value={values.selectedRate}
                            isInvalid={touched?.orderItems?.[index]?.selectedRate && !!errors?.orderItems?.[index]?.selectedRate}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        <Form.Control.Feedback type="invalid">{errors?.orderItems?.[index]?.selectedRate}</Form.Control.Feedback>
                    </Form.Group> */}

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

                    {/* Package Type */}
                    <Form.Group className="mb-3">
                        <div className='mb-2'>
                            <Form.Label className='label'>Package Type</Form.Label>
                        </div>
                        <Form.Select
                            type="string"
                            name={`orderItems[${index}].packageType`}
                            placeholder="Select your type of package"
                            isInvalid={touched?.orderItems?.[index]?.packageType && !!errors?.orderItems?.[index]?.packageType}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        >
                            {authState?.packageTypes?.map((type,index) =>{
                                return <option key={index} value={type}>{type}</option>
                            })}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors?.orderItems?.[index]?.packageType}</Form.Control.Feedback>
                    </Form.Group>

                    <Button type="submit" variant="warning" disabled={!isValid} className='my-btn-yellow'>Search for driver</Button>
                </Col>
            </Row>
        </>
    )
}

function OrderCreation(){
    const [authState] = useContext(AuthContext);
    const [orderState, {postOrder}] = useContext(OrderContext);

    return(
        <Formik
            initialValues={{
                senderId: authState.accountInfo?.id,
                sendingLocation: {
                    unitNumber: 0,
                    streetNumber: 0,
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
                        itemCharCode: '', 
                        itemDescription: '',
                        quantity: 0,
                        weight: 0,
                        startingRate: 0,
                        selectedRate: 0,
                        packageType: '',
                        productPictures: []
                    }
                ]
            }} 
            enableReinitialize={true}
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
            const {touched, errors,setFieldValue, handleSubmit, handleChange, handleBlur,values} = formProps;
            return(   
                <div className='p-3'>
                    <pre>{JSON.stringify()}</pre>
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
                                                    placeholder="Enter street name"
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
                                                    placeholder="Enter suburb"
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
                                            isInvalid={touched.to && errors.to}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.to}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            {/* Receiver Information */}
                            <h4 className="my-3">Receiver</h4>
                            <Row>
                                <Col>
                                    <Form.Group>
                                        <div className='mb-2'>
                                            <Form.Label className='label'>Receiver Name</Form.Label>
                                        </div>
                                        <Form.Control
                                            type="text"
                                            name="receiverName"
                                            placeholder=""
                                            isInvalid={touched.receiverName && !!errors?.receiverName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors?.receiverName}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <div className='mb-2'>
                                            <Form.Label className='label'>Receiver Phone</Form.Label>
                                        </div>
                                        <Form.Control
                                            type="text"
                                            name="receiverPhone"
                                            placeholder=""
                                            isInvalid={touched.receiverPhone && !!errors?.receiverPhone}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors?.receiverPhone}</Form.Control.Feedback>
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
                                            return <ItemCreation key={index} index={index} {...formProps}></ItemCreation>
                                        })}
                                    </>
                                }}
                            />
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