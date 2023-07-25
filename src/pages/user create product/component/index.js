import { FieldArray, Formik } from 'formik';
import * as yup from 'yup';
import Form from 'react-bootstrap/Form';
import React, { useContext } from 'react';
import { Button, Col, Modal, Row, Spinner } from 'react-bootstrap';
import { AuthContext, OrderContext } from '../../../stores';
import '../style/createProduct.css';
import moment from 'moment';
import { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { dotnetFormDataSerialize } from '../../../ultitlies';
import 'react-phone-input-2/lib/style.css';
import ItemCreation from './item';
import { FaTimes } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import { LuPackagePlus } from 'react-icons/lu';
import { RiArrowDropDownLine } from 'react-icons/ri';
import PhoneInput from 'react-phone-input-2';
import { toast } from 'react-toastify';
import { AiOutlineLeft, AiOutlineRight, AiOutlineUserAdd } from 'react-icons/ai';
import { BsFillSendCheckFill } from 'react-icons/bs';
import { FcAcceptDatabase } from 'react-icons/fc';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

const PERMIT_FILE_FORMATS = ['image/jpeg', 'image/png', 'image/jpg'];

let orderSchema = yup.object().shape({
    senderId: yup.string().required(),
    sendingLocation: yup.object().shape({
        unitNumber: yup.string().required('Unit Number is required'),
        streetNumber: yup.string().required('Street Number is required'),
        streetName: yup.string().required('Street Name is required'),
        suburb: yup.string().required('Suburb is required'),
        state: yup.string().required('State is required'),
        postCode: yup.number().required('Post code is required'),
    }),
    deliverableDate: yup.date().required(),
    startingRate: yup.number().positive().min(5).required('Your Reference Rate value is required'),
    timeFrame: yup
        .string()
        .test('TIME INCORRECT', 'The time format is incorrect', (value) => {
            var timeFrames = value?.split('-');
            return timeFrames.length === 2;
        })
        .test('TIME EXCEEDED', 'The time of end should be larger than start', (value) => {
            var timeFrames = value.split('-');
            var start = moment(timeFrames[0], 'HH:mm');
            var end = moment(timeFrames[1], 'HH:mm');
            return end.diff(start) > 0;
        }),
    vehicles: yup.array().of(yup.string()).min(1, 'Vehicle must be selected 1 unit at least'),
    receivers: yup.array().of(
        yup.object().shape({
            receiverName: yup.string().required('Receiver Name is required'),
            receiverPhone: yup.string().required('Receiver Phone is required'),
            destination: yup.object().shape({
                unitNumber: yup.string().required('Unit Number is required'),
                streetNumber: yup.string().required('Street Number is required'),
                streetName: yup.string().required('Street Name is required'),
                suburb: yup.string().required('Suburb is required'),
                state: yup.string().required('State is required'),
                postCode: yup.number().required('Post code is required'),
            }),
        }),
    ),
    orderItems: yup.array().of(
        yup.object().shape({
            itemName: yup.string().required('Item Name is required field'),
            itemCharcode: yup.number().default(Math.floor(Math.random() * (999999 - 100000 + 1) + 100000)),
            itemDescription: yup.string().nullable(),
            receiverIndex: yup.number().required(),
            quantity: yup
                .number()
                .positive()
                .min(1, 'Quantity should be larger then 1 and least than 10')
                .max(10, 'Quantity should be larger then 1 and least than 10')
                .required('Quantity is required field'),
            weight: yup.number().positive().required('Weight is required field'),
            packageType: yup.string().required('Package Type is required field'),
            productPictures: yup
                .array()
                .of(
                    yup.object().shape({
                        file: yup.mixed().required(),
                        url: yup.string().required(),
                    }),
                )
                .min(1, 'Adding more pictures for product')
                .max(3, 'Your picture number should be smaller than 4')
                .required('Adding more pictures for product')
                .test('FILE SIZE', 'the file collection is too large', (files) => {
                    if (!files) {
                        return true;
                    }
                    return files.reduce((p, c) => c.file.size + p, 0) <= 2 * 1024 * 1024;
                })
                .test('FILE FORMAT', `the file format should be ${PERMIT_FILE_FORMATS.join()}`, (files) => {
                    if (!files.length) {
                        return true;
                    }
                    return files.every((c) => PERMIT_FILE_FORMATS.includes(c.file.type));
                }),
        }),
    ),
});

export const stateOptions = [
    'VICTORIA (VIC)',
    'NEW SOUTH WALES (NSW)',
    'QUEENSLAND (QLD)',
    'SOUTH AUSTRALIA (SA)',
    'WESTERN AUSTRALIA (WA)',
    'NOTHERN AUSTRALIA (NT)',
    'TASMANIA (TAS)',
    'AUSTRALIAN CAPITAL TERRITORY (ACT)',
];

function OrderCreation() {
    const actions = {
        addItem: 'add item',
        addReceiver: 'add receiver',
    };
    const [authState] = useContext(AuthContext);
    const [orderState, { postOrder }] = useContext(OrderContext);
    const [phoneError, setPhoneError] = React.useState('');
    const [currentReceiver, setCurrent] = React.useState(0);
    const [currentItem, setCurrentItem] = React.useState(0);
    const [devModal, setDevModal] = React.useState(false);
    const [swiperRef, setSwiperRef] = React.useState(null);
    const [receiverDropdown, setReceiverDropdown] = React.useState(0);
    const [itemDropdown, setItemDropdown] = React.useState(0);
    const [receiverEditModal, setReceiverEditModal] = React.useState(null);
    const [activeAction, setActions] = React.useState(null);
    const [submitConfirm, setSubmitConfirm] = React.useState(false);

    const pagination = {
        clickable: true,
        renderBullet: function (index, className) {
            return '<span class="' + className + '">' + (index + 1) + '</span>';
        },
    };

    const slideTo = (index) => {
        swiperRef?.slideTo(index, 0);
    };
    return (
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
                deliverableDate: Date.now(),
                timeFrame: '-',
                startingRate: 0,
                vehicles: [],
                receivers: [
                    {
                        index: 0,
                        destination: {
                            unitNumber: '',
                            streetNumber: '',
                            streetName: '',
                            suburb: '',
                            state: '',
                            postCode: '',
                        },
                        receiverName: '',
                        receiverPhone: '',
                    },
                ],
                orderItems: [
                    {
                        itemName: '',
                        itemCharcode: Math.floor(Math.random() * (999999 - 100000 + 1) + 100000),
                        receiverIndex: 0,
                        itemDescription: '',
                        quantity: '',
                        weight: '',
                        packageType: authState?.packageTypes?.[0],
                        productPictures: [],
                    },
                ],
            }}
            validationSchema={orderSchema}
            onSubmit={(values) => {
                const states = values.receivers.map((r) => r.destination?.state);

                const handledObjects = {
                    ...values,
                    states: states.filter((state, index) => states.indexOf(state) === index),
                    orderItems: values.orderItems.map((item) => {
                        return {
                            ...item,
                            ...values.receivers.find((r) => r.index === item.receiverIndex),
                            productPictures: item.productPictures.map((item) => item?.file),
                        };
                    }),
                };

                const formData = dotnetFormDataSerialize(handledObjects, {
                    indices: true,
                    dotsForObjectNotation: true,
                });

                postOrder(formData);
            }}
        >
            {(formProps) => {
                const {
                    touched,
                    isValid,
                    errors,
                    setFieldValue,
                    setFieldTouched,
                    handleSubmit,
                    handleChange,
                    handleBlur,
                    values,
                } = formProps;
                return (
                    <div className="p-3">
                        <Modal show={orderState.loading} size="lg" backdrop="static" keyboard={false} centered>
                            <Modal.Body className="text-center">
                                <Spinner className="mb-2"></Spinner>
                                <h2>Please waiting for us</h2>
                                <p>
                                    We are handling your request,{' '}
                                    <b style={{ color: 'red' }}>Don't close your device</b>
                                </p>
                            </Modal.Body>
                        </Modal>

                        <Modal show={devModal} size="xl" centered onHide={() => setDevModal(false)}>
                            <Modal.Header closeButton></Modal.Header>
                            <Modal.Body>
                                <Row>
                                    <Col sm="12" lg="6">
                                        <h3>Pickup Location</h3>
                                        <Row>
                                            <Col>Unit number</Col>
                                            <Col>
                                                <p>{values.sendingLocation.unitNumber}</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>Street number</Col>
                                            <Col>
                                                <p>{values.sendingLocation.streetNumber}</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>Street Name</Col>
                                            <Col>
                                                <p>{values.sendingLocation.streetName}</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>Suburb</Col>
                                            <Col>
                                                <p>{values.sendingLocation.suburb}</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>State</Col>
                                            <Col>
                                                <p>{values.sendingLocation.state}</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>Post code</Col>
                                            <Col>
                                                <p>{values.sendingLocation.postCode}</p>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col sm="12" lg="6">
                                        <h3>Delivery Capability</h3>
                                        <Row>
                                            <Col>
                                                <b>Pickup date</b>
                                            </Col>
                                            <Col>
                                                <p>{moment(values?.deliverableDate).format('DD-MM-YYYY')}</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <b>Timeframe</b>
                                            </Col>
                                            <Col>
                                                <p>{values?.timeFrame}</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <b>Your rate</b>
                                            </Col>
                                            <Col>
                                                <p>{values?.startingRate}</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <b>Vehicles</b>
                                            </Col>
                                            <Col>
                                                <ul>
                                                    {authState.vehicles?.map?.((v) => {
                                                        const isExisting = values.vehicles.some((vid) => {
                                                            return vid === v?.id?.toString?.();
                                                        });

                                                        return isExisting ? <li key={v}>{v?.name}</li> : null;
                                                    })}
                                                </ul>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col sm="12" lg="6">
                                        <h3>Delivery Location</h3>
                                    </Col>
                                    <Col sm="12" lg="6" className="d-sm-none d-lg-block">
                                        <h3>Item Information</h3>
                                    </Col>
                                </Row>

                                {values.receivers.map((receiver) => {
                                    return (
                                        <Row className="py-2" style={{ border: '1px solid #010101' }}>
                                            <Col sm="12" lg="6">
                                                <Row>
                                                    <Col>
                                                        <p>
                                                            <b>Receiver Name</b>
                                                        </p>
                                                    </Col>
                                                    <Col>
                                                        <p>{receiver.receiverName}</p>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <p>
                                                            <b>Receiver phone number</b>
                                                        </p>
                                                    </Col>
                                                    <Col>
                                                        <p>{receiver.receiverPhone}</p>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>Unit number</Col>
                                                    <Col>
                                                        <p>{receiver.destination.unitNumber}</p>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>Street number</Col>
                                                    <Col>
                                                        <p>{receiver.destination.streetNumber}</p>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>Street Name</Col>
                                                    <Col>
                                                        <p>{receiver.destination.streetName}</p>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>Suburb</Col>
                                                    <Col>
                                                        <p>{receiver.destination.suburb}</p>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>State</Col>
                                                    <Col>
                                                        <p>{receiver.destination.state}</p>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>Post code</Col>
                                                    <Col>
                                                        <p>{receiver.destination.postCode}</p>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col sm="12" lg="6">
                                                {values.orderItems
                                                    .filter((p) => p.receiverIndex === receiver.index)
                                                    .map((item) => {
                                                        return (
                                                            <div
                                                                className="mb-2 p-2"
                                                                style={{ border: '1px solid #010101' }}
                                                            >
                                                                <Row>
                                                                    <Col>
                                                                        <p>
                                                                            <b>Item name</b>
                                                                        </p>
                                                                    </Col>
                                                                    <Col>
                                                                        <p>{item?.itemName}</p>
                                                                    </Col>
                                                                    <Col></Col>
                                                                    <Col></Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col>
                                                                        <p>
                                                                            <b>Quantity</b>
                                                                        </p>
                                                                    </Col>
                                                                    <Col>
                                                                        <p>{item?.quantity || 0}</p>
                                                                    </Col>
                                                                    <Col>
                                                                        <p>
                                                                            <b>Weight</b>
                                                                        </p>
                                                                    </Col>
                                                                    <Col>
                                                                        <p>{item?.weight || 0} Kilograms</p>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col>
                                                                        <p>
                                                                            <b>Receiver code</b>
                                                                        </p>
                                                                    </Col>
                                                                    <Col>
                                                                        <p>{item?.itemCharcode}</p>
                                                                    </Col>
                                                                    <Col>
                                                                        <p>
                                                                            <b>Package Type</b>
                                                                        </p>
                                                                    </Col>
                                                                    <Col>
                                                                        <p>{item?.packageType}</p>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col>
                                                                        <p>
                                                                            <b>Note</b>
                                                                        </p>
                                                                    </Col>
                                                                    <Col>
                                                                        <p>{item?.itemDescription}</p>
                                                                    </Col>
                                                                    <Col></Col>
                                                                    <Col></Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col sm="12">
                                                                        <p>
                                                                            <b>Pictures</b>
                                                                        </p>
                                                                    </Col>
                                                                    <Col sm="12">
                                                                        <Row>
                                                                            {item?.productPictures.map((pic) => {
                                                                                return (
                                                                                    <Col
                                                                                        className="mb-2"
                                                                                        sm={6}
                                                                                        md={4}
                                                                                        lg={4}
                                                                                    >
                                                                                        <div
                                                                                            style={{
                                                                                                border: '1px solid #010101',
                                                                                            }}
                                                                                        >
                                                                                            <img
                                                                                                src={pic.url}
                                                                                                width={'100%'}
                                                                                            ></img>
                                                                                        </div>
                                                                                    </Col>
                                                                                );
                                                                            })}
                                                                        </Row>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        );
                                                    })}
                                            </Col>
                                        </Row>
                                    );
                                })}

                                {process.env.NODE_ENV === 'development' && (
                                    <Row>
                                        {/* <Col sm="6">
                                            <pre>values: {JSON.stringify(values, 4, 4)}</pre>
                                        </Col> */}
                                        <Col sm="6">
                                            <pre>errors: {JSON.stringify(errors, 4, 4)}</pre>
                                        </Col>
                                    </Row>
                                )}
                            </Modal.Body>
                        </Modal>

                        <Form onSubmit={handleSubmit}>
                            <div
                            // className='form-order'
                            >
                                <Row className="mb-2">
                                    {/* Sending location & Destination */}
                                    <Col lg="6">
                                        <h3 className="mb-3">Order Location</h3>
                                        {/* Sending Location */}
                                        <Form.Group className="mb-3">
                                            <div className="mb-2">
                                                <Form.Label className="label">Pick Up</Form.Label>
                                                <p className="asterisk">*</p>
                                            </div>
                                            <div className="pickup-post">
                                                {/* Unit Number */}
                                                <Form.Group>
                                                    <Form.Control
                                                        type="text"
                                                        name="sendingLocation.unitNumber"
                                                        placeholder="Enter Unit number (apartment, room,...)"
                                                        isInvalid={
                                                            touched.sendingLocation?.unitNumber &&
                                                            !!errors?.sendingLocation?.unitNumber
                                                        }
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors?.sendingLocation?.unitNumber}
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                {/* Street Number */}
                                                <Form.Group>
                                                    <Form.Control
                                                        type="text"
                                                        name="sendingLocation.streetNumber"
                                                        placeholder="Enter street number"
                                                        isInvalid={
                                                            touched.sendingLocation?.streetNumber &&
                                                            !!errors?.sendingLocation?.streetNumber
                                                        }
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors?.sendingLocation?.streetNumber}
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                {/* Street Name */}
                                                <Form.Group>
                                                    <Form.Control
                                                        type="text"
                                                        name="sendingLocation.streetName"
                                                        placeholder="Enter Street Name"
                                                        isInvalid={
                                                            touched.sendingLocation?.streetName &&
                                                            !!errors?.sendingLocation?.streetName
                                                        }
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors?.sendingLocation?.streetName}
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                {/* Suburb */}
                                                <Form.Group>
                                                    <Form.Control
                                                        type="text"
                                                        name="sendingLocation.suburb"
                                                        placeholder="Enter Suburb"
                                                        isInvalid={
                                                            touched.sendingLocation?.suburb &&
                                                            !!errors?.sendingLocation?.suburb
                                                        }
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors?.sendingLocation?.suburb}
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                {/* State */}
                                                <Form.Group>
                                                    {/* <Form.Control
                                                        type="text"
                                                        name="sendingLocation.state"
                                                        placeholder="Enter state"
                                                        isInvalid={
                                                            touched.sendingLocation?.state &&
                                                            !!errors?.sendingLocation?.state
                                                        }
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    /> */}
                                                    {/* <Form.Control.Feedback type="invalid">
                                                        {errors?.sendingLocation?.state}
                                                    </Form.Control.Feedback> */}
                                                    <Dropdown
                                                        options={stateOptions}
                                                        onChange={(e) => {
                                                            console.log(e);
                                                            setFieldValue('sendingLocation.state', e.value);
                                                        }}
                                                        onFocus={() => {
                                                            console.log(errors);
                                                            setFieldTouched('sendingLocation.state', true);
                                                        }}
                                                        placeholder={'Select pickup state'}
                                                        className={`${
                                                            errors?.sendingLocation?.state ? ' is-invalid' : ''
                                                        }`}
                                                        controlClassName={
                                                            'form-control aus-drop-down' +
                                                            `${errors?.sendingLocation?.state ? ' is-invalid' : ''}`
                                                        }
                                                        value={values.sendingLocation?.state}
                                                    ></Dropdown>

                                                    <Form.Control.Feedback type="invalid">
                                                        {errors?.sendingLocation?.state}
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                {/* Post code */}
                                                <Form.Group>
                                                    <Form.Control
                                                        type="text"
                                                        name="sendingLocation.postCode"
                                                        placeholder="Enter post code"
                                                        isInvalid={
                                                            touched.sendingLocation?.postCode &&
                                                            !!errors?.sendingLocation?.postCode
                                                        }
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors?.sendingLocation?.postCode}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        {/* Delivery Date */}
                                        <h3 className="mb-3">Delivery Capability</h3>
                                        <Row className="mb-lg-3">
                                            <Col>
                                                {/* Deliverable Date */}
                                                <Form.Group className="mb-2">
                                                    <div className="mb-2">
                                                        <Form.Label className="label">Deliverable Date</Form.Label>
                                                        <p className="asterisk">*</p>
                                                    </div>
                                                    <Form.Control
                                                        type="date"
                                                        name="deliverableDate"
                                                        placeholder="Enter deliverable date"
                                                        isInvalid={touched.deliverableDate && !!errors?.deliverableDate}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors?.deliverableDate}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Col>
                                            <Col>
                                                {/* Time Frame */}
                                                <Form.Group>
                                                    <div className="mb-2">
                                                        <Form.Label className="label">Time Frame From</Form.Label>
                                                        <p className="asterisk">*</p>
                                                    </div>
                                                    <Form.Control
                                                        className="mb-2"
                                                        type="time"
                                                        name="timeFrame"
                                                        placeholder="Enter time frame start"
                                                        isInvalid={touched?.timeFrame && !!errors?.timeFrame}
                                                        onChange={(e) => {
                                                            var timeFrames = values[e.target.name].split('-');

                                                            timeFrames[0] = e.target.value;
                                                            setFieldValue(e.target.name, timeFrames.join('-'), true);
                                                        }}
                                                        onBlur={handleBlur}
                                                    />
                                                    <div className="mb-2">
                                                        <Form.Label className="label">Time Frame To</Form.Label>
                                                        <p className="asterisk">*</p>
                                                    </div>
                                                    <Form.Control
                                                        type="time"
                                                        name="timeFrame"
                                                        placeholder="Enter time frame end"
                                                        isInvalid={touched.timeFrame && !!errors?.timeFrame}
                                                        onChange={(e) => {
                                                            var timeFrames = values[e.target.name].split('-');

                                                            timeFrames[1] = e.target.value;
                                                            setFieldValue(e.target.name, timeFrames.join('-'), true);
                                                        }}
                                                        onBlur={handleBlur}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors?.timeFrame}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>

                                <Modal show={submitConfirm} onHide={() => setSubmitConfirm(false)}>
                                    <Modal.Header closeButton></Modal.Header>
                                    <Modal.Body>
                                        <h4>Do you want to submit this order now?</h4>
                                        <i>
                                            Please check order information again before submitting. You cannot edit any
                                            details after submission.
                                        </i>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button
                                            type="submit"
                                            variant="warning"
                                            onClick={() => {
                                                handleSubmit();
                                                setSubmitConfirm(false);
                                            }}
                                        >
                                            <BsFillSendCheckFill className="me-2"></BsFillSendCheckFill>
                                            Submit now
                                        </Button>
                                        <Button variant="danger" onClick={() => setSubmitConfirm(false)}>
                                            <FaTimes className="me-2"></FaTimes>
                                            Cancel
                                        </Button>
                                    </Modal.Footer>
                                </Modal>

                                {/* OrderItems */}
                                <FieldArray name="orderItems" shouldUpdate={(next, props) => true}>
                                    {(itemArrayHelpers) => {
                                        return (
                                            <Row>
                                                <Col sm="12" md="6">
                                                    <div className="item-root py-2 px-xl-5">
                                                        <CustomNavButtons swiperRef={swiperRef}></CustomNavButtons>
                                                        <Swiper
                                                            id="orderItems"
                                                            onSwiper={setSwiperRef}
                                                            // navigation={true}
                                                            pagination={pagination}
                                                            modules={[Pagination, Navigation]}
                                                            initialSlide={
                                                                values.orderItems.length
                                                                    ? values.orderItems.length - 1
                                                                    : 0
                                                            }
                                                            spaceBetween={12}
                                                            effect="fade"
                                                            onInit={(swiper) => {
                                                                // swiper.params.navigation.prevEl =
                                                                //     navigationPrevRef.current;
                                                                // swiper.params.navigation.nextEl =
                                                                //     navigationNextRef.current;
                                                                // swiper.navigation.init();
                                                                // swiper.navigation.update();
                                                                swiper.updateSlides();
                                                            }}
                                                            onSlideChange={(swiper) => {
                                                                let receiverIndex = values.receivers.findIndex(
                                                                    (r) =>
                                                                        r.index ===
                                                                        values.orderItems?.[swiper.activeIndex]
                                                                            ?.receiverIndex,
                                                                );
                                                                setCurrent(receiverIndex);
                                                                setCurrentItem(swiper.activeIndex);
                                                            }}
                                                            onSlidesLengthChange={(swiper) => {
                                                                if (
                                                                    activeAction === actions.addItem ||
                                                                    swiper.slides.length === 2
                                                                ) {
                                                                    swiper.slideNext();
                                                                } else if (activeAction === actions.addReceiver) {
                                                                    swiper.slideTo(values.orderItems.length - 1);
                                                                }
                                                            }}
                                                        >
                                                            {values.orderItems.map((item, index) => {
                                                                return (
                                                                    <SwiperSlide className="mb-5">
                                                                        {() => {
                                                                            return (
                                                                                <ItemCreation
                                                                                    key={index}
                                                                                    index={index}
                                                                                    itemName={item?.itemName}
                                                                                    name={`orderItems[${index}]`}
                                                                                    setParentPhoneError={setPhoneError}
                                                                                    onEditReceiver={() =>
                                                                                        setReceiverEditModal(
                                                                                            values.receivers.findIndex(
                                                                                                (r) =>
                                                                                                    r.index ===
                                                                                                    item?.receiverIndex,
                                                                                            ),
                                                                                        )
                                                                                    }
                                                                                    onAddItem={() => {
                                                                                        setActions(actions.addItem);
                                                                                        itemArrayHelpers.insert(
                                                                                            index + 1,
                                                                                            {
                                                                                                itemName: '',
                                                                                                itemCharcode:
                                                                                                    item.itemCharcode,
                                                                                                receiverIndex:
                                                                                                    item.receiverIndex,
                                                                                                itemDescription: '',
                                                                                                quantity: '',
                                                                                                weight: '',
                                                                                                packageType:
                                                                                                    authState
                                                                                                        ?.packageTypes?.[0],
                                                                                                productPictures: [],
                                                                                            },
                                                                                        );
                                                                                        setCurrentItem(index + 1);
                                                                                    }}
                                                                                    onDeleteItem={() => {
                                                                                        setCurrentItem(
                                                                                            index - 1 < 0
                                                                                                ? 0
                                                                                                : index - 1,
                                                                                        );
                                                                                        itemArrayHelpers.remove(index);
                                                                                    }}
                                                                                    {...formProps}
                                                                                ></ItemCreation>
                                                                            );
                                                                        }}
                                                                    </SwiperSlide>
                                                                );
                                                            })}
                                                        </Swiper>
                                                    </div>
                                                </Col>
                                                <Col sm="12" md="6">
                                                    <div
                                                        style={{
                                                            position: 'sticky',
                                                            top: '0',
                                                        }}
                                                    >
                                                        <h5 className="my-3">Receiver List Table</h5>
                                                        <FieldArray
                                                            name="receivers"
                                                            shouldUpdate={(nextProps, props) => true}
                                                        >
                                                            {(receiverArrayHelpers) => {
                                                                return (
                                                                    <>
                                                                        <p>How many receiver?</p>
                                                                        <Row>
                                                                            {values.receivers.map((receiver, index) => {
                                                                                return (
                                                                                    <Col className="p-2" sm="5" xl="3">
                                                                                        <div
                                                                                            className={
                                                                                                currentReceiver ===
                                                                                                    index &&
                                                                                                'text-danger'
                                                                                            }
                                                                                            data-active="true"
                                                                                            style={{
                                                                                                border: '1px solid var(--clr-txt-secondary)',
                                                                                                height: 'fit-content',
                                                                                                display: 'flex',
                                                                                                padding: '5px 10px',
                                                                                                borderRadius: '5px',
                                                                                                alignItems: 'center',
                                                                                                justifyContent:
                                                                                                    'space-between',
                                                                                                cursor: 'pointer',
                                                                                            }}
                                                                                            title={
                                                                                                receiver.receiverName
                                                                                            }
                                                                                        >
                                                                                            <div
                                                                                                onClick={() => {
                                                                                                    setReceiverDropdown(
                                                                                                        (r) =>
                                                                                                            r !==
                                                                                                                null &&
                                                                                                            r === index
                                                                                                                ? null
                                                                                                                : index,
                                                                                                    );
                                                                                                    slideTo(
                                                                                                        values.orderItems.findIndex(
                                                                                                            (i) =>
                                                                                                                i.receiverIndex ===
                                                                                                                index,
                                                                                                        ),
                                                                                                    );
                                                                                                }}
                                                                                            >
                                                                                                {receiver.receiverName ||
                                                                                                    `Receiver ${
                                                                                                        index + 1
                                                                                                    }`}
                                                                                            </div>
                                                                                            <RiArrowDropDownLine
                                                                                                className="times-createProduct"
                                                                                                onClick={() =>
                                                                                                    setReceiverDropdown(
                                                                                                        (r) =>
                                                                                                            r !==
                                                                                                                null &&
                                                                                                            r === index
                                                                                                                ? null
                                                                                                                : index,
                                                                                                    )
                                                                                                }
                                                                                            ></RiArrowDropDownLine>
                                                                                        </div>
                                                                                        <ul
                                                                                            className="aus-dropdown-menu"
                                                                                            data-show={
                                                                                                receiverDropdown ===
                                                                                                index
                                                                                            }
                                                                                        >
                                                                                            <li
                                                                                                className="aus-dropdown-item"
                                                                                                onClick={() =>
                                                                                                    setReceiverEditModal(
                                                                                                        index,
                                                                                                    )
                                                                                                }
                                                                                            >
                                                                                                <MdEdit className="times-createProduct"></MdEdit>{' '}
                                                                                                Edit
                                                                                            </li>
                                                                                            {values.receivers.length >
                                                                                                1 && (
                                                                                                <li
                                                                                                    className="aus-dropdown-item"
                                                                                                    onClick={() => {
                                                                                                        receiverArrayHelpers.remove(
                                                                                                            index,
                                                                                                        );
                                                                                                        values.orderItems.forEach(
                                                                                                            (i, id) => {
                                                                                                                if (
                                                                                                                    i.receiverIndex ===
                                                                                                                    receiver.index
                                                                                                                ) {
                                                                                                                    toast.success(
                                                                                                                        `Removed ${
                                                                                                                            receiver.receiverName ||
                                                                                                                            `Receiver ${
                                                                                                                                index +
                                                                                                                                1
                                                                                                                            }`
                                                                                                                        }`,
                                                                                                                    );
                                                                                                                    itemArrayHelpers.remove(
                                                                                                                        id,
                                                                                                                    );
                                                                                                                }
                                                                                                            },
                                                                                                        );
                                                                                                    }}
                                                                                                >
                                                                                                    <FaTimes className="times-createProduct"></FaTimes>{' '}
                                                                                                    Remove
                                                                                                </li>
                                                                                            )}
                                                                                        </ul>
                                                                                        <Modal
                                                                                            show={
                                                                                                receiverEditModal ===
                                                                                                index
                                                                                            }
                                                                                            onHide={() =>
                                                                                                setReceiverEditModal(
                                                                                                    null,
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            <Modal.Header
                                                                                                closeButton
                                                                                            ></Modal.Header>
                                                                                            <Modal.Body>
                                                                                                <EditReceiverForm
                                                                                                    errors={errors}
                                                                                                    handleBlur={
                                                                                                        handleBlur
                                                                                                    }
                                                                                                    handleChange={
                                                                                                        handleChange
                                                                                                    }
                                                                                                    index={index}
                                                                                                    name={`receivers.[${index}]`}
                                                                                                    phoneError={
                                                                                                        phoneError
                                                                                                    }
                                                                                                    setFieldValue={
                                                                                                        setFieldValue
                                                                                                    }
                                                                                                    setFieldTouched={
                                                                                                        setFieldTouched
                                                                                                    }
                                                                                                    setPhoneError={
                                                                                                        setPhoneError
                                                                                                    }
                                                                                                    touched={touched}
                                                                                                    values={values}
                                                                                                ></EditReceiverForm>
                                                                                                <Button
                                                                                                    variant="success"
                                                                                                    onClick={() =>
                                                                                                        setReceiverEditModal(
                                                                                                            null,
                                                                                                        )
                                                                                                    }
                                                                                                >
                                                                                                    <b>Done</b>
                                                                                                </Button>
                                                                                            </Modal.Body>
                                                                                        </Modal>
                                                                                    </Col>
                                                                                );
                                                                            })}
                                                                            <Col className="p-2" sm="5" xl="3">
                                                                                <Button
                                                                                    onClick={() => {
                                                                                        let newReceiverIndex =
                                                                                            values.receivers?.[
                                                                                                values.receivers
                                                                                                    .length - 1
                                                                                            ]?.index + 1;
                                                                                        setActions(actions.addReceiver);
                                                                                        receiverArrayHelpers.push({
                                                                                            index: newReceiverIndex,
                                                                                            destination: {
                                                                                                unitNumber: '',
                                                                                                streetNumber: '',
                                                                                                streetName: '',
                                                                                                suburb: '',
                                                                                                state: '',
                                                                                                postCode: '',
                                                                                            },
                                                                                            receiverName: '',
                                                                                            receiverPhone: '',
                                                                                        });
                                                                                        itemArrayHelpers.push({
                                                                                            receiverIndex:
                                                                                                newReceiverIndex,
                                                                                            itemName: '',
                                                                                            itemCharcode: Math.floor(
                                                                                                Math.random() *
                                                                                                    (999999 -
                                                                                                        100000 +
                                                                                                        1) +
                                                                                                    100000,
                                                                                            ),
                                                                                            itemDescription: '',
                                                                                            quantity: '',
                                                                                            weight: '',
                                                                                            packageType:
                                                                                                authState
                                                                                                    ?.packageTypes?.[0],
                                                                                            productPictures: [],
                                                                                        });
                                                                                    }}
                                                                                >
                                                                                    <AiOutlineUserAdd className="me-2"></AiOutlineUserAdd>
                                                                                    Add Receiver
                                                                                </Button>
                                                                            </Col>
                                                                        </Row>
                                                                        <p>
                                                                            How many items for{' '}
                                                                            {values.receivers?.find(
                                                                                (d) => d.index === currentReceiver,
                                                                            )?.receiverName ||
                                                                                `Receiver ${
                                                                                    values.receivers.findIndex(
                                                                                        (r) =>
                                                                                            r.index === currentReceiver,
                                                                                    ) + 1
                                                                                }`}
                                                                            ?
                                                                        </p>
                                                                        <Row>
                                                                            {values.orderItems.map((item, index) => {
                                                                                return item.receiverIndex ===
                                                                                    currentReceiver ? (
                                                                                    <Col className="p-2" sm="5" xl="3">
                                                                                        <div
                                                                                            className={
                                                                                                currentItem === index &&
                                                                                                'text-danger'
                                                                                            }
                                                                                            data-active="true"
                                                                                            style={{
                                                                                                border: '1px solid var(--clr-txt-secondary)',
                                                                                                height: 'fit-content',
                                                                                                display: 'flex',
                                                                                                padding: '5px 10px',
                                                                                                borderRadius: '5px',
                                                                                                alignItems: 'center',
                                                                                                justifyContent:
                                                                                                    'space-between',
                                                                                                cursor: 'pointer',
                                                                                            }}
                                                                                            onClick={() =>
                                                                                                setCurrentItem(index)
                                                                                            }
                                                                                            title={item.itemName}
                                                                                        >
                                                                                            <div
                                                                                                onClick={() => {
                                                                                                    setItemDropdown(
                                                                                                        (r) =>
                                                                                                            r !==
                                                                                                                null &&
                                                                                                            r === index
                                                                                                                ? null
                                                                                                                : index,
                                                                                                    );
                                                                                                    slideTo(index);
                                                                                                }}
                                                                                            >
                                                                                                {item.itemName ||
                                                                                                    `Item ${index + 1}`}
                                                                                            </div>
                                                                                            <RiArrowDropDownLine
                                                                                                className="times-createProduct"
                                                                                                onClick={() =>
                                                                                                    setItemDropdown(
                                                                                                        (r) =>
                                                                                                            r !==
                                                                                                                null &&
                                                                                                            r === index
                                                                                                                ? null
                                                                                                                : index,
                                                                                                    )
                                                                                                }
                                                                                            ></RiArrowDropDownLine>
                                                                                        </div>
                                                                                        <ul
                                                                                            className="aus-dropdown-menu"
                                                                                            data-show={
                                                                                                itemDropdown === index
                                                                                            }
                                                                                        >
                                                                                            <li
                                                                                                className="aus-dropdown-item"
                                                                                                onClick={() =>
                                                                                                    slideTo(index)
                                                                                                }
                                                                                            >
                                                                                                <MdEdit className="times-createProduct"></MdEdit>{' '}
                                                                                                Edit
                                                                                            </li>
                                                                                            {values.orderItems.filter(
                                                                                                (i) =>
                                                                                                    i.receiverIndex ===
                                                                                                    currentReceiver,
                                                                                            ).length > 1 && (
                                                                                                <li
                                                                                                    className="aus-dropdown-item"
                                                                                                    onClick={() => {
                                                                                                        itemArrayHelpers.remove(
                                                                                                            index,
                                                                                                        );
                                                                                                    }}
                                                                                                >
                                                                                                    <FaTimes className="times-createProduct"></FaTimes>{' '}
                                                                                                    Remove
                                                                                                </li>
                                                                                            )}
                                                                                        </ul>
                                                                                    </Col>
                                                                                ) : null;
                                                                            })}
                                                                            <Col className="p-2" sm="5" xl="3">
                                                                                <Button
                                                                                    onClick={() => {
                                                                                        setActions(actions.addItem);

                                                                                        itemArrayHelpers.insert(
                                                                                            currentItem + 1,
                                                                                            {
                                                                                                receiverIndex:
                                                                                                    currentReceiver,
                                                                                                itemName: '',
                                                                                                itemCharcode:
                                                                                                    values.orderItems?.[
                                                                                                        currentItem
                                                                                                    ]?.itemCharcode,
                                                                                                itemDescription: '',
                                                                                                quantity: '',
                                                                                                weight: '',
                                                                                                packageType:
                                                                                                    authState
                                                                                                        ?.packageTypes?.[0],
                                                                                                productPictures: [],
                                                                                            },
                                                                                        );

                                                                                        setItemDropdown(
                                                                                            currentItem + 1,
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <LuPackagePlus className="me-2"></LuPackagePlus>
                                                                                    Add Item
                                                                                </Button>
                                                                            </Col>
                                                                        </Row>
                                                                    </>
                                                                );
                                                            }}
                                                        </FieldArray>

                                                        {/* Start shipping rate */}
                                                        <Form.Group className="mb-2 mb-lg-3">
                                                            <Row>
                                                                <Col className="mb-2" xl="12">
                                                                    <Form.Label className="label">
                                                                        Your preference rate
                                                                    </Form.Label>
                                                                    <p className="asterisk">*</p>
                                                                </Col>
                                                                <Col xl="6">
                                                                    <Form.Group className="mb-2 mb-xl-3">
                                                                        <Form.Control
                                                                            type="number"
                                                                            name={`startingRate`}
                                                                            placeholder="Enter your shipping rate"
                                                                            value={values?.startingRate}
                                                                            min={5}
                                                                            isInvalid={
                                                                                touched?.startingRate &&
                                                                                !!errors?.startingRate
                                                                            }
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                        />
                                                                        <Form.Control.Feedback type="invalid">
                                                                            {errors?.startingRate}
                                                                        </Form.Control.Feedback>
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col xl="6"></Col>
                                                            </Row>
                                                        </Form.Group>

                                                        {/* Vehicles */}
                                                        <Form.Group className="form-group">
                                                            <div className="mb-2">
                                                                <Form.Label className="label">Vehicles</Form.Label>
                                                                <p className="asterisk">*</p>
                                                            </div>
                                                            <Row>
                                                                {authState.vehicles.map((item, index) => {
                                                                    return (
                                                                        <Col key={index} sm="6" md="12" lg="6">
                                                                            <label className="fr-checkbox mb-2">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    name={'vehicles'}
                                                                                    value={item?.id}
                                                                                    defaultChecked={values.vehicles.some(
                                                                                        (v) => v === item.id,
                                                                                    )}
                                                                                    onChange={handleChange}
                                                                                    onBlur={handleBlur}
                                                                                />
                                                                                <span className="checkmark"></span>
                                                                                <span
                                                                                    className="txt-checkbox"
                                                                                    style={{
                                                                                        display: 'inline-block',
                                                                                        fontWeight: '500',
                                                                                        overflow: 'hidden',
                                                                                        whiteSpace: 'nowrap',
                                                                                        wordBreak: 'break-word',
                                                                                        textOverflow: 'ellipsis',
                                                                                        maxWidth: '80%',
                                                                                    }}
                                                                                    title={item?.name}
                                                                                >
                                                                                    {item?.name}
                                                                                </span>
                                                                            </label>
                                                                        </Col>
                                                                    );
                                                                })}
                                                            </Row>
                                                            <p className="content-red mt-2">{errors?.vehicles}</p>
                                                        </Form.Group>

                                                        <Button
                                                            // type="submit"
                                                            onClick={() => setSubmitConfirm(true)}
                                                            variant="warning"
                                                            disabled={!isValid || !!phoneError}
                                                            className="my-btn-yellow me-2"
                                                        >
                                                            Search for driver
                                                        </Button>
                                                        <Button onClick={() => setDevModal(true)}>
                                                            <FcAcceptDatabase className="me-2"></FcAcceptDatabase>
                                                            Check your order
                                                        </Button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        );
                                    }}
                                </FieldArray>
                            </div>
                        </Form>
                    </div>
                );
            }}
        </Formik>
    );
}

const EditReceiverForm = ({
    name,
    values,
    touched,
    errors,
    index,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    setPhoneError,
    phoneError,
}) => {
    return (
        <>
            {/* Receiver Information */}
            <Form.Group className="mb-4">
                {/* Receiver Information */}
                <h5 className="my-3">Receiver Information</h5>
                <Row>
                    <Col>
                        <Form.Group className="mb-2">
                            <div className="mb-2">
                                <Form.Label className="label">Receiver Name</Form.Label>
                                <p className="asterisk">*</p>
                            </div>
                            <Form.Control
                                type="text"
                                name={`${name}.receiverName`}
                                placeholder="Enter Receiver Name"
                                value={values.receivers?.[index]?.receiverName}
                                isInvalid={
                                    touched.receivers?.[index]?.receiverName &&
                                    !!errors?.receivers?.[index]?.receiverName
                                }
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors?.receivers?.[index]?.receiverName}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col>
                        {/* Phone */}
                        <Form.Group>
                            <div className="mb-2">
                                <Form.Label className="label">Phone Number</Form.Label>
                                <p className="asterisk">*</p>
                            </div>
                            <PhoneInput
                                country={'au'}
                                value={values.receivers?.[index]?.receiverPhone}
                                containerClass="w-100"
                                inputClass="w-100"
                                onChange={(phone) => setFieldValue(`${name}.receiverPhone`, phone)}
                                onlyCountries={['au', 'vn']}
                                preferredCountries={['au']}
                                placeholder="Enter Receiver Phone number"
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
                                name={`${name}.receiverPhone`}
                                defaultValue={values.receivers?.[index]?.phone}
                                isInvalid={!!errors.receivers?.[index]?.phone || !!phoneError}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.receivers?.[index]?.phone || phoneError}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
            </Form.Group>
            {/* Destination */}
            <Form.Group className="mb-4">
                <div className="mb-2">
                    <Form.Label className="label">Destination</Form.Label>
                    <p className="asterisk">*</p>
                </div>
                <div className="pickup-post">
                    {/* Unit Number */}
                    <Form.Group>
                        <Form.Control
                            type="text"
                            name={`${name}.destination.unitNumber`}
                            placeholder="Enter Unit number (apartment, room,...)"
                            value={values.receivers?.[index]?.destination?.unitNumber}
                            isInvalid={
                                touched.receivers?.[index]?.destination?.unitNumber &&
                                !!errors?.receivers?.[index]?.destination?.unitNumber
                            }
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.receivers?.[index]?.destination?.unitNumber}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Street Number */}
                    <Form.Group>
                        <Form.Control
                            type="text"
                            name={`${name}.destination.streetNumber`}
                            value={values.receivers?.[index]?.destination?.streetNumber}
                            placeholder="Enter street number"
                            isInvalid={
                                touched.receivers?.[index]?.destination?.streetNumber &&
                                !!errors?.receivers?.[index]?.destination?.streetNumber
                            }
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors?.receivers?.[index]?.destination?.streetNumber}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Street Name */}
                    <Form.Group>
                        <Form.Control
                            type="text"
                            name={`${name}.destination.streetName`}
                            placeholder="Enter Street Name"
                            value={values.receivers?.[index]?.destination?.streetName}
                            isInvalid={
                                touched.receivers?.[index]?.destination?.streetName &&
                                !!errors?.receivers?.[index]?.destination?.streetName
                            }
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors?.receivers?.[index]?.destination?.streetName}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Suburb */}
                    <Form.Group>
                        <Form.Control
                            type="text"
                            name={`${name}.destination.suburb`}
                            placeholder="Enter Suburb"
                            value={values.receivers?.[index]?.destination?.suburb}
                            isInvalid={
                                touched.receivers?.[index]?.destination?.suburb &&
                                !!errors?.receivers?.[index]?.destination?.suburb
                            }
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors?.receivers?.[index]?.destination?.suburb}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* State */}
                    <Form.Group>
                        {/* <Form.Control
                            type="text"
                            name={`${name}.destination.state`}
                            placeholder="Enter state"
                            value={values.receivers?.[index]?.destination?.state}
                            isInvalid={
                                touched.receivers?.[index]?.destination?.state &&
                                !!errors?.receivers?.[index]?.destination?.state
                            }
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors?.receivers?.[index]?.destination?.state}
                        </Form.Control.Feedback> */}
                        <Dropdown
                            options={stateOptions}
                            onChange={(e) => {
                                setFieldValue(`${name}.destination.state`, e.value);
                            }}
                            onFocus={() => {
                                setFieldTouched(`${name}.destination.state`, true);
                            }}
                            placeholder={'Select destination state'}
                            className={`${
                                touched.receivers?.[index]?.destination?.state &&
                                !!errors?.receivers?.[index]?.destination?.state
                                    ? ' is-invalid'
                                    : ''
                            }`}
                            controlClassName={
                                'form-control aus-drop-down' +
                                `${
                                    touched.receivers?.[index]?.destination?.state &&
                                    !!errors?.receivers?.[index]?.destination?.state
                                        ? ' is-invalid'
                                        : ''
                                }`
                            }
                            value={values.receivers?.[index]?.destination?.state}
                        ></Dropdown>

                        <Form.Control.Feedback type="invalid">
                            {errors?.receivers?.[index]?.destination?.state}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* State */}
                    <Form.Group>
                        <Form.Control
                            type="text"
                            name={`${name}.destination.postCode`}
                            placeholder="Enter post code"
                            value={values.receivers?.[index]?.destination?.postCode}
                            isInvalid={
                                touched.receivers?.[index]?.destination?.postCode &&
                                !!errors?.receivers?.[index]?.destination?.postCode
                            }
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors?.receivers?.[index]?.destination?.postCode}
                        </Form.Control.Feedback>
                    </Form.Group>
                </div>
            </Form.Group>
        </>
    );
};

function CustomNavButtons({ swiperRef = null }) {
    const swiper = useSwiper();

    return (
        <>
            <AiOutlineLeft
                className="swiper-nav-btns swiper-nav-prev"
                onClick={() => {
                    if (!swiperRef) {
                        swiper.slidePrev();
                    } else {
                        swiperRef?.slidePrev();
                    }
                }}
                style={{
                    display: swiperRef?.activeIndex > 0 ? 'block' : 'none',
                }}
            ></AiOutlineLeft>
            <AiOutlineRight
                className="swiper-nav-btns swiper-nav-next"
                onClick={() => {
                    if (!swiperRef) {
                        swiper.slideNext();
                    } else {
                        swiperRef?.slideNext();
                    }
                }}
                style={{
                    display: swiperRef?.activeIndex < swiperRef?.slides?.length - 1 ? 'block' : 'none',
                }}
            ></AiOutlineRight>
        </>
    );
}

export default function Index() {
    return <OrderCreation></OrderCreation>;
}
