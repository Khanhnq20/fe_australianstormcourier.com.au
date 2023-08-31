import '../style/driverProduct.css';
import React, { useContext, useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { BiSearchAlt2 } from 'react-icons/bi';
import Dropdown from 'react-bootstrap/Dropdown';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import { Col, Row, Form, Button, InputGroup, Modal, Spinner } from 'react-bootstrap';
import { usePagination } from '../../../hooks';
import { authConstraints, authInstance, config } from '../../../api';
import moment from 'moment';
import { AuthContext, OrderContext, SocketContext, taskStatus } from '../../../stores';
import { CustomSpinner } from '../../../layout';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/navigation';
import { useSearchParams } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';
import { RiHandCoinFill } from 'react-icons/ri';
import { FcViewDetails } from 'react-icons/fc';

let driverSchema = yup.object().shape({
    driverId: yup.string().nullable(),
    ratePrice: yup.number().moreThan(4).required(),
    orderId: yup.string().required(),
    createdAt: yup.date().required(),
});
function Product() {
    const [authState] = useContext(AuthContext);
    const [orderState, { postDriverOffer }] = useContext(OrderContext);
    const [{ socketConnection }, { onOrderReceive }] = useContext(SocketContext);
    const [detailModal, setDetailModal] = useState(null);
    const [orderLoading, setOrderLoading] = useState([]);
    const [searchParams] = useSearchParams();

    const rows = [5, 10, 15, 20, 25, 30, 35, 40];
    const {
        currentPage,
        perPageAmount,
        total,
        loading,
        items,
        nextPage,
        prevPage,
        setCurrent,
        setPerPageAmount,
        refresh,
        search,
    } = usePagination({
        fetchingAPIInstance: ({ controller, page, take, ...queries }) =>
            authInstance.get([authConstraints.driverRoot, authConstraints.getDriverJobs].join('/'), {
                headers: {
                    Authorization: [config.AuthenticationSchema, localStorage.getItem(authConstraints.LOCAL_KEY)].join(
                        ' ',
                    ),
                },
                params: {
                    page: page,
                    amount: take,
                    pickup: searchParams?.get?.('state') || null,
                    ...queries,
                },
                signal: controller.signal,
            }),
        propToGetItem: 'results',
        propToGetTotalPage: 'total',
        amountPerPage: rows[0],
        startingPage: 1,
        totalPages: 1,
    });

    useEffect(() => {
        onOrderReceive((orderId) => {
            refresh();
        });
    }, [socketConnection]);

    // On Global Tasks Changed
    useEffect(() => {
        if (orderState.tasks?.[authConstraints.postDriverOffers] === taskStatus.Completed) {
            refresh();
            setOrderLoading(([_, ...r]) => r);
        } else if (orderState.tasks?.[authConstraints.postDriverOffers] === taskStatus.Failed) {
            refresh();
            setOrderLoading(([_, ...r]) => r);
        }
    }, [orderState.tasks]);

    return (
        <div>
            <div className="p-2 p-lg-3">
                <Formik
                    initialValues={{
                        suburb: '',
                        postCode: '',
                    }}
                    onSubmit={(values) => {
                        search(values);
                    }}
                >
                    {({ handleChange, handleSubmit, values }) => {
                        return (
                            <Form onSubmit={handleSubmit}>
                                <div className="form-order">
                                    <Form.Group>
                                        <div className="mb-2">
                                            <Form.Label className="label">Suburb</Form.Label>
                                        </div>
                                        <Form.Control
                                            type="text"
                                            placeholder="Search by Suburb"
                                            name="suburb"
                                            value={values.suburb}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <div className="mb-2">
                                            <Form.Label className="label">Zip code</Form.Label>
                                        </div>
                                        <Form.Control
                                            type="text"
                                            placeholder="Search by Zip code"
                                            name="postCode"
                                            value={values.postCode}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </div>
                                <Button
                                    type="submit"
                                    variant="warning"
                                    style={{ backgroundColor: '#f2a13b', border: 'none' }}
                                    className={`my-btn-yellow my-4 product-btn-search`}
                                >
                                    <BiSearchAlt2 style={{ fontSize: '20px' }}></BiSearchAlt2>
                                    Search
                                </Button>
                            </Form>
                        );
                    }}
                </Formik>
            </div>

            <div className="p-2 p-lg-3">
                <div className="pg-rows">
                    <p className="m-0">Show</p>
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
                    <p className="m-0">Rows</p>
                </div>

                {loading ? (
                    <CustomSpinner></CustomSpinner>
                ) : items?.length === 0 ? (
                    <div className="txt-center">
                        <h5>No Data Found</h5>
                    </div>
                ) : (
                    <>
                        <div style={{ maxWidth: '100%', overflowX: 'scroll' }}>
                            <Table striped bordered>
                                <thead>
                                    <tr>
                                        <th>Order Id</th>
                                        <th
                                            style={{
                                                minWidth: '150px',
                                            }}
                                        >
                                            Item Name
                                        </th>
                                        <th>Pickup</th>

                                        <th>Posted At</th>
                                        <th>Expected date</th>
                                        <th>Expected time frame</th>
                                        <th>Expected vehicles</th>
                                        <th>Status</th>
                                        <th>Sender Offer</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items
                                        ?.slice((currentPage - 1) * perPageAmount, perPageAmount * currentPage)
                                        .map((post, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{post?.id}</td>
                                                    <td>
                                                        <Row>
                                                            <Col sm="5">
                                                                <img
                                                                    src={
                                                                        post?.orderItems?.[0]?.itemImages?.split?.(
                                                                            '[space]',
                                                                        )?.[0]
                                                                    }
                                                                    style={{
                                                                        width: '100%',
                                                                    }}
                                                                ></img>
                                                            </Col>
                                                            <Col sm="7">
                                                                <b>{post?.orderItems?.[0]?.itemName}</b>
                                                            </Col>
                                                        </Row>
                                                    </td>
                                                    <td>{post?.sendingLocation}</td>
                                                    <td style={{ whiteSpace: 'nowrap' }}>
                                                        {!!post?.createdDate
                                                            ? moment(post?.createdDate).format('DD-MM-YYYY')
                                                            : ''}
                                                    </td>
                                                    <td style={{ whiteSpace: 'nowrap' }}>
                                                        {!!post?.deliverableDate
                                                            ? moment(post?.deliverableDate).format('DD-MM-YYYY')
                                                            : ''}
                                                    </td>
                                                    <td style={{ whiteSpace: 'nowrap' }}>{post?.timeFrame}</td>
                                                    <td>
                                                        <ul className="ps-3">
                                                            {post?.vehicles?.map?.((str, id) => {
                                                                return (
                                                                    <li style={{ whiteSpace: 'nowrap' }} key={id}>
                                                                        {str}
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </td>
                                                    <td>{post?.status?.replace?.(/([A-Z])/g, ' $1')?.trim?.()}</td>
                                                    <td>{post?.startingRate} aud</td>
                                                    <td>
                                                        <Formik
                                                            initialValues={{
                                                                driverId: authState?.accountInfo?.id,
                                                                ratePrice: post?.startingRate,
                                                                orderId: post?.id,
                                                                createdAt: new moment(),
                                                                show: false,
                                                            }}
                                                            validationSchema={driverSchema}
                                                            enableReinitialize
                                                            onSubmit={(values) => {
                                                                setOrderLoading((orders) => [
                                                                    ...orders,
                                                                    values.orderId,
                                                                ]);
                                                                postDriverOffer(values);
                                                            }}
                                                        >
                                                            {({
                                                                touched,
                                                                errors,
                                                                values,
                                                                handleSubmit,
                                                                handleChange,
                                                                handleBlur,
                                                                setValues,
                                                                setFieldValue,
                                                                isValid,
                                                            }) => {
                                                                const isLoading = orderLoading.some((i) => {
                                                                    return i === values.orderId.toString();
                                                                });

                                                                return (
                                                                    <>
                                                                        <Row
                                                                            style={{
                                                                                flexWrap: 'wrap',
                                                                            }}
                                                                        >
                                                                            <Col sm="12" className="mb-2">
                                                                                <Form onSubmit={handleSubmit}>
                                                                                    <Button
                                                                                        className="w-100"
                                                                                        variant="success"
                                                                                        type="submit"
                                                                                        disabled={isLoading}
                                                                                        style={{ whiteSpace: 'nowrap' }}
                                                                                    >
                                                                                        {isLoading ? (
                                                                                            <Spinner></Spinner>
                                                                                        ) : (
                                                                                            <Row className="flex-nowrap">
                                                                                                <Col sm="auto   ">
                                                                                                    <FaCheck></FaCheck>
                                                                                                </Col>
                                                                                                <Col
                                                                                                    className="text-start d-none d-md-block"
                                                                                                    style={{
                                                                                                        paddingLeft: 0,
                                                                                                    }}
                                                                                                >
                                                                                                    Accept
                                                                                                </Col>
                                                                                            </Row>
                                                                                        )}
                                                                                    </Button>
                                                                                </Form>
                                                                            </Col>
                                                                            <Col sm="12" className="mb-2">
                                                                                <Button
                                                                                    className="w-100"
                                                                                    variant="warning"
                                                                                    onClick={() =>
                                                                                        setValues((v) => ({
                                                                                            ...v,
                                                                                            show: !v.show,
                                                                                        }))
                                                                                    }
                                                                                    disabled={isLoading}
                                                                                    style={{ whiteSpace: 'nowrap' }}
                                                                                >
                                                                                    {isLoading ? (
                                                                                        <Spinner></Spinner>
                                                                                    ) : (
                                                                                        <Row className="flex-nowrap">
                                                                                            <Col sm="auto">
                                                                                                <RiHandCoinFill></RiHandCoinFill>
                                                                                            </Col>
                                                                                            <Col
                                                                                                className="text-start d-none d-md-block"
                                                                                                style={{
                                                                                                    paddingLeft: 0,
                                                                                                }}
                                                                                            >
                                                                                                My Offer
                                                                                            </Col>
                                                                                        </Row>
                                                                                    )}
                                                                                </Button>
                                                                                {values.show && (
                                                                                    <Form onSubmit={handleSubmit}>
                                                                                        <Form.Group>
                                                                                            <InputGroup className="my-3">
                                                                                                <Form.Control
                                                                                                    name="ratePrice"
                                                                                                    onChange={(e) => {
                                                                                                        setFieldValue(
                                                                                                            e.target
                                                                                                                .name,
                                                                                                            Number(
                                                                                                                e.target
                                                                                                                    .value,
                                                                                                            ),
                                                                                                            true,
                                                                                                        );
                                                                                                    }}
                                                                                                    isInvalid={
                                                                                                        touched.ratePrice &&
                                                                                                        !!errors?.ratePrice
                                                                                                    }
                                                                                                    onBlur={handleBlur}
                                                                                                    aria-label="RatePrice"
                                                                                                    aria-describedby="aud"
                                                                                                    style={{
                                                                                                        boxShadow:
                                                                                                            '1px 1px #0000',
                                                                                                        minWidth:
                                                                                                            '100px !important',
                                                                                                    }}
                                                                                                ></Form.Control>
                                                                                                <InputGroup.Text id="aud">
                                                                                                    $
                                                                                                </InputGroup.Text>
                                                                                                <Form.Control.Feedback type="invalid">
                                                                                                    {errors?.ratePrice}
                                                                                                </Form.Control.Feedback>
                                                                                            </InputGroup>
                                                                                            <Button
                                                                                                className="w-100"
                                                                                                type="submit"
                                                                                            >
                                                                                                Send My Offer
                                                                                            </Button>
                                                                                        </Form.Group>
                                                                                    </Form>
                                                                                )}
                                                                            </Col>
                                                                            <Col sm="12" className="mb-2">
                                                                                <Button
                                                                                    className="w-100"
                                                                                    variant="warning"
                                                                                    onClick={() =>
                                                                                        setDetailModal(index)
                                                                                    }
                                                                                    style={{ whiteSpace: 'nowrap' }}
                                                                                >
                                                                                    <Row>
                                                                                        <Col sm="auto">
                                                                                            <FcViewDetails></FcViewDetails>
                                                                                        </Col>
                                                                                        <Col
                                                                                            className="text-start d-none d-md-block"
                                                                                            style={{
                                                                                                paddingLeft: 0,
                                                                                            }}
                                                                                        >
                                                                                            Detail
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Button>
                                                                                <Modal
                                                                                    show={detailModal === index}
                                                                                    onHide={() => setDetailModal(null)}
                                                                                >
                                                                                    <Modal.Header
                                                                                        closeButton
                                                                                    ></Modal.Header>
                                                                                    <Modal.Body>
                                                                                        <Swiper navigation={true}>
                                                                                            {post?.orderItems.map(
                                                                                                (item, index) => {
                                                                                                    return (
                                                                                                        <SwiperSlide
                                                                                                            key={index}
                                                                                                        >
                                                                                                            <div className="py-2">
                                                                                                                <h5>{`Item ${
                                                                                                                    index +
                                                                                                                    1
                                                                                                                }`}</h5>
                                                                                                                <Row>
                                                                                                                    <Col className="text-end">
                                                                                                                        <b>
                                                                                                                            Id
                                                                                                                        </b>
                                                                                                                    </Col>
                                                                                                                    <Col>
                                                                                                                        {
                                                                                                                            item?.id
                                                                                                                        }
                                                                                                                    </Col>
                                                                                                                </Row>
                                                                                                                <Row>
                                                                                                                    <Col className="text-end"></Col>
                                                                                                                    <Col>
                                                                                                                        {item?.itemImages
                                                                                                                            .split(
                                                                                                                                '[space]',
                                                                                                                            )
                                                                                                                            .map(
                                                                                                                                (
                                                                                                                                    img,
                                                                                                                                    index,
                                                                                                                                ) => (
                                                                                                                                    <img
                                                                                                                                        className="w-100"
                                                                                                                                        key={
                                                                                                                                            index
                                                                                                                                        }
                                                                                                                                        style={{
                                                                                                                                            maxWidth:
                                                                                                                                                '120px',
                                                                                                                                        }}
                                                                                                                                        src={
                                                                                                                                            img
                                                                                                                                        }
                                                                                                                                        alt={
                                                                                                                                            item.itemName
                                                                                                                                        }
                                                                                                                                    ></img>
                                                                                                                                ),
                                                                                                                            )}
                                                                                                                    </Col>
                                                                                                                </Row>
                                                                                                                <Row>
                                                                                                                    <Col className="text-end">
                                                                                                                        <b>
                                                                                                                            Name
                                                                                                                        </b>
                                                                                                                    </Col>
                                                                                                                    <Col>
                                                                                                                        {
                                                                                                                            item?.itemName
                                                                                                                        }
                                                                                                                    </Col>
                                                                                                                </Row>

                                                                                                                <Row>
                                                                                                                    <Col className="text-end">
                                                                                                                        <b>
                                                                                                                            From
                                                                                                                        </b>
                                                                                                                    </Col>
                                                                                                                    <Col>
                                                                                                                        {
                                                                                                                            post?.sendingLocation
                                                                                                                        }
                                                                                                                    </Col>
                                                                                                                </Row>
                                                                                                                <Row>
                                                                                                                    <Col className="text-end">
                                                                                                                        <b>
                                                                                                                            To
                                                                                                                        </b>
                                                                                                                    </Col>
                                                                                                                    <Col>
                                                                                                                        {
                                                                                                                            item?.destination
                                                                                                                        }
                                                                                                                    </Col>
                                                                                                                </Row>
                                                                                                                <Row>
                                                                                                                    <Col className="text-end">
                                                                                                                        <b>
                                                                                                                            Note
                                                                                                                        </b>
                                                                                                                    </Col>
                                                                                                                    <Col>
                                                                                                                        {
                                                                                                                            item?.itemDescription
                                                                                                                        }
                                                                                                                    </Col>
                                                                                                                </Row>
                                                                                                                <Row>
                                                                                                                    <Col className="text-end">
                                                                                                                        <b>
                                                                                                                            Quantity
                                                                                                                        </b>
                                                                                                                    </Col>
                                                                                                                    <Col>
                                                                                                                        {
                                                                                                                            item?.quantity
                                                                                                                        }
                                                                                                                    </Col>
                                                                                                                </Row>
                                                                                                                <Row>
                                                                                                                    <Col className="text-end">
                                                                                                                        <b>
                                                                                                                            Weight
                                                                                                                        </b>
                                                                                                                    </Col>
                                                                                                                    <Col>
                                                                                                                        {
                                                                                                                            item?.weight
                                                                                                                        }
                                                                                                                    </Col>
                                                                                                                </Row>
                                                                                                                <Row>
                                                                                                                    <Col className="text-end">
                                                                                                                        <b>
                                                                                                                            Package
                                                                                                                            type
                                                                                                                        </b>
                                                                                                                    </Col>
                                                                                                                    <Col>
                                                                                                                        {
                                                                                                                            item?.packageType
                                                                                                                        }
                                                                                                                    </Col>
                                                                                                                </Row>
                                                                                                            </div>
                                                                                                        </SwiperSlide>
                                                                                                    );
                                                                                                },
                                                                                            )}
                                                                                        </Swiper>
                                                                                    </Modal.Body>
                                                                                </Modal>
                                                                            </Col>
                                                                        </Row>
                                                                    </>
                                                                );
                                                            }}
                                                        </Formik>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </Table>
                        </div>
                        <Pagination className="pg-form w-100">
                            <Pagination.Prev onClick={prevPage} className="pg-first" />
                            {Array.from(Array(total).keys()).map((item, index) => {
                                return (
                                    <div key={index}>
                                        <Pagination.Item
                                            className={item + 1 === currentPage ? 'pg-no pg-active' : 'pg-no'}
                                            onClick={() => setCurrent(item + 1)}
                                        >
                                            {item + 1}
                                        </Pagination.Item>
                                    </div>
                                );
                            })}
                            <Pagination.Next onClick={nextPage} className="pg-first" />
                        </Pagination>
                    </>
                )}
            </div>
        </div>
    );
}

export default function Index() {
    return <Product></Product>;
}
