import '../style/driverProduct.css';
import React, { useContext } from 'react';
import { Formik } from "formik";
import * as yup from 'yup';
import {BiSearchAlt2} from 'react-icons/bi';
import Dropdown from 'react-bootstrap/Dropdown';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import { Col, Row, Spinner, Form, Button, InputGroup } from 'react-bootstrap';
import { usePagination } from '../../../hooks';
import { authConstraints, authInstance, config } from '../../../api';
import moment from 'moment';
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
        fetchingAPIInstance: authInstance.get([authConstraints.driverRoot, authConstraints.getDriverJobs].join("/"), {
            headers: {
                'Authorization': [config.AuthenticationSchema, localStorage.getItem(authConstraints.LOCAL_KEY)].join(' ')
            }
        }),
        propToGetItem: "results",
        propToGetTotalPage: "total",
        amountPerPage: rows[0],
        startingPage: 0,
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
                                        }}>Posted At</th>
                                        <th style={{
                                            minWidth: '140px'
                                        }}>Expected date</th>
                                        <th style={{
                                            minWidth: '140px'
                                        }}>Expected time frame</th>
                                        <th style={{
                                            minWidth: '140px'
                                        }}>Expected vehicles</th>
                                        <th style={{
                                            minWidth: '140px'
                                        }}>Status</th>
                                        <th style={{
                                            minWidth: '140px'
                                        }}>Sender Offer</th>
                                        <th style={{
                                            minWidth: '140px'
                                        }}>Required Vehicles</th>
                                        <th style={{
                                            minWidth: '140px'
                                        }}>Actions</th>
                                    </tr>
                                </thead> 
                                <tbody>
                                    {
                                        items?.slice(currentPage * perPageAmount, perPageAmount * (1 + currentPage)).map((post,index) =>{
                                            return (
                                                <tr key={index}>
                                                    <td>{post?.id}</td>
                                                    <td>
                                                        <Row>
                                                            <Col sm="5">
                                                                <>
                                                                    <img src={post?.orderItems?.[0]?.itemImages?.split?.("[space]")?.[0]} style={{width: "100%"}}></img>
                                                                </>
                                                            </Col>
                                                            <Col sm="7">
                                                                <b>{post?.orderItems?.[0]?.itemName}</b>
                                                            </Col>
                                                        </Row>
                                                    </td>
                                                    <td>{post?.sendingLocation}</td>
                                                    <td>{post?.destination}</td>
                                                    <td>{!!post?.createdDate ? moment(post?.createdDate).format("DD-MM-YYYY") : ""}</td>
                                                    <td>{!!post?.deliveredDate ? moment(post?.deliveredDate).format("DD-MM-YYYY") : ""}</td>
                                                    <td>{post?.timeFrame}</td>
                                                    <td><>
                                                        {post?.vehicles?.map?.(str => {
                                                            return <li>{str}</li>
                                                        })}
                                                    </>
                                                    </td>
                                                    <td>{post?.status?.replace?.(/([A-Z])/g, ' $1')?.trim?.()}</td>
                                                    <td>{post?.orderItems?.reduce?.((i,c) => i + c?.startingRate,0)} aud</td>
                                                    <td>{post?.vehicles?.join(" - ")}</td>
                                                    <td>
                                                        <Formik
                                                            initialValues={{
                                                                driverId: authState?.accountInfo?.id,
                                                                ratePrice: post?.selectedRate,
                                                                orderId: post?.id,
                                                                createdAt: new moment(),
                                                                show: false
                                                            }} 
                                                            validationSchema={driverSchema}
                                                            onSubmit={values =>{
                                                                postDriverOffer(values);
                                                            }}
                                                        >
                                                        {({touched, errors, values, handleSubmit, handleChange, handleBlur, setValues, setFieldValue, isValid}) =>{
                                                            return (
                                                                <>
                                                                    <Row style={{flexWrap: 'wrap'}}>
                                                                        <Col sm="12" className='mb-2'>
                                                                            <Button className="w-100" variant='success' onClick={() =>{
                                                                                const body = {
                                                                                    ...values,
                                                                                    ratePrice: post?.orderItems?.[0]?.startingRate
                                                                                };
                                                                                
                                                                                postDriverOffer(body);
                                                                            }}>
                                                                                Accept
                                                                            </Button>
                                                                        </Col>
                                                                        <Col sm="12">
                                                                            <Button className="w-100" variant='warning' onClick={() => setValues(v => ({...v, show: !v.show}))}>
                                                                                My Offer
                                                                            </Button>
                                                                        </Col>
                                                                    </Row>
                                                                    {values.show && (
                                                                        <Form onSubmit={handleSubmit}>
                                                                            <Form.Group>
                                                                                <InputGroup className="my-3">
                                                                                    <Form.Control name="ratePrice" 
                                                                                        onChange={(e) =>{
                                                                                            setFieldValue(e.target.name, Number(e.target.value), true);
                                                                                        }}
                                                                                        isInvalid={touched.ratePrice && !!errors?.ratePrice}
                                                                                        onBlur={handleBlur}
                                                                                        aria-label="RatePrice"
                                                                                        aria-describedby="aud"
                                                                                    ></Form.Control>
                                                                                    <InputGroup.Text id="aud">$</InputGroup.Text>
                                                                                    <Form.Control.Feedback type="invalid">{errors?.ratePrice}</Form.Control.Feedback>
                                                                                </InputGroup>
                                                                                <Button className='w-100' type="submit">Send My Offer</Button>
                                                                            </Form.Group>
                                                                        </Form>
                                                                    )}
                                                                </>
                                                        )}}
                                                        </Formik>
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
                            {Array.from(Array(5).keys()).map((item,index) => {
                                return (
                                    <div key={index}>
                                        <Pagination.Item 
                                        className={item === currentPage ? "pg-no pg-active" : "pg-no"}
                                        onClick={()=>setCurrent(item)}
                                        >{item + 1}</Pagination.Item>
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
