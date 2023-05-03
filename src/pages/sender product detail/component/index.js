import React,{ useRef } from 'react'
import {  Sidebar } from '../../../layout'
import { Col, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import '../style/senderProductDetail.css';
import {TfiPencilAlt} from 'react-icons/tfi';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import { Formik } from "formik";
import * as yup from 'yup';
import Form from 'react-bootstrap/Form';
import {RiImageEditFill} from 'react-icons/ri';
import {BsFillPersonVcardFill} from 'react-icons/bs';
import Modal from 'react-bootstrap/Modal';

function ProductDetail(){
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
    return(
        <div>
            <div>
              <p className='product-detail-header'>Details</p>
            </div>
          <div>
            <div>
                <div className='sender-product-title'>
                    <p className='product-content-title mb-3'>Product Information</p>
                    <div>
                        <Button className='my-btn-yellow py-1'>
                            <TfiPencilAlt className='product-edit-icon'></TfiPencilAlt>
                            Edit</Button>
                    </div>
                </div>
            </div>
            <Row className='product-form-content'>
                <Col>
                  <div className='product-form-info'>
                      <div>
                        <div className='product-label-info'>
                            <p className='product-label'>
                              ID
                            </p>
                            <p className='product-content'>
                              00001
                            </p>
                        </div>
                        <div className='product-label-info'>
                            <p className='product-label'>
                              Name
                            </p>
                            <p className='product-content'>
                              Ansel
                            </p>
                        </div>
                        <div className='product-label-info'>
                            <p className='product-label'>
                              Quality
                            </p>
                            <p className='product-content'>
                              07731158000
                            </p>
                        </div>
                        <div className='product-label-info'>
                            <p className='product-label'>
                              From
                            </p>
                            <p className='product-content'>
                              Anselm@gmail.com
                            </p>
                        </div>
                        <div className='product-label-info'>
                            <p className='product-label'>
                              To
                            </p>
                            <p className='product-content'>
                              189795
                            </p>
                        </div>
                      </div>
                  </div>
                </Col>
                <Col>
                    <div>
                      <div className='product-label-info'>
                            <p className='product-label-fit'>
                              Starting shipping rates
                            </p>
                            <p className='product-content'>
                              300$
                            </p>
                        </div>
                        <div className='product-label-info'>
                            <p className='product-label-fit'>
                              Selected shipping rates
                            </p>
                            <p className='product-content'>
                              06785634545$
                            </p>
                        </div>
                        <div className='product-label-info'>
                            <p className='product-label-fit'>
                              Status
                            </p>
                            <p className='content-green'>
                              Actived
                            </p>
                        </div>
                        <div className='product-label-info'  style={{alignItems:'unset'}}>
                            <p className='product-label-fit'>
                              Product pictures
                            </p>
                            <div>
                                <div className='img-front-frame'  style={{padding:'10px 0 '}}>
                                    <div className='background-front'>
                                        <div style={{position:'relative',color:'gray',fontSize:'50px',opacity:'70%'}}>4</div>
                                        <p className='driving-txt'>view image</p>
                                    </div>
                                    <img className='img-front' src={'https://tinyurl.com/5ehpcctt'}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row>
              <Col>
                  <div className='py-4'>
                    <div className='product-label-info my' >
                          <p className='product-label-fit'>
                            Status
                          </p>
                          <p className='content-blue'>
                            Looking for a driver
                          </p>
                      </div>
                      <div>
                          <p style={{fontWeight:'600'}}>The driver requested delivery</p>
                      </div>
                      <div>
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
                                                <th>Driver</th>
                                                <th>Rate</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead> 
                                            <tbody>
                                                {
                                                    paginatedPost?.map((post,index) =>{
                                                        return (
                                                            <tr key={index}>
                                                                <td>{post.id}</td>
                                                                <td>{post.userId}</td>
                                                                <td>
                                                                    <div className='content-green'>Received</div>
                                                                </td>
                                                                <td className='sender-action'>
                                                                    <div className='txt-success'>Accept</div>
                                                                    <div className='txt-error'>Cancel</div>
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
                      </div>
                  </div>
              </Col>
            </Row>
          </div>
          {/* <ProductEdit></ProductEdit> */}
          <Driver></Driver>
        </div>
    )
}
let productSchema = yup.object().shape({
    shippingRates: yup.string().required("Selected shipper rates is required field"),
    phoneNumber: yup.number().typeError("Phone Number must be number").required("Phone Number is required field"),
})
function ProductEdit(){
    const product_img_ipt = useRef();
    const [imgUrlBack,setImgUrlBack] = React.useState();
    return(
    <Formik
        initialValues={{
            id:'',
            from:'',
            fullName:'',
            to:''
        }} 
        validationSchema={productSchema}
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
                                                <Form.Label className='label'>Selected shipper rates</Form.Label>
                                            </div>
                                            <Form.Control
                                                type="text"
                                                name="shippingRates"
                                                placeholder="Enter..."
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
                                                <Form.Label className='label'>Status</Form.Label>
                                            </div>
                                            <DropDownStatus></DropDownStatus>
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
                                                <Form.Label className='label'>Starting shipper rates</Form.Label>
                                            </div>
                                            <Form.Control
                                                type="text"
                                                name="shipperRates"
                                                placeholder="Enter..."
                                                isInvalid={touched.fullName && errors.fullName}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.fullName}</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group>
                                            <div className='mb-2'>
                                                <Form.Label className='label'>Product images</Form.Label>
                                            </div>
                                            <div className='back-up'>
                                                <div className='img-front-frame' onClick={() => product_img_ipt.current.click()}>
                                                    <div className='background-front'>
                                                        <RiImageEditFill style={{position:'relative',color:'gray',fontSize:'50px',opacity:'70%'}}></RiImageEditFill>
                                                        <p className='driving-txt'>Change driving license</p>
                                                    </div>
                                                    <img className='img-front' src={imgUrlBack || 'https://tinyurl.com/5ehpcctt'}/>
                                                </div>
                                                <input type="file" id="driver_image_back" name="fileBack" ref={product_img_ipt} 
                                                        isInvalid={!!errors.fileImageBack}
                                                        onChange={(e) =>{
                                                            
                                                            const file = e.target.files[0];
                                                            // setFieldValue("fileImage", file);
                                                            
                                                            const fileReader = new FileReader();
                                                            if(file){
                                                                fileReader.addEventListener("loadend", (e)=>{
                                                                    setImgUrlBack(fileReader.result);
                                                                })
                                                                fileReader.readAsDataURL(file);
                                                            }
                                                        }}
                                                />
                                                <input type="file" id="driver_image_back" name="fileBack"/>
                                            </div>
                                        </Form.Group>
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

function Driver({children}){
    const [active,setActive] = React.useState(1);
    const [modalShow, setModalShow] = React.useState(false);
    const [stepTemplate, setTemplate] = React.useState([
      "Prepare", "Ordering", "Delivering", "Completed"
    ]);
    return(
        <div>
            <div>
                <div className='product-label-info'>
                    <p className='product-label-fit'>
                    Status
                    </p>
                    <p className='content-yellow'>
                    In processing
                    </p>
                </div>
                <div className='product-label-info'>
                    <p className='product-label-fit'>
                    Driver
                    </p>
                    <p>
                    Tymothy
                    </p>
                </div>
                <div className='product-label-info'>
                    <p className='product-label-fit'>
                    Driving license
                    </p>
                    <div className="license-form" onClick={() => setModalShow(true)}>
                        <BsFillPersonVcardFill className='license-icon'></BsFillPersonVcardFill>
                        <p className='m-0'>Tymothy</p>
                    </div>
                </div>
                <PopUpCenteredModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                />
                <div className='product-label-info' style={{alignItems:'unset'}}>
                    <p className='product-label-fit py-2'>
                    Process
                    </p>  
                    <div>
                    <section class="step-wizard">
                        <ul className='order-progress'>
                        {stepTemplate.map((template,index) =>{
                            return (<li className='order-progress-item' key={index} data-active={index <= active}>
                            <div class="progress-circle"></div>
                            <div class="progress-label">
                                <h2 className='progress-txt-header'>
                                {template}
                                </h2>
                                <p>At 9PM, the driver requested to deliver the good</p>
                            </div>
                            </li>)
                        })}
                        
                        </ul>
                    </section>
                    </div>
                </div>
                <div className='product-label-info' style={{alignItems:'unset'}}>
                    <p className='product-label-fit py-2'>
                    Process
                    </p> 
                    {/* <GoogleMapReact
                    defaultCenter={this.props.center}
                    defaultZoom={this.props.zoom}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
                    >
                    <AnyReactComponent
                        lat={59.955413}
                        lng={30.337844}
                        text="My Marker"
                    />
                    </GoogleMapReact> */}
                </div>
                <div className='product-label-info py-3' style={{alignItems:'unset'}}>
                    <p className='product-label-fit py-1'>
                    Delivery pictures
                    </p>
                    <div>
                        <div className='img-front-frame'  style={{padding:'10px 0 '}}>
                            <div className='background-front'>
                                <div style={{position:'relative',color:'gray',fontSize:'50px',opacity:'70%'}}>4</div>
                                <p className='driving-txt'>view image</p>
                            </div>
                            <img className='img-front' src={'https://tinyurl.com/5ehpcctt'}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
function PopUpCenteredModal(props) {
  return (
    <>
        <Modal
        {...props}
        closeButton
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        >
        <Modal.Header closeButton>
        </Modal.Header>
        <div>
            <Modal.Body className='p-4'>
            <Row className='license-info-form'>
                <Col>
                    <div className='product-label-info'>
                        <p className='product-label'>
                            ID
                        </p>
                        <p className='product-content'>
                            00001
                        </p>
                    </div>
                    <div className='product-label-info'>
                        <p className='product-label'>
                            Username
                        </p>
                        <p className='product-content'>
                            Tymothy
                        </p>
                    </div>
                    <div className='product-label-info'>
                        <p className='product-label'>
                            Phone number
                        </p>
                        <p className='product-content'>
                            012345678
                        </p>
                    </div>
                    <div className='product-label-info'>
                        <p className='product-label'>
                            Full Name
                        </p>
                        <p className='product-content'>
                            Tymothy
                        </p>
                    </div>
                    <div className='product-label-info'>
                        <p className='product-label'>
                            Email
                        </p>
                        <p className='product-content'>
                            Tymothy@gmail.com
                        </p>
                    </div>
                    <div className='product-label-info'>
                        <p className='product-label'>
                            ABNnumber
                        </p>
                        <p className='product-content'>
                            12325
                        </p>
                    </div>
                    <div className='product-label-info'>
                        <p className='product-label'>
                            Address
                        </p>
                        <p className='product-content'>
                            123 Newyork
                        </p>
                    </div>
                    <div className='product-label-info'>
                        <p className='product-label'>
                            City
                        </p>
                        <p className='product-content'>
                            Newyork
                        </p>
                    </div>
                    <div className='product-label-info'>
                        <p className='product-label'>
                            Driving license
                        </p>
                        <img width={"400px"} src='https://tinyurl.com/3p5vmunz'/>
                    </div>
                </Col>
                <Col>
                    <div className='product-label-info'>
                        <p className='product-label'>
                            State
                        </p>
                        <p className='product-content'>
                            American
                        </p>
                    </div>
                    <div className='product-label-info'>
                        <p className='product-label'>
                            Zipcode
                        </p>
                        <p className='product-content'>
                            555000
                        </p>
                    </div>
                    <div className='product-label-info'>
                        <p className='product-label'>
                            Vehicles
                        </p>
                        <p className='product-content' style={{wordWrap:"break-word",maxWidth:'200px'}}>
                            Motorbike,Car(Hatchback),4x4Wagon,Van,Medium Van(1-3 ton), Other
                        </p>
                    </div>
                    <div className='product-label-info'>
                        <p className='product-label'>
                        Status
                        </p>
                        <p className='content-green'>
                        Actived
                        </p>
                    </div>
                    <div className='product-label-info'>
                        <p className='product-label'>
                            Birthday
                        </p>
                        <p className='product-content'>
                            22/02/1991
                        </p>
                    </div>
                    <div className='product-label-info'>
                        <p className='product-label'>
                            Gender
                        </p>
                        <p className='product-content'>
                            Male
                        </p>
                    </div>
                    <div className='product-label-info'>
                        <p className='product-label'>
                            Additional Information
                        </p>
                        <p className='product-content'>
                            Additional Information
                        </p>
                    </div>
                    <div className='product-label-info'>
                        <p className='product-label'>
                            Review
                        </p>
                        <p className='product-content'>
                            Loadding....
                        </p>
                    </div>
                </Col>
            </Row>
            </Modal.Body>
        </div>
        </Modal>
    </>
  );
}
export default function Index() {
  return (<>
        <ProductDetail></ProductDetail>
  </>
  )
}
