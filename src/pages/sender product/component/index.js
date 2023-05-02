import React from 'react';
import { Formik } from "formik";
import * as yup from 'yup';
import Form from 'react-bootstrap/Form';
import { Sidebar } from '../../../layout';
import Button from 'react-bootstrap/Button';
import {BiSearchAlt2} from 'react-icons/bi';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';


let senderSchema = yup.object().shape({
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
    },[rows])
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
            fullName:'',
            to:''
        }} 
        validationSchema={senderSchema}
    >
    {({touched, errors, handleSubmit, handleChange, handleBlur, isValid,values}) =>{
        return(
            <>   
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
                                                <Form.Label className='label'>Name</Form.Label>
                                            </div>
                                            <Form.Control
                                                type="text"
                                                name="fullName"
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
                                                <Form.Label className='label'>Status</Form.Label>
                                            </div>
                                            <DropDownStatus></DropDownStatus>
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
                        

                    </div>
            </>
    )}}
    </Formik>
  )
}

function DropDownStatus() {
    const [state,setState] = React.useState(true);
    return (
      <Dropdown className='reg-dr'>
        <Dropdown.Toggle className='dr-btn' id="dropdown-basic">
            {state === true ? "Looking for driver" : "Done"}
        </Dropdown.Toggle>
  
        <Dropdown.Menu className='w-100'>
          <Dropdown.Item onClick={()=>setState(true)}>Looking for driver</Dropdown.Item>
          <Dropdown.Item onClick={() => setState(false)}>Done</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
export default function Index(){
    return(
        <Sidebar>
            <Product></Product>
        </Sidebar>
    )
}
