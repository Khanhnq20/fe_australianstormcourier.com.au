import React, { useContext, useEffect, useRef } from 'react';
import { Col, Container, Row, Spinner, Stack } from 'react-bootstrap';
import '../style/orderDetail.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FaTimes, FaTimesCircle } from 'react-icons/fa';
import { FieldArray, Formik } from 'formik';
import * as yup from 'yup';
import { Navigate, useParams } from 'react-router-dom';
import { authConstraints, authInstance, config } from '../../../api';
import { RiImageAddFill, RiImageEditFill } from 'react-icons/ri';
import { CustomSpinner } from '../../../layout';
import Modal from 'react-bootstrap/Modal';
import { OrderContext, taskStatus } from '../../../stores';
import { dotnetFormDataSerialize } from '../../../ultitlies';
import moment from 'moment';
import { Swiper, SwiperSlide } from 'swiper/react';
import { toast } from 'react-toastify';
import Confetti from 'react-confetti';
import { EffectCoverflow, EffectFade, Navigation, Pagination } from 'swiper';

const PERMIT_FILE_FORMATS = ['image/jpeg', 'image/png', 'image/jpg'];
let imgSchema = yup.object().shape({
    orderId: yup.number().required(),
    deliveryImages: yup
        .array()
        .of(
            yup
                .array()
                .of(
                    yup
                        .object()
                        .shape({
                            file: yup.mixed().nullable(),
                            url: yup.string().nullable(),
                        })
                        .test('FILE SIZE', 'this file is too large', (obj) => {
                            if (!obj?.file) {
                                return true;
                            }
                            return obj?.file?.size <= 2 * 1000 * 1000;
                        })
                        .test('FILE FORMAT', `the file format should be ${PERMIT_FILE_FORMATS.join()}`, (obj) => {
                            if (!obj?.file) {
                                return true;
                            }
                            return PERMIT_FILE_FORMATS.includes(obj?.file?.type);
                        }),
                )
                .min(2)
                .required(),
            // .test('FILE SIZE', '${path} is too large', (files) => {
            //     if (!files.length) {
            //         return true;
            //     }
            //     return files?.filter((p) => p?.file)?.reduce((p, c) => c?.file?.size + p, 0) <= 2 * 1000 * 1000;
            // })
            // .test('FILE FORMAT', `the file format should be ${PERMIT_FILE_FORMATS.join()}`, (files) => {
            //     if (!files.length) {
            //         return true;
            //     }
            //     return files.filter((p) => p?.file).every((file) => PERMIT_FILE_FORMATS.includes(file?.type));
            // }),
        )
        .min(1)
        .required('Please provide images to step the next'),
    // .test('FILE SIZE', 'the file is too large', (files) => {
    //     if (!files.length) {
    //         return true;
    //     }
    //     return (
    //         files?.reduce((p, c) => c?.filter((p) => p?.file)?.reduce((p1, c1) => c1.file.size + p1, 0) + p, 0) <=
    //         5 * 1000 * 1000
    //     );
    // })
    // .test('FILE FORMAT', `the file format should be ${PERMIT_FILE_FORMATS.join()}`, (files) => {
    //     if (!files.length) {
    //         return true;
    //     }
    //     return files.every((c) =>
    //         c.filter((p) => p?.file).every((c1) => PERMIT_FILE_FORMATS.includes(c1.file?.type)),
    //     );
    // }),
});
let imgDoneSchema = yup.object().shape({
    orderId: yup.number().required(),
    itemId: yup.number().required(),
    receivedImages: yup
        .array()
        .of(
            yup
                .array()
                .of(
                    yup
                        .object()
                        .shape({
                            file: yup.mixed().nullable(),
                            url: yup.string().nullable(),
                        })
                        .test('FILE SIZE', 'this file is too large', (obj) => {
                            if (!obj?.file) {
                                return true;
                            }
                            return obj?.file?.size <= 2 * 1000 * 1000;
                        })
                        .test('FILE FORMAT', `the file format should be ${PERMIT_FILE_FORMATS.join()}`, (obj) => {
                            if (!obj?.file) {
                                return true;
                            }
                            return PERMIT_FILE_FORMATS.includes(obj?.file?.type);
                        }),
                )
                .min(2)
                .required(),
        )
        .min(1)
        .required('Please provide images to step the next'),
    barcode: yup.number().required('Barcode is required field'),
});

