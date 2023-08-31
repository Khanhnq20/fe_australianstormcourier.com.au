import React, { useContext, useRef } from 'react';
import { Row, Col, Form, Button, Spinner, FloatingLabel, Modal } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';
import '../style/registerDriver.css';
import { AuthContext, taskStatus } from '../../../stores';
import { serialize } from 'object-to-formdata';
import { Popover } from 'react-tiny-popover';

import { RiImageEditFill } from 'react-icons/ri';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { VscFilePdf } from 'react-icons/vsc';
import { CustomSpinner, Message } from '../../../layout';
import { authConstraints, config } from '../../../api';
import { GrDocumentPdf } from 'react-icons/gr';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import ScrollToTop from 'react-scroll-to-top';
import { BsFillArrowUpSquareFill } from 'react-icons/bs';
import { BiInfoCircle } from 'react-icons/bi';
import { FaWhatsapp } from 'react-icons/fa';
import { stateOptions } from '../..';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
const PERMIT_FILE_FORMATS = ['image/jpeg', 'image/png', 'image/jpg'];

let registerSchema = yup.object().shape({
    userName: yup.string().required('User Name is required field'),
    phone: yup.string().required('Phone Number is required field'),
    email: yup.string().email().required('Email is required field'),
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
    fullName: yup.string().required('Full Name is required field'),
    ABNNumber: yup.number().typeError('ABN must be number').nullable(),
    businessName: yup.string().nullable(),
    address: yup.string().required('Full Address is required field'),
    city: yup.string().required('State is required field'),
    postCode: yup.number().typeError('Zip code must be number').required('Zip code is required field'),
    vehicles: yup.array().min(1, 'Select one vehicle to complete the registry'),
    adInfo: yup.string().nullable(),
    bsb: yup.string().required('You should specify this field to create transactions with user'),
    accountName: yup.string().required('Account Name is required field'),
    accountNumber: yup.string().required('Account Number is required field'),
    isAusDrivingLiense: yup.boolean().default(false),
    frontDrivingLiense: yup
        .mixed()
        .nullable()
        .required('Front Driving License is required field')
        .test('FILE SIZE', 'the file is too large', (value) => {
            if (!value) {
                return true;
            }

            return value.size <= 2 * 1024 * 1024;
        })
        .test('FILE FORMAT', `the file format should be ${PERMIT_FILE_FORMATS.join()}`, (value) => {
            if (!value) {
                return true;
            }
            return PERMIT_FILE_FORMATS.includes(value.type);
        }),
    backDrivingLiense: yup
        .mixed()
        .nullable()
        .required('Back Driving License is required field')
        .test('FILE SIZE', 'the file is too large', (value) => {
            if (!value) {
                return true;
            }

            return value.size <= 2 * 1024 * 1024;
        })
        .test('FILE FORMAT', `the file format should be ${PERMIT_FILE_FORMATS.join()}`, (value) => {
            if (!value) {
                return true;
            }
            return PERMIT_FILE_FORMATS.includes(value.type);
        }),
    drivingCertificate: yup
        .mixed()
        .required('Driving Certificate is required field')
        .when('isAusDrivingLiense', {
            is: (isAusDrivingLiense) => {
                return !isAusDrivingLiense;
            },
            then: (schema) => {
                return schema
                    .required()
                    .test('FILE SIZE', 'the file is too large', (value) => {
                        if (!value) {
                            return true;
                        }

                        return value.size <= 5 * 1024 * 1024;
                    })
                    .test('FILE FORMAT', `the file format should be pdf`, (value) => {
                        if (!value) {
                            return true;
                        }
                        return value.type === 'application/pdf';
                    });
            },
            otherwise: (schema) => {
                return schema.notRequired();
            },
        }),
});

