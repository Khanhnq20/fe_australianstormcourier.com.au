import '../style/driverActiveOrder.css';
import React, { useContext, useEffect } from 'react';
import * as yup from 'yup';
import {BiSearchAlt2} from 'react-icons/bi';
import Dropdown from 'react-bootstrap/Dropdown';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import { Col, Row, Form, Button, Modal, Spinner } from 'react-bootstrap';
import { usePagination } from '../../../hooks';
import { authConstraints, authInstance, config } from '../../../api';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { AuthContext, OrderContext, SocketContext, taskStatus } from '../../../stores';
import { Formik } from 'formik';
import { toast } from 'react-toastify';

function Product() {
    const [authState] = useContext(AuthContext);
    const [orderState,{putCancelOffer}] = useContext(OrderContext);
    const [__,{onOrderReceive}] = useContext(SocketContext);
    const [modalShow, setModalShow] = React.useState(false);
    const [modalData, setModalData] = React.useState();

    const rows = [5,10,15,20,25,30,35,40];
    const {
        currentPage,
        perPageAmount,
        total,
        loading,
        items: offers,
        nextPage,
        prevPage,
        setCurrent,
        setPerPageAmount,
        refresh
    } = usePagination({
        fetchingAPIInstance: ({controller, page, take}) => authInstance.get([authConstraints.driverRoot, authConstraints.getDriverActiveOrders].join("/"), {
            headers: {
                'Authorization': [config.AuthenticationSchema, localStorage.getItem(authConstraints.LOCAL_KEY)].join(' ')
            },
            params: {
                page,
                amount: take
            },
            signal: controller.signal
        }),
        propToGetItem: "results",
        propToGetTotalPage: "total",
        amountPerPage: rows[0],
        startingPage: 1,
        totalPages: 1
    });

    useEffect(() =>{
        onOrderReceive(orderId =>{
            console.log("Driver Active Order Page has changed status :" + orderId);
            refresh();
        });
    }, []);

    // On Global Tasks Changed
    useEffect(() => {
        if(orderState.tasks?.[authConstraints.putCancelOffer] === taskStatus.Completed){
            refresh();
            setModalShow(false);
        }

        else if(orderState.tasks?.[authConstraints.putCancelOffer] === taskStatus.Failed){
        }        
    }, [orderState.tasks]);
    
    return (
        <Formik initialValues={{
            suburb: '',
            postcode: ''
        }}
        onSubmit={(values) =>{

        }}>
            {props => {
                return (<>
                    {/* Search Panel */}
                    <div className='p-3'>
                        <div className='form-order'>
                            <Form.Group>
                                <div className='mb-2'>
                                    <Form.Label className='label'>Suburb</Form.Label>
                                </div>
                                <Form.Control
                                    type="text"
                                    placeholder='Enter The Suburb'
                                    name="suburd"
                                />
                            </Form.Group>
                            <Form.Group>
                                <div className='mb-2'>
                                    <Form.Label className='label'>Postcode</Form.Label>
                                </div>
                                <Form.Control
                                    type="text"
                                    placeholder='Enter Postcode'
                                    name="postcode"
                                />
                            </Form.Group>
                        </div>
                        <div>
                            <Button variant="warning" style={{backgroundColor:"#f2a13b",border:'none'}} className={`my-btn-yellow my-4 product-btn-search`}>
                                <BiSearchAlt2 style={{fontSize:'20px'}}></BiSearchAlt2>
                                Search</Button>
                        </div>
                    </div>
                    
                    {/* Table Showcase */}
                    <div>
                        <div className='pg-rows'>
                            <p className='m-0'>Show</p>
                            <Dropdown className='reg-dr' style={{width:'fit-content'}}>
                                <Dropdown.Toggle className='dr-btn py-1' id="dropdown-basic">
                                    {perPageAmount}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {rows.map((item,index) => {
                                        return(
                                            <Dropdown.Item key={index} onClick={()=>setPerPageAmount(item)}>{item}</Dropdown.Item>
                                        )
                                    })}
                                </Dropdown.Menu>
                            </Dropdown>
                            <p className='m-0'>Rows</p>
                        </div>

                        {loading && <Spinner></Spinner>}
                        
                        {offers?.length === 0 ? 
                            (<div className='txt-center'>
                                <h5>No Data Found</h5>
                            </div>) :
                            (<>
                                <div style={{maxWidth: '100%', overflowX: "scroll" }}>
                                    <Table striped bordered >
                                        <thead>
                                            <tr>
                                                <th>Order Id</th>
                                                <th style={{
                                                    minWidth: '320px'
                                                }}>Item Name</th>
                                                <th style={{
                                                    minWidth: '140px'
                                                }}>Pickup</th>
                                                <th style={{
                                                    minWidth: '140px'
                                                }}>Destination</th>
                                                <th style={{
                                                    minWidth: '140px'
                                                }}>Expected date</th>
                                                <th style={{
                                                    minWidth: '140px'
                                                }}>Expected time frame</th>
                                                <th style={{
                                                    minWidth: '140px'
                                                }}>Sender Offer</th>
                                                <th style={{
                                                    minWidth: '140px'
                                                }}>My Offer</th>
                                                <th style={{
                                                    minWidth: '140px'
                                                }}>
                                                    Order Status
                                                </th>
                                                <th style={{
                                                    minWidth: '140px'
                                                }}>Offer Status</th>
                                                <th style={{
                                                    minWidth: '140px'
                                                }}>Actions</th>
                                            </tr>
                                        </thead> 
                                        <tbody>
                                            {
                                                offers?.slice((currentPage - 1) * perPageAmount, currentPage * perPageAmount).map((offer,index) =>{
                                                    const allowDelivery = offer?.status === "Accepted" 
                                                        && (offer?.order?.status === "Paid"
                                                        || offer?.order?.status === "Prepared"
                                                        || offer?.order?.status === "Delivering"
                                                        || offer?.order?.status === "Completed" );
                                                    const waiting = offer?.status === "Waiting";    
                                                    const isCorrectDriver =offer?.order?.driverId === authState?.accountInfo?.id;
                                                    return (
                                                        <tr key={index}>
                                                            <td>{offer?.order?.id}</td>
                                                            <td>
                                                            <Row>
                                                                <Col sm="5">
                                                                    <img src={offer?.order?.orderItems?.[0]?.itemImages?.split?.("[space]")?.[0]} style={{width: "100%", maxWidth: '120px'}}></img>
                                                                </Col>
                                                                <Col sm="7">
                                                                    <b>{offer?.order?.orderItems?.[0]?.itemName}</b>
                                                                </Col>
                                                            </Row>
                                                                
                                                            </td>
                                                            <td>{offer?.order?.sendingLocation}</td>
                                                            <td>{offer?.order?.destination}</td>
                                                            <td>{!!offer?.order?.deliverableDate ? moment(offer?.order?.deliverableDate).format("DD-MM-YYYY") : ""}</td>
                                                            <td>{offer?.order?.timeFrame}</td>
                                                            <td>{offer?.order?.orderItems?.reduce?.((i,c) => i + c?.startingRate, 0)} aud</td>
                                                            <td>{offer?.ratePrice} aud</td>
                                                            <td>{offer?.order?.status}</td>
                                                            <td>{offer?.status}</td>
                                                            <td>
                                                            {(allowDelivery && isCorrectDriver) ? 
                                                                <Row style={{flexWrap: 'wrap'}}>
                                                                    <Col sm="12" className='mb-2'>
                                                                        <Link to={`/driver/order/detail/${offer?.order?.id}`}>
                                                                            <Button className="w-100" variant='success'>
                                                                                Start
                                                                            </Button>
                                                                        </Link>
                                                                    </Col>
                                                                </Row> :
                                                                (waiting) ? 
                                                                (<div className='p-2'>
                                                                    <p className='content-yellow text-center'>This order are being popup</p>
                                                                </div>) :
                                                                (offer?.order?.status === "Cancel") ?
                                                                (<div className='p-2'>
                                                                    <p className='content-yellow text-center'>This order has been removed</p>
                                                                </div>) : 
                                                                (offer?.status === "Cancelled") ?
                                                                (<div className='p-2'>
                                                                    <p className='content-yellow text-center'>This offer has been cancelled</p>
                                                                </div>) :
                                                                !allowDelivery ?  
                                                                (<div className='p-2'>
                                                                    <p className='content-red text-center'>Order has completed transaction</p>
                                                                </div>) :
                                                                (<div className='p-2'>
                                                                    <Button className='w-100' variant='danger' onClick={() => {
                                                                        setModalShow(true);
                                                                        setModalData(offer);
                                                                    }}>Cancel</Button>
                                                                </div>)
                                                            }
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </Table>

                                    <Modal
                                        size="sm"
                                        aria-labelledby="contained-modal-title-vcenter"
                                        centered
                                        show={modalShow}
                                        >
                                        <Modal.Header>
                                            <Modal.Title className='txt-center w-100'>
                                            Confirm Your Action
                                            </Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <p className='txt-center' style={{margin:'0'}}> 
                                            Are you sure to cancel this order?
                                            </p>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <div className='txt-center w-100'>
                                            <button className='my-btn-gray mx-4' onClick={() => {setModalShow(false)}}>No</button>
                                            <button className='my-btn-red mx-4' onClick={() =>{
                                                if(modalData?.orderId){
                                                    putCancelOffer(modalData?.orderId);
                                                    return;
                                                }
                                                toast.error('Cannot find your order id');
                                            }}>Yes</button>
                                            </div>
                                        </Modal.Footer>
                                    </Modal>
                                </div>
                                <Pagination className='pg-form w-100'>
                                    <Pagination.Prev onClick={prevPage} className='pg-first' />
                                    {Array.from(Array(total).keys()).map((i,index) => {
                                        const item = i + 1;
                                        return (
                                            <div key={index}>
                                                <Pagination.Item 
                                                className={item === currentPage ? "pg-no pg-active" : "pg-no"}
                                                onClick={()=>setCurrent(item)}
                                                >{item}</Pagination.Item>
                                            </div>
                                        )
                                    })}
                                    <Pagination.Next onClick={nextPage} className='pg-first' />
                                </Pagination>
                            </>)}
                    </div>
                </>)
            }}
        </Formik>
    )
}
export default function Index(){
    return(
        <Product></Product>
    )
}