function OrderDetail() {
    const [orderState, { putStartOrder, putPrepareOrder, putDeliveryOrder, putReceiveOrder, putCancelOrder }] =
        useContext(OrderContext);
    const [result, setResult] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [congratulation, setCongratulation] = React.useState(true);
    const imgPreDelivery = useRef([]);
    const imgLabDelivery = useRef([]);
    const [error, setError] = React.useState('');
    const { id } = useParams();
    const [showDeliveredImage, setShowDeliveredImage] = React.useState(false);

    useEffect(() => {
        refresh();
    }, [id]);

    useEffect(() => {
        if (
            orderState.tasks?.[authConstraints.putPrepareOrder] === taskStatus.Completed ||
            orderState.tasks?.[authConstraints.putDeliverOrder] === taskStatus.Completed ||
            orderState.tasks?.[authConstraints.putReceiveOrder] === taskStatus.Completed ||
            orderState.tasks?.[authConstraints.putCancelOffer] === taskStatus.Completed
        ) {
            refresh();
        }
    }, [orderState]);

    function refresh() {
        setLoading(true);
        authInstance
            .get([authConstraints.driverRoot, authConstraints.getAllOrderInfo].join('/'), {
                headers: {
                    Authorization: [config.AuthenticationSchema, localStorage.getItem(authConstraints.LOCAL_KEY)].join(
                        ' ',
                    ),
                },
                params: {
                    orderId: id,
                },
            })
            .then((response) => {
                if (response.data?.successed) {
                    setResult(response.data?.result);
                }
                setLoading(false);
            })
            .catch((error) => {
                if (error.message === 'Axios Error' && error.code === 403) {
                    setError('Forbiden');
                }
                setLoading(false);
            });
    }

    useEffect(() => {
        setCongratulation(result?.order?.status === 'Completed');
    }, [result?.order?.status]);

    if (loading || orderState?.loading)
        return (
            <Container>
                <CustomSpinner></CustomSpinner>
            </Container>
        );

    if (error === 'Forbiden') {
        return <Navigate to="/driver/order"></Navigate>;
    }

    return (
        <div className="p-2 p-lg-3">
            <div>
                <p className="product-detail-header">Details</p>
            </div>
            <div>
                {/* Display order information  */}
                <div>
                    <p className="product-content-title mb-3">Order Information</p>
                </div>
                <Row className="product-form-content">
                    <Col>
                        <div className="product-form-info">
                            <div>
                                <div className="product-label-info">
                                    <p className="product-label">ID</p>
                                    <p className="product-content">
                                        {'000000'.substring(0, 6 - result?.order?.id?.toString().length) +
                                            result?.order?.id}
                                    </p>
                                </div>
                                <div className="product-label-info">
                                    <p className="product-label">Sender Full Name</p>
                                    <p className="product-content">
                                        {result?.sender?.name || result?.sender?.['username']}
                                    </p>
                                </div>
                                <div className="product-label-info">
                                    <p className="product-label">Phone number</p>
                                    <p className="product-content">+{result?.sender?.phoneNumber}</p>
                                </div>
                                <div className="product-label-info">
                                    <p className="product-label">Receiver number</p>
                                    <p className="product-content">{result?.order?.orderItems?.length}</p>
                                </div>
                                {/* <div className="product-label-info">
                                    <p className="product-label">Email</p>
                                    <p className="product-content">{result?.sender?.email}</p>
                                </div> */}
                                {/* <div className="product-label-info">
                                    <p className="product-label">ABNnumber</p>
                                    <p className="product-content">{result?.sender?.abnNumber || 'Not yet'}</p>
                                </div> */}
                            </div>
                        </div>
                    </Col>
                    <Col>
                        <div>
                            <div className="product-label-info">
                                <p className="product-label">Shipment price</p>
                                <p className="product-content">{result?.order?.shipFee?.toFixed?.(2)} AUD</p>
                            </div>
                            <div className="product-label-info">
                                <p className="product-label">Status</p>
                                <p className="content-green">{result?.order?.status}</p>
                            </div>
                            <div className="product-label-info align-items-start" style={{ flexWrap: 'wrap' }}>
                                <p className="product-label">Delivered Images</p>
                                <div className="product-content">
                                    <div className="img-front-frame" onClick={() => setShowDeliveredImage(true)}>
                                        <div className="background-front">
                                            <div
                                                style={{
                                                    position: 'relative',
                                                    color: 'gray',
                                                    fontSize: '50px',
                                                    opacity: '0.7',
                                                }}
                                            >
                                                {result?.order?.deliverdItemImages?.split?.('[space]')?.length || 0}
                                            </div>
                                            <p class="driving-txt">view image</p>
                                        </div>
                                        <img
                                            className="img-front"
                                            src={
                                                result?.order?.deliverdItemImages?.split?.('[space]')?.[0] ||
                                                'https://tinyurl.com/5ehpcctt'
                                            }
                                            style={{ minWidth: '220px' }}
                                        />
                                    </div>
                                    <Modal
                                        show={!!result?.order?.deliverdItemImages && showDeliveredImage}
                                        onHide={() => setShowDeliveredImage(false)}
                                    >
                                        <Modal.Header closeButton></Modal.Header>
                                        <Modal.Body>
                                            <Swiper
                                                spaceBetween={30}
                                                effect={'fade'}
                                                navigation={true}
                                                pagination={{
                                                    clickable: true,
                                                }}
                                                modules={[EffectFade, Navigation, Pagination]}
                                            >
                                                {result?.order?.deliverdItemImages
                                                    ?.split?.('[space]')
                                                    ?.map?.((imageUrl, id) => {
                                                        return (
                                                            <SwiperSlide key={id}>
                                                                <img src={imageUrl} width="100%"></img>
                                                            </SwiperSlide>
                                                        );
                                                    })}
                                            </Swiper>
                                        </Modal.Body>
                                    </Modal>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
                {/* It includes before delivering and after prepared process + delivery pictures and cancelled reason */}
                <Row>
                    <p className="product-content-title my-3">Progressing</p>
                    {result?.order?.status &&
                        result?.order?.status !== 'Prepared' &&
                        result?.order?.status !== 'Delivering' &&
                        result?.order?.status !== 'Completed' &&
                        result?.order?.status !== 'Cancelled' && (
                            <div className="order-letter-form py-4">
                                {/* otherwise driver send delivery images to confirm their ready */}
                                <div>
                                    <Formik
                                        initialValues={{
                                            orderId: result?.orderId,
                                            deliveryImages: [
                                                [
                                                    { file: null, url: '' },
                                                    { file: null, url: '' },
                                                ],
                                            ],
                                        }}
                                        validationSchema={imgSchema}
                                        onSubmit={(values) => {
                                            const handleObj = {
                                                ...values,
                                                deliveryImages: values.deliveryImages.reduce(
                                                    (p, c) => [
                                                        ...p,
                                                        ...c.filter((item) => item?.file).map((item) => item?.file),
                                                    ],
                                                    [],
                                                ),
                                            };

                                            const formData = dotnetFormDataSerialize(handleObj, {
                                                indices: true,
                                                dotsForObjectNotation: true,
                                            });

                                            if (
                                                result?.order?.orderItems?.length * 2 >
                                                handleObj?.deliveryImages?.length
                                            ) {
                                                toast.error(
                                                    `This order's included ${
                                                        result?.order.orderItems.length
                                                    } items. Please provide at least ${
                                                        result?.order.orderItems.length * 2
                                                    } images presented each one`,
                                                );
                                                return;
                                            }

                                            console.log(handleObj);

                                            putPrepareOrder(formData);
                                        }}
                                    >
                                        {({ errors, isValid, setFieldValue, handleSubmit, handleBlur, values }) => {
                                            const isLoading =
                                                orderState.tasks?.[authConstraints.putPrepareOrder] ===
                                                taskStatus.Inprogress;
                                            return (
                                                <Form onSubmit={handleSubmit}>
                                                    <div className="txt-center">
                                                        <h4>There are {result?.order?.orderItems?.length} items</h4>
                                                        <div className="mb-2">
                                                            <Button onClick={() => putStartOrder(values.orderId)}>
                                                                Send Notification to Sender
                                                            </Button>
                                                        </div>
                                                        <i className=" mx-auto">
                                                            Take at least {result?.order?.orderItems?.length * 2}{' '}
                                                            pictures in this order.
                                                            <br />
                                                            (Each item should be 2 pictures, one with item which is as
                                                            soon as received and labeled package)
                                                        </i>

                                                        <FieldArray
                                                            name={`deliveryImages`}
                                                            shouldUpdate={() => true}
                                                            render={(arrayHelpers) => {
                                                                return (
                                                                    <>
                                                                        <p>
                                                                            <b>
                                                                                {/* {(
                                                                                        values.deliveryImages.reduce(
                                                                                            (p, c) => {
                                                                                                return p + c.file.size;
                                                                                            },
                                                                                            0,
                                                                                        ) * Math.pow(10, -6)
                                                                                    ).toFixed(2)} */}
                                                                                {` / ${5}.00`}
                                                                            </b>
                                                                        </p>

                                                                        {/* Image showcase */}
                                                                        <Row className="mb-3">
                                                                            {values?.deliveryImages?.map(
                                                                                (deliveries, index) => {
                                                                                    return (
                                                                                        <React.Fragment key={index + 1}>
                                                                                            {deliveries.map(
                                                                                                (delivery, index2) => {
                                                                                                    return (
                                                                                                        <Col
                                                                                                            key={index2}
                                                                                                            sm={6}
                                                                                                        >
                                                                                                            <h4>
                                                                                                                {index2 ===
                                                                                                                0
                                                                                                                    ? 'Item Image'
                                                                                                                    : 'Labelled Package'}
                                                                                                            </h4>
                                                                                                            <i>
                                                                                                                (
                                                                                                                {index2 ===
                                                                                                                0
                                                                                                                    ? 'Send package only'
                                                                                                                    : 'Send package with label'}
                                                                                                                )
                                                                                                            </i>
                                                                                                            <div
                                                                                                                className="img-front-frame position-relative"
                                                                                                                style={{
                                                                                                                    margin: '0 auto',
                                                                                                                }}
                                                                                                            >
                                                                                                                {!delivery?.file && (
                                                                                                                    <div
                                                                                                                        className="background-front"
                                                                                                                        onClick={() => {
                                                                                                                            if (
                                                                                                                                index2 ===
                                                                                                                                0
                                                                                                                            ) {
                                                                                                                                imgPreDelivery?.current[
                                                                                                                                    index
                                                                                                                                ].click();
                                                                                                                            } else if (
                                                                                                                                index2 ===
                                                                                                                                1
                                                                                                                            ) {
                                                                                                                                imgLabDelivery?.current[
                                                                                                                                    index
                                                                                                                                ].click();
                                                                                                                            }
                                                                                                                        }}
                                                                                                                    >
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
                                                                                                                            Post
                                                                                                                            the
                                                                                                                            Image
                                                                                                                        </p>
                                                                                                                    </div>
                                                                                                                )}
                                                                                                                <img
                                                                                                                    className="img-front"
                                                                                                                    src={
                                                                                                                        delivery?.url ||
                                                                                                                        'https://tinyurl.com/5ehpcctt'
                                                                                                                    }
                                                                                                                />
                                                                                                                <FaTimesCircle
                                                                                                                    className="text-danger"
                                                                                                                    style={{
                                                                                                                        position:
                                                                                                                            'absolute',
                                                                                                                        top: '20px',
                                                                                                                        right: 0,
                                                                                                                        fontSize:
                                                                                                                            '2rem',
                                                                                                                    }}
                                                                                                                    onClick={() =>
                                                                                                                        setFieldValue(
                                                                                                                            `deliveryImages[${index}][${index2}]`,
                                                                                                                            {
                                                                                                                                file: null,
                                                                                                                                url: '',
                                                                                                                            },
                                                                                                                        )
                                                                                                                    }
                                                                                                                ></FaTimesCircle>
                                                                                                            </div>
                                                                                                            {/* Image input */}
                                                                                                            <Form.Group id="preImage">
                                                                                                                <Form.Control
                                                                                                                    type="file"
                                                                                                                    className="d-none"
                                                                                                                    name={`deliveryImages[${index}][${index2}]`}
                                                                                                                    ref={(
                                                                                                                        e,
                                                                                                                    ) => {
                                                                                                                        if (
                                                                                                                            index2 ===
                                                                                                                            0
                                                                                                                        ) {
                                                                                                                            imgPreDelivery.current[
                                                                                                                                index
                                                                                                                            ] =
                                                                                                                                e;
                                                                                                                        } else if (
                                                                                                                            index2 ===
                                                                                                                            1
                                                                                                                        ) {
                                                                                                                            imgLabDelivery.current[
                                                                                                                                index
                                                                                                                            ] =
                                                                                                                                e;
                                                                                                                        }
                                                                                                                    }}
                                                                                                                    accept="image"
                                                                                                                    isInvalid={
                                                                                                                        !!errors
                                                                                                                            ?.deliveryImages?.[
                                                                                                                            index
                                                                                                                        ]?.[
                                                                                                                            index2
                                                                                                                        ]
                                                                                                                    }
                                                                                                                    // onBlur={
                                                                                                                    //     handleBlur
                                                                                                                    // }
                                                                                                                    onChange={(
                                                                                                                        e,
                                                                                                                    ) => {
                                                                                                                        const file =
                                                                                                                            e
                                                                                                                                .target
                                                                                                                                .files[0];
                                                                                                                        const name =
                                                                                                                            e
                                                                                                                                .target
                                                                                                                                .name;
                                                                                                                        const fileReader =
                                                                                                                            new FileReader();
                                                                                                                        if (
                                                                                                                            file
                                                                                                                        ) {
                                                                                                                            fileReader.onload =
                                                                                                                                function (
                                                                                                                                    e,
                                                                                                                                ) {
                                                                                                                                    // get file content
                                                                                                                                    fileReader.addEventListener(
                                                                                                                                        'loadend',
                                                                                                                                        () => {
                                                                                                                                            setFieldValue(
                                                                                                                                                name,
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
                                                                                                                        }
                                                                                                                    }}
                                                                                                                />
                                                                                                                <Form.Control.Feedback type="invalid">
                                                                                                                    {
                                                                                                                        errors
                                                                                                                            ?.deliveryImages?.[
                                                                                                                            index
                                                                                                                        ]?.[
                                                                                                                            index2
                                                                                                                        ]
                                                                                                                    }
                                                                                                                </Form.Control.Feedback>
                                                                                                            </Form.Group>
                                                                                                        </Col>
                                                                                                    );
                                                                                                },
                                                                                            )}
                                                                                        </React.Fragment>
                                                                                    );
                                                                                },
                                                                            )}
                                                                        </Row>

                                                                        <Button
                                                                            onClick={() =>
                                                                                arrayHelpers.push([
                                                                                    { file: null, url: '' },
                                                                                    { file: null, url: '' },
                                                                                ])
                                                                            }
                                                                        >
                                                                            <RiImageAddFill className="me-2"></RiImageAddFill>
                                                                            Add Delivery
                                                                        </Button>
                                                                    </>
                                                                );
                                                            }}
                                                        />

                                                        <p className="order-txt-letter txt-center py-3 px-5">
                                                            Please send package image when you received it from the
                                                            sender to start delivery process.
                                                        </p>

                                                        <div style={{ margin: '0 auto' }}>
                                                            <Button
                                                                type="submit"
                                                                className="my-btn-yellow mx-2"
                                                                disabled={
                                                                    !isValid ||
                                                                    !values.deliveryImages?.length ||
                                                                    isLoading
                                                                }
                                                            >
                                                                {isLoading ? <Spinner></Spinner> : 'Start'}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </Form>
                                            );
                                        }}
                                    </Formik>
                                </div>
                            </div>
                        )}
                    <Swiper navigation={true} spaceBetween={20}>
                        {result?.order?.orderItems?.map((item, id) => {
                            return (
                                <SwiperSlide key={id}>
                                    {/* The order must be larger than "prepared" status to display the process of driver */}
                                    {result?.order?.status &&
                                        (result?.order?.status === 'Prepared' ||
                                            result?.order?.status === 'Delivering' ||
                                            result?.order?.status === 'Completed' ||
                                            result?.order?.status === 'Cancelled') && (
                                            <Process
                                                orderId={result?.orderId}
                                                receiverName={item?.receiverName}
                                                receiverPhone={item?.receiverPhone}
                                                item={item}
                                                itemTotal={result?.order?.orderItems?.length || 0}
                                                isLoading={
                                                    orderState?.tasks?.[authConstraints.putDeliverOrder] ===
                                                        taskStatus.Inprogress ||
                                                    orderState?.tasks?.[authConstraints.putCancelOffer] ===
                                                        taskStatus.Inprogress ||
                                                    orderState?.tasks?.[authConstraints.putReceiveOrder] ===
                                                        taskStatus.Inprogress
                                                }
                                                deliveryImages={result?.order?.deliverdItemImages}
                                                putDeliveryOrder={() => putDeliveryOrder(result?.orderId)}
                                                putReceiveOrder={putReceiveOrder}
                                                putCancelOrder={() => putCancelOrder(result?.orderId)}
                                                preparedTime={moment().format('HH : mm, dd MMM YYYY')}
                                                deliveryTime={moment().format('HH : mm, dd MMM YYYY')}
                                                completedTime={moment().format('HH : mm, dd MMM YYYY')}
                                                cancelledTime={moment().format('HH : mm, dd MMM YYYY')}
                                                orderStatus={
                                                    result?.order?.status === 'Prepared'
                                                        ? 0
                                                        : item?.status === 'Completed'
                                                        ? 2
                                                        : result?.order?.status === 'Delivering'
                                                        ? 1
                                                        : result?.order?.status === 'Completed'
                                                        ? 2
                                                        : result?.order?.status === 'Cancelled'
                                                        ? 3
                                                        : 1
                                                }
                                            >
                                                {2}
                                            </Process>
                                        )}
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </Row>
            </div>
            {/* {congratulation && <Confetti></Confetti>} */}
            <Modal show={congratulation} centered onHide={() => setCongratulation(false)}>
                <Modal.Header closeButton>
                    <h4 className="text-primary" style={{ marginBottom: '0' }}>
                        Congratulations
                    </h4>
                </Modal.Header>
                <Confetti className="w-100"></Confetti>
                <Modal.Body
                    className="p-2 text-center"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        minWidth: '320px',
                        minHeight: '280px',
                        // background:
                        //     'url(https://media.istockphoto.com/id/1168280104/vector/white-background-design-with-golden-ribbon-decoration.jpg?s=612x612&w=0&k=20&c=ezCiSbcFOGoLOkwi_pGf6d-r1sf1oCO5--w9nOSuGpc=) no-repeat',
                        // backgroundSize: 'contain',
                    }}
                >
                    <i style={{ color: 'var(--clr-txt-primary)', fontSize: '2rem' }}>You have completed this order.</i>
                    <b style={{ display: 'block' }}>Thanks for your contribution</b>
                </Modal.Body>
            </Modal>
        </div>
    );
}

function Process({
    orderStatus,
    isLoading,
    orderId,
    item,
    itemTotal,
    receiverName,
    receiverPhone,
    deliveryImages = [],
    putDeliveryOrder,
    putReceiveOrder,
    putCancelOrder,
    preparedTime,
    deliveryTime,
    completedTime,
    cancelledTime,
}) {
    const [active] = React.useState(orderStatus);
    const [complete, setComplete] = React.useState(false);
    const [modalShow, setModalShow] = React.useState(false);
    const [presentModal, setPresentModal] = React.useState(false);
    const [slider, setSlider] = React.useState(false);
    const imgDone = useRef([]);
    const imgLabelDone = useRef([]);
    const [stepTemplate] = React.useState(['Prepared', 'Delivering', 'Completed', 'Cancelled']);

    return (
        <>
            {/* Cancellation status*/}
            {stepTemplate[active] === 'Cancelled' ? (
                <StatusFail></StatusFail>
            ) : (
                <div>
                    <Row className="align-items-start mb-2">
                        <Col className="product-label-info" sm="3">
                            <p className="product-label-fit">Item Images</p>
                        </Col>
                        <Col sm="9">
                            <img
                                src={item?.itemImages?.split('[space]')?.[0]}
                                loading="lazy"
                                style={{ maxWidth: '120px' }}
                                onClick={() => setPresentModal(true)}
                            ></img>
                            <Modal show={presentModal} onHide={() => setPresentModal(false)}>
                                <Modal.Header closeButton></Modal.Header>
                                <Modal.Body>
                                    <Swiper
                                        effect={'coverflow'}
                                        grabCursor={true}
                                        centeredSlides={true}
                                        slidesPerView={3}
                                        coverflowEffect={{
                                            rotate: 50,
                                            stretch: 0,
                                            depth: 100,
                                            modifier: 1,
                                            slideShadows: true,
                                        }}
                                        pagination={true}
                                        modules={[EffectCoverflow, Pagination]}
                                        className="mySwiper"
                                    >
                                        {item?.itemImages?.split('[space]').map((url, id) => {
                                            return (
                                                <SwiperSlide key={id}>
                                                    <img src={url} loading="lazy" style={{ maxWidth: '120px' }}></img>
                                                </SwiperSlide>
                                            );
                                        })}
                                    </Swiper>
                                </Modal.Body>
                            </Modal>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="product-label-info" sm="3">
                            <p className="product-label-fit">Item number</p>
                        </Col>
                        <Col sm="9">
                            <p className="product-content">{item?.id}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="product-label-info" sm="3">
                            <p className="product-label">Receiver Full Name</p>
                        </Col>
                        <Col sm="9">
                            <p className="product-content">{receiverName}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="product-label-info" sm="3">
                            <p className="product-label">Phone number</p>
                        </Col>
                        <Col sm="9">
                            <p className="product-content">{receiverPhone}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="product-label-info" sm="3">
                            <p className="product-label">Destination</p>
                        </Col>
                        <Col sm="9">
                            <p className="product-content">{item?.destination}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="product-label-info" sm="3">
                            <p className="product-label-fit">Note</p>
                        </Col>
                        <Col sm="9">
                            <p className="product-content">{item?.itemDescription}</p>
                        </Col>
                    </Row>
                    {/* Agreed to delivery */}
                    {/* Status of delivery */}
                    <Row>
                        <Col className="product-label-info" sm="3">
                            <p className="product-label-fit">Item Status</p>
                        </Col>
                        <Col sm="9">
                            {stepTemplate?.[active] === 'Prepared' || stepTemplate?.[active] === 'Delivering' ? (
                                <p className="content-yellow">{stepTemplate?.[active]}</p>
                            ) : stepTemplate?.[active] === 'Completed' ? (
                                <p className="content-green">{stepTemplate?.[active]}</p>
                            ) : (
                                <p className="content-red">{stepTemplate?.[active]}</p>
                            )}
                        </Col>
                    </Row>
                    {/* Process of delivery */}
                    <div className="product-label-info" style={{ alignItems: 'unset' }}>
                        <div className="process-form">
                            <p className="product-label-fit py-2">Process</p>

                            <section class="step-wizard">
                                <ul className="order-progress">
                                    {stepTemplate.map((template, index) => {
                                        return (
                                            <li
                                                className="order-progress-item"
                                                key={index}
                                                data-active={index <= active}
                                            >
                                                <div class="progress-circle"></div>
                                                <div class="progress-label">
                                                    <h2 className="progress-txt-header">{template}</h2>
                                                    <p>
                                                        {template === 'Prepared'
                                                            ? `At ${preparedTime} ready to delivering`
                                                            : template === 'Delivering'
                                                            ? `At ${deliveryTime} delivering`
                                                            : template === 'Completed'
                                                            ? `At ${completedTime} completed`
                                                            : `At ${cancelledTime} cancelled`}
                                                    </p>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </section>

                            <div>
                                {/* Delivery Success */}
                                {(!active && (
                                    <button
                                        className="my-btn-yellow mx-5 my-2"
                                        onClick={() => {
                                            putDeliveryOrder();
                                        }}
                                    >
                                        {isLoading ? <Spinner></Spinner> : 'Start Deliver Now'}
                                    </button>
                                )) ||
                                    (stepTemplate[active] !== 'Completed' && (
                                        <button
                                            className="my-btn-yellow mx-5 my-2"
                                            onClick={() => {
                                                setComplete(true);
                                            }}
                                        >
                                            {isLoading ? <Spinner></Spinner> : 'Next Step'}
                                        </button>
                                    ))}

                                {/* Modal show form to submit the received package */}
                                <Modal
                                    size="md"
                                    aria-labelledby="contained-modal-title-vcenter"
                                    centered
                                    show={complete}
                                    onHide={() => setComplete(false)}
                                >
                                    <Modal.Header closeButton>
                                        <Modal.Title className="txt-center w-100">Confirm Your Action</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Formik
                                            initialValues={{
                                                orderId: orderId,
                                                itemId: item?.id,
                                                receivedImages: [
                                                    [
                                                        {
                                                            file: null,
                                                            url: '',
                                                        },
                                                        {
                                                            file: null,
                                                            url: '',
                                                        },
                                                    ],
                                                ],
                                                barcode: null,
                                            }}
                                            validationSchema={imgDoneSchema}
                                            onSubmit={(values) => {
                                                if (!values.itemId) {
                                                    toast.warning('This item is invalid');
                                                    return;
                                                }
                                                const handleObj = {
                                                    ...values,
                                                    receivedImages: values.receivedImages.reduce(
                                                        (p, c) => [
                                                            ...p,
                                                            ...c
                                                                ?.filter((item) => item?.file)
                                                                .map((item) => item?.file),
                                                        ],
                                                        [],
                                                    ),
                                                };
                                                const formData = dotnetFormDataSerialize(handleObj, {
                                                    indices: true,
                                                    dotsForObjectNotation: true,
                                                });
                                                if (handleObj.receivedImages.length < itemTotal * 2) {
                                                    toast.error(
                                                        `This order's included ${itemTotal} items. Please provide at least ${
                                                            itemTotal * 2
                                                        } images presented each one`,
                                                    );
                                                    return;
                                                }
                                                putReceiveOrder(formData);
                                            }}
                                        >
                                            {({
                                                errors,
                                                touched,
                                                values,
                                                setFieldValue,
                                                handleSubmit,
                                                handleChange,
                                                handleBlur,
                                            }) => {
                                                return (
                                                    <Form onSubmit={handleSubmit}>
                                                        <Form.Group className="txt-center">
                                                            <FieldArray
                                                                name={`receivedImages`}
                                                                shouldUpdate={() => true}
                                                                render={(arrayHelpers) => {
                                                                    return (
                                                                        <>
                                                                            <p>
                                                                                <b>
                                                                                    {(
                                                                                        values.receivedImages.reduce(
                                                                                            (p, c) => {
                                                                                                return (
                                                                                                    p +
                                                                                                    c
                                                                                                        .filter(
                                                                                                            (p) =>
                                                                                                                !!p?.file,
                                                                                                        )
                                                                                                        .reduce(
                                                                                                            (p1, c1) =>
                                                                                                                p1 +
                                                                                                                c1?.file
                                                                                                                    ?.size,
                                                                                                            0,
                                                                                                        )
                                                                                                );
                                                                                            },
                                                                                            0,
                                                                                        ) * Math.pow(10, -6)
                                                                                    ).toFixed(2)}
                                                                                    {` / ${5}.00`}
                                                                                </b>
                                                                            </p>

                                                                            {/* Image showcase */}
                                                                            <Row className="mb-3">
                                                                                {values?.receivedImages?.map(
                                                                                    (receives, index) => {
                                                                                        return (
                                                                                            <React.Fragment
                                                                                                key={index + 1}
                                                                                            >
                                                                                                {receives.map(
                                                                                                    (
                                                                                                        receive,
                                                                                                        index2,
                                                                                                    ) => {
                                                                                                        return (
                                                                                                            <Col
                                                                                                                key={
                                                                                                                    index2
                                                                                                                }
                                                                                                                sm={6}
                                                                                                            >
                                                                                                                <h4>
                                                                                                                    {index2 ===
                                                                                                                    0
                                                                                                                        ? 'Item Image'
                                                                                                                        : 'Labelled Package'}
                                                                                                                </h4>
                                                                                                                <i>
                                                                                                                    (
                                                                                                                    {index2 ===
                                                                                                                    0
                                                                                                                        ? 'Send package only'
                                                                                                                        : 'Send package with label'}
                                                                                                                    )
                                                                                                                </i>
                                                                                                                <div
                                                                                                                    className="img-front-frame position-relative"
                                                                                                                    style={{
                                                                                                                        margin: '0 auto',
                                                                                                                    }}
                                                                                                                >
                                                                                                                    {!receive?.file && (
                                                                                                                        <div
                                                                                                                            className="background-front"
                                                                                                                            onClick={() => {
                                                                                                                                if (
                                                                                                                                    index2 ===
                                                                                                                                    0
                                                                                                                                ) {
                                                                                                                                    imgDone?.current[
                                                                                                                                        index
                                                                                                                                    ].click();
                                                                                                                                } else if (
                                                                                                                                    index2 ===
                                                                                                                                    1
                                                                                                                                ) {
                                                                                                                                    imgLabelDone?.current[
                                                                                                                                        index
                                                                                                                                    ].click();
                                                                                                                                }
                                                                                                                            }}
                                                                                                                        >
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
                                                                                                                                Post
                                                                                                                                the
                                                                                                                                Image
                                                                                                                            </p>
                                                                                                                        </div>
                                                                                                                    )}
                                                                                                                    <img
                                                                                                                        className="img-front"
                                                                                                                        src={
                                                                                                                            receive?.url ||
                                                                                                                            'https://tinyurl.com/5ehpcctt'
                                                                                                                        }
                                                                                                                    />

                                                                                                                    <FaTimesCircle
                                                                                                                        className="text-danger"
                                                                                                                        style={{
                                                                                                                            position:
                                                                                                                                'absolute',
                                                                                                                            top: '20px',
                                                                                                                            right: 0,
                                                                                                                            fontSize:
                                                                                                                                '2rem',
                                                                                                                        }}
                                                                                                                        onClick={() =>
                                                                                                                            setFieldValue(
                                                                                                                                `receivedImages[${index}][${index2}]`,
                                                                                                                                {
                                                                                                                                    file: null,
                                                                                                                                    url: '',
                                                                                                                                },
                                                                                                                            )
                                                                                                                        }
                                                                                                                    ></FaTimesCircle>
                                                                                                                </div>
                                                                                                                {/* Image input */}
                                                                                                                <Form.Group id="preImage">
                                                                                                                    <Form.Control
                                                                                                                        type="file"
                                                                                                                        className="d-none"
                                                                                                                        name={`receivedImages[${index}][${index2}]`}
                                                                                                                        ref={(
                                                                                                                            e,
                                                                                                                        ) => {
                                                                                                                            if (
                                                                                                                                index2 ===
                                                                                                                                0
                                                                                                                            ) {
                                                                                                                                imgDone.current[
                                                                                                                                    index
                                                                                                                                ] =
                                                                                                                                    e;
                                                                                                                            } else if (
                                                                                                                                index2 ===
                                                                                                                                1
                                                                                                                            ) {
                                                                                                                                imgLabelDone.current[
                                                                                                                                    index
                                                                                                                                ] =
                                                                                                                                    e;
                                                                                                                            }
                                                                                                                        }}
                                                                                                                        accept="image"
                                                                                                                        isInvalid={
                                                                                                                            !!errors
                                                                                                                                ?.receivedImages?.[
                                                                                                                                index
                                                                                                                            ]?.[
                                                                                                                                index2
                                                                                                                            ]
                                                                                                                        }
                                                                                                                        // onBlur={
                                                                                                                        //     handleBlur
                                                                                                                        // }
                                                                                                                        onChange={(
                                                                                                                            e,
                                                                                                                        ) => {
                                                                                                                            const file =
                                                                                                                                e
                                                                                                                                    .target
                                                                                                                                    .files[0];
                                                                                                                            const name =
                                                                                                                                e
                                                                                                                                    .target
                                                                                                                                    .name;
                                                                                                                            const fileReader =
                                                                                                                                new FileReader();
                                                                                                                            if (
                                                                                                                                file
                                                                                                                            ) {
                                                                                                                                fileReader.onload =
                                                                                                                                    function (
                                                                                                                                        e,
                                                                                                                                    ) {
                                                                                                                                        // get file content
                                                                                                                                        fileReader.addEventListener(
                                                                                                                                            'loadend',
                                                                                                                                            () => {
                                                                                                                                                setFieldValue(
                                                                                                                                                    name,
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
                                                                                                                            }
                                                                                                                        }}
                                                                                                                    />
                                                                                                                    <Form.Control.Feedback type="invalid">
                                                                                                                        {
                                                                                                                            errors
                                                                                                                                ?.receivedImages?.[
                                                                                                                                index
                                                                                                                            ]?.[
                                                                                                                                index2
                                                                                                                            ]
                                                                                                                        }
                                                                                                                    </Form.Control.Feedback>
                                                                                                                </Form.Group>
                                                                                                            </Col>
                                                                                                        );
                                                                                                    },
                                                                                                )}
                                                                                            </React.Fragment>
                                                                                        );
                                                                                    },
                                                                                )}
                                                                            </Row>
                                                                            <Button
                                                                                onClick={() =>
                                                                                    arrayHelpers.push([
                                                                                        { file: null, url: '' },
                                                                                        { file: null, url: '' },
                                                                                    ])
                                                                                }
                                                                            >
                                                                                <RiImageAddFill className="me-2"></RiImageAddFill>
                                                                                Add Received Images
                                                                            </Button>
                                                                        </>
                                                                    );
                                                                }}
                                                            />
                                                        </Form.Group>

                                                        <Form.Group className="form-group">
                                                            <div className="mb-2">
                                                                <Form.Label className="label">Barcode</Form.Label>
                                                                <p className="asterisk">*</p>
                                                            </div>
                                                            <Form.Control
                                                                type="number"
                                                                name="barcode"
                                                                placeholder="Enter The Barcode"
                                                                isInvalid={touched.barcode && errors.barcode}
                                                                onBlur={handleBlur}
                                                                onChange={handleChange}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors.barcode}
                                                            </Form.Control.Feedback>
                                                        </Form.Group>

                                                        <Stack
                                                            direction="horizontal"
                                                            gap={5}
                                                            style={{ justifyContent: 'right' }}
                                                            className="w-100"
                                                        >
                                                            <button
                                                                type="submit"
                                                                className="my-btn-yellow"
                                                                disabled={isLoading}
                                                            >
                                                                {isLoading ? <Spinner></Spinner> : 'Done'}
                                                            </button>
                                                        </Stack>
                                                    </Form>
                                                );
                                            }}
                                        </Formik>
                                    </Modal.Body>
                                </Modal>
                            </div>
                        </div>
                    </div>
                    {/* Showcase of deliveryImages */}
                    <div className="product-label-info py-3" style={{ alignItems: 'unset' }}>
                        <p className="product-label-fit py-1">Delivery pictures</p>
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
                                        {deliveryImages?.split('[space]')?.length}
                                    </div>
                                    <p className="driving-txt">view image</p>
                                </div>
                                <img
                                    className="img-front"
                                    src={deliveryImages?.split('[space]')?.[0] || 'https://tinyurl.com/5ehpcctt'}
                                />
                            </div>
                            <div>
                                <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered show={slider}>
                                    <Modal.Header>
                                        <Modal.Title
                                            className="txt-center w-100"
                                            onClick={() => {
                                                setSlider(false);
                                            }}
                                        >
                                            <div style={{ textAlign: 'right' }}>
                                                <FaTimes style={{ color: 'grey', cursor: 'pointer' }}></FaTimes>
                                            </div>
                                        </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body className="link-slider">
                                        <Swiper
                                            effect={'coverflow'}
                                            grabCursor={true}
                                            centeredSlides={true}
                                            slidesPerView={3}
                                            coverflowEffect={{
                                                rotate: 50,
                                                stretch: 0,
                                                depth: 100,
                                                modifier: 1,
                                                slideShadows: true,
                                            }}
                                            pagination={true}
                                            modules={[EffectCoverflow, Pagination]}
                                            className="mySwiper"
                                        >
                                            {deliveryImages?.split?.('[space]')?.map((url, index) => {
                                                return (
                                                    <SwiperSlide style={{ borderLeft: 'none' }} key={index}>
                                                        <img
                                                            className="w-100"
                                                            src={url}
                                                            alt="First slide"
                                                            style={{ maxWidth: '420px' }}
                                                        />
                                                    </SwiperSlide>
                                                );
                                            })}
                                        </Swiper>
                                    </Modal.Body>
                                </Modal>
                            </div>
                        </div>
                    </div>
                    {/* Trigger to cancel and confirm cancellation */}
                    {stepTemplate[active] !== 'Cancelled' && stepTemplate[active] !== 'Completed' && (
                        <div className="product-label-info py-3" style={{ alignItems: 'unset' }}>
                            <div>
                                <button className="my-btn-red" onClick={() => setModalShow(true)}>
                                    Cancel
                                </button>
                            </div>
                            <Modal size="sm" aria-labelledby="contained-modal-title-vcenter" centered show={modalShow}>
                                <Modal.Header>
                                    <Modal.Title className="txt-center w-100">Confirm Your Action</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <p className="txt-center" style={{ margin: '0' }}>
                                        Are you sure to cancel this order?
                                    </p>
                                </Modal.Body>
                                <Modal.Footer>
                                    <div className="txt-center w-100">
                                        <button
                                            className="my-btn-gray mx-4"
                                            onClick={() => {
                                                setModalShow(false);
                                            }}
                                        >
                                            No
                                        </button>
                                        <button
                                            className="my-btn-red mx-4"
                                            onClick={() => {
                                                putCancelOrder();
                                                setModalShow(false);
                                            }}
                                        >
                                            Yes
                                        </button>
                                    </div>
                                </Modal.Footer>
                            </Modal>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

let rateSchema = yup.object().shape({
    reason: yup.string().required('Rate is required field'),
});

function StatusFail() {
    return (
        <div>
            <div className="product-label-info">
                <p className="product-label-fit">Status</p>
                <p className="content-red">Fail</p>
            </div>
            <Formik
                initialValues={{
                    reason: '',
                }}
                validationSchema={rateSchema}
            >
                {({ touched, errors, handleSubmit, handleChange, handleBlur }) => {
                    return (
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="form-group">
                                <div className="mb-2">
                                    <Form.Label className="product-label-fit my-0">Reason fail</Form.Label>
                                </div>
                                <div className="product-rate-form">
                                    <div className="frame-pass" style={{ flexGrow: '1' }}>
                                        <Form.Control
                                            type={'text'}
                                            as="textarea"
                                            rows={3}
                                            style={{ position: 'relative', background: '#fafafa' }}
                                            isInvalid={touched.reason && errors.reason}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="Enter Your Reason"
                                            name="rate"
                                        />
                                    </div>
                                </div>
                            </Form.Group>
                            <Button type="submit" variant="warning" className="my-btn-yellow">
                                Submit
                            </Button>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
}

export default function Index() {
    const params = useParams();

    if (params?.id) {
        return (
            <>
                <OrderDetail></OrderDetail>
            </>
        );
    }
    return <Navigate to="/driver/order"></Navigate>;
}
