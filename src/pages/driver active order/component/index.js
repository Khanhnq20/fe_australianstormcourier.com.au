import '../style/driverActiveOrder.css';
import React, { useContext } from 'react';
import * as yup from 'yup';
import {BiSearchAlt2} from 'react-icons/bi';
import Dropdown from 'react-bootstrap/Dropdown';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import { Col, Row, Form, Button, Modal } from 'react-bootstrap';
import { usePagination } from '../../../hooks';
import { authConstraints, authInstance, config } from '../../../api';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { AuthContext, OrderContext } from '../../../stores';
import { CustomSpinner } from '../../../layout';
import { Formik } from 'formik';

function Product() {
    const [authState] = useContext(AuthContext);
    const [_,{postDriverOffer, putCancelOffer}] = useContext(OrderContext);
    const [modalShow, setModalShow] = React.useState(false);

    const rows = [5,10,15,20,25,30,35,40];
    const {
        currentPage,
        perPageAmount,
        total,
        loading,
        items,
        nextPage,
        prevPage,
        setCurrent,
        setPerPageAmount
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
    

    if(loading){
        return <CustomSpinner></CustomSpinner>
    }
    
    return (
        <Formik initialValues={{

        }}
        onSubmit={(values) =>{

        }}>
            {props => {
                return (<>
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
                        
                        {items?.length === 0 ? 
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
                                                items?.slice((currentPage - 1) * perPageAmount, currentPage * perPageAmount).map((post,index) =>{
                                                    const allowDelivery = post?.status === "Accepted" 
                                                        && post?.order?.status === "Paid"
                                                        || post?.order?.status === "Prepared"
                                                        || post?.order?.status === "Delivering"
                                                        || post?.order?.status === "Completed";
                                                    return (
                                                        <tr key={index}>
                                                            <td>{post?.order?.id}</td>
                                                            <td>
                                                            <Row>
                                                                <Col sm="5">
                                                                    <>
                                                                        <img src={post?.order?.orderItems?.[0]?.itemImages?.split?.("[space]")?.[0]} style={{width: "100%"}}></img>
                                                                    </>
                                                                </Col>
                                                                <Col sm="7">
                                                                    <b>{post?.order?.orderItems?.[0]?.itemName}</b>
                                                                </Col>
                                                            </Row>
                                                                
                                                            </td>
                                                            <td>{post?.order?.sendingLocation}</td>
                                                            <td>{post?.order?.destination}</td>
                                                            <td>{!!post?.order?.deliverableDate ? moment(post?.order?.deliverableDate).format("DD-MM-YYYY") : ""}</td>
                                                            <td>{post?.order?.timeFrame}</td>
                                                            <td>{post?.order?.orderItems?.reduce?.((i,c) => i + c?.startingRate, 0)} aud</td>
                                                            <td>{post?.ratePrice} aud</td>
                                                            <td>{post?.order?.status}</td>
                                                            <td>{post?.status}</td>
                                                            <td>
                                                            {allowDelivery ? 
                                                                <Row style={{flexWrap: 'wrap'}}>
                                                                    <Col sm="12" className='mb-2'>
                                                                        <Link to={`/driver/order/detail/${post?.order?.id}`}>
                                                                            <Button className="w-100" variant='success'>
                                                                                Start
                                                                            </Button>
                                                                        </Link>
                                                                    </Col>
                                                                </Row> :
                                                                (post?.order?.status === "Cancel") ?
                                                                <div className='p-2'>
                                                                    <p>This order has been cancelled</p>
                                                                </div> : 
                                                                (post?.status === "Cancelled") ?
                                                                <div className='p-2'>
                                                                    <p>This offer has been cancelled</p>
                                                                </div> :
                                                                <div className='p-2'>
                                                                    <Button className='w-100' variant='danger' onClick={() => setModalShow(true)}>Cancel</Button>
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
                                                                                putCancelOffer(post?.orderId);
                                                                            }}>Yes</button>
                                                                            </div>
                                                                        </Modal.Footer>
                                                                    </Modal>
                                                                </div>
                                                            }
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </Table>
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
