import React from 'react';
import '../style/driverPhoneConfirm.css';
import { AiOutlineSend, AiOutlineWhatsApp } from 'react-icons/ai';
import { Formik } from 'formik';
import PhoneInput from 'react-phone-input-2';
import * as yup from 'yup';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { TbDeviceMobileMessage } from 'react-icons/tb';
import { AuthContext } from '../../../stores';
import { authConstraints, authInstance, config } from '../../../api';
import { toast } from 'react-toastify';
import { Link, useSearchParams } from 'react-router-dom';
import { BsCheckCircle } from 'react-icons/bs';

function Index() {
    const actions = {
        sendPhone: 1,
        sendCode: 2,
        completed: 3,
    };
    const [authState, { getAccount }] = React.useContext(AuthContext);
    const [phoneError, setPhoneError] = React.useState('');
    const [step, setStep] = React.useState(actions.sendPhone);
    const [loading, setLoading] = React.useState(false);
    const [searchParams] = useSearchParams();
    const queries = ['phone', 'userId', 'from'];

    function sendPhoneDigit(newPhone, userId) {
        setLoading(true);
        authInstance
            .get([authConstraints.root, authConstraints.sendPhoneDigit].join('/'), {
                params: {
                    newPhone,
                    userId,
                },
            })
            .then((response) => {
                if (response.data?.successed) {
                    toast.success('Check your whatsapp to receive confirmation digit');
                    setLoading(false);
                    setStep(actions.sendCode);
                } else {
                    toast.error(response.data?.error);
                    setLoading(false);
                }
            })
            .catch((error) => {
                toast.error(error.message);
                setLoading(false);
            });
    }

    function confirmPhone(digit, userId) {
        setLoading(true);
        authInstance
            .get([authConstraints.root, authConstraints.verifiedPhone].join('/'), {
                params: {
                    digit,
                    userId,
                },
            })
            .then((response) => {
                if (response.data?.successed) {
                    toast.success('Your account has been confirmed phone');
                    setLoading(false);
                    setStep(actions.completed);
                    if (searchParams.get(queries[2]) === 'login') {
                        getAccount();
                    }
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
        <div className="container p-sm-2 p-lg-5">
            <div className="box-shadow-form aus-phone-confirm-form text-center p-sm-2 p-md-3">
                <Formik
                    validationSchema={yup.object().shape({
                        phoneNumber: yup
                            .string()
                            // .matches(phoneRegExp, 'Phone number is not valid')
                            .required('Please enter your phone number'),
                        code: yup
                            .string()
                            .length(6, 'Confirm code is a 6-digit number')
                            .required('Please enter your confirm code'),
                    })}
                    initialValues={{
                        userId: searchParams?.get(queries[1]) || '',
                        phoneNumber: searchParams?.get(queries[0]) || '+61',
                        code: '',
                    }}
                    onSubmit={(values) => {
                        if (step === actions.sendCode) {
                            confirmPhone(values.code, values.userId);
                        }
                    }}
                >
                    {({
                        isValid,
                        values,
                        errors,
                        touched,
                        setFieldValue,
                        handleSubmit,
                        handleBlur,
                        handleChange,
                        setFieldTouched,
                    }) => {
                        return (
                            <Form onSubmit={handleSubmit}>
                                {step === actions.sendPhone ? (
                                    <Form.Group className="fadeLeft" id="aus-phone-confirm">
                                        {/* <AiOutlineWhatsApp className="mb-2" style={{ fontSize: '5rem', color: 'green' }}></AiOutlineWhatsApp> */}
                                        <img
                                            src="https://static.whatsapp.net/rsrc.php/v3/y7/r/DSxOAUB0raA.png"
                                            className="mb-2"
                                            width={'100%'}
                                            style={{ maxWidth: '9rem' }}
                                        ></img>
                                        <h3>Verify your phone number</h3>
                                        <i
                                            className="mb-3"
                                            style={{ display: 'block' }}
                                        >{`We wil send an Whatsapp message to verify your Whatsapp account.\nEnter your phone number`}</i>
                                        <Row className="justify-content-center">
                                            <Col sm="6">
                                                <PhoneInput
                                                    containerClass="w-100 text-start mb-2"
                                                    inputClass="w-100"
                                                    country={'au'}
                                                    value={values?.phoneNumber}
                                                    onChange={(phone) => setFieldValue('phoneNumber', phone)}
                                                    onBlur={() => setFieldTouched('phoneNumber', true)}
                                                    onlyCountries={['au', 'vn', 'us']}
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
                                                {touched.phoneNumber && (!!errors?.phoneNumber || !!phoneError) && (
                                                    <i className="text-danger">{phoneError || errors.phoneNumber}</i>
                                                )}
                                            </Col>
                                            <Col sm="auto">
                                                <div className="mb-2">
                                                    <Button
                                                        variant="success"
                                                        type="submit"
                                                        className="mb-2"
                                                        style={{ cursor: 'pointer' }}
                                                        disabled={!!errors.phoneNumber || !!phoneError}
                                                        onClick={() => {
                                                            if (step === actions.sendPhone) {
                                                                var userId = searchParams.get(queries[1]);
                                                                if (!userId) {
                                                                    toast.error('Your url is invalid');
                                                                    return;
                                                                }
                                                                sendPhoneDigit(values.phoneNumber, userId);
                                                            }
                                                        }}
                                                    >
                                                        <AiOutlineSend className="me-2"></AiOutlineSend>Send code
                                                    </Button>
                                                </div>
                                            </Col>
                                        </Row>
                                        <div>
                                            <i>
                                                if you didn't have Whatsapp, you can{' '}
                                                <a href="https://www.whatsapp.com/download" target="_blank">
                                                    download here
                                                </a>
                                            </i>
                                        </div>
                                    </Form.Group>
                                ) : step === actions.sendCode ? (
                                    <Form.Group className="fadeLeft" id="aus-code-confirm">
                                        <TbDeviceMobileMessage
                                            className="mb-2 phone-ring"
                                            style={{ fontSize: '3rem' }}
                                        ></TbDeviceMobileMessage>
                                        <h3>Check your Whatsapp messages</h3>
                                        <i className="mb-2" style={{ display: 'block' }}>
                                            We've sent an code on your <b>WhatsApp</b> messages with phone number{' '}
                                            <b>+{values.phoneNumber}</b>.
                                        </i>
                                        <Row className="justify-content-center">
                                            <Col sm="6">
                                                <Form.Control
                                                    name="code"
                                                    placeholder="Enter 6-digit code"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={touched.code && !!errors?.code}
                                                ></Form.Control>
                                                <Form.Control.Feedback type="invalid">
                                                    {errors?.code}
                                                </Form.Control.Feedback>
                                            </Col>
                                            <Col sm="auto">
                                                <div className="mb-2">
                                                    <Button variant="warning" type="submit">
                                                        <AiOutlineSend className="me-2"></AiOutlineSend>Verified
                                                    </Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                ) : (
                                    <Form.Group className="fadeLeft">
                                        <BsCheckCircle
                                            className="mb-2 text-success"
                                            style={{ fontSize: '5rem' }}
                                        ></BsCheckCircle>
                                        <h3>WhatsApp: Completed Verification</h3>
                                        <i className="mb-3" style={{ display: 'inline-block' }}>
                                            Now you're able to get notifications throughout <b>Whatsapp</b>
                                        </i>
                                        {searchParams.get(queries[2]) === 'register' ? (
                                            <Link to="/auth/register/confirm">
                                                <Button variant="warning">Next Step</Button>
                                            </Link>
                                        ) : (
                                            <Link to="/user/order/me">
                                                <Button variant="warning">Come back to workspace</Button>
                                            </Link>
                                        )}
                                    </Form.Group>
                                )}
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        </div>
    );
}

export default Index;
