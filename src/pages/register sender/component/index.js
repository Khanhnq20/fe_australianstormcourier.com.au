import Dropdown from 'react-bootstrap/Dropdown';
import React from 'react'
import { Formik } from "formik";
import * as yup from 'yup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Sidebar } from '../../../layout';


let registerSchema = yup.object().shape({
    fullName: yup.string().required("Full Name is required field"),
    abnNumber: yup.number().typeError("Phone Number must be number").required("Phone Number is required field"),
    additional: yup.string().email().required("Additional information is required field"),  
})
function DashBoardSender() {
  return (

    <Formik
    initialValues={{
        fullName:'',
        abnNumber:'',
        additional:'',
        gender:0
        }}
        
    validationSchema={registerSchema}
    >
    {({touched, errors, handleSubmit, handleChange, handleBlur}) =>{
        return(
            <>   
                <h3 className='ui-header p-2'>Become Sender</h3>
                <div className='container p-5'>
                    <div>
                        <Form className='form'>
                            <Form.Group className="form-group" >
                                    <div className='mb-2'>
                                        <Form.Label className='label'>Full name</Form.Label>
                                        <p className='asterisk'>*</p>
                                    </div>
                                    <Form.Control
                                        type="text"
                                        name="fullName"
                                        placeholder="Enter Your Full Name"
                                        isInvalid={touched.userName && errors.userName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.userName}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="form-group" >
                                <div className='mb-2'>
                                    <Form.Label className='label'>ABNnumber</Form.Label>
                                    <p className='asterisk'>*</p>
                                </div>
                                <Form.Control
                                    type="text"
                                    name="abnNumber"
                                    placeholder="Enter Your Full Address"
                                    isInvalid={touched.phoneNumber && errors.phoneNumber}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <Form.Control.Feedback type="invalid">{errors.phoneNumber}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="form-group" >
                                <div className='mb-2'>
                                    <Form.Label className='label'>Image ABNnumber</Form.Label>
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
                                    <Form.Label className='label'>Gender</Form.Label>
                                    <p className='asterisk'>*</p>
                                </div>
                                <DropDownGender></DropDownGender>
                            </Form.Group>
                            <Form.Group className="form-group" >
                                <div className='mb-2'>
                                    <Form.Label className='label'>Additional Information</Form.Label>
                                    <p className='asterisk'>*</p>
                                </div>
                                <Form.Control
                                    type="text"
                                    name="additional"
                                    style={{background:'#fafafa'}}
                                    as="textarea" rows={3}
                                    placeholder="Enter Your Additional Information"
                                    isInvalid={touched.city && errors.city}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
                            </Form.Group>
                            <Button variant="warning" className='my-btn-yellow'>Register</Button>
                        </Form>
                    </div>
                </div>
            </>
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
            <DashBoardSender></DashBoardSender>
    )
}

