import '../style/registerUser.css';
import React, { useContext } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import Form from 'react-bootstrap/Form';
import '../../register driver/style/registerDriver.css';
import Button from 'react-bootstrap/Button';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { AuthContext, taskStatus } from '../../../stores';
import { CustomSpinner, Message } from '../../../layout';
import { authConstraints, config } from '../../../api';
import { useNavigate, useNavigation } from 'react-router-dom';
import { Col, Modal, Row, Spinner } from 'react-bootstrap';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

let registerSchema = yup.object().shape({
    name: yup.string().required('Full name is specific'),
    userName: yup
        .string()
        .required('User Name is required field')
        .matches(/^(?!\s+$).*/, 'User name field contain only blankspaces'),
    phone: yup.string().typeError('Phone Number must be number').required('Phone Number is required field'),
    email: yup.string().email().required('Email is required field'),
    address: yup.string().required('Full Address is required field'),
    password: yup
        .string()
        .required('This field is requied')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
        ),
    confirmPassword: yup
        .string()
        .required('This field is requied')
        .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

export default function Index() {
    const [authState, { signupUser }] = useContext(AuthContext);

    const [showPass, setShowPass] = React.useState(false);
    const [showPassConfirm, setShowPassConfirm] = React.useState(false);
    const [phoneError, setPhoneError] = React.useState('');
    const [modal, setModal] = React.useState(false);

    const navigate = useNavigate();

    const showPassHandler = () => {
        setShowPass((e) => !e);
    };

    const showPassConfirmHandler = () => {
        setShowPassConfirm((e) => !e);
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    React.useEffect(() => {
        if (authState?.errors) {
            scrollToTop();
        }
    }, [authState?.errors]);

    return (
        <Formik
            initialValues={{
                name: '',
                userName: '',
                email: '',
                password: '',
                confirmPassword: '',
                phone: '',
                address: '',
                abn: null,
            }}
            validationSchema={registerSchema}
            enableReinitialize
            onSubmit={(values) => {
                signupUser(
                    values,
                    `${window.location.protocol}//${window.location.host}${config.AccountConfirmationURL}`,
                    () => {
                        navigate('/auth/register/confirm');
                    },
                );
            }}
        >
            {({ values, touched, errors, isValid, setFieldValue, handleSubmit, handleChange, handleBlur }) => {
                const isLoading =
                    !!authState?.tasks?.hasOwnProperty(authConstraints.signupUser) &&
                    authState?.tasks?.[authConstraints.signupUser] === taskStatus.Inprogress;
                return (
                    <div className="reg-user">
                        <div className="container p-sm-1 p-lg-5 mb-5">
                            <div>
                                {/* <h3 className="reg-header txt-center">Register</h3>
                                <h4 className="reg-txt-u txt-center">Get started with Us</h4>
                                <p className="txt-center m-0">Register a new membership.</p> */}
                                <h3 className="reg-header txt-center" style={{ textTransform: 'uppercase' }}>
                                    Become a sender
                                </h3>
                                <h4 className="reg-txt-u txt-center">Register now.</h4>
                            </div>
                            {isLoading && <CustomSpinner></CustomSpinner>}
                            <Form className="form" onSubmit={handleSubmit}>
                                {!!authState?.errors?.length && (
                                    <>
                                        {authState?.errors?.map((error, idx) => (
                                            <Message.Error key={idx}>
                                                <>{error}</>
                                            </Message.Error>
                                        ))}
                                    </>
                                )}

                                <Form.Group className="form-group">
                                    <div className="mb-2">
                                        <Form.Label className="label">Full name</Form.Label>
                                        <p className="asterisk">*</p>
                                    </div>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        placeholder="Enter Full Name"
                                        isInvalid={touched.name && errors.name}
                                        value={values.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="form-group">
                                    <div className="mb-2">
                                        <Form.Label className="label">User name</Form.Label>
                                        <p className="asterisk">*</p>
                                    </div>
                                    <Form.Control
                                        type="text"
                                        name="userName"
                                        placeholder="Enter User Name"
                                        isInvalid={touched.userName && errors.userName}
                                        value={values.userName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.userName}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="form-group">
                                    <div className="mb-2">
                                        <Form.Label className="label">Email</Form.Label>
                                        <p className="asterisk">*</p>
                                    </div>
                                    <Form.Control
                                        type="text"
                                        name="email"
                                        placeholder="Enter Your Email"
                                        isInvalid={touched.email && errors.email}
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="form-group">
                                    <div className="mb-2">
                                        <Form.Label className="label">Password</Form.Label>
                                        <p className="asterisk">*</p>
                                    </div>
                                    <div className="frame-pass">
                                        <Form.Control
                                            type={showPass ? 'text' : 'password'}
                                            isInvalid={touched.password && errors.password}
                                            value={values.password}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="Enter Your Password"
                                            name="password"
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                                        <div className="override-block"></div>
                                        <div className="eyes-pass">
                                            {showPass ? (
                                                <AiFillEye onClick={showPassHandler}></AiFillEye>
                                            ) : (
                                                <AiFillEyeInvisible onClick={showPassHandler}></AiFillEyeInvisible>
                                            )}
                                        </div>
                                    </div>
                                </Form.Group>

                                <Form.Group className="form-group">
                                    <div className="mb-2">
                                        <Form.Label className="label">Confirm Password</Form.Label>
                                        <p className="asterisk">*</p>
                                    </div>
                                    <div className="frame-pass">
                                        <Form.Control
                                            type={showPassConfirm ? 'text' : 'password'}
                                            name="confirmPassword"
                                            placeholder="Enter Password Again"
                                            isInvalid={touched.confirmPassword && errors.confirmPassword}
                                            value={values.confirmPassword}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.confirmPassword}
                                        </Form.Control.Feedback>
                                        <div className="override-block"></div>
                                        <div className="eyes-pass">
                                            {showPassConfirm ? (
                                                <AiFillEye onClick={showPassConfirmHandler}></AiFillEye>
                                            ) : (
                                                <AiFillEyeInvisible
                                                    onClick={showPassConfirmHandler}
                                                ></AiFillEyeInvisible>
                                            )}
                                        </div>
                                    </div>
                                </Form.Group>
                                {/* Phone */}
                                <Form.Group className="form-group mb-2">
                                    <div className="mb-2">
                                        <Form.Label className="label">Phone Number</Form.Label>
                                        <p className="asterisk">*</p>
                                    </div>
                                    <PhoneInput
                                        containerClass="w-100"
                                        inputClass="w-100"
                                        country={'au'}
                                        value={values?.phone}
                                        onChange={(phone) => setFieldValue('phone', phone)}
                                        onlyCountries={config.PhoneCountries}
                                        preferredCountries={['au']}
                                        placeholder="Enter Your Phone number"
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
                                        name="phone"
                                        defaultValue={values?.phone}
                                        isInvalid={!!errors.phone || !!phoneError}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.phone || phoneError}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                {/* <Form.Group className="form-group" >
                <div className='mb-2'>
                    <Form.Label className='label'>Phone Number</Form.Label>
                    <p className='asterisk'>*</p>
                </div>
                <Form.Control
                    type="text"
                    name="phone"
                    placeholder="Enter Your Phone Number"
                    isInvalid={touched.phone && errors.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
            </Form.Group> */}
                                <Form.Group className="form-group">
                                    <div className="mb-2">
                                        <Form.Label className="label">Address</Form.Label>
                                        <p className="asterisk">*</p>
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

                                <Form.Group className="form-group">
                                    <div className="mb-2">
                                        <Form.Label className="label">ABN</Form.Label>
                                    </div>
                                    <Form.Control
                                        type="number"
                                        name="abn"
                                        placeholder="Enter Your ABN"
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Row>
                                    <Col sm="auto">
                                        <Button
                                            type="submit"
                                            variant="warning"
                                            className="my-btn-yellow w-100"
                                            disabled={authState?.authLoading || isLoading || !isValid || !!phoneError}
                                        >
                                            {authState?.authLoading || isLoading ? (
                                                <Row style={{ alignItems: 'center' }}>
                                                    <Col sm="auto" style={{ padding: 0 }}>
                                                        <Spinner className="me-2"></Spinner>
                                                    </Col>
                                                    <Col style={{ padding: 0 }}>Submitting...</Col>
                                                </Row>
                                            ) : (
                                                'Submit'
                                            )}
                                        </Button>
                                    </Col>
                                    <Col sm="auto">
                                        <Button
                                            variant="warning"
                                            className="my-btn-yellow"
                                            onClick={() => setModal(true)}
                                        >
                                            Watch tutorial
                                        </Button>
                                    </Col>
                                </Row>
                                <Modal show={modal} size="lg" onHide={() => setModal(false)}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Tutorial Video</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <section>
                                            <iframe
                                                width="100%"
                                                height="520"
                                                src="https://www.youtube.com/embed/6jQ3dMAr6zs"
                                                title="YouTube video player"
                                                frameborder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                allowfullscreen
                                            ></iframe>
                                        </section>
                                    </Modal.Body>
                                </Modal>
                            </Form>
                        </div>
                    </div>
                );
            }}
        </Formik>
    );
}
