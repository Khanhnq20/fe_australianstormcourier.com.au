import React from 'react';
import { Formik } from 'formik';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { BiSearchAlt2 } from 'react-icons/bi';
import Dropdown from 'react-bootstrap/Dropdown';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import { usePagination } from '../../../hooks';
import { authConstraints, authInstance, config } from '../../../api';
import { Col, Row } from 'react-bootstrap';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { CustomSpinner } from '../../../layout';

function UserHistory() {
    const { currentPage, perPageAmount, loading, items, nextPage, prevPage, setCurrent, setPerPageAmount, search } =
        usePagination({
            fetchingAPIInstance: ({ controller, page, take, ...queries }) =>
                authInstance.get([authConstraints.userRoot, authConstraints.getUserOrderHistory].join('/'), {
                    headers: {
                        Authorization: [
                            config.AuthenticationSchema,
                            localStorage.getItem(authConstraints.LOCAL_KEY),
                        ].join(' '),
                    },
                    signal: controller.signal,
                    params: {
                        page,
                        amount: take,
                        ...queries,
                    },
                }),
            propToGetItem: 'results',
            propToGetTotalPage: 'total',
            amountPerPage: 10,
            startingPage: 1,
            totalPages: 1,
        });
    const rows = [10, 15, 20, 25, 30, 35, 40];

    return (
        <Formik
            initialValues={{
                pick: '',
                des: '',
            }}
            onSubmit={(values) => {
                search(values);
            }}
        >
            {({ handleSubmit, handleChange }) => {
                return (
                    <>
                        <div>
                            <div className="p-3">
                                <Form onSubmit={handleSubmit}>
                                    <div className="form-order">
                                        <Form.Group>
                                            <div className="mb-2">
                                                <Form.Label className="label">Pickup Location</Form.Label>
                                            </div>
                                            <Form.Control
                                                type="text"
                                                name="pick"
                                                placeholder=""
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <div className="mb-2">
                                                <Form.Label className="label">Destination</Form.Label>
                                            </div>
                                            <Form.Control
                                                type="text"
                                                name="des"
                                                placeholder=""
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
                                        <BiSearchAlt2 style={{ fontSize: '20px' }}></BiSearchAlt2> Search
                                    </Button>
                                </Form>
                            </div>

                            <div className="p-3">
                                {/* Request to show row number */}
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
                                                        <Dropdown.Item
                                                            key={index}
                                                            onClick={() => setPerPageAmount(item)}
                                                        >
                                                            {item}
                                                        </Dropdown.Item>
                                                    );
                                                })}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                    <p className="m-0">Items</p>
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
                                                        <th>Pickup Location</th>
                                                        <th>Posted At</th>
                                                        <th>Expected date</th>
                                                        <th>Expected time frame</th>
                                                        <th>Status</th>
                                                        <th>Vehicles</th>
                                                        <th>Offer Amount</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {items
                                                        ?.slice(
                                                            (currentPage - 1) * perPageAmount,
                                                            perPageAmount * (1 + currentPage),
                                                        )
                                                        .map((post, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>
                                                                        {'000000'.substring(
                                                                            0,
                                                                            6 - post?.id.toString().length,
                                                                        ) + post?.id}
                                                                    </td>
                                                                    <td>
                                                                        <Row>
                                                                            <Col sm="4">
                                                                                <img
                                                                                    src={
                                                                                        post?.orderItems?.[0]?.itemImages?.split?.(
                                                                                            '[space]',
                                                                                        )?.[0]
                                                                                    }
                                                                                    style={{ width: '100%' }}
                                                                                ></img>
                                                                            </Col>
                                                                            <Col sm="8">
                                                                                <b>{post?.orderItems?.[0]?.itemName}</b>
                                                                            </Col>
                                                                        </Row>
                                                                    </td>
                                                                    <td>{post?.sendingLocation}</td>
                                                                    <td
                                                                        style={{
                                                                            whiteSpace: 'nowrap',
                                                                        }}
                                                                    >
                                                                        {!!post?.createdDate
                                                                            ? moment(post?.createdDate).format(
                                                                                  'DD-MM-YYYY',
                                                                              )
                                                                            : ''}
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            whiteSpace: 'nowrap',
                                                                        }}
                                                                    >
                                                                        {!!post?.deliveredDate
                                                                            ? moment(post?.deliveredDate).format(
                                                                                  'DD-MM-YYYY',
                                                                              )
                                                                            : ''}
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            whiteSpace: 'nowrap',
                                                                        }}
                                                                    >
                                                                        {post?.timeFrame}
                                                                    </td>
                                                                    <td>
                                                                        {post?.status
                                                                            ?.replace?.(/([A-Z])/g, ' $1')
                                                                            ?.trim?.()}
                                                                    </td>
                                                                    <td>
                                                                        <ul className="ps-3">
                                                                            {post?.vehicles?.map?.((v) => (
                                                                                <li>{v}</li>
                                                                            ))}
                                                                        </ul>
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            whiteSpace: 'nowrap',
                                                                        }}
                                                                    >
                                                                        {post?.offerNumber}
                                                                    </td>
                                                                    <td>
                                                                        <Link
                                                                            to={`/user/order/detail?orderid=${post?.id}`}
                                                                            state={{
                                                                                ...post,
                                                                                from: 'user/history',
                                                                            }}
                                                                        >
                                                                            <Button variant="primary">Detail</Button>
                                                                        </Link>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                </tbody>
                                            </Table>
                                        </div>

                                        <Pagination className="pg-form w-100">
                                            {/* <Pagination.First onClick={first} className='pg-first' style={{color:'black'}}/> */}
                                            <Pagination.Prev onClick={prevPage} className="pg-first" />
                                            {Array.from(Array(5)).map((item, index) => {
                                                return (
                                                    <div>
                                                        <div key={index}>
                                                            <Pagination.Item
                                                                className={
                                                                    item === currentPage ? 'pg-no pg-active' : 'pg-no'
                                                                }
                                                                onClick={() => setCurrent(item)}
                                                            >
                                                                {item}
                                                            </Pagination.Item>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            <Pagination.Next onClick={nextPage} className="pg-first" />
                                            {/* <Pagination.Last onClick={last} className='pg-first'/> */}
                                        </Pagination>
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                );
            }}
        </Formik>
    );
}

export default function Index() {
    return <UserHistory></UserHistory>;
}