function RegisterDriver() {
    const [{ vehicles, loading: authLoading, ...authState }, { signupDriver }] = useContext(AuthContext);
    const navigate = useNavigate();
    const f_driver_img_ipt = useRef();
    const b_driver_img_ipt = useRef();
    const d_certificate = useRef();
    const [imgUrlFront, setImgUrlFront] = React.useState();
    const [imgUrlBack, setImgUrlBack] = React.useState();
    const [pdf, setPdf] = React.useState();
    const [showPass, setShowPass] = React.useState(false);
    const [showPassConfirm, setShowPassConfirm] = React.useState(false);
    const [next, setNext] = React.useState(true);
    const [phoneError, setPhoneError] = React.useState('');
    const [phonePopOver, setPhonePopOver] = React.useState(false);
    const [modal, setModal] = React.useState(false);

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
                userName: '',
                phone: '',
                email: '',
                password: '',
                confirmPassword: '',
                fullName: '',
                ABNNumber: '',
                businessName: '',
                address: '',
                city: '',
                postCode: 0,
                frontDrivingLiense: null,
                backDrivingLiense: null,
                drivingCertificate: null,
                isAusDrivingLiense: false,
                vehicles: [],
                adInfo: '',
                bsb: '',
                accountName: '',
                accountNumber: '',
            }}
            validationSchema={registerSchema}
            onSubmit={(values) => {
                const formData = serialize(values, {
                    indices: true,
                    dotsForObjectNotation: true,
                });

                signupDriver(
                    formData,
                    `${window.location.protocol}//${window.location.host}${config.AccountConfirmationURL}`,
                    (newDriver) => {
                        if (newDriver?.id) {
                            navigate(
                                `/auth/verify/phone?phone=${newDriver?.phoneNumber}&userId=${newDriver?.id}&from=register`,
                            );
                        }
                    },
                );
            }}
        >
            {({
                values,
                touched,
                errors,
                setFieldValue,
                setFieldTouched,
                handleSubmit,
                handleChange,
                handleBlur,
                isValid,
            }) => {
                const isLoading =
                    !!authState?.tasks?.hasOwnProperty(authConstraints.signupDriver) &&
                    authState?.tasks?.[authConstraints.signupDriver] === taskStatus.Inprogress;
                const permitedNext = !errors.userName && !errors.phone && !errors.email && !errors.password;

                return (
                    <div style={{ minHeight: '86vh' }} className="container p-sm-2 p-lg-5">
                        <div className="text-center">
                            {/* <h3 className="reg-header txt-center">Register</h3>
                            <h4 className="reg-txt-u txt-center">Get started with Us</h4>
                            <p className="txt-center m-0">Register a new membership.</p> */}
                            <h3 className="reg-header txt-center" style={{ textTransform: 'uppercase' }}>
                                Become a driver
                            </h3>
                            <h4 className="reg-txt-u txt-center">Register now.</h4>
                        </div>
                        <Form className="form" onSubmit={handleSubmit}>
                            {isLoading && <CustomSpinner></CustomSpinner>}

                            {!!authState?.errors?.length && (
                                <>
                                    {authState?.errors?.map((error, idx) => (
                                        <Message.Error key={idx}>
                                            <>{error}</>
                                        </Message.Error>
                                    ))}
                                    <ScrollToTop
                                        top={120}
                                        width="50"
                                        height="50"
                                        component={
                                            <BsFillArrowUpSquareFill
                                                className="w-100"
                                                style={{ fontSize: '2rem', fill: 'var(--clr-primary)' }}
                                            ></BsFillArrowUpSquareFill>
                                        }
                                    ></ScrollToTop>
                                </>
                            )}

                            <Row>
                                <Col className={next ? 'step1-show' : 'step1-hide'}>
                                    <h4 className="my-3" style={{ textTransform: 'capitalize' }}>
                                        Account information
                                    </h4>
                                    {/* Username and email */}
                                    <Row>
                                        <Col>
                                            {/* UserName */}
                                            <Form.Group className="form-group">
                                                <div className="mb-2">
                                                    <Form.Label className="label">User name</Form.Label>
                                                    <p className="asterisk">*</p>
                                                </div>
                                                <Form.Control
                                                    type="text"
                                                    name="userName"
                                                    placeholder="Enter Your Account Name"
                                                    isInvalid={touched.userName && errors.userName}
                                                    value={values.userName}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.userName}
                                                </Form.Control.Feedback>
                                                <i>* Please enter with no space and symbol.</i>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            {/* Email */}
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
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.email}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    {/* Password */}
                                    <Form.Group className="form-group">
                                        <div className="mb-2">
                                            <Form.Label className="label">Password</Form.Label>
                                            <p className="asterisk">*</p>
                                        </div>
                                        <div className="frame-pass">
                                            <Form.Control
                                                type={showPass ? 'text' : 'password'}
                                                isInvalid={touched.password && errors.password}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="Enter your Password"
                                                name="password"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.password}
                                            </Form.Control.Feedback>
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

                                    {/* Confirm Password */}
                                    <Form.Group className="form-group">
                                        <div className="mb-2">
                                            <Form.Label className="label">Confirm Password</Form.Label>
                                            <p className="asterisk">*</p>
                                        </div>
                                        <div className="frame-pass">
                                            <Form.Control
                                                type={showPassConfirm ? 'text' : 'password'}
                                                name="confirmPassword"
                                                placeholder="Enter password again"
                                                isInvalid={touched.passwordConfirm && errors.passwordConfirm}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.passwordConfirm}
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
                                    <Form.Group className="form-group mb-4">
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
                                            preferredCountries={config.PhoneCountries}
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
                                        <i className={phonePopOver ? 'mt-5' : ''}>
                                            <Popover
                                                isOpen={phonePopOver}
                                                positions={['right', 'bottom', 'top', 'left']}
                                                reposition={true}
                                                onClickOutside={() => setPhonePopOver(false)}
                                                content={
                                                    <div className="p-3" style={{ background: 'var(--clr-light)' }}>
                                                        <a href="https://www.whatsapp.com/download" target="_blank">
                                                            <Button variant="success">
                                                                <FaWhatsapp className="me-2"></FaWhatsapp>
                                                                Download now !
                                                            </Button>
                                                        </a>
                                                    </div>
                                                }
                                            >
                                                <span

                                                // onMouseLeave={() => setPhonePopOver(false)}
                                                >
                                                    * Your phone number should be registered with whatsapp{' '}
                                                    <BiInfoCircle
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => setPhonePopOver(true)}
                                                        onMouseOver={() => setPhonePopOver(true)}
                                                        onTouchStart={() => setPhonePopOver(true)}
                                                    ></BiInfoCircle>{' '}
                                                </span>
                                            </Popover>
                                        </i>
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
                                    <Row>
                                        <Col sm="auto">
                                            <Button
                                                variant="warning"
                                                disabled={!permitedNext || !!phoneError}
                                                onClick={() => setNext((e) => !e)}
                                                className="my-btn-yellow w-100 w-lg-40"
                                            >
                                                Next
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
                                </Col>

                                <Col className={!next ? 'step2-show' : 'step2-hide'}>
                                    <Button
                                        type="submit"
                                        variant="warning"
                                        onClick={() => setNext((e) => !e)}
                                        className="my-btn-yellow mb-4"
                                    >
                                        Back
                                    </Button>
                                    {/* Full Name */}
                                    <Form.Group className="form-group">
                                        <div className="mb-2">
                                            <Form.Label className="label">Full name</Form.Label>
                                            <p className="asterisk">*</p>
                                        </div>
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

                                    {/* ABN Number */}
                                    <Form.Group className="form-group">
                                        <div className="mb-2">
                                            <Form.Label className="label">ABN</Form.Label>
                                            <p className="asterisk">*</p>
                                        </div>
                                        <Form.Control
                                            type="text"
                                            name="ABNNumber"
                                            placeholder="Enter Your ABN Number"
                                            isInvalid={touched.ABNNumber && errors.ABNNumber}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.ABNNumber}</Form.Control.Feedback>
                                    </Form.Group>

                                    {/* Business Name */}
                                    <Form.Group className="form-group">
                                        <div className="mb-2">
                                            <Form.Label className="label">Business Name</Form.Label>
                                        </div>
                                        <Form.Control
                                            type="text"
                                            name="bussinessName"
                                            placeholder="Enter Your Business Name"
                                            isInvalid={touched.bussinessName && !!errors?.bussinessName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors?.bussinessName}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    {/* Address */}
                                    <Form.Group className="form-group">
                                        <div className="mb-2">
                                            <Form.Label className="label">Address</Form.Label>
                                            <p className="asterisk">*</p>
                                        </div>
                                        <Form.Control
                                            type="text"
                                            name="address"
                                            placeholder="Enter Your Address"
                                            isInvalid={touched?.address && !!errors?.address}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors?.address}</Form.Control.Feedback>
                                    </Form.Group>

                                    {/* City */}
                                    <Form.Group className="form-group">
                                        <div className="mb-2">
                                            <Form.Label className="label">State</Form.Label>
                                            <p className="asterisk">*</p>
                                        </div>
                                        {/* <Form.Control
                                            type="text"
                                            name="city"
                                            placeholder="Enter Your State"
                                            isInvalid={touched?.city && !!errors?.city}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors?.city}</Form.Control.Feedback> */}

                                        <Dropdown
                                            options={stateOptions}
                                            onChange={(e) => {
                                                setFieldValue('city', e.value);
                                            }}
                                            onFocus={() => {
                                                setFieldTouched('city', true);
                                            }}
                                            placeholder={'Select pickup state'}
                                            className={`${errors?.city ? ' is-invalid' : ''}`}
                                            controlClassName={
                                                'form-control aus-drop-down' + `${errors?.city ? ' is-invalid' : ''}`
                                            }
                                            value={values.city}
                                        ></Dropdown>

                                        <Form.Control.Feedback type="invalid">{errors?.city}</Form.Control.Feedback>
                                    </Form.Group>

                                    {/* PostCode */}
                                    <Form.Group className="form-group">
                                        <div className="mb-2">
                                            <Form.Label className="label">Postcode</Form.Label>
                                            <p className="asterisk">*</p>
                                        </div>
                                        <Form.Control
                                            type="text"
                                            name="postCode"
                                            placeholder="Enter Your Post Code"
                                            isInvalid={touched.postCode && !!errors?.postCode}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors?.postCode}</Form.Control.Feedback>
                                    </Form.Group>

                                    {/* Driving Liense Images */}
                                    <Form.Group className="form-group mb-2">
                                        <div className="mb-2">
                                            <Form.Label className="label py-3 mb-2">
                                                Driving License (Front and Back)
                                            </Form.Label>
                                            <p className="asterisk">*</p>
                                        </div>
                                        <div className="front-up">
                                            <i>Front</i>
                                            <div
                                                className="img-front-frame"
                                                onClick={() => f_driver_img_ipt.current.click()}
                                            >
                                                <div className="background-front">
                                                    <RiImageEditFill
                                                        style={{
                                                            position: 'relative',
                                                            color: 'gray',
                                                            fontSize: '50px',
                                                            opacity: '70%',
                                                        }}
                                                    ></RiImageEditFill>
                                                    <p className="driving-txt">Change driving license</p>
                                                </div>
                                                <img
                                                    className="img-front w-100"
                                                    src={imgUrlFront || 'https://tinyurl.com/5ehpcctt'}
                                                    style={{ maxWidth: 'unset' }}
                                                    alt="FrontDrivingImage"
                                                />
                                            </div>
                                            <Form.Control
                                                type="file"
                                                id="driver_image_front"
                                                name="frontDrivingLiense"
                                                ref={f_driver_img_ipt}
                                                isInvalid={!!errors?.frontDrivingLiense}
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    setFieldValue(e.target.name, file, true);

                                                    const fileReader = new FileReader();
                                                    if (file) {
                                                        fileReader.addEventListener('loadend', (e) => {
                                                            setImgUrlFront(fileReader.result);
                                                        });
                                                        fileReader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                            <Form.Control.Feedback className="mb-2" type="invalid">
                                                {errors?.frontDrivingLiense}
                                            </Form.Control.Feedback>
                                        </div>
                                        <div className="back-up">
                                            <i>Back</i>
                                            <div
                                                className="img-front-frame"
                                                onClick={() => b_driver_img_ipt.current.click()}
                                            >
                                                <div className="background-front">
                                                    <RiImageEditFill
                                                        style={{
                                                            position: 'relative',
                                                            color: 'gray',
                                                            fontSize: '50px',
                                                            opacity: '70%',
                                                        }}
                                                    ></RiImageEditFill>
                                                    <p className="driving-txt">Change driving license</p>
                                                </div>
                                                <img
                                                    className="img-front"
                                                    src={imgUrlBack || 'https://tinyurl.com/5ehpcctt'}
                                                    style={{ maxWidth: 'unset' }}
                                                />
                                            </div>

                                            <Form.Control
                                                type="file"
                                                id="driver_image_back"
                                                name="backDrivingLiense"
                                                ref={b_driver_img_ipt}
                                                isInvalid={!!errors?.backDrivingLiense}
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    setFieldValue(e.target.name, file, true);

                                                    const fileReader = new FileReader();

                                                    if (file) {
                                                        fileReader.addEventListener('loadend', (e) => {
                                                            setImgUrlBack(fileReader.result);
                                                        });
                                                        fileReader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                            <Form.Control.Feedback className="mb-2" type="invalid">
                                                {errors?.backDrivingLiense}
                                            </Form.Control.Feedback>
                                        </div>
                                        <label className="fr-checkbox mb-2">
                                            <input
                                                type="checkbox"
                                                name="isAusDrivingLiense"
                                                checked={values.isAusDrivingLiense}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            <span className="checkmark"></span>
                                            <span className="txt-checkbox" style={{ fontWeight: '500' }}>
                                                Is it Australian driver's license?
                                            </span>
                                        </label>
                                        {!values.isAusDrivingLiense && (
                                            <div className="drivingCertificate">
                                                <div>
                                                    <h6
                                                        style={{
                                                            paddingTop: '15px',
                                                        }}
                                                    >
                                                        Address Confirmation Documents
                                                    </h6>
                                                </div>
                                                <div
                                                    className="img-front-frame"
                                                    style={{
                                                        minWidth: '120px',
                                                        minHeight: '200px',
                                                    }}
                                                    onClick={() => d_certificate.current.click()}
                                                >
                                                    {(!values.drivingCertificate && (
                                                        <div className="background-front">
                                                            <GrDocumentPdf
                                                                style={{
                                                                    position: 'relative',
                                                                    color: 'gray',
                                                                    fontSize: '50px',
                                                                    opacity: '70%',
                                                                }}
                                                            ></GrDocumentPdf>
                                                            <p className="driving-txt">Change PDF</p>
                                                        </div>
                                                    )) || (
                                                        <div>
                                                            <VscFilePdf
                                                                style={{
                                                                    fontSize: '10rem',
                                                                }}
                                                            ></VscFilePdf>
                                                        </div>
                                                    )}
                                                </div>

                                                <Form.Control
                                                    type="file"
                                                    id="driver_pdf"
                                                    name="drivingCertificate"
                                                    accept="application/pdf"
                                                    ref={d_certificate}
                                                    isInvalid={!!errors?.drivingCertificate}
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        setFieldValue(e.target.name, file, true);
                                                        const fileReader = new FileReader();
                                                        if (file) {
                                                            fileReader.addEventListener('loadend', (e) => {
                                                                setPdf(fileReader.result);
                                                            });
                                                            fileReader.readAsDataURL(file);
                                                        }
                                                    }}
                                                />
                                                <Form.Control.Feedback className="mb-2" type="invalid">
                                                    {errors?.drivingCertificate}
                                                </Form.Control.Feedback>
                                            </div>
                                        )}
                                    </Form.Group>

                                    {/* Vehicles */}
                                    <Form.Group className="form-group">
                                        <div className="mb-2" style={{ paddingTop: '20px' }}>
                                            <Form.Label className="label">Vehicles</Form.Label>
                                            <p className="asterisk">*</p>
                                        </div>
                                        <div className="list-vehicle">
                                            {vehicles.map((item, index) => {
                                                return (
                                                    <div key={index}>
                                                        <label className="fr-checkbox mb-2">
                                                            <input
                                                                type="checkbox"
                                                                name="vehicles"
                                                                value={item?.id}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                            />
                                                            <span className="checkmark"></span>
                                                            <span
                                                                className="txt-checkbox"
                                                                style={{
                                                                    fontWeight: '500',
                                                                }}
                                                            >
                                                                {item?.name}
                                                            </span>
                                                        </label>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </Form.Group>

                                    <Form.Group className="form-group-border mb-3" id="payment_detail">
                                        <div className="form-group-label">
                                            <h5>Payment Detail</h5>
                                        </div>
                                        {/* BSB */}
                                        <Form.Group className="form-group">
                                            <div className="mb-2">
                                                <Form.Label className="label">BSB</Form.Label>
                                                <p className="asterisk">*</p>
                                            </div>
                                            <Form.Control
                                                type="text"
                                                name="bsb"
                                                placeholder="Enter Bsb"
                                                isInvalid={touched.bsb && !!errors?.bsb}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors?.bsb}</Form.Control.Feedback>
                                        </Form.Group>

                                        {/* Account Name */}
                                        <Form.Group className="form-group">
                                            <div className="mb-2">
                                                <Form.Label className="label">Account Name</Form.Label>
                                                <p className="asterisk">*</p>
                                            </div>
                                            <Form.Control
                                                type="text"
                                                name="accountName"
                                                placeholder="Enter Account Name"
                                                isInvalid={touched.accountName && !!errors?.accountName}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors?.accountName}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        {/* Account Name */}
                                        <Form.Group className="form-group">
                                            <div className="mb-2">
                                                <Form.Label className="label">Account Number</Form.Label>
                                                <p className="asterisk">*</p>
                                            </div>
                                            <Form.Control
                                                type="text"
                                                name="accountNumber"
                                                placeholder="Enter Account Number"
                                                isInvalid={touched.accountNumber && !!errors?.accountNumber}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors?.accountNumber}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Form.Group>

                                    {/* Additional Information */}
                                    <Form.Group className="form-group">
                                        <div className="mb-2">
                                            <Form.Label className="label">Additional Information</Form.Label>
                                        </div>
                                        <Form.Control
                                            type="text"
                                            style={{ background: '#fafafa' }}
                                            name="adInfo"
                                            as="textarea"
                                            rows={3}
                                            placeholder="Enter Your Additional Information"
                                            isInvalid={touched.adInfo && !!errors.adInfo}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.adInfo}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Row className="align-items-center">
                                        <Col sm="auto">
                                            <Button
                                                type="submit"
                                                variant="warning"
                                                style={{
                                                    backgroundColor: '#f2a13b',
                                                    border: 'none',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                                disabled={authLoading || !isValid || isLoading}
                                                className="my-btn-yellow my-2 gap-2"
                                            >
                                                {isLoading || authLoading ? (
                                                    <>
                                                        <Spinner></Spinner> Submitting
                                                    </>
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
                                                    src="https://www.youtube.com/embed/OeCiWm2RuUc"
                                                    title="YouTube video player"
                                                    frameborder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                    allowfullscreen
                                                ></iframe>
                                            </section>
                                        </Modal.Body>
                                    </Modal>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                );
            }}
        </Formik>
    );
}

export default function Index() {
    return <RegisterDriver></RegisterDriver>;
}
