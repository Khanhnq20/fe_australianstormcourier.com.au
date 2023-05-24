
import React, { useState } from 'react';
import { Formik } from "formik";
import * as yup from 'yup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {BiSearchAlt2} from 'react-icons/bi';
import { GrRefresh} from 'react-icons/gr';
import Dropdown from 'react-bootstrap/Dropdown';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import { usePagination } from '../../../hooks';
import { authConstraints, authInstance, config } from '../../../api';
import { CustomSpinner } from '../../../layout';
import moment from 'moment';
import { toast } from 'react-toastify';

let userManagementSchema = yup.object().shape({
    email: yup.string().email('This field must be email type').required("Email is required field"), 
    password: yup.string().required("This field is requied")
})
function AdminInvoice() {
    const rows = [10,15,20,25,30,35,40];
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
        refresh
    } = usePagination({
        fetchingAPIInstance: authInstance.get([authConstraints.adminRoot, authConstraints.getAllPayments].join('/'), {
            headers: {
                'Authorization': [config.AuthenticationSchema, localStorage.getItem(authConstraints.LOCAL_KEY)].join(' ')
            }
        }), 
        propToGetItem: "results", 
        propToGetTotalPage: "total", 
        amountPerPage : rows[0], 
        startingPage : 1,
        totalPages: 1
    });
    const [aloading, setALoading] = useState(false);

    return (
        <Formik
            initialValues={{
                email: ''
            }} 
            validationSchema={userManagementSchema}
        >
        {({touched, errors, handleSubmit, handleChange, handleBlur, isValid,values}) =>{
            return(<>
                <section>
                    <div className='p-3'>
                        <div>
                            <Form onSubmit={handleSubmit}>
                                <div className='form-order'>
                                    <Form.Group>
                                        <div className='mb-2'>
                                            <Form.Label className='label'>Enter Id</Form.Label>
                                        </div>
                                        <Form.Control
                                            type="text"
                                            name="fullNameDriver"
                                            placeholder="Enter Full Name"
                                            isInvalid={touched.email && !!errors?.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors?.email}</Form.Control.Feedback>
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
                        {/* Request to show row number */}
                        <div className='pg-rows'>
                            <p className='m-0'>Show</p>
                            <div>
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
                            </div>
                            <p className='m-0'>Items</p>
                            
                            <GrRefresh className='ms-auto' style={{fontSize: '2rem', cursor: 'pointer'}} onClick={()=> refresh()}></GrRefresh>
                        </div>
                        {aloading && <CustomSpinner></CustomSpinner>}
                        
                        {loading ? <CustomSpinner></CustomSpinner> : items?.length === 0 ? (<div className='txt-center'>
                                <h5>No Data Found</h5>
                            </div>) :
                            (<>
                                <div style={{maxWidth: '100%', overflowX: "scroll", scrollBehavior: "smooth", scrollbarWidth: "30px" }}>
                                    <Table bordered >
                                        <thead>
                                            <tr>
                                                <th>Figure</th>
                                                <th style={{
                                                    minWidth: '150px'
                                                }}>Status</th>
                                                <th style={{
                                                    minWidth: '150px'
                                                }}>Sender Email</th>
                                                <th style={{
                                                    minWidth: '150px'
                                                }}>Sender Phone</th>
                                                <th style={{
                                                    minWidth: '150px'
                                                }}>Receiver Email</th>
                                                <th style={{
                                                    minWidth: '150px'
                                                }}>Receiver Phone</th>
                                                <th style={{
                                                    minWidth: '150px'
                                                }}>Created At</th>
                                                <th style={{
                                                    minWidth: '150px'
                                                }}>Completed At</th>
                                                <th style={{
                                                    minWidth: '150px'
                                                }}>Payout At</th>
                                                <th style={{
                                                    minWidth: '150px'
                                                }}>Actions</th>
                                            </tr>
                                        </thead> 
                                        <tbody>
                                            {
                                                items?.slice((currentPage - 1) * perPageAmount, perPageAmount * (1 + currentPage)).map((payment,index) =>{
                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td><span className="content-red">
                                                                {payment?.status}
                                                            </span>
                                                            </td>
                                                            <td>{payment?.sender?.email}</td>
                                                            <td>{payment?.sender?.phoneNumber}</td>
                                                            <td>{payment?.receiver?.email}</td>
                                                            <td>{payment?.receiver?.phoneNumber}</td>
                                                            <td>{payment?.createdAt ? moment(payment?.createdAt).format("YYYY/MM/DD") : "null"}</td>
                                                            <td>{payment?.completedAt ? moment(payment?.completedAt).format("YYYY/MM/DD") : "null"}</td>
                                                            <td>{!payment?.hasPayout ? <span className="content-red">Not Payout</span> : <span className="content-green">Payout at moment(payment?.payoutAt).format("YYYY/MM/DD")</span>}</td>
                                                            <td>
                                                                {!payment?.hasPayout && <Button className="ms-auto w-100" variant="success">Payout</Button>}
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </Table>
                                </div>

                                <Pagination className='pg-form w-100'>
                                    {/* <Pagination.First onClick={first} className='pg-first' style={{color:'black'}}/> */}
                                    <Pagination.Prev onClick={prevPage} className='pg-first' />
                                    {Array.from(total).map((item,index) => {
                                        return (
                                            <div>
                                                <div key={index}>
                                                    <Pagination.Item 
                                                    className={item === currentPage ? "pg-no pg-active" : "pg-no"}
                                                    onClick={() => setCurrent(item)}
                                                    >{item}</Pagination.Item>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    <Pagination.Next onClick={nextPage} className='pg-first' />
                                    {/* <Pagination.Last onClick={last} className='pg-first'/> */}
                                </Pagination>
                            </>)}
                    </div>
                </section>
            </>)}}
        </Formik>
    )
}

export default function Index(){
    return(
        <AdminInvoice></AdminInvoice>
    )
}
