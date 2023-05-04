import Dropdown from 'react-bootstrap/Dropdown';
import React, { useContext } from 'react'
import { Formik } from "formik";
import * as yup from 'yup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Sidebar } from '../../../layout';
import { AuthContext } from '../../../stores';
import { serialize } from 'object-to-formdata';

const PERMIT_FILE_FORMATS = ['image/jpeg', 'image/png', 'image/jpg'];

let registerSchema = yup.object().shape({
    fullName: yup.string().required("Full Name is required field"),
    ABNNumber: yup.number().typeError("ABN Number must be number").required("ABN Number is required field"),
    gender: yup.string().required("Gender is required field"),
    ABNNumberImage: yup
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
    adInfo: yup.string().required("Additional information is required field"),  
});

function DashBoardSender() {
    const [_,{signupSender}] = useContext(AuthContext);
    return (
        <Formik
            initialValues={{
                fullName:'',
                ABNNumber:'',
                gender: '',
                ABNNumberImage: null,
                adInfo:'',
            }}
                
            validationSchema={registerSchema}
            onSubmit={values =>{
                const formData = serialize(values);
                signupSender(formData);
            }}
        >
        {({values,touched, errors,isValid,setFieldValue, handleSubmit, handleChange, handleBlur}) =>{
            return(
                <>   
                    <h3 className='ui-header p-2'>Become Sender</h3>
                    <div className='container p-5'>
                        <Form className='form' onSubmit={handleSubmit}>
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
                                    name="ABNNumber"
                                    placeholder="Enter Your Full Address"
                                    isInvalid={touched.ABNNumber && !!errors?.ABNNumber}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <Form.Control.Feedback type="invalid">{errors?.ABNNumber}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="form-group" >
                                <div className='mb-2'>
                                    <Form.Label className='label'>Image ABNnumber</Form.Label>
                                    <p className='asterisk'>*</p>
                                </div>
                                <Form.Control
                                    type="file"
                                    name="ABNNumberImage"
                                    placeholder="Enter Your Full Address"
                                    isInvalid={touched.address && errors.address}
                                    onChange={(e) =>{
                                        const file = e.target.files[0];
                                        setFieldValue(e.target.name, file, true);
                                    }}
                                    onBlur={handleBlur}
                                />
                                <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="form-group" >
                                <div className='mb-2'>
                                    <Form.Label className='label'>Gender</Form.Label>
                                    <p className='asterisk'>*</p>
                                </div>
                                <Form.Select name="gender" onChange={handleChange}>
                                    <option>Select your gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="form-group" >
                                <div className='mb-2'>
                                    <Form.Label className='label'>Additional Information</Form.Label>
                                    <p className='asterisk'>*</p>
                                </div>
                                <Form.Control
                                    type="text"
                                    name="adInfo"
                                    style={{background:'#fafafa'}}
                                    as="textarea" rows={3}
                                    placeholder="Enter Your Additional Information"
                                    isInvalid={touched.adInfo && errors.adInfo}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <Form.Control.Feedback type="invalid">{errors.adInfo}</Form.Control.Feedback>
                            </Form.Group>
                            <Button variant="warning" type="submit" disabled={!isValid} className='my-btn-yellow'>Register</Button>
                        </Form>
                    </div>
                </>
        )}}
        </Formik>
    )
}
// function DropDownGender() {
//     const [state,setState] = React.useState(true);

//     return (
//         <Dropdown className='reg-dr'>
//         <Dropdown.Toggle className='dr-btn' id="dropdown-basic">
//             {state === true ? "Male" : "Female"}
//         </Dropdown.Toggle>

//         <Dropdown.Menu className='w-100'>
//             <Dropdown.Item onClick={()=>setState(true)}>Male</Dropdown.Item>
//             <Dropdown.Item onClick={() => setState(false)}>Female</Dropdown.Item>
//         </Dropdown.Menu>
//         </Dropdown>
//     );
// }
export default function Index(){
    return(
            <DashBoardSender></DashBoardSender>
    )
}

