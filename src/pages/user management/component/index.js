
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
import { Col, Modal, Row } from 'react-bootstrap';
import { usePagination } from '../../../hooks';
import { authConstraints, authInstance, config } from '../../../api';
import { CustomSpinner } from '../../../layout';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';

let userManagementSchema = yup.object().shape({
    email: yup.string().email('This field must be email type').required("Email is required field"), 
    password: yup.string().required("This field is requied")
})
function UserManagement() {
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
        fetchingAPIInstance: authInstance.get([authConstraints.adminRoot, authConstraints.getAllAccounts].join('/'), {
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
    const [shown, setShown] = useState(false);
    const [entity, setEntity] = useState(-1);
    const [aloading, setALoading] = useState(false);

    function acceptDriver(driverId){
        console.log(driverId);
        setALoading(true);
        authInstance.post([authConstraints.adminRoot, authConstraints.acceptAccountDriver].join("/"),null, {
            headers: {
                'Authorization': [config.AuthenticationSchema, localStorage.getItem(authConstraints.LOCAL_KEY)].join(' ')
            },
            params: {
                driverId
            }
        }).then(response =>{
            setALoading(false);
            if(response.data?.successed){
                toast.success("Update the status of this user");
            }
        }).catch(error =>{
            setALoading(false);
            toast.error(error?.data?.error || error?.message);
        });
    }

    function blockDriver(driverId){}

    function unlockDriver(driverId){}

    return (
        <Formik
            initialValues={{
                email: ''
            }} 
            validationSchema={userManagementSchema}
        >
        {({touched, errors, handleSubmit, handleChange, handleBlur, isValid,values}) =>{
            return(<>
                <div>
                    <div className='p-3'>
                        <div>
                            <Form onSubmit={handleSubmit}>
                                <div className='form-order'>
                                    <Form.Group>
                                        <div className='mb-2'>
                                            <Form.Label className='label'>Full name driver</Form.Label>
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
                            
                            <GrRefresh className='ms-auto' style={{fontSize: '2rem'}} onClick={()=> refresh()}></GrRefresh>
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
                                                }}>Driver Name</th>
                                                <th style={{
                                                    minWidth: '150px'
                                                }}>Email</th>
                                                <th style={{
                                                    minWidth: '150px'
                                                }}>Phone Number</th>
                                                <th style={{
                                                    minWidth: '150px'
                                                }}>Joined At</th>
                                                <th style={{
                                                    minWidth: '150px'
                                                }}>ABN</th>
                                                <th style={{
                                                    minWidth: '150px'
                                                }}>Bussiness Name</th>
                                                <th style={{
                                                    minWidth: '150px'
                                                }}>Status</th>
                                                <th style={{
                                                    minWidth: '150px'
                                                }}>Address</th>
                                                <th style={{
                                                    minWidth: '150px'
                                                }}>Actions</th>
                                            </tr>
                                        </thead> 
                                        <tbody>
                                            {
                                                items?.slice((currentPage - 1) * perPageAmount, perPageAmount * (1 + currentPage)).map((driver,index) =>{
                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{driver?.name || <span className='content-red'>{"null"}</span>}</td>
                                                            <td>{driver?.email}</td>
                                                            <td>{driver?.phoneNumber}</td>
                                                            <td>{moment(new Date()).format("YYYY/MM/DD")}</td>
                                                            <td>{driver?.abnNumber}</td>
                                                            <td>{driver?.bussinessName}</td>
                                                            <td>{driver?.isBlocked ? <span className="content-red">Block</span> : <span className="content-green">Activated</span>}</td>
                                                            <td>{driver?.address}</td>
                                                            <td>
                                                                {!driver?.hasCensored ?
                                                                    <Button className="ms-auto w-100" variant="success" onClick={() => acceptDriver(driver?.id)}>Accept driver</Button> :
                                                                driver?.isBlocked ? 
                                                                    <Button className="ms-auto w-100" variant="success" onClick={() => unlockDriver(driver?.id)}>Unlock</Button> :
                                                                    <Button className="ms-auto w-100" variant="danger" onClick={() => blockDriver(driver?.id)}>Block</Button>
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
                </div>
            </>)}}
        </Formik>
    )
}

export default function Index(){
    return(
        <UserManagement></UserManagement>
    )
}
