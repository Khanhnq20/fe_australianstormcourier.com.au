import '../style/product.css';
import React, { useContext, useState } from 'react';
import { Formik, yupToFormErrors } from "formik";
import * as yup from 'yup';
import {BiSearchAlt2} from 'react-icons/bi';
import Dropdown from 'react-bootstrap/Dropdown';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import { Col, Row, Spinner, Form, Button, Modal, InputGroup } from 'react-bootstrap';
import { ImCross } from 'react-icons/im';
import { FcAcceptDatabase } from 'react-icons/fc';
import { usePagination } from '../../../hooks';
import { authConstraints, authInstance, config } from '../../../api';
import moment, { utc } from 'moment';
import { Link } from 'react-router-dom';
import { AuthContext, OrderContext } from '../../../stores';


let driverSchema = yup.object().shape({
    driverId: yup.string().nullable(),
    ratePrice: yup.number().moreThan(5).required(),
    orderId: yup.string().required(),
    createdAt: yup.date().required(),
})
function Product() {
    const [authState] = useContext(AuthContext);
    const [_,{postDriverOffer}] = useContext(OrderContext);

    const rows = [5,10,15,20,25,30,35,40];
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
        setPerPageAmount
    } = usePagination({
        fetchingAPIInstance: authInstance.get([authConstraints.driverRoot, authConstraints.getDriverActiveOrders].join("/"), {
            headers: {
                'Authorization': [config.AuthenticationSchema, localStorage.getItem(authConstraints.LOCAL_KEY)].join(' ')
            }
        }),
        propToGetItem: "results",
        propToGetTotalPage: "total",
        amountPerPage: rows[0],
        startingPage: 1,
        totalPages: 1
    });
    

    if(loading){
        return <Spinner></Spinner>
    }

    if(error) return <pre>{JSON.stringify(error, 4, 4)}</pre>

    return (
        <div>
            <div className='p-3'>
                <div className='form-order'>
                    <Form.Group>
                        <div className='mb-2'>
                            <Form.Label className='label'>From</Form.Label>
                        </div>
                        <Form.Control
                            type="text"
                            name="from"
                        />
                    </Form.Group>
                    <Form.Group>
                        <div className='mb-2'>
                            <Form.Label className='label'>Name</Form.Label>
                        </div>
                        <Form.Control
                            type="text"
                            name="fullName"
                        />
                    </Form.Group>
                    <Form.Group>
                        <div className='mb-2'>
                            <Form.Label className='label'>To</Form.Label>
                        </div>
                        <Form.Control
                            type="text"
                            name="to"
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
                                        }}>Offer Status</th>
                                        <th style={{
                                            minWidth: '140px'
                                        }}>Actions</th>
                                    </tr>
                                </thead> 
                                <tbody>
                                    {
                                        items?.slice(currentPage - 1, currentPage * perPageAmount).map((post,index) =>{
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
                                                    <td>{!!post?.order?.deliveredDate ? moment(post?.order?.deliveredDate).format("DD-MM-YYYY") : ""}</td>
                                                    <td>{post?.order?.timeFrame}</td>
                                                    <td>{post?.order?.orderItems?.reduce?.((i,c) => i + c?.startingRate, 0)} aud</td>
                                                    <td>{post?.ratePrice} aud</td>
                                                    <td>{post?.status}</td>
                                                    <td>
                                                    {(post?.isAccepted && post?.order?.status === "Paid") ? 
                                                        <Row style={{flexWrap: 'wrap'}}>
                                                            <Col sm="12" className='mb-2'>
                                                                <Link to={`/driver/order/detail/${post?.order?.id}`}>
                                                                    <Button className="w-100" variant='success'>
                                                                        Start
                                                                    </Button>
                                                                </Link>
                                                            </Col>
                                                        </Row> :
                                                        (post?.order?.status === "Trading") ?
                                                        <div className='p-2'>
                                                            <p>Your offer has been sent to customer to get their acceptance, please wait!</p>
                                                        </div> : 
                                                        (post?.order?.status === "Cancel") ?
                                                        <div className='p-2'>
                                                            <p>This order has been cancelled</p>
                                                        </div> : 
                                                        <div className='p-2'>
                                                            <p>Your offer has been accepted but waiting for payment</p>
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
                            {Array.from(Array(total).keys()).map((item,index) => {
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
        </div>
    )
}

export default function Index(){
    return(
        <Product></Product>
    )
}
