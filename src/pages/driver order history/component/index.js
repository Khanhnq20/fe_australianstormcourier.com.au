import React from 'react';
import { Formik } from "formik";
import {BiSearchAlt2} from 'react-icons/bi';
import {Table, Pagination,Form,Button, Dropdown} from 'react-bootstrap';
import { usePagination } from '../../../hooks';
import { authConstraints, authInstance, config } from '../../../api';

function Product() {
    const rows = [10,15,20,25,30,35,40];
    const {
        currentPage,
        perPageAmount,
        total,
        loading,
        items : orders,
        nextPage,
        prevPage,
        setCurrent,
        setPerPageAmount
     } = usePagination({
        fetchingAPIInstance: ({controller, page, take }) => authInstance.get([authConstraints.driverRoot, authConstraints.getDriverHistory].join("/"), {
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

    return (
        <Formik
            initialValues={{
                id:'',
                from:'',
                fullNameSender:'',
                fullNameDriver:'',
                to:''
            }} 
        >
        {({touched, errors, handleSubmit, handleChange, handleBlur, isValid,values}) =>{
            return(
                <div>
                    <div className='p-3'>
                        <div>
                            <Form>
                                <div className='form-order'>
                                    <Form.Group>
                                        <div className='mb-2'>
                                            <Form.Label className='label'>ID</Form.Label>
                                        </div>
                                        <Form.Control
                                            type="text"
                                            name="id"
                                            placeholder="Enter Id"
                                            isInvalid={touched.id && errors.id}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.id}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group>
                                        <div className='mb-2'>
                                            <Form.Label className='label'>Sender Location</Form.Label>
                                        </div>
                                        <Form.Control
                                            type="text"
                                            name="senderLocation"
                                            placeholder="Enter Sender Location"
                                            isInvalid={touched.senderLocation && errors.senderLocation}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.id}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group>
                                        <div className='mb-2'>
                                            <Form.Label className='label'>Full name sender</Form.Label>
                                        </div>
                                        <Form.Control
                                            type="text"
                                            name="fullNameSender"
                                            placeholder="Enter Sender's Name"
                                            isInvalid={touched.senderName && errors.senderName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.senderName}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group>
                                        <div className='mb-2'>
                                            <Form.Label className='label'>Destination</Form.Label>
                                        </div>
                                        <Form.Control
                                            type="text"
                                            name="destiantion"
                                            placeholder="Enter Destination"
                                            isInvalid={touched.destination && errors.destination}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.destination}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group>
                                        <div className='mb-2'>
                                            <Form.Label className='label'>Date</Form.Label>
                                        </div>
                                        <Form.Control
                                            type="text"
                                            name="date"
                                            placeholder="Enter Date"
                                            isInvalid={touched.date && errors.date}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.date}</Form.Control.Feedback>
                                    </Form.Group>
                                </div>
                                <div>
                                    <Button variant="warning" style={{backgroundColor:"#f2a13b",border:'none'}} className={`my-btn-yellow my-4 product-btn-search`}>
                                        <BiSearchAlt2 style={{fontSize:'20px'}}></BiSearchAlt2>
                                        Search</Button>
                                </div>
                            </Form>
                        </div>
                    </div>
                        
                    <div>
                        <div className='pg-rows'>
                            <p className='m-0'>Show</p>
                            <div>
                                <Dropdown className='reg-dr' style={{width:'fit-content'}}>
                                    <Dropdown.Toggle className='dr-btn py-1' id="dropdown-basic">
                                        {rows}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {rows.map((item,index) => {
                                            return(
                                                <Dropdown.Item key={index} onClick={() => setPerPageAmount(item)}>{item}</Dropdown.Item>
                                            )
                                        })}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            <p className='m-0'>Rows</p>
                        </div>
                        {orders?.length === 0 ? 
                            (<div className='txt-center'>
                                <h5>No Data Found</h5>
                            </div>) :
                            (<>
                                <Table striped bordered >
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Order Name</th>
                                            <th>Pickup Location</th>
                                            <th>Destination</th>
                                            <th></th>
                                        </tr>
                                    </thead> 
                                        <tbody>
                                            {
                                                orders?.map((order,index) =>{
                                                    return (
                                                        <tr key={index}>
                                                            <td>{order.id}</td>
                                                            <td>{order.userId}</td>
                                                            <td>{order.title}</td>
                                                            <td>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                </Table>
                                <Pagination className='pg-form w-100'>
                                    <Pagination.Prev onClick={prevPage} className='pg-first' />
                                    {Array.from(Array(total).keys()).map((item,index) => {
                                        return (
                                            <div key={index}>
                                                <Pagination.Item 
                                                className={item + 1 === currentPage ? "pg-no pg-active" : "pg-no"}
                                                onClick={()=>setCurrent(item + 1)}
                                                >{item + 1}</Pagination.Item>
                                            </div>
                                        )
                                    })}
                                    <Pagination.Next onClick={nextPage} className='pg-first' />
                                </Pagination>
                            </>)
                            }
                    </div>
                </div>)
        }}
        </Formik>
    )
}

export default function Index(){
    return(
        <Product></Product>
    )
}
