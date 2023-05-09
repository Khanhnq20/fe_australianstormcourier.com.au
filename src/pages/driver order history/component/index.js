import React from 'react';
import { Formik } from "formik";
import * as yup from 'yup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {BiSearchAlt2} from 'react-icons/bi';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import { Col, Row } from 'react-bootstrap';


let loginSchema = yup.object().shape({
    email: yup.string().email('This field must be email type').required("Email is required field"), 
    password: yup.string().required("This field is requied")
})
function Product() {
    const [post,setPost] = React.useState([]);
    const [paginatedPost,setPagiantedPost] = React.useState([]);
    const [currentPage,setCurrentPage] = React.useState(1);
    const [rows,setRows] = React.useState(10);
    const row = [10,15,20,25,30,35,40];
    const pageSize=rows;

    React.useEffect(()=>{
        axios.get('https://jsonplaceholder.typicode.com/todos').then((res)=>{
            setPost(res.data);
            setPagiantedPost(post.slice(0,pageSize)); 
        })
    },[rows]);
    const pages = post ? Math.ceil(post?.length/pageSize) : 0;
    const pageCount = [...Array(pages+1).keys()].slice(1);
    function pagination(pageNo){
        setCurrentPage(pageNo);
        const startIndex = (pageNo -1 ) * pageSize;
        const paginatedPostt = post?.slice(startIndex,startIndex+pageSize);
        setPagiantedPost(paginatedPostt);
    }
    function first(){
        setCurrentPage(1);
        const paginatedPostt = post?.slice(0,pageSize);
        setPagiantedPost(paginatedPostt);
    }
    function last(){
        setCurrentPage(pages);
        const paginatedPostt = post?.slice(-pageSize);
        setPagiantedPost(paginatedPostt);
    }
    function next(pageNo){
        if(currentPage !== pages){
            setCurrentPage(e => e+1);
            const startIndex = pageNo * pageSize;
            const paginatedPostt = post?.slice(startIndex,startIndex+pageSize);
            setPagiantedPost(paginatedPostt);
        }
    }
    function previous(pageNo){
        if(currentPage !== 1){
            setCurrentPage(e => e-1);
            const startIndex = (pageNo-2) * pageSize;
            const paginatedPostt = post?.slice(startIndex,startIndex+pageSize);
            setPagiantedPost(paginatedPostt);
        }
    }
    return (
        <Formik
            initialValues={{
                id:'',
                from:'',
                fullNameSender:'',
                fullNameDriver:'',
                to:''
            }} 
            validationSchema={loginSchema}
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
                                            placeholder="Enter Full Name"
                                            isInvalid={touched.fullName && errors.fullName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.fullName}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group>
                                        <div className='mb-2'>
                                            <Form.Label className='label'>From</Form.Label>
                                        </div>
                                        <Form.Control
                                            type="text"
                                            name="from"
                                            placeholder="Enter Full Name"
                                            isInvalid={touched.fullName && errors.fullName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.fullName}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group>
                                        <div className='mb-2'>
                                            <Form.Label className='label'>Full name sender</Form.Label>
                                        </div>
                                        <Form.Control
                                            type="text"
                                            name="fullNameSender"
                                            placeholder="Enter Full Name"
                                            isInvalid={touched.fullName && errors.fullName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.fullName}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group>
                                        <div className='mb-2'>
                                            <Form.Label className='label'>To</Form.Label>
                                        </div>
                                        <Form.Control
                                            type="text"
                                            name="to"
                                            placeholder="Enter Full Name"
                                            isInvalid={touched.fullName && errors.fullName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.fullName}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group>
                                        <div className='mb-2'>
                                            <Form.Label className='label'>Date</Form.Label>
                                        </div>
                                        <Form.Control
                                            type="text"
                                            name="fullNameDriver"
                                            placeholder="Enter Full Name"
                                            isInvalid={touched.fullName && errors.fullName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.fullName}</Form.Control.Feedback>
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
                                        {row.map((item,index) => {
                                            return(
                                                <Dropdown.Item key={index} onClick={()=>setRows(item)}>{item}</Dropdown.Item>
                                            )
                                        })}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            <p className='m-0'>Rows</p>
                        </div>
                        {paginatedPost?.length === 0 ? (<div className='txt-center'>
                                <h5>No Data Found</h5>
                            </div>) :
                            (<>
                                <Table striped bordered >
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Order Name</th>
                                            <th>Delivery Location</th>
                                            <th>Delivery Destination</th>
                                        </tr>
                                    </thead> 
                                        <tbody>
                                            {
                                                paginatedPost?.map((post,index) =>{
                                                    return (
                                                        <tr key={index}>
                                                            <td>{post.id}</td>
                                                            <td>{post.userId}</td>
                                                            <td>{post.title}</td>
                                                            <td>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                </Table>
                                <Pagination className='pg-form w-100'>
                                    <Pagination.First onClick={first} className='pg-first' style={{color:'black'}}/>
                                    <Pagination.Prev onClick={()=>previous(currentPage)} className='pg-first' />
                                    {pageCount.map((item,index) => {
                                        return (
                                            <div>
                                                <div key={index}>
                                                    <Pagination.Item 
                                                    className={item === currentPage ? "pg-no pg-active" : "pg-no"}
                                                    onClick={()=>pagination(item)}
                                                    >{item}</Pagination.Item>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    <Pagination.Next onClick={()=>next(currentPage)} className='pg-first' />
                                    <Pagination.Last onClick={last} className='pg-first'/>
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
