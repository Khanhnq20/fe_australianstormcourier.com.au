import React from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { AuthContext } from '../../../stores';
import { Col, Container, Modal, Row, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../style/userInformation.css';
import PhoneInput from 'react-phone-input-2';
import { authConstraints, authInstance, config } from '../../../api';
import { toast } from 'react-toastify';
import { CustomSpinner } from '../../../layout';

let registerSchema = yup.object().shape({
    fullName: yup.string().required('Full Name is required field'),
    userName: yup.string().required('User Name is required field'),
    phoneNumber: yup.string().typeError('Phone Number must be number').required('Phone Number is required field'),
    email: yup.string().email().required('Email is required field'),
    address: yup.string().required('Full Address is required field'),
});

function UserInformation() {
    const [authState, { updateProfile }] = React.useContext(AuthContext);
    const [phoneError, setPhoneError] = React.useState('');
    const [showPhoneVerification, setShowPhoneVerification] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    function sendPhoneDigit() {
        setLoading(true);
        authInstance
            .get([authConstraints.root, authConstraints.sendPhoneDigit].join('/'), {
                headers: {
                    Authorization: [config.AuthenticationSchema, localStorage.getItem(authConstraints.LOCAL_KEY)].join(
                        ' ',
                    ),
                },
            })
            .then((response) => {
                if (response.data?.successed) {
                    toast.success('Check your whatsapp to receive confirmation digit');
                    setLoading(false);
                } else {
                    toast.error('Failed');
                    setLoading(false);
                }
            })
            .catch((error) => {
                toast.error(error.message);
                setLoading(false);
            });
    }

    function confirmPhone(digit) {
        setLoading(true);
        authInstance
            .get([authConstraints.root, authConstraints.verifiedPhone].join('/'), {
                headers: {
                    Authorization: [config.AuthenticationSchema, localStorage.getItem(authConstraints.LOCAL_KEY)].join(
                        ' ',
                    ),
                },
                params: {
                    digit,
                },
            })
            .then((response) => {
                if (response.data?.successed) {
                    toast.success('Your account has been confirmed phone');
                    setLoading(false);
                } else {
                    toast.error('Failed');
                    setLoading(false);
                }
            })
            .catch((error) => {
                toast.error(error.message);
                setLoading(false);
            });
    }

    return (
        <Row className="p-3 p-lg-3">
            <Col>
                <h3 className="ui-header">Information</h3>
                <div className="py-lg-3">
                    <div className="product-label-info">
                        <p className="product-label">Full Name</p>
                        <p className="product-content">{authState?.accountInfo?.name}</p>
                    </div>
                    <div className="product-label-info">
                        <p className="product-label">User name</p>
                        <p className="product-content">{authState?.accountInfo?.username}</p>
                    </div>
                    <div className="product-label-info">
                        <p className="product-label">Email</p>
                        <p className="product-content">{authState?.accountInfo?.email}</p>
                    </div>
                    <div className="product-label-info">
                        <p className="product-label">Phone number</p>
                        <p className="product-content">{authState?.accountInfo?.phoneNumber}</p>
                    </div>
                    <div className="product-label-info">
                        <p className="product-label">Confirmed phone number</p>
                        <p className="product-content">
                            {authState?.accountInfo?.phoneNumberConfirmed ? (
                                <span>Confirmed</span>
                            ) : (
                                <Button
                                    variant="success"
                                    onClick={() => {
                                        setShowPhoneVerification(true);
                                    }}
                                >
                                    Not confirmed
                                </Button>
                            )}
                        </p>
                        <Modal show={showPhoneVerification} onHide={() => setShowPhoneVerification(false)}>
                            <Modal.Header closeButton></Modal.Header>
                            <Modal.Body style={{ minHeight: '200px' }}>
                                {loading ? (
                                    <Spinner></Spinner>
                                ) : (
                                    <div>
                                        <Row>
                                            <Col>
                                                <b>Step 1:</b>
                                            </Col>
                                            <Col>
                                                <p>
                                                    Download{' '}
                                                    <a href="https://www.whatsapp.com/download" target="_blank">
                                                        Whatsapp
                                                    </a>{' '}
                                                    on your phone
                                                </p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <b>Step 2:</b>
                                            </Col>
                                            <Col>
                                                <p>
                                                    <b>Signin</b> with your phone number
                                                </p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <b>Step 3:</b>
                                            </Col>
                                            <Col>
                                                <p>
                                                    Check new message and copy 6-digit code. Return website and paste{' '}
                                                    <b>code</b> to the below
                                                </p>
                                                <img src=""></img>
                                                <Formik
                                                    initialValues={{
                                                        digit: '',
                                                    }}
                                                    onSubmit={(value) => {
                                                        confirmPhone(value?.digit);
                                                    }}
                                                >
                                                    {({ handleChange, handleSubmit, values }) => (
                                                        <Form onSubmit={handleSubmit}>
                                                            <Form.Group>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="digit"
                                                                    value={values.digit}
                                                                    className="mb-2"
                                                                    onChange={handleChange}
                                                                ></Form.Control>
                                                                <Button variant="success" type="submit">
                                                                    Send
                                                                </Button>
                                                            </Form.Group>
                                                        </Form>
                                                    )}
                                                </Formik>
                                                <div>
                                                    if you are not receiving any code?{' '}
                                                    <Button
                                                        variant="primary"
                                                        className="me-2"
                                                        onClick={() => sendPhoneDigit()}
                                                    >
                                                        Resend code
                                                    </Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                )}
                            </Modal.Body>
                        </Modal>
                    </div>
                    <div className="product-label-info">
                        <p className="product-label">Address</p>
                        <p className="product-content">{authState?.accountInfo?.address}</p>
                    </div>
                    <div className="product-label-info">
                        <p className="product-label">ABN Number</p>
                        <p className="product-content">{authState?.accountInfo?.abnNumber || <Link>_blank</Link>}</p>
                    </div>
                    <div className="product-label-info">
                        <p className="product-label">Authorized account type</p>
                        <p className="product-content">{authState?.accountInfo?.roles?.[0]}</p>
                    </div>
                </div>
            </Col>
            <Col>
                <h3 className="ui-header">Edit Information</h3>
                <div className="py-lg-3">
                    <Formik
                        initialValues={{
                            id: authState?.accountInfo?.id || '',
                            fullName: authState?.accountInfo?.name || '',
                            userName: authState?.accountInfo?.username || '',
                            email: authState?.accountInfo?.email || '',
                            phoneNumber: authState?.accountInfo?.phoneNumber || '',
                            address: authState?.accountInfo?.address || '',
                        }}
                        validationSchema={registerSchema}
                        enableReinitialize={true}
                        onSubmit={(values) => {
                            updateProfile(
                                {
                                    fullName: values.fullName,
                                    userName: values.userName,
                                    phoneNumber: values.phoneNumber,
                                    address: values.address,
                                },
                                values.id,
                            );
                        }}
                    >
                        {({ touched, errors, setFieldValue, handleSubmit, handleChange, handleBlur, values }) => {
                            return (
                                <>
                                    <Form style={{ margin: 0, maxWidth: '700px' }} onSubmit={handleSubmit}>
                                        <Form.Group className="form-group">
                                            <div className="mb-2">
                                                <Form.Label className="label">Full name</Form.Label>
                                                <p className="asterisk">*</p>
                                            </div>
                                            <Form.Control
                                                type="text"
                                                name="fullName"
                                                placeholder="Enter Your Full Name"
                                                value={values.fullName}
                                                isInvalid={touched.userName && errors.userName}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.userName}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group className="form-group">
                                            <div className="mb-2">
                                                <Form.Label className="label">User name</Form.Label>
                                                <p className="asterisk">*</p>
                                            </div>
                                            <Form.Control
                                                type="text"
                                                name="userName"
                                                placeholder="Enter Your User Name"
                                                value={values.userName}
                                                isInvalid={touched.userName && errors.userName}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.userName}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group className="form-group">
                                            <div className="mb-2">
                                                <Form.Label className="label">Email</Form.Label>
                                                <p className="asterisk">*</p>
                                            </div>
                                            <Form.Control
                                                type="text"
                                                name="email"
                                                disabled
                                                value={values.email}
                                                className="ui-email-input"
                                                placeholder="Enter Your Email"
                                                isInvalid={touched.email && errors.email}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                        </Form.Group>
                                        {/* Phone */}
                                        <Form.Group>
                                            <div className="mb-2">
                                                <Form.Label className="label">Phone Number</Form.Label>
                                                <p className="asterisk">*</p>
                                            </div>
                                            <PhoneInput
                                                containerClass="w-100"
                                                inputClass="w-100"
                                                country={'au'}
                                                value={values?.phoneNumber}
                                                onChange={(phone) => setFieldValue('phoneNumber', phone)}
                                                onlyCountries={['au', 'vn']}
                                                preferredCountries={['au']}
                                                placeholder="Enter your phone"
                                                autoFormat={true}
                                                isValid={(inputNumber, _, countries) => {
                                                    const isValid = countries.some((country) => {
                                                        return (
                                                            inputNumber.startsWith(country.dialCode) ||
                                                            country.dialCode.startsWith(inputNumber)
                                                        );
                                                    });

                                                    setPhoneError('');

                                                    if (!isValid) {
                                                        setPhoneError('Your phone is not match with dial code');
                                                    }

                                                    return isValid;
                                                }}
                                            ></PhoneInput>
                                            <Form.Control
                                                type="hidden"
                                                name="phoneNumber"
                                                defaultValue={values?.phoneNumber}
                                                isInvalid={!!errors?.phoneNumber || !!phoneError}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors?.phoneNumber || phoneError}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group className="form-group">
                                            <div className="mb-2">
                                                <Form.Label className="label">Address</Form.Label>
                                                <p className="asterisk">*</p>
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
                                            <Form.Control.Feedback type="invalid">
                                                {errors.address}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Button variant="warning" type="submit" className="my-btn-yellow">
                                            Update
                                        </Button>
                                    </Form>
                                </>
                            );
                        }}
                    </Formik>
                </div>
            </Col>
        </Row>
    );
}

export default function Index() {
    return (
        <div>
            <UserInformation></UserInformation>
        </div>
    );
}
