import React, { useContext, useRef } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Formik } from "formik";
import * as yup from 'yup';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import { AuthContext } from '../../../stores';
import { Link } from 'react-router-dom';


let updateDriverSchema = yup.object().shape({
    fullName: yup.string().required("Full Name is required field"),
    address: yup.string().required("Full Address is required field"),   
    city: yup.string().required("City is required field"),
    zipCode: yup.number().typeError("Zip code must be number").required("Zip code is required field"),
});

function UpdateDriver() {
    const [authState,{updateDriverProfile}] = useContext(AuthContext);

    return (
        <Formik
            initialValues={{
                fullName:authState?.accountInfo?.name,
                userName: authState?.accountInfo?.username,
                phone: authState?.accountInfo?.phoneNumber,
                address: authState?.accountInfo?.address,
                zipCode: authState?.accountInfo?.zipCode,
                city: authState?.accountInfo?.city,
                vehicles: [],
                addInfo: ""
            }}
                
            validationSchema={updateDriverSchema}
            onSubmit={(values) =>{
                updateDriverProfile(values);
            }}
        >
        {({values, touched, errors, handleSubmit, handleChange, handleBlur,isValid}) =>{
            return( 
                <div className='container py-sm-3 py-lg-5'>
                    <Row>
                        <Col>
                            <h3 className='ui-header'>Information</h3>
                            <div style={{padding:'35px'}}>
                                {/* Full Name */}
                                <div className='product-label-info'>
                                    <p className='product-label'>
                                        Full Name
                                    </p>
                                    <p className='product-content'>
                                        {authState?.accountInfo?.name}
                                    </p>
                                </div>
                                <div className='product-label-info'>
                                    <p className='product-label'>
                                        User name
                                    </p>
                                    <p className='product-content'>
                                        {authState?.accountInfo?.username}
                                    </p>
                                </div>
                                <div className='product-label-info'>
                                    <p className='product-label'>
                                        Email
                                    </p>
                                    <p className='product-content'>
                                        {authState?.accountInfo?.email}
                                    </p>
                                </div>
                                <div className='product-label-info'>
                                    <p className='product-label'>
                                        Phone number
                                    </p>
                                    <p className='product-content'>
                                    {authState?.accountInfo?.phoneNumber}
                                    </p>
                                </div>
                                <div className='product-label-info'>
                                    <p className='product-label'>
                                        Confirmed phone number
                                    </p>
                                    <p className='product-content'>
                                        {authState?.accountInfo?.phoneNumberConfirmed ? <span>Confirmed</span> : <span>Not confirmed</span>}
                                    </p>
                                </div>
                                <div className='product-label-info'>
                                    <p className='product-label'>
                                        Address
                                    </p>
                                    <p className='product-content'>
                                        {authState?.accountInfo?.address}
                                    </p>
                                </div>
                                <div className='product-label-info'>
                                    <p className='product-label'>
                                        ABN Number
                                    </p>
                                    <p className='product-content'>
                                        {authState?.accountInfo?.abnNumber || <Link>Not yet</Link>}
                                    </p>
                                </div>
                                <div className='product-label-info'>
                                    <p className='product-label'>
                                        Authorized account type
                                    </p>
                                    <p className='product-content'>
                                        {authState?.accountInfo?.roles?.[0]}
                                    </p>
                                </div>
                                <div className='product-label-info' style={{alignItems: 'flex-start'}}>
                                    <p className='product-label'>
                                        BSB
                                    </p>
                                    <p className='product-content'>
                                        {authState?.accountInfo?.bsb}
                                    </p>
                                </div>
                                <div className='product-label-info' style={{alignItems: 'flex-start'}}>
                                    <p className='product-label'>
                                        Vehicles
                                    </p>
                                    <Row>
                                        {authState?.accountInfo?.vehicles?.map(vehicle =>{
                                            return (<Col sm="auto">
                                                <p className='product-content'>
                                                    {vehicle}
                                                </p>
                                            </Col>)
                                        })}
                                    </Row>
                                </div>
                                <div className='product-label-info' style={{alignItems: 'flex-start'}}>
                                    <p className='product-label'>
                                        Front Driving Liense
                                    </p>
                                    <p className='product-content'  >
                                        <div style={{maxWidth: '320px'}}>
                                            <img style={{width: "100%"}} src={authState?.accountInfo?.frontDrivingLiense}></img>
                                        </div>
                                    </p>
                                </div>
                                <div className='product-label-info' style={{alignItems: 'flex-start'}}>
                                    <p className='product-label'>
                                        Back Driving Liense
                                    </p>
                                    <p className='product-content'>
                                        <div style={{maxWidth: '320px'}}>
                                            <img style={{width: "100%"}} src={authState?.accountInfo?.backDrivingLiense}></img>
                                        </div>
                                    </p>
                                </div>
                            </div>   
                        </Col>
                        <Col>
                            <h3 className='ui-header'>Edit Driver</h3>
                            <Form className='reg-form' onSubmit={handleSubmit}>
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
                                        value={values.fullName}
                                        isInvalid={touched.fullName && !!errors?.fullName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors?.fullName}</Form.Control.Feedback>
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
                                        placeholder="Enter Your Phone Number"
                                        value={values.phone}
                                        isInvalid={touched.phone && !!errors?.phone}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <Form.Control.Feedback type="invalid">{!!errors?.phone}</Form.Control.Feedback>
                                </Form.Group>
                                {/* Address */}
                                <Form.Group className="form-group" >
                                    <div className='mb-2'>
                                        <Form.Label className='label'>Address</Form.Label>
                                        <p className='asterisk'>*</p>
                                    </div>
                                    <Form.Control
                                        type="text"
                                        name="address"
                                        placeholder="Enter Your Full Address"
                                        value={values.address}
                                        isInvalid={touched.address && errors.address}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                                </Form.Group>
                                {/* City */}
                                <Form.Group className="form-group" >
                                    <div className='mb-2'>
                                        <Form.Label className='label'>City</Form.Label>
                                        <p className='asterisk'>*</p>
                                    </div>
                                    <Form.Control
                                        type="text"
                                        name="city"
                                        placeholder="Enter Your Full Address"
                                        value={values.city}
                                        isInvalid={touched.city && errors.city}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
                                </Form.Group>
                                {/* Zipcode */}
                                <Form.Group className="form-group" >
                                    <div className='mb-2'>
                                        <Form.Label className='label'>Zip code</Form.Label>
                                        <p className='asterisk'>*</p>
                                    </div>
                                    <Form.Control
                                        type="text"
                                        name="zipCode"
                                        placeholder="Enter Your Zipcode"
                                        value={values.zipCode}
                                        isInvalid={touched.zipCode && errors.zipCode}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.zipCode}</Form.Control.Feedback>
                                </Form.Group>
                                {/* ABN Number */}
                                <Form.Group className="form-group" >
                                    <div className='mb-2'>
                                        <Form.Label className='label'>ABN Number</Form.Label>
                                        <p className='asterisk'>*</p>
                                    </div>
                                    <Form.Control
                                        type="text"
                                        name="abnNumber"
                                        placeholder="Enter Your ABN Number"
                                        value={values.abnNumber}
                                        isInvalid={touched.abnNumber && !!errors?.abnNumber}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors?.abnNumber}</Form.Control.Feedback>
                                </Form.Group>
                                {/* Vehicles */}
                                <Form.Group className="form-group" >
                                    <div className='mb-2'>
                                        <Form.Label className='label'>Vehicles</Form.Label>
                                        <p className='asterisk'>*</p>
                                    </div>
                                    <div className='list-vehicle'>
                                        {authState?.vehicles?.map?.((item,index) => {
                                            return(
                                                <div key={index}>
                                                    <label class="fr-checkbox mb-2">
                                                        <input type="checkbox" checked={authState?.accountInfo?.vehicles?.includes?.(item?.name)}/>
                                                        <span className="checkmark"></span>
                                                        <span className='txt-checkbox' style={{fontWeight:'500'}}>{item?.name}</span>
                                                    </label>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </Form.Group>
                                {/* Additional Information */}
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
                                        isInvalid={touched.addInfo && !!errors?.addInfo}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.addInfo}</Form.Control.Feedback>
                                </Form.Group>

                                <Button type="submit" variant="warning" 
                                    disabled={!isValid} 
                                    style={{backgroundColor:"#f2a13b",border:'none'}} 
                                    className='my-btn-yellow my-2'>Send your updates</Button>
                            </Form>
                        </Col>
                    </Row>
                </div>
        )}}
        </Formik>
    )
}

export default function Index(){
    return(
        <UpdateDriver></UpdateDriver>
    )
}