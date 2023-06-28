import React, { useEffect, useRef } from 'react';
import {
    Col,
    Container,
    Row,
    Button,
    Dropdown,
    Table,
    Form,
    Pagination,
    Modal,
    Stack,
    Spinner,
    InputGroup,
} from 'react-bootstrap';
import PaymentPopup from './paymentPopup';
import '../style/senderProductDetail.css';
import { MdPayment } from 'react-icons/md';
import { FieldArray, Formik } from 'formik';
import * as yup from 'yup';
import { RiImageEditFill } from 'react-icons/ri';
import { Navigate, useSearchParams } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';
import { authConstraints, authInstance, config } from '../../../api';
import { usePagination } from '../../../hooks';
import { CustomSpinner } from '../../../layout';
import Carousel from 'react-bootstrap/Carousel';
import { FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Pagination as SwiperPagination, Navigation } from 'swiper';
import { SwiperSlide, Swiper } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { AuthContext } from '../../../stores';
import PhoneInput from 'react-phone-input-2';
import { dotnetFormDataSerialize } from '../../../ultitlies';
import Driver from './driver';

const PERMIT_FILE_FORMATS = ['image/jpeg', 'image/png', 'image/jpg'];

function ProductDetail() {
    const [support, setSupport] = React.useState(false);
    const [authState] = React.useContext(AuthContext);
    const [slider, setSlider] = React.useState(false);
    const [receiveImg, setReceiveImg] = React.useState(false);
    const [deliveryImg, setDeliveryImg] = React.useState(false);
    const [order, setResult] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [popupLoading, setPopupLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [show, setShow] = React.useState(false);
    const [clientSecret, setClientSecret] = React.useState('');
    const rows = [5, 10, 15, 20, 25, 30, 35, 40];
    const [searchParams] = useSearchParams();
    const [editOrderModal, setEditOrderModal] = React.useState(false);
    const [editItemModal, setEditItemodal] = React.useState(null);
    const [addItemModal, setAddItemModal] = React.useState(false);
    const [phoneError, setPhoneError] = React.useState('');
    const product_img_ipt = useRef();

    const {
        currentPage,
        perPageAmount,
        total,
        loading: offerLoading,
        error: offerError,
        items: offers,
        nextPage,
        prevPage,
        setCurrent,
        setPerPageAmount,
        refresh,
    } = usePagination({
        fetchingAPIInstance: ({ controller, page, take }) =>
            authInstance.get([authConstraints.userRoot, authConstraints.getOrderOffers].join('/'), {
                headers: {
                    Authorization: [config.AuthenticationSchema, localStorage.getItem(authConstraints.LOCAL_KEY)].join(
                        ' ',
                    ),
                },
                params: {
                    orderId: searchParams.get(keyquery),
                    page,
                    amount: take,
                },
                signal: controller.signal,
            }),
        propToGetItem: 'result',
        deps: [order],
        propToGetTotalPage: 'total',
        amountPerPage: rows[0],
        startingPage: 1,
        totalPages: 1,
    });

    useEffect(() => {
        if (searchParams.get(keyquery)) {
            getOrderInfo();
        }
    }, [searchParams]);

    useEffect(() => {
        if (order) {
            refresh();
        }
    }, [order]);

    function getOrderInfo() {
        setLoading(true);
        authInstance
            .get([authConstraints.userRoot, authConstraints.getAllOrderInfo].join('/'), {
                headers: {
                    Authorization: [config.AuthenticationSchema, localStorage.getItem(authConstraints.LOCAL_KEY)].join(
                        ' ',
                    ),
                },
                params: {
                    orderId: searchParams.get(keyquery),
                },
            })
            .then((response) => {
                if (response?.data?.successed) {
                    setResult(response?.data?.result);
                }
                setLoading(false);
            })
            .catch((error) => {
                if (error.message === 'Axios Error' && error.code === 403) {
                    setError('Forbiden');
                    toast.error('Forbiden');
                }
                setLoading(false);
            });
    }

    function acceptDriver(driverId) {
        setLoading(true);
        authInstance
            .put([authConstraints.userRoot, authConstraints.acceptDriverOffer].join('/'), null, {
                headers: {
                    Authorization: [config.AuthenticationSchema, localStorage.getItem(authConstraints.LOCAL_KEY)].join(
                        ' ',
                    ),
                },
                params: {
                    orderId: searchParams.get(keyquery),
                    driverId: driverId,
                },
            })
            .then((response) => {
                if (response?.data?.successed && response.data?.result) {
                    const { orderId, driverId } = response.data?.result;
                    getOrderInfo();
                    createOrderPayment(orderId, driverId);
                }
                setLoading(false);
            })
            .catch((error) => {
                toast.error(error?.message);
                setError(error?.message);
                setLoading(false);
            });
    }

    function cancelDriver(driverId) {
        setLoading(true);
        authInstance
            .put([authConstraints.userRoot, authConstraints.cancelDriverOffer].join('/'), null, {
                headers: {
                    Authorization: [config.AuthenticationSchema, localStorage.getItem(authConstraints.LOCAL_KEY)].join(
                        ' ',
                    ),
                },
                params: {
                    orderId: searchParams.get(keyquery),
                    driverId: driverId,
                },
            })
            .then((response) => {
                if (response?.data?.successed && response.data?.result) {
                    const { orderId, driverId } = response.data?.result;
                    getOrderInfo();
                }
                setLoading(false);
            })
            .catch((error) => {
                toast.error(error?.message);
                setError(error?.message);
                setLoading(false);
            });
    }

    function createOrderPayment(orderId, driverId) {
        setPopupLoading(true);
        return authInstance
            .post([authConstraints.userRoot, authConstraints.postCheckoutIntentSessions].join('/'), null, {
                headers: {
                    Authorization: [config.AuthenticationSchema, localStorage.getItem(authConstraints.LOCAL_KEY)].join(
                        ' ',
                    ),
                },
                params: {
                    orderId,
                    driverId,
                },
            })
            .then((response) => {
                if (response.data?.successed) {
                    setShow(true);
                    const { clientSecrete } = response?.data;
                    setClientSecret(clientSecrete);
                }
                setPopupLoading(false);
            })
            .catch((error) => {
                setShow(false);
                setPopupLoading(false);
            });
    }

    function checkoutServerAPI(orderId, driverId) {
        return authInstance
            .post(
                [authConstraints.userRoot, authConstraints.postCheckout].join('/'),
                {},
                {
                    headers: {
                        Authorization: [
                            config.AuthenticationSchema,
                            localStorage.getItem(authConstraints.LOCAL_KEY),
                        ].join(' '),
                    },
                    params: {
                        orderId,
                        driverId,
                    },
                },
            )
            .then((response) => {
                if (response.data?.successed) {
                    toast.success('Successfully payment');
                }
            })
            .catch((error) => {
                toast.error(error?.message);
            });
    }

    function editOrder(body) {
        setPopupLoading(true);
        return authInstance
            .put([authConstraints.userRoot, authConstraints.putUpdateOrder].join('/'), body, {
                headers: {
                    Authorization: [config.AuthenticationSchema, localStorage.getItem(authConstraints.LOCAL_KEY)].join(
                        ' ',
                    ),
                },
            })
            .then((response) => {
                if (response.data?.successed) {
                    toast.success('Successfully edit order');

                    getOrderInfo();
                } else if (response?.data?.error) {
                    toast.error(response?.data?.error);
                } else if (response?.data?.errors && Array.isArray(response?.data?.errors)) {
                    response?.data?.errors.forEach((error) => toast.error(error));
                }
                setPopupLoading(false);
            })
            .catch((error) => {
                setPopupLoading(false);
            });
    }

    function editItem(itemId, body) {
        setPopupLoading(true);
        return authInstance
            .put([authConstraints.userRoot, authConstraints.putUpdateItem].join('/'), body, {
                headers: {
                    Authorization: [config.AuthenticationSchema, localStorage.getItem(authConstraints.LOCAL_KEY)].join(
                        ' ',
                    ),
                },
                params: {
                    itemId,
                },
            })
            .then((response) => {
                if (response.data?.successed) {
                    toast.success('Successfully edit item');
                    getOrderInfo();
                } else if (response?.data?.error) {
                    toast.error(response?.data?.error);
                }
                setPopupLoading(false);
            })
            .catch((error) => {
                setPopupLoading(false);
            });
    }

    function addItem(body) {
        setPopupLoading(true);
        return authInstance
            .post([authConstraints.userRoot, authConstraints.postNewItem].join('/'), body, {
                headers: {
                    Authorization: [config.AuthenticationSchema, localStorage.getItem(authConstraints.LOCAL_KEY)].join(
                        ' ',
                    ),
                },
            })
            .then((response) => {
                if (response.data?.successed) {
                    toast.success('Successfully add new item');

                    getOrderInfo();
                } else if (response?.data?.error) {
                    toast.error(response?.data?.error);
                }
                setPopupLoading(false);
            })
            .catch((error) => {
                setPopupLoading(false);
            });
    }

    if (loading)
        return (
            <Container>
                <CustomSpinner></CustomSpinner>
            </Container>
        );

    if (error === 'Forbiden') return <Navigate to="/user/order"></Navigate>;

    return (
        <div className="p-2 p-lg-3">
            <div>
                {/* Delivery Information Title*/}
                <div className="sender-product-title">
                    <p className="product-content-title">Delivery Information</p>
                </div>
                {/* Delivery Information Body*/}
                <Row className="product-form-content">
                    {/* Left Info: ID, Sender name, Phone number, From, To, Receiver Name, Receiver Phone, Posted Date, Vehicles */}
                    <Col sm="12" md="6">
                        <div className="product-form-info">
                            {/* ID */}
                            <div className="product-label-info">
                                <p className="product-label">ID</p>
                                <p className="product-content">
                                    {'000000'.substring(0, 6 - order?.id?.toString().length) + order?.id}
                                </p>
                            </div>
                            {/* Sender Name */}
                            <div className="product-label-info">
                                <p className="product-label">Sender Name</p>
                                <p className="product-content">
                                    {authState?.accountInfo?.name || authState?.accountInfo?.username}
                                </p>
                            </div>
                            {/* Phone number */}
                            <div className="product-label-info">
                                <p className="product-label">Phone number</p>
                                <p className="product-content">{authState?.accountInfo?.phoneNumber}</p>
                            </div>
                            {/* From */}
                            <div className="product-label-info">
                                <p className="product-label">From</p>
                                <p className="product-content">{order?.sendingLocation}</p>
                            </div>
                            {/* Posted date */}
                            <div className="product-label-info">
                                <p className="product-label">Posted Date</p>
                                <p className="product-content">
                                    {new moment(order?.createdDate).format('YYYY-MM-DD HH : mm : ss')}
                                </p>
                            </div>
                            <div className="product-label-info">
                                <p className="product-label">TimeFrame</p>
                                <p className="product-content">{order?.timeFrame}</p>
                            </div>
                            {/* Deliverable date */}
                            <div className="product-label-info">
                                <p className="product-label">Deliverable Date</p>
                                <p className="product-content">
                                    {new moment(order?.deliverableDate).format('YYYY-MM-DD')}
                                </p>
                            </div>
                            {/* Vehicles */}
                            <div className="product-label-info" style={{ alignItems: 'flex-start' }}>
                                <p className="product-label">Vehicles</p>
                                <div className="product-content">
                                    {order?.vehicles?.map?.((str, idx) => {
                                        return <p key={idx}>- {str}</p>;
                                    })}
                                </div>
                            </div>
                        </div>
                    </Col>
                    {/* Right Info: Starting shipping rates, Selected shipping rates, Status, Delivery Images, Received Images */}
                    <Col sm="12" md="6">
                        <div className="pb-2">
                            <div className="product-label-info">
                                <p className="product-label-fit">Starting shipping rates</p>
                                <p className="product-content">{order?.startingRate} AUD</p>
                            </div>
                            <div className="product-label-info">
                                <p className="product-label-fit">Selected shipping rates</p>
                                <p className="product-content">
                                    {order?.selectedRate ? order?.selectedRate + ' AUD' : 'NULL'}
                                </p>
                            </div>
                            <div className="product-label-info">
                                <p className="product-label-fit">Status</p>

                                {order?.status === 'WaitingForPayment' || order?.status === 'Paid' ? (
                                    <p className="content-red">Closed</p>
                                ) : order?.status !== 'Cancelled' ? (
                                    <p className="content-green">Opening</p>
                                ) : (
                                    <p className="content-red">Not available</p>
                                )}
                            </div>
                            <div className="product-label-info" style={{ alignItems: 'unset' }}>
                                <p className="product-label-fit">Delivery Images</p>
                                <div>
                                    <div
                                        className="img-front-frame"
                                        style={{ padding: '10px 0 ' }}
                                        onClick={() => {
                                            setDeliveryImg(true);
                                        }}
                                    >
                                        <div className="background-front">
                                            <div
                                                style={{
                                                    position: 'relative',
                                                    color: 'gray',
                                                    fontSize: '50px',
                                                    opacity: '70%',
                                                }}
                                            >
                                                {order?.deliverdItemImages?.split('[space]')?.length || 0}
                                            </div>
                                            <p className="driving-txt">view image</p>
                                        </div>
                                        <img
                                            className="img-front"
                                            src={order?.deliverdItemImages?.split?.('[space]')?.[0]}
                                        />
                                    </div>
                                    <div>
                                        <Modal
                                            size="lg"
                                            aria-labelledby="contained-modal-title-vcenter"
                                            centered
                                            show={deliveryImg}
                                        >
                                            <Modal.Header>
                                                <Modal.Title
                                                    className="txt-center w-100"
                                                    onClick={() => {
                                                        setDeliveryImg(false);
                                                    }}
                                                >
                                                    <div style={{ textAlign: 'right' }}>
                                                        <FaTimes style={{ color: 'grey', cursor: 'pointer' }}></FaTimes>
                                                    </div>
                                                </Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body className="link-slider">
                                                <Carousel>
                                                    {order?.deliverdItemImages
                                                        ?.split?.('[space]')
                                                        ?.map((url, index) => {
                                                            return (
                                                                <Carousel.Item
                                                                    style={{ borderLeft: 'none' }}
                                                                    key={index}
                                                                >
                                                                    <img
                                                                        className="w-100"
                                                                        src={url}
                                                                        alt="First slide"
                                                                    />
                                                                    <Carousel.Caption></Carousel.Caption>
                                                                </Carousel.Item>
                                                            );
                                                        })}
                                                </Carousel>
                                            </Modal.Body>
                                        </Modal>
                                    </div>
                                </div>
                            </div>
                            <Button variant="success" onClick={() => setEditOrderModal(true)}>
                                Edit information
                            </Button>
                            <Modal show={editOrderModal} onHide={() => setEditOrderModal(false)}>
                                <Modal.Header closeButton>
                                    <h5 style={{ margin: 0 }}>Edit order information</h5>
                                </Modal.Header>
                                <Modal.Body>
                                    <Formik
                                        initialValues={{
                                            orderId: order?.id,
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
                                            startingRate: order?.startingRate,
                                            vehicles: order?.vehicles.map(
                                                (v) => authState.vehicles.find((p) => p.name === v).id,
                                            ),
                                        }}
                                        validationSchema={yup.object().shape({
                                            sendingLocation: yup.object().shape({
                                                unitNumber: yup.string().required('Unit Number is required'),
                                                streetNumber: yup.string().required('Street Number is required'),
                                                streetName: yup.string().required('Street Name is required'),
                                                suburb: yup.string().required('Suburb is required'),
                                                state: yup.string().required('State is required'),
                                                postCode: yup.number().required('Post code is required'),
                                            }),
                                            deliverableDate: yup.date().required(),
                                            startingRate: yup
                                                .number()
                                                .positive()
                                                .required('Your Reference Rate value is required'),
                                            timeFrame: yup
                                                .string()
                                                .test('TIME INCORRECT', 'The time format is incorrect', (value) => {
                                                    var timeFrames = value?.split('-');
                                                    return timeFrames.length === 2;
                                                })
                                                .test(
                                                    'TIME EXCEEDED',
                                                    'The time of end should be larger than start',
                                                    (value) => {
                                                        var timeFrames = value.split('-');
                                                        var start = moment(timeFrames[0], 'HH:mm');
                                                        var end = moment(timeFrames[1], 'HH:mm');
                                                        return end.diff(start) > 0;
                                                    },
                                                ),
                                            vehicles: yup
                                                .array()
                                                .of(yup.string())
                                                .min(1, 'Vehicle must be selected 1 unit at least'),
                                        })}
                                        onSubmit={(values) => {
                                            editOrder(values);
                                        }}
                                    >
                                        {({
                                            handleChange,
                                            values,
                                            errors,
                                            touched,
                                            isValid,
                                            handleBlur,
                                            handleSubmit,
                                            setFieldValue,
                                        }) => {
                                            return (
                                                <Form onSubmit={handleSubmit}>
                                                    <Row>
                                                        {/* Sending location & Destination */}
                                                        <Col>
                                                            <h4 className="mb-3">Order Location</h4>
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
                                                                        <Form.Control
                                                                            type="text"
                                                                            name="sendingLocation.state"
                                                                            placeholder="Enter state"
                                                                            isInvalid={
                                                                                touched.sendingLocation?.state &&
                                                                                !!errors?.sendingLocation?.state
                                                                            }
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                        />
                                                                        <Form.Control.Feedback type="invalid">
                                                                            {errors?.sendingLocation?.state}
                                                                        </Form.Control.Feedback>
                                                                    </Form.Group>

                                                                    {/* State */}
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
                                                            <h4 className="mb-3">Delivery Capability</h4>
                                                            <Row className="mb-3">
                                                                <Col>
                                                                    {/* Deliverable Date */}
                                                                    <Form.Group className="mb-2">
                                                                        <div className="mb-2">
                                                                            <Form.Label className="label">
                                                                                Deliverable Date
                                                                            </Form.Label>
                                                                            <p className="asterisk">*</p>
                                                                        </div>
                                                                        <Form.Control
                                                                            type="date"
                                                                            name="deliverableDate"
                                                                            placeholder="Enter deliverable date"
                                                                            isInvalid={
                                                                                touched.deliverableDate &&
                                                                                !!errors?.deliverableDate
                                                                            }
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
                                                                            <Form.Label className="label">
                                                                                Time Frame From
                                                                            </Form.Label>
                                                                            <p className="asterisk">*</p>
                                                                        </div>
                                                                        <Form.Control
                                                                            className="mb-2"
                                                                            type="time"
                                                                            name="timeFrame"
                                                                            placeholder="Enter time frame start"
                                                                            isInvalid={
                                                                                touched?.timeFrame &&
                                                                                !!errors?.timeFrame
                                                                            }
                                                                            onChange={(e) => {
                                                                                var timeFrames =
                                                                                    values[e.target.name].split('-');

                                                                                timeFrames[0] = e.target.value;
                                                                                setFieldValue(
                                                                                    e.target.name,
                                                                                    timeFrames.join('-'),
                                                                                    true,
                                                                                );
                                                                            }}
                                                                            onBlur={handleBlur}
                                                                        />
                                                                        <div className="mb-2">
                                                                            <Form.Label className="label">
                                                                                Time Frame To
                                                                            </Form.Label>
                                                                            <p className="asterisk">*</p>
                                                                        </div>
                                                                        <Form.Control
                                                                            type="time"
                                                                            name="timeFrame"
                                                                            placeholder="Enter time frame end"
                                                                            isInvalid={
                                                                                touched.timeFrame && !!errors?.timeFrame
                                                                            }
                                                                            onChange={(e) => {
                                                                                var timeFrames =
                                                                                    values[e.target.name].split('-');

                                                                                timeFrames[1] = e.target.value;
                                                                                setFieldValue(
                                                                                    e.target.name,
                                                                                    timeFrames.join('-'),
                                                                                    true,
                                                                                );
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
                                                        <Col>
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
                                                                type="submit"
                                                                className="w-100"
                                                                disabled={popupLoading || !isValid}
                                                            >
                                                                {popupLoading ? <Spinner></Spinner> : 'Edit'}
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                </Form>
                                            );
                                        }}
                                    </Formik>
                                </Modal.Body>
                            </Modal>
                        </div>
                    </Col>
                </Row>

                {/* Item Information */}
                <div>
                    <div className="sender-product-title">
                        <p className="product-content-title my-4">Product Information</p>
                    </div>
                    <Swiper
                        pagination={{
                            type: 'fraction',
                            renderFraction: (currentClass, totalClass) => {
                                return (
                                    '<span class="' +
                                    currentClass +
                                    '"></span>' +
                                    ' of ' +
                                    '<span class="' +
                                    totalClass +
                                    '"></span>'
                                );
                            },
                        }}
                        autoHeight={true}
                        navigation={true}
                        spaceBetween={20}
                        modules={[Navigation, SwiperPagination]}
                        slideNextClass={'aus-swiper-slider-next'}
                        slidePrevClass={'aus-swiper-slider-prev'}
                        currentClass="aus-swiper-current"
                        totalClass="aus-swiper-total"
                    >
                        {order?.orderItems?.map?.((item, index) => {
                            return (
                                <SwiperSlide key={index} className="pb-5">
                                    <Button variant="success" className="mb-3" onClick={() => setEditItemodal(index)}>
                                        Edit
                                    </Button>
                                    <Modal show={editItemModal === index} onHide={() => setEditItemodal(null)}>
                                        <Modal.Header closeButton>
                                            <h4 style={{ margin: 0 }}>Edit Item</h4>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <Formik
                                                initialValues={{
                                                    itemName: item.itemName,
                                                    destination: {
                                                        unitNumber: '',
                                                        streetNumber: '',
                                                        streetName: '',
                                                        suburb: '',
                                                        state: '',
                                                        postCode: '',
                                                    },
                                                    receiverName: item.receiverName,
                                                    receiverPhone: item.receiverPhone,
                                                    itemDescription: item.itemDescription,
                                                    quantity: item?.quantity,
                                                    weight: item?.weight,
                                                    packageType: authState?.packageTypes?.[0],
                                                    productPictures: [],
                                                }}
                                                validationSchema={yup.object().shape({
                                                    itemName: yup.string().required('Item Name is required field'),
                                                    destination: yup.object().shape({
                                                        unitNumber: yup.string().required('Unit Number is required'),
                                                        streetNumber: yup
                                                            .string()
                                                            .required('Street Number is required'),
                                                        streetName: yup.string().required('Street Name is required'),
                                                        suburb: yup.string().required('Suburb is required'),
                                                        state: yup.string().required('State is required'),
                                                        postCode: yup.number().required('Post code is required'),
                                                    }),
                                                    itemDescription: yup.string().nullable(),
                                                    receiverName: yup.string().required('Receiver Name is required'),
                                                    receiverPhone: yup.string().required('Receiver Phone is required'),
                                                    quantity: yup
                                                        .number()
                                                        .positive()
                                                        .min(1, 'Quantity should be larger then 1 and least than 10')
                                                        .max(10, 'Quantity should be larger then 1 and least than 10')
                                                        .required('Quantity is required field'),
                                                    weight: yup
                                                        .number()
                                                        .positive()
                                                        .required('Weight is required field'),
                                                    packageType: yup
                                                        .string()
                                                        .required('Package Type is required field'),
                                                    productPictures: yup
                                                        .array()
                                                        .of(
                                                            yup.object().shape({
                                                                file: yup.mixed().required(),
                                                                url: yup.string().required(),
                                                            }),
                                                        )
                                                        .min(1, 'Adding more pictures for product')
                                                        .required('Adding more pictures for product')
                                                        .test(
                                                            'FILE SIZE',
                                                            'the file collection is too large',
                                                            (files) => {
                                                                if (!files) {
                                                                    return true;
                                                                }
                                                                return (
                                                                    files.reduce((p, c) => c.file.size + p, 0) <=
                                                                    2 * 1024 * 1024
                                                                );
                                                            },
                                                        )
                                                        .test(
                                                            'FILE FORMAT',
                                                            `the file format should be ${PERMIT_FILE_FORMATS.join()}`,
                                                            (files) => {
                                                                if (!files.length) {
                                                                    return true;
                                                                }
                                                                return files.every((c) =>
                                                                    PERMIT_FILE_FORMATS.includes(c.file.type),
                                                                );
                                                            },
                                                        ),
                                                })}
                                                onSubmit={(values) => {
                                                    const handledObjects = {
                                                        ...values,
                                                        productPictures: values.productPictures
                                                            .filter((item) => item?.file)
                                                            .map((item) => item?.file),
                                                    };
                                                    console.log(handledObjects);

                                                    const formData = dotnetFormDataSerialize(handledObjects, {
                                                        indices: true,
                                                        dotsForObjectNotation: true,
                                                    });

                                                    editItem(item?.id, formData);
                                                }}
                                            >
                                                {({
                                                    handleChange,
                                                    handleSubmit,
                                                    handleBlur,
                                                    setFieldValue,
                                                    values,
                                                    errors,
                                                    isValid,
                                                    touched,
                                                }) => {
                                                    return (
                                                        <Form className="p-2" onSubmit={handleSubmit}>
                                                            <Form.Group className="mb-4">
                                                                {/* Receiver Information */}
                                                                <h5 className="my-3">Receiver Information</h5>
                                                                <Row>
                                                                    <Col>
                                                                        <Form.Group>
                                                                            <div className="mb-2">
                                                                                <Form.Label className="label">
                                                                                    Receiver Name
                                                                                </Form.Label>
                                                                                <p className="asterisk">*</p>
                                                                            </div>
                                                                            <Form.Control
                                                                                type="text"
                                                                                name={`receiverName`}
                                                                                placeholder="Enter Receiver Name"
                                                                                value={values?.receiverName}
                                                                                isInvalid={
                                                                                    touched?.receiverName &&
                                                                                    !!errors?.receiverName
                                                                                }
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                            />
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {errors?.receiverName}
                                                                            </Form.Control.Feedback>
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col>
                                                                        {/* Phone */}
                                                                        <Form.Group>
                                                                            <div className="mb-2">
                                                                                <Form.Label className="label">
                                                                                    Phone Number
                                                                                </Form.Label>
                                                                                <p className="asterisk">*</p>
                                                                            </div>
                                                                            <PhoneInput
                                                                                country={'au'}
                                                                                value={values?.receiverPhone}
                                                                                containerClass="w-100"
                                                                                inputClass="w-100"
                                                                                onChange={(phone) =>
                                                                                    setFieldValue(
                                                                                        `receiverPhone`,
                                                                                        phone,
                                                                                    )
                                                                                }
                                                                                onlyCountries={['au', 'vn']}
                                                                                preferredCountries={['au']}
                                                                                placeholder="Enter Receiver Phone number"
                                                                                autoFormat={true}
                                                                                isValid={(
                                                                                    inputNumber,
                                                                                    _,
                                                                                    countries,
                                                                                ) => {
                                                                                    const isValid = countries.some(
                                                                                        (country) => {
                                                                                            return (
                                                                                                inputNumber.startsWith(
                                                                                                    country.dialCode,
                                                                                                ) ||
                                                                                                country.dialCode.startsWith(
                                                                                                    inputNumber,
                                                                                                )
                                                                                            );
                                                                                        },
                                                                                    );

                                                                                    setPhoneError('');

                                                                                    if (!isValid) {
                                                                                        setPhoneError(
                                                                                            'Your phone is not match with dial code',
                                                                                        );
                                                                                    }

                                                                                    return isValid;
                                                                                }}
                                                                            ></PhoneInput>
                                                                            <Form.Control
                                                                                type="hidden"
                                                                                name={`receiverPhone`}
                                                                                defaultValue={values?.phone}
                                                                                isInvalid={
                                                                                    !!errors?.phone || !!phoneError
                                                                                }
                                                                            />
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {errors?.phone || phoneError}
                                                                            </Form.Control.Feedback>
                                                                        </Form.Group>
                                                                    </Col>
                                                                </Row>
                                                            </Form.Group>
                                                            {/* Destination */}
                                                            <Form.Group className="mb-4">
                                                                <div className="mb-2">
                                                                    <Form.Label className="label">
                                                                        Destination
                                                                    </Form.Label>
                                                                    <p className="asterisk">*</p>
                                                                </div>
                                                                <div className="pickup-post">
                                                                    {/* Unit Number */}
                                                                    <Form.Group>
                                                                        <Form.Control
                                                                            type="text"
                                                                            name={`destination.unitNumber`}
                                                                            placeholder="Enter Unit number (apartment, room,...)"
                                                                            value={values?.destination?.unitNumber}
                                                                            isInvalid={
                                                                                touched?.destination?.unitNumber &&
                                                                                !!errors?.destination?.unitNumber
                                                                            }
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                        />
                                                                        <Form.Control.Feedback type="invalid">
                                                                            {errors?.destination?.unitNumber}
                                                                        </Form.Control.Feedback>
                                                                    </Form.Group>

                                                                    {/* Street Number */}
                                                                    <Form.Group>
                                                                        <Form.Control
                                                                            type="text"
                                                                            name={`destination.streetNumber`}
                                                                            value={values?.destination?.streetNumber}
                                                                            placeholder="Enter street number"
                                                                            isInvalid={
                                                                                touched?.destination?.streetNumber &&
                                                                                !!errors?.destination?.streetNumber
                                                                            }
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                        />
                                                                        <Form.Control.Feedback type="invalid">
                                                                            {errors?.destination?.streetNumber}
                                                                        </Form.Control.Feedback>
                                                                    </Form.Group>

                                                                    {/* Street Name */}
                                                                    <Form.Group>
                                                                        <Form.Control
                                                                            type="text"
                                                                            name={`destination.streetName`}
                                                                            placeholder="Enter Street Name"
                                                                            value={values?.destination?.streetName}
                                                                            isInvalid={
                                                                                touched?.destination?.streetName &&
                                                                                !!errors?.destination?.streetName
                                                                            }
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                        />
                                                                        <Form.Control.Feedback type="invalid">
                                                                            {errors?.destination?.streetName}
                                                                        </Form.Control.Feedback>
                                                                    </Form.Group>

                                                                    {/* Suburb */}
                                                                    <Form.Group>
                                                                        <Form.Control
                                                                            type="text"
                                                                            name={`destination.suburb`}
                                                                            placeholder="Enter Suburb"
                                                                            value={values?.destination?.suburb}
                                                                            isInvalid={
                                                                                touched?.destination?.suburb &&
                                                                                !!errors?.destination?.suburb
                                                                            }
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                        />
                                                                        <Form.Control.Feedback type="invalid">
                                                                            {errors?.destination?.suburb}
                                                                        </Form.Control.Feedback>
                                                                    </Form.Group>

                                                                    {/* State */}
                                                                    <Form.Group>
                                                                        <Form.Control
                                                                            type="text"
                                                                            name={`destination.state`}
                                                                            placeholder="Enter state"
                                                                            value={
                                                                                values.orderItems?.[index]?.destination
                                                                                    ?.state
                                                                            }
                                                                            isInvalid={
                                                                                touched?.destination?.state &&
                                                                                !!errors?.destination?.state
                                                                            }
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                        />
                                                                        <Form.Control.Feedback type="invalid">
                                                                            {errors?.destination?.state}
                                                                        </Form.Control.Feedback>
                                                                    </Form.Group>

                                                                    {/* State */}
                                                                    <Form.Group>
                                                                        <Form.Control
                                                                            type="text"
                                                                            name={`destination.postCode`}
                                                                            placeholder="Enter post code"
                                                                            value={values?.destination?.postCode}
                                                                            isInvalid={
                                                                                touched?.destination?.postCode &&
                                                                                !!errors?.destination?.postCode
                                                                            }
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                        />
                                                                        <Form.Control.Feedback type="invalid">
                                                                            {errors?.destination?.postCode}
                                                                        </Form.Control.Feedback>
                                                                    </Form.Group>
                                                                </div>
                                                            </Form.Group>
                                                            {/* Item Name  */}
                                                            <Form.Group className="mb-3">
                                                                <div className="mb-2">
                                                                    <Form.Label className="label">Item Name</Form.Label>
                                                                    <p className="asterisk">*</p>
                                                                </div>
                                                                <Form.Control
                                                                    type="text"
                                                                    name={`itemName`}
                                                                    value={values?.itemName}
                                                                    placeholder="Enter Product Name"
                                                                    isInvalid={touched?.itemName && errors?.itemName}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                />
                                                                <Form.Control.Feedback type="invalid">
                                                                    {errors?.itemName}
                                                                </Form.Control.Feedback>
                                                            </Form.Group>
                                                            {/* Item Description  */}
                                                            <Form.Group className="mb-3">
                                                                <div className="mb-2">
                                                                    <Form.Label className="label">
                                                                        Product Description
                                                                    </Form.Label>
                                                                    <p className="asterisk">*</p>
                                                                </div>
                                                                <Form.Control
                                                                    as="textarea"
                                                                    row="3"
                                                                    placeholder="Enter Product Description"
                                                                    name={`itemDescription`}
                                                                    value={values?.itemDescription}
                                                                    isInvalid={
                                                                        touched?.itemDescription &&
                                                                        !!errors?.itemDescription
                                                                    }
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                />
                                                                <Form.Control.Feedback type="invalid">
                                                                    {errors?.itemDescription}
                                                                </Form.Control.Feedback>
                                                            </Form.Group>
                                                            {/* Quantity and Weight */}
                                                            <Row>
                                                                <Col>
                                                                    {/* Quantity  */}
                                                                    <Form.Group className="mb-3">
                                                                        <div className="mb-2">
                                                                            <Form.Label className="label">
                                                                                Quantity
                                                                            </Form.Label>
                                                                            <p className="asterisk">*</p>
                                                                        </div>
                                                                        <Form.Control
                                                                            type="number"
                                                                            className="product-form-input"
                                                                            min={0}
                                                                            max={10}
                                                                            name={`quantity`}
                                                                            placeholder="Enter Quantity"
                                                                            value={values?.quantity}
                                                                            isInvalid={
                                                                                touched?.quantity && !!errors?.quantity
                                                                            }
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                        />
                                                                        <Form.Control.Feedback type="invalid">
                                                                            {errors?.quantity}
                                                                        </Form.Control.Feedback>
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col>
                                                                    {/* Weight  */}
                                                                    <Form.Group className="mb-3">
                                                                        <div className="mb-2">
                                                                            <Form.Label className="label">
                                                                                Weight
                                                                            </Form.Label>
                                                                            <p className="asterisk">*</p>
                                                                        </div>
                                                                        <InputGroup>
                                                                            <Form.Control
                                                                                type="text"
                                                                                name={`weight`}
                                                                                placeholder="Enter item weight"
                                                                                value={values?.weight}
                                                                                isInvalid={
                                                                                    touched?.weight && !!errors?.weight
                                                                                }
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                aria-describedby="weight"
                                                                            />
                                                                            <InputGroup.Text id="weight">
                                                                                Kilogram
                                                                            </InputGroup.Text>
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {errors?.weight}
                                                                            </Form.Control.Feedback>
                                                                        </InputGroup>
                                                                    </Form.Group>
                                                                </Col>
                                                            </Row>
                                                            {/* Product Pictures & Shipping Rate & PackageType & Vehicles*/}
                                                            <Row>
                                                                {/* Shipping Rate & Package Type & Vehicles */}
                                                                <Col sm="12" xl="6">
                                                                    {/* Package Type */}
                                                                    <Form.Group className="mb-3">
                                                                        <div className="mb-2">
                                                                            <Form.Label className="label">
                                                                                Package Type
                                                                            </Form.Label>
                                                                            <p className="asterisk">*</p>
                                                                        </div>

                                                                        <Form.Select
                                                                            type="string"
                                                                            name={`packageType`}
                                                                            placeholder="Select your type of package"
                                                                            isInvalid={
                                                                                touched?.packageType &&
                                                                                !!errors?.packageType
                                                                            }
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            defaultValue={values?.packageType}
                                                                        >
                                                                            {authState?.packageTypes?.map(
                                                                                (type, index) => {
                                                                                    return (
                                                                                        <option
                                                                                            key={index}
                                                                                            value={type}
                                                                                        >
                                                                                            {type}
                                                                                        </option>
                                                                                    );
                                                                                },
                                                                            )}
                                                                        </Form.Select>
                                                                        <Form.Control.Feedback type="invalid">
                                                                            {errors?.orderItems?.[index]?.packageType}
                                                                        </Form.Control.Feedback>
                                                                    </Form.Group>
                                                                </Col>
                                                                {/* Old Product Pictures */}
                                                                <Col>
                                                                    <Form.Group className="mb-3">
                                                                        <div className="mb-2">
                                                                            <Form.Label className="label">
                                                                                Old Pictures
                                                                            </Form.Label>
                                                                        </div>
                                                                    </Form.Group>
                                                                    <Row>
                                                                        {item?.itemImages
                                                                            .split('[space]')
                                                                            .map((image) => (
                                                                                <Col>
                                                                                    <img
                                                                                        src={image}
                                                                                        className="w-100"
                                                                                        style={{ maxWidth: '120px' }}
                                                                                    ></img>
                                                                                </Col>
                                                                            ))}
                                                                    </Row>
                                                                </Col>
                                                                {/* Product pictures */}
                                                                <Col sm="12" xl="6">
                                                                    <Form.Group className="mb-3">
                                                                        <div className="mb-2">
                                                                            <Form.Label className="label">
                                                                                Product Images
                                                                            </Form.Label>
                                                                            <p className="asterisk">*</p>
                                                                        </div>
                                                                        <div className="back-up">
                                                                            <FieldArray
                                                                                name={`productPictures`}
                                                                                render={(arrayHelpers) => {
                                                                                    return (
                                                                                        <>
                                                                                            <Form.Control
                                                                                                type="file"
                                                                                                id="driver_image_back"
                                                                                                ref={product_img_ipt}
                                                                                                multiple
                                                                                                isInvalid={
                                                                                                    !!errors?.productPictures
                                                                                                }
                                                                                                onChange={(e) => {
                                                                                                    const files =
                                                                                                        e.target.files;
                                                                                                    for (
                                                                                                        var i = 0;
                                                                                                        i <
                                                                                                        files.length;
                                                                                                        i++
                                                                                                    ) {
                                                                                                        //for multiple files
                                                                                                        (function (
                                                                                                            file,
                                                                                                        ) {
                                                                                                            const fileReader =
                                                                                                                new FileReader();
                                                                                                            fileReader.onload =
                                                                                                                function (
                                                                                                                    e,
                                                                                                                ) {
                                                                                                                    // get file content
                                                                                                                    fileReader.addEventListener(
                                                                                                                        'loadend',
                                                                                                                        (
                                                                                                                            e,
                                                                                                                        ) => {
                                                                                                                            arrayHelpers.push(
                                                                                                                                {
                                                                                                                                    file,
                                                                                                                                    url: fileReader.result,
                                                                                                                                },
                                                                                                                            );
                                                                                                                        },
                                                                                                                    );
                                                                                                                };
                                                                                                            fileReader.readAsDataURL(
                                                                                                                file,
                                                                                                            );
                                                                                                        })(files[i]);
                                                                                                    }
                                                                                                }}
                                                                                                accept="img"
                                                                                            />
                                                                                            <Form.Control.Feedback type="invalid">
                                                                                                {
                                                                                                    errors?.productPictures
                                                                                                }
                                                                                            </Form.Control.Feedback>
                                                                                            <Row
                                                                                                style={{
                                                                                                    flexDirection:
                                                                                                        'column',
                                                                                                }}
                                                                                            >
                                                                                                {values?.productPictures?.map?.(
                                                                                                    (picture, ind) => {
                                                                                                        return (
                                                                                                            <Col
                                                                                                                key={
                                                                                                                    ind
                                                                                                                }
                                                                                                            >
                                                                                                                <div className="img-front-frame">
                                                                                                                    {picture?.url ? (
                                                                                                                        <>

                                                                                                                        </>
                                                                                                                    ) : (
                                                                                                                        <div className="background-front">
                                                                                                                            <RiImageEditFill
                                                                                                                                style={{
                                                                                                                                    position:
                                                                                                                                        'relative',
                                                                                                                                    color: 'gray',
                                                                                                                                    fontSize:
                                                                                                                                        '50px',
                                                                                                                                    opacity:
                                                                                                                                        '70%',
                                                                                                                                }}
                                                                                                                            ></RiImageEditFill>
                                                                                                                            <p className="driving-txt">
                                                                                                                                Change
                                                                                                                                Product
                                                                                                                                Images
                                                                                                                            </p>
                                                                                                                        </div>
                                                                                                                    )}
                                                                                                                    <img
                                                                                                                        className="img-front"
                                                                                                                        src={
                                                                                                                            picture?.url ||
                                                                                                                            'https://tinyurl.com/5ehpcctt'
                                                                                                                        }
                                                                                                                    />
                                                                                                                </div>
                                                                                                                <Button
                                                                                                                    variant="danger"
                                                                                                                    onClick={() =>
                                                                                                                        arrayHelpers.remove(
                                                                                                                            ind,
                                                                                                                        )
                                                                                                                    }
                                                                                                                >
                                                                                                                    Remove
                                                                                                                </Button>
                                                                                                                {
                                                                                                                    errors
                                                                                                                        ?.productPictures?.[
                                                                                                                        ind
                                                                                                                    ]
                                                                                                                        ?.file
                                                                                                                }
                                                                                                            </Col>
                                                                                                        );
                                                                                                    },
                                                                                                )}
                                                                                                <Col>
                                                                                                    <div
                                                                                                        className="img-front-frame"
                                                                                                        onClick={() =>
                                                                                                            product_img_ipt.current.click()
                                                                                                        }
                                                                                                    >
                                                                                                        <div className="background-front">
                                                                                                            <RiImageEditFill
                                                                                                                style={{
                                                                                                                    position:
                                                                                                                        'relative',
                                                                                                                    color: 'gray',
                                                                                                                    fontSize:
                                                                                                                        '50px',
                                                                                                                    opacity:
                                                                                                                        '70%',
                                                                                                                }}
                                                                                                            ></RiImageEditFill>
                                                                                                            <p className="driving-txt">
                                                                                                                Change
                                                                                                                Product
                                                                                                                Images
                                                                                                            </p>
                                                                                                        </div>
                                                                                                        <img
                                                                                                            className="img-front"
                                                                                                            src={
                                                                                                                'https://tinyurl.com/5ehpcctt'
                                                                                                            }
                                                                                                        />
                                                                                                    </div>
                                                                                                </Col>
                                                                                            </Row>
                                                                                            <Form.Control
                                                                                                type="file"
                                                                                                id="driver_image_back"
                                                                                                ref={product_img_ipt}
                                                                                                multiple
                                                                                                isInvalid={
                                                                                                    !!errors?.productPictures
                                                                                                }
                                                                                                onChange={(e) => {
                                                                                                    const files =
                                                                                                        e.target.files;
                                                                                                    for (
                                                                                                        var i = 0;
                                                                                                        i <
                                                                                                        files.length;
                                                                                                        i++
                                                                                                    ) {
                                                                                                        //for multiple files
                                                                                                        (function (
                                                                                                            file,
                                                                                                        ) {
                                                                                                            const fileReader =
                                                                                                                new FileReader();
                                                                                                            fileReader.onload =
                                                                                                                function (
                                                                                                                    e,
                                                                                                                ) {
                                                                                                                    // get file content
                                                                                                                    fileReader.addEventListener(
                                                                                                                        'loadend',
                                                                                                                        (
                                                                                                                            e,
                                                                                                                        ) => {
                                                                                                                            arrayHelpers.push(
                                                                                                                                {
                                                                                                                                    file,
                                                                                                                                    url: fileReader.result,
                                                                                                                                },
                                                                                                                            );
                                                                                                                        },
                                                                                                                    );
                                                                                                                };
                                                                                                            fileReader.readAsDataURL(
                                                                                                                file,
                                                                                                            );
                                                                                                        })(files[i]);
                                                                                                    }
                                                                                                }}
                                                                                                accept="img"
                                                                                            />
                                                                                            <Form.Control.Feedback type="invalid">
                                                                                                {
                                                                                                    errors?.productPictures
                                                                                                }
                                                                                            </Form.Control.Feedback>
                                                                                        </>
                                                                                    );
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </Form.Group>
                                                                </Col>
                                                            </Row>

                                                            <Button type="submit" disabled={popupLoading || !isValid}>
                                                                {popupLoading ? <Spinner></Spinner> : 'Edit'}
                                                            </Button>
                                                        </Form>
                                                    );
                                                }}
                                            </Formik>
                                        </Modal.Body>
                                    </Modal>
                                    <Row className="product-form-content justify-content-center" key={index + 1}>
                                        <Col sm="12" md="8" lg="6">
                                            <div className="product-form-info">
                                                {/* Item name */}
                                                <div className="product-label-info">
                                                    <p className="product-label text-sm-start text-lg-end">Item Name</p>
                                                    <p className="product-content">{item.itemName}</p>
                                                </div>
                                                {/* Charcode */}
                                                <div className="product-label-info">
                                                    <p className="product-label text-sm-start text-lg-end">Charcode</p>
                                                    <p className="product-content">
                                                        {'000000'.substring(
                                                            0,
                                                            6 - item.itemCharCode.toString().length,
                                                        ) + item.itemCharCode}
                                                    </p>
                                                </div>
                                                {/* Note */}
                                                <div className="product-label-info">
                                                    <p className="product-label text-sm-start text-lg-end">Note</p>
                                                    <p className="product-content">{item.itemDescription}</p>
                                                </div>
                                                {/* Quantity */}
                                                <div className="product-label-info">
                                                    <p className="product-label text-sm-start text-lg-end">Quantity</p>
                                                    <p className="product-content">{item.quantity}</p>
                                                </div>
                                                {/* Weight */}
                                                <div className="product-label-info">
                                                    <p className="product-label text-sm-start text-lg-end">Weight</p>
                                                    <p className="product-content">{item?.weight} Kilograms</p>
                                                </div>
                                                {/* Package type */}
                                                <div className="product-label-info">
                                                    <p className="product-label text-sm-start text-lg-end">
                                                        Package Type
                                                    </p>
                                                    <p className="product-content">{item.packageType}</p>
                                                </div>
                                                {/* From */}
                                                <div className="product-label-info">
                                                    <p className="product-label text-sm-start text-lg-end">From</p>
                                                    <p className="product-content">{order?.sendingLocation}</p>
                                                </div>
                                                {/* To */}
                                                <div className="product-label-info">
                                                    <p className="product-label text-sm-start text-lg-end">To</p>
                                                    <p className="product-content">{item?.destination}</p>
                                                </div>
                                                {/* Receiver Name */}
                                                <div className="product-label-info">
                                                    <p className="product-label text-sm-start text-lg-end">
                                                        Receiver Name
                                                    </p>
                                                    <p className="product-content">
                                                        {item?.receiverName || 'Provide now'}
                                                    </p>
                                                </div>
                                                {/* Receiver Phone */}
                                                <div className="product-label-info">
                                                    <p className="product-label text-sm-start text-lg-end">
                                                        Receiver Phone
                                                    </p>
                                                    <p className="product-content">{item?.receiverPhone}</p>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col sm="12" md="8" lg="6">
                                            <div className="product-label-info" style={{ alignItems: 'unset' }}>
                                                <p className="product-label-fit text-sm-end text-md-start">
                                                    Received Barcode
                                                </p>
                                                <p>{item?.itemCharCode}</p>
                                            </div>
                                            <div className="product-label-info" style={{ alignItems: 'unset' }}>
                                                <p className="product-label-fit text-sm-end text-md-start">
                                                    Product pictures
                                                </p>
                                                <div>
                                                    <div
                                                        className="img-front-frame"
                                                        style={{ padding: '10px 0 ' }}
                                                        onClick={() => {
                                                            setSlider(true);
                                                        }}
                                                    >
                                                        <div className="background-front">
                                                            <div
                                                                style={{
                                                                    position: 'relative',
                                                                    color: 'gray',
                                                                    fontSize: '50px',
                                                                    opacity: '70%',
                                                                }}
                                                            >
                                                                {
                                                                    order?.orderItems?.[0]?.itemImages?.split('[space]')
                                                                        ?.length
                                                                }
                                                            </div>
                                                            <p className="driving-txt">view image</p>
                                                        </div>
                                                        <img
                                                            className="img-front"
                                                            src={item.itemImages?.split?.('[space]')?.[0]}
                                                        />
                                                    </div>
                                                    <div>
                                                        {slider ? (
                                                            <div>
                                                                <Modal
                                                                    size="lg"
                                                                    aria-labelledby="contained-modal-title-vcenter"
                                                                    centered
                                                                    show={slider}
                                                                >
                                                                    <Modal.Header>
                                                                        <Modal.Title
                                                                            className="txt-center w-100"
                                                                            onClick={() => {
                                                                                setSlider(false);
                                                                            }}
                                                                        >
                                                                            <div style={{ textAlign: 'right' }}>
                                                                                <FaTimes
                                                                                    style={{
                                                                                        color: 'grey',
                                                                                        cursor: 'pointer',
                                                                                    }}
                                                                                ></FaTimes>
                                                                            </div>
                                                                        </Modal.Title>
                                                                    </Modal.Header>
                                                                    <Modal.Body className="link-slider">
                                                                        <Carousel>
                                                                            {item.itemImages
                                                                                ?.split?.('[space]')
                                                                                ?.map((url, index) => {
                                                                                    return (
                                                                                        <Carousel.Item
                                                                                            style={{
                                                                                                borderLeft: 'none',
                                                                                            }}
                                                                                            key={index}
                                                                                        >
                                                                                            <img
                                                                                                className="w-100"
                                                                                                src={url}
                                                                                                alt="First slide"
                                                                                            />
                                                                                            <Carousel.Caption></Carousel.Caption>
                                                                                        </Carousel.Item>
                                                                                    );
                                                                                })}
                                                                        </Carousel>
                                                                    </Modal.Body>
                                                                </Modal>
                                                            </div>
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="product-label-info" style={{ alignItems: 'unset' }}>
                                                <p className="product-label-fit text-sm-end text-md-start">
                                                    Received Images
                                                </p>
                                                <div>
                                                    <div
                                                        className="img-front-frame"
                                                        style={{ padding: '10px 0 ' }}
                                                        onClick={() => {
                                                            setReceiveImg(true);
                                                        }}
                                                    >
                                                        <div className="background-front">
                                                            <div
                                                                style={{
                                                                    position: 'relative',
                                                                    color: 'gray',
                                                                    fontSize: '50px',
                                                                    opacity: '70%',
                                                                }}
                                                            >
                                                                {order?.receivedItemImages?.split('[space]')?.length ||
                                                                    0}
                                                            </div>
                                                            <p className="driving-txt">view image</p>
                                                        </div>
                                                        <img
                                                            className="img-front"
                                                            src={item?.receivedItemImages?.split?.('[space]')?.[0]}
                                                        />
                                                    </div>
                                                    <Modal
                                                        size="lg"
                                                        aria-labelledby="contained-modal-title-vcenter"
                                                        centered
                                                        show={receiveImg}
                                                    >
                                                        <Modal.Header>
                                                            <Modal.Title
                                                                className="txt-center w-100"
                                                                onClick={() => {
                                                                    setReceiveImg(false);
                                                                }}
                                                            >
                                                                <div style={{ textAlign: 'right' }}>
                                                                    <FaTimes
                                                                        style={{ color: 'grey', cursor: 'pointer' }}
                                                                    ></FaTimes>
                                                                </div>
                                                            </Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body className="link-slider">
                                                            <Carousel>
                                                                {order.receivedItemImages
                                                                    ?.split?.('[space]')
                                                                    ?.map((url, index) => {
                                                                        return (
                                                                            <Carousel.Item
                                                                                style={{ borderLeft: 'none' }}
                                                                                key={index}
                                                                            >
                                                                                <img
                                                                                    className="w-100"
                                                                                    src={url}
                                                                                    alt="First slide"
                                                                                />
                                                                                <Carousel.Caption></Carousel.Caption>
                                                                            </Carousel.Item>
                                                                        );
                                                                    })}
                                                            </Carousel>
                                                        </Modal.Body>
                                                    </Modal>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                    <div className="py-4">
                        <div className="product-label-info my">
                            <p className="product-label-fit">Status</p>
                            <p className="content-blue">{order.status?.replace?.(/([A-Z])/g, ' $1')?.trim?.()}</p>
                        </div>
                        <div>
                            <p style={{ fontWeight: '600' }}>The driver requested {order?.offerNumber} offers</p>
                        </div>
                        <div className="pg-rows">
                            <p className="m-0">Show</p>
                            <div>
                                <Dropdown className="reg-dr" style={{ width: 'fit-content' }}>
                                    <Dropdown.Toggle className="dr-btn py-1" id="dropdown-basic">
                                        {perPageAmount}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {rows.map((item, index) => {
                                            return (
                                                <Dropdown.Item key={index} onClick={() => setPerPageAmount(item)}>
                                                    {item}
                                                </Dropdown.Item>
                                            );
                                        })}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            <p className="m-0">Rows</p>
                        </div>
                        {offerLoading ? (
                            <Spinner></Spinner>
                        ) : offers.length === 0 ? (
                            <div className="txt-center">
                                <h5>No Data Found</h5>
                            </div>
                        ) : (
                            <div style={{ maxWidth: '100%', overflowX: 'scroll' }}>
                                <Table bordered>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th style={{ minWidth: '150px' }}>Rate</th>
                                            <th>Status</th>
                                            <th>Sent at</th>
                                            <th>Driver Vehicles</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {offers?.map?.((offer, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        {'000000'.substring(0, 6 - (index + 1)?.toString().length) +
                                                            (index + 1)}
                                                    </td>
                                                    <td>
                                                        <Row>
                                                            <Col>ShipFee:</Col>
                                                            <Col>{offer?.ratePrice}</Col>
                                                        </Row>
                                                        <Row>
                                                            <Col>GST:</Col>
                                                            <Col>10%</Col>
                                                        </Row>
                                                        <Row>
                                                            <Col>Freight:</Col>
                                                            <Col>10%</Col>
                                                        </Row>
                                                        <Row>
                                                            <Col>Total</Col>
                                                            <Col>
                                                                {(offer?.ratePrice * (1 + 0.1) * (1 + 0.1)).toFixed(2)}
                                                            </Col>
                                                        </Row>
                                                    </td>
                                                    <td>
                                                        {
                                                            <div
                                                                className={
                                                                    offer.status === 'Accepted'
                                                                        ? 'content-green'
                                                                        : offer.status === 'Denied'
                                                                        ? 'content-danger'
                                                                        : 'content-yellow'
                                                                }
                                                            >
                                                                {offer.status}
                                                            </div>
                                                        }
                                                    </td>
                                                    <td>{new moment(offer?.createdDate).format('DD/MM/YYYY')}</td>
                                                    <td>
                                                        {offer?.driver?.vehicles?.join?.(' - ') ||
                                                            offer?.driverVehicles?.join(' - ')}
                                                    </td>
                                                    <td className="sender-action justify-content-center">
                                                        {
                                                            // Case 1: Button Accept
                                                            (order.status === 'LookingForDriver' ||
                                                                order.status === 'Trading' ||
                                                                order.status === 'WaitingForPayment') &&
                                                            offer.status === 'Waiting' ? (
                                                                <div className="txt-success">
                                                                    <Button
                                                                        className="w-100 mb-2"
                                                                        variant="success"
                                                                        disabled={loading}
                                                                        onClick={() => acceptDriver(offer?.driverId)}
                                                                    >
                                                                        {!loading ? 'Accept' : <Spinner></Spinner>}
                                                                    </Button>
                                                                </div>
                                                            ) : // Case 2: Button Checkout
                                                            order.status === 'WaitingForPayment' &&
                                                              offer?.status === 'Accepted' ? (
                                                                <div className="txt-success">
                                                                    <div
                                                                        style={{
                                                                            cursor: 'pointer',
                                                                            fontSize: '1.4rem',
                                                                        }}
                                                                        onClick={() =>
                                                                            createOrderPayment(
                                                                                order?.id,
                                                                                offer?.driverId,
                                                                            )
                                                                        }
                                                                    >
                                                                        <p>
                                                                            <MdPayment></MdPayment>
                                                                            <span
                                                                                className="ms-auto"
                                                                                style={{ fontSize: '1rem' }}
                                                                            >
                                                                                Checkout Now
                                                                            </span>
                                                                        </p>
                                                                    </div>
                                                                    <Button
                                                                        className="w-100"
                                                                        variant="danger"
                                                                        disabled={loading}
                                                                        onClick={() => cancelDriver(offer?.driverId)}
                                                                    >
                                                                        {!loading ? 'Cancel' : <Spinner></Spinner>}
                                                                    </Button>
                                                                </div>
                                                            ) : // Case 3: Button Support, View and Print invoice
                                                            (order.status === 'Paid' ||
                                                                  order.status === 'Prepared' ||
                                                                  order.status === 'Delivering') &&
                                                              offer?.status === 'Accepted' ? (
                                                                <Stack>
                                                                    <Button className="w-100 mb-2" variant="warning">
                                                                        Support
                                                                    </Button>
                                                                    <Link
                                                                        to={`/payment/checkout/return/invoice?id=${order?.paymentId}`}
                                                                    >
                                                                        <Button className="w-100 mb-2">
                                                                            View Invoice
                                                                        </Button>
                                                                    </Link>
                                                                </Stack>
                                                            ) : // Case 4: Text Completed
                                                            order.status === 'Completed' &&
                                                              offer?.status === 'Accepted' ? (
                                                                <Stack>
                                                                    <Link
                                                                        to={`/payment/checkout/return/invoice?id=${order?.paymentId}`}
                                                                    >
                                                                        <Button variant="warning">View Invoice</Button>
                                                                    </Link>
                                                                </Stack>
                                                            ) : (
                                                                // Default
                                                                <></>
                                                            )
                                                        }
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                                <Pagination className="pg-form w-100">
                                    {/* <Pagination.First onClick={first} className='pg-first' style={{color:'black'}}/> */}
                                    <Pagination.Prev onClick={prevPage} className="pg-first" />
                                    {Array.from(Array(total).keys()).map((item, index) => {
                                        return (
                                            <div key={index}>
                                                <div key={index}>
                                                    <Pagination.Item
                                                        className={
                                                            item + 1 === currentPage ? 'pg-no pg-active' : 'pg-no'
                                                        }
                                                        onClick={() => setCurrent(item + 1)}
                                                    >
                                                        {item + 1}
                                                    </Pagination.Item>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <Pagination.Next onClick={nextPage} className="pg-first" />
                                    {/* <Pagination.Last onClick={last} className='pg-first'/> */}
                                </Pagination>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Checkout after driver accepted */}
            <PaymentPopup
                show={show}
                onHide={() => setShow(false)}
                clientSecret={clientSecret}
                loading={popupLoading}
                checkoutServerAPI={() => checkoutServerAPI(order?.id, order?.driverId)}
            ></PaymentPopup>

            {order?.driverId &&
                (order?.status === 'Completed' ||
                    order?.status === 'Delivering' ||
                    order?.status === 'Prepared' ||
                    order?.status === 'Paid') && (
                    <Driver
                        driver={order.driver}
                        orderId={order?.id}
                        reviews={order?.reviews}
                        preparedTime={order?.preparedDate}
                        deliveringTime={order?.deliveredDate}
                        completedTime={order?.completedDate}
                        createdTime={order?.approvedDate}
                        cancelledTime={order?.cancelledDate}
                        deliveryImages={order?.deliverdItemImages?.split?.('[space]')}
                        receivedImages={order?.receivedItemImages?.split?.('[space]')}
                        orderStatus={
                            order?.status === 'Paid'
                                ? 0
                                : order?.status === 'Prepared'
                                ? 1
                                : order?.status === 'Delivering'
                                ? 2
                                : order?.status === 'Completed'
                                ? 3
                                : 4
                        }
                    ></Driver>
                )}
        </div>
    );
}

const keyquery = 'orderid';

export default function Index() {
    const [searchParams] = useSearchParams();

    if (!searchParams.has(keyquery) || !searchParams.get(keyquery)) {
        return <Navigate to="/user/order/list"></Navigate>;
    }

    return (
        <>
            <ProductDetail></ProductDetail>
        </>
    );
}
