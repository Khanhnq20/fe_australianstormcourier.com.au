import '../style/driverProduct.css';
import React, { useContext, useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { BiSearchAlt2 } from 'react-icons/bi';
import Dropdown from 'react-bootstrap/Dropdown';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import { Col, Row, Form, Button, InputGroup, Modal } from 'react-bootstrap';
import { usePagination } from '../../../hooks';
import { authConstraints, authInstance, config } from '../../../api';
import moment from 'moment';
import { AuthContext, OrderContext, SocketContext, taskStatus } from '../../../stores';
import { CustomSpinner } from '../../../layout';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/navigation';

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
    const [detailModal, setDetailModal] = useState(false);

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
    } = usePagination({
        fetchingAPIInstance: ({ controller, page, take }) =>
            authInstance.get([authConstraints.driverRoot, authConstraints.getDriverJobs].join('/'), {
                headers: {
                    Authorization: [config.AuthenticationSchema, localStorage.getItem(authConstraints.LOCAL_KEY)].join(
                        ' ',
                    ),
                },
                params: {
                    page,
                    amount: take,
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
        console.log(orderState);
        if (orderState.tasks?.[authConstraints.postDriverOffers] === taskStatus.Completed) {
            refresh();
        } else if (orderState.tasks?.[authConstraints.postDriverOffers] === taskStatus.Failed) {
        }
    }, [orderState.tasks]);

    if (loading) {
        return <CustomSpinner></CustomSpinner>;
    }

    return (
        <div>
            <div className="p-3">
                <div className="form-order">
                    <Form.Group>
                        <div className="mb-2">
                            <Form.Label className="label">Suburb</Form.Label>
                        </div>
                        <Form.Control type="text" placeholder="Enter The Suburb" name="suburd" />
                    </Form.Group>
                    <Form.Group>
                        <div className="mb-2">
                            <Form.Label className="label">Postcode</Form.Label>
                        </div>
                        <Form.Control type="text" placeholder="Enter Postcode" name="postcode" />
                    </Form.Group>
                </div>
                <div>
                    <Button
                        variant="warning"
                        style={{ backgroundColor: '#f2a13b', border: 'none' }}
                        className={`my-btn-yellow my-4 product-btn-search`}
                    >
                        <BiSearchAlt2 style={{ fontSize: '20px' }}></BiSearchAlt2>
                        Search
                    </Button>
                </div>
            </div>

            <div>
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

                {items?.length === 0 ? (
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
                                                minWidth: '320px',
                                            }}
                                        >
                                            Item Name
                                        </th>
                                        <th
                                            style={{
                                                minWidth: '140px',
                                            }}
                                        >
                                            Pickup
                                        </th>

                                        <th
                                            style={{
                                                minWidth: '140px',
                                            }}
                                        >
                                            Posted At
                                        </th>
                                        <th
                                            style={{
                                                minWidth: '140px',
                                            }}
                                        >
                                            Expected date
                                        </th>
                                        <th
                                            style={{
                                                minWidth: '140px',
                                            }}
                                        >
                                            Expected time frame
                                        </th>
                                        <th
                                            style={{
                                                minWidth: '140px',
                                            }}
                                        >
                                            Expected vehicles
                                        </th>
                                        <th
                                            style={{
                                                minWidth: '140px',
                                            }}
                                        >
                                            Status
                                        </th>
                                        <th
                                            style={{
                                                minWidth: '140px',
                                            }}
                                        >
                                            Sender Offer
                                        </th>
                                        <th
                                            style={{
                                                minWidth: '140px',
                                            }}
                                        >
                                            Actions
                                        </th>
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
                                                                <div
                                                                    style={{
                                                                        width: '120px',
                                                                    }}
                                                                >
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
                                                                </div>
                                                            </Col>
                                                            <Col sm="7">
                                                                <b>{post?.orderItems?.[0]?.itemName}</b>
                                                            </Col>
                                                        </Row>
                                                    </td>
                                                    <td>{post?.sendingLocation}</td>
                                                    <td>
                                                        {!!post?.createdDate
                                                            ? moment(post?.createdDate).format('DD-MM-YYYY')
                                                            : ''}
                                                    </td>
                                                    <td>
                                                        {!!post?.deliverableDate
                                                            ? moment(post?.deliverableDate).format('DD-MM-YYYY')
                                                            : ''}
                                                    </td>
                                                    <td>{post?.timeFrame}</td>
                                                    <td>
                                                        <ul>
                                                            {post?.vehicles?.map?.((str) => {
                                                                return <li>{str}</li>;
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
                                                            onSubmit={(values) => {
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
                                                                                    >
                                                                                        Accept
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
                                                                                >
                                                                                    My Offer
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
                                                                                    onClick={() => setDetailModal(true)}
                                                                                >
                                                                                    Detail
                                                                                </Button>
                                                                                <Modal
                                                                                    show={detailModal}
                                                                                    onHide={() => setDetailModal(false)}
                                                                                >
                                                                                    <Modal.Header
                                                                                        closeButton
                                                                                    ></Modal.Header>
                                                                                    <Modal.Body>
                                                                                        <Swiper navigation={true}>
                                                                                            {post?.orderItems.map(
                                                                                                (item, index) => {
                                                                                                    return (
                                                                                                        <SwiperSlide>
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
                                                                                                                                ) => (
                                                                                                                                    <img
                                                                                                                                        className="w-100"
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
