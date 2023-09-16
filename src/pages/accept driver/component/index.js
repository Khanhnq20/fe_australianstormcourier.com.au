import React, { useContext, useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { BiSearchAlt2 } from 'react-icons/bi';
import { GrRefresh } from 'react-icons/gr';
import Dropdown from 'react-bootstrap/Dropdown';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import { Col, Modal, Row } from 'react-bootstrap';
import { usePagination } from '../../../hooks';
import { authConstraints, authInstance, config } from '../../../api';
import { CustomSpinner } from '../../../layout';
import moment from 'moment';
import { toast } from 'react-toastify';
import { SocketContext } from '../../../stores';

let driverSchema = yup.object().shape({
    email: yup.string().email('This field must be email type').required('Email is required field'),
    password: yup.string().required('This field is requied'),
});

function DriverList() {
    const rows = [10, 15, 20, 25, 30, 35, 40];
    const {
        currentPage,
        perPageAmount,
        total,
        loading,
        error,
        items,
        nextPage,
        prevPage,
        setCurrent,
        setPerPageAmount,
        refresh,
    } = usePagination({
        fetchingAPIInstance: ({ controller, page, take }) =>
            authInstance.get([authConstraints.adminRoot, authConstraints.getAccountsDriver].join('/'), {
                headers: {
                    Authorization: [config.AuthenticationSchema, localStorage.getItem(authConstraints.LOCAL_KEY)].join(
                        ' ',
                    ),
                },
                signal: controller.signal,
                params: {
                    page,
                    amount: take,
                },
            }),
        propToGetItem: 'results',
        propToGetTotalPage: 'total',
        amountPerPage: rows[0],
        startingPage: 1,
        totalPages: 1,
    });
    const [{ onlineUsers }] = useContext(SocketContext);
    const [shown, setShown] = useState(false);
    const [entity, setEntity] = useState(-1);
    const [aloading, setALoading] = useState(false);

    const cellstyle = {
        minWidth: '150px',
    };

    function acceptDriver(driverId) {
        setALoading(true);
        authInstance
            .post([authConstraints.adminRoot, authConstraints.acceptAccountDriver].join('/'), null, {
                headers: {
                    Authorization: [config.AuthenticationSchema, localStorage.getItem(authConstraints.LOCAL_KEY)].join(
                        ' ',
                    ),
                },
                params: {
                    driverId,
                },
            })
            .then((response) => {
                setALoading(false);
                if (response.data?.successed) {
                    toast.success('Update the status of this user');
                }
            })
            .catch((error) => {
                setALoading(false);
                toast.error(error?.data?.error || error?.message);
            });
    }

    function blockDriver(driverId) {
        setALoading(true);
        authInstance
            .put([authConstraints.adminRoot, authConstraints.blockAccount].join('/'), null, {
                headers: {
                    Authorization: [config.AuthenticationSchema, localStorage.getItem(authConstraints.LOCAL_KEY)].join(
                        ' ',
                    ),
                },
                params: {
                    driverId,
                },
            })
            .then((response) => {
                setALoading(false);
                if (response.data?.successed) {
                    toast.success('Update the status of this user');
                }
            })
            .catch((error) => {
                setALoading(false);
                toast.error(error?.data?.error || error?.message);
            });
    }

    return (
        <Formik
            initialValues={{
                email: '',
            }}
            validationSchema={driverSchema}
        >
            {({ touched, errors, handleSubmit, handleChange, handleBlur, isValid, values }) => {
                return (
                    <>
                        <div>
                            <div className="p-3">
                                <div>
                                    <Form onSubmit={handleSubmit}>
                                        <div className="form-order">
                                            <Form.Group>
                                                <div className="mb-2">
                                                    <Form.Label className="label">Full name driver</Form.Label>
                                                </div>
                                                <Form.Control
                                                    type="text"
                                                    name="fullNameDriver"
                                                    placeholder="Enter Full Name"
                                                    isInvalid={touched.email && !!errors?.email}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors?.email}
                                                </Form.Control.Feedback>
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
                                    </Form>
                                </div>
                            </div>

                            <div>
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

                                    <GrRefresh
                                        className="ms-auto"
                                        style={{ fontSize: '2rem' }}
                                        onClick={() => refresh()}
                                    ></GrRefresh>
                                </div>
                                {aloading && <CustomSpinner></CustomSpinner>}

                                {loading ? (
                                    <CustomSpinner></CustomSpinner>
                                ) : items?.length === 0 ? (
                                    <div className="txt-center">
                                        <h5>No Data Found</h5>
                                    </div>
                                ) : (
                                    <>
                                        <div
                                            style={{
                                                maxWidth: '100%',
                                                overflowX: 'scroll',
                                                scrollBehavior: 'smooth',
                                                scrollbarWidth: '30px',
                                            }}
                                        >
                                            <Table bordered>
                                                <thead>
                                                    <tr>
                                                        <th>Figure</th>
                                                        <th style={cellstyle}>Driver Name</th>
                                                        <th style={cellstyle}>Email</th>
                                                        <th style={cellstyle}>Phone Number</th>
                                                        <th style={cellstyle}>Joined At</th>
                                                        <th style={cellstyle}>ABN</th>
                                                        <th style={cellstyle}>Bussiness Name</th>
                                                        <th>Online</th>
                                                        <th style={cellstyle}>Status</th>
                                                        <th style={cellstyle}>Address</th>
                                                        <th style={cellstyle}>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {items
                                                        ?.slice(
                                                            (currentPage - 1) * perPageAmount,
                                                            perPageAmount * currentPage,
                                                        )
                                                        .map((driver, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>
                                                                        {driver?.name || (
                                                                            <span className="content-red">
                                                                                {'null'}
                                                                            </span>
                                                                        )}
                                                                    </td>
                                                                    <td>{driver?.email}</td>
                                                                    <td>{driver?.phoneNumber}</td>
                                                                    <td>
                                                                        {moment(driver?.createdDate).format(
                                                                            'YYYY/MM/DD',
                                                                        )}
                                                                    </td>
                                                                    <td>{driver?.abnNumber}</td>
                                                                    <td>{driver?.bussinessName}</td>
                                                                    <td>
                                                                        {Array.isArray(onlineUsers) &&
                                                                        onlineUsers.includes(driver?.id) ? (
                                                                            <span className="content-green">
                                                                                Online
                                                                            </span>
                                                                        ) : (
                                                                            <span className="content-red">Offline</span>
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {driver?.isBlocked ? (
                                                                            <span className="content-red">Block</span>
                                                                        ) : !driver?.hasCensored ? (
                                                                            <span className="content-red">
                                                                                Not Inspected
                                                                            </span>
                                                                        ) : (
                                                                            <span className="content-green">
                                                                                Inspected
                                                                            </span>
                                                                        )}
                                                                    </td>
                                                                    <td>{driver?.address}</td>
                                                                    <td>
                                                                        <Button
                                                                            className="mb-2 w-100"
                                                                            onClick={() => {
                                                                                setEntity(index);
                                                                                setShown(true);
                                                                            }}
                                                                        >
                                                                            View
                                                                        </Button>
                                                                        <DetailPopup
                                                                            show={shown && index === entity}
                                                                            driver={driver}
                                                                            acceptDriver={() =>
                                                                                acceptDriver(driver?.id)
                                                                            }
                                                                            blockDriver={() => blockDriver(driver?.id)}
                                                                            unlockDriver={() => blockDriver(driver?.id)}
                                                                            closeHandler={() => {
                                                                                setShown(false);
                                                                                setEntity(-1);
                                                                            }}
                                                                        ></DetailPopup>
                                                                        {!driver?.hasCensored ? (
                                                                            <Button
                                                                                className="ms-auto w-100"
                                                                                variant="success"
                                                                                onClick={() => acceptDriver(driver?.id)}
                                                                            >
                                                                                Accept driver
                                                                            </Button>
                                                                        ) : driver?.isBlocked ? (
                                                                            <Button
                                                                                className="ms-auto w-100"
                                                                                variant="success"
                                                                                onClick={() => blockDriver(driver?.id)}
                                                                            >
                                                                                Unlock
                                                                            </Button>
                                                                        ) : (
                                                                            <Button
                                                                                className="ms-auto w-100"
                                                                                variant="danger"
                                                                                onClick={() => blockDriver(driver?.id)}
                                                                            >
                                                                                Block
                                                                            </Button>
                                                                        )}
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
                                            {Array.from(Array(total).keys()).map((i, index) => {
                                                const item = i + 1;
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

function DetailPopup({ driver, show, closeHandler, acceptDriver, unlockDriver, blockDriver }) {
    return (
        <Modal show={show} onHide={closeHandler}>
            <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col>
                        <div className="product-label-info">
                            <p className="product-label">FullName</p>
                            <p className="product-content">{driver?.name}</p>
                        </div>
                        <div className="product-label-info">
                            <p className="product-label">Email</p>
                            <p className="product-content">{driver?.email}</p>
                        </div>
                        <div className="product-label-info">
                            <p className="product-label">Phone number</p>
                            <p className="product-content">{driver?.phoneNumber}</p>
                        </div>
                        <div className="product-label-info">
                            <p className="product-label">Address</p>
                            <p className="product-content">{driver?.address}</p>
                        </div>
                        <div className="product-label-info">
                            <p className="product-label">ABN</p>
                            <p className="product-content">{driver?.abnNumber}</p>
                        </div>
                        <div className="product-label-info">
                            <p className="product-label">Business Name</p>
                            <p className="product-content">{driver?.bussinessName}</p>
                        </div>
                    </Col>
                    <Col>
                        <div className="product-label-info">
                            <p className="product-label">Status</p>
                            <p className="product-content">
                                {driver?.isBlocked ? (
                                    <span className="content-red">Block</span>
                                ) : !driver?.hasCensored ? (
                                    <span className="content-red">Not Inspected</span>
                                ) : (
                                    <span className="content-green">Inspected</span>
                                )}
                            </p>
                        </div>
                        <div className="product-label-info">
                            <p className="product-label">Post Code</p>
                            <p className="product-content">{driver?.postCode}</p>
                        </div>
                        <div className="product-label-info">
                            <p className="product-label">City</p>
                            <p className="product-content">{driver?.city}</p>
                        </div>
                        <div className="product-label-info">
                            <p className="product-label">Vehicles</p>
                            <p className="product-content">{driver?.vehicles?.join?.(' -- ')}</p>
                        </div>
                        <div className="product-label-info">
                            <p className="product-label">BSB</p>
                            <p className="product-content">{driver?.bsb}</p>
                        </div>
                        <div className="product-label-info">
                            <p className="product-label">Front Driving License</p>
                            <p className="product-content">
                                <img src={driver?.frontDrivingLiense} style={{ width: '100%' }}></img>
                            </p>
                        </div>
                        <div className="product-label-info">
                            <p className="product-label">Back Driving License</p>
                            <p className="product-content">
                                <img src={driver?.backDrivingLiense} style={{ width: '100%' }}></img>
                            </p>
                        </div>
                        {!driver?.isAusDrivingLiense && (
                            <div className="product-label-info">
                                <p className="product-label">Driving Certificate</p>
                                <a className="product-content" href={driver?.drivingCertificate} target="_blank">
                                    View Pdf
                                </a>
                            </div>
                        )}
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeHandler}>
                    Close
                </Button>
                {!driver?.hasCensored ? (
                    <Button className="ms-auto" variant="success" onClick={acceptDriver}>
                        Accept this driver
                    </Button>
                ) : driver?.isBlocked ? (
                    <Button className="ms-auto" variant="success" onClick={unlockDriver}>
                        Unlock
                    </Button>
                ) : (
                    <Button className="ms-auto" variant="danger" onClick={blockDriver}>
                        Block
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
}

export default function Index() {
    return <DriverList></DriverList>;
}
