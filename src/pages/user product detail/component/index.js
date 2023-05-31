import React,{ useEffect, useRef } from 'react'
import { Col, Container, Row, Button, Dropdown, Table, Form, Pagination,Modal, Stack, Spinner } from 'react-bootstrap';
import '../style/senderProductDetail.css';
import {MdPayment} from 'react-icons/md';
import { Formik } from "formik";
import * as yup from 'yup';
import {RiImageEditFill} from 'react-icons/ri';
import {BsFillPersonVcardFill} from 'react-icons/bs';
import { Navigate, useSearchParams } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';
import { authConstraints, authInstance, config } from '../../../api';
import { usePagination } from '../../../hooks';
import { PaymentComponents } from '../..';
import { CustomSpinner } from '../../../layout';
import Carousel from 'react-bootstrap/Carousel';
import {FaTimes} from 'react-icons/fa';
import { Link } from "react-router-dom";

function ProductDetail(){
    const [support,setSupport] = React.useState(false);
    const [slider,setSlider] = React.useState(false);
    const [receiveImg,setReceiveImg] = React.useState(false); 
    const [deliveryImg,setDeliveryImg] = React.useState(false); 
    const [order, setResult] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [popupLoading, setPopupLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const [show, setShow] = React.useState(false);
    const [clientSecret, setClientSecret] = React.useState("");
    const rows = [5,10,15,20,25,30,35,40];
    const [searchParams] = useSearchParams();
    const {
        currentPage,
        perPageAmount,
        total,
        loading: offerLoading,
        error: offerError,
        items : offers,
        nextPage,
        prevPage,
        setCurrent,
        setPerPageAmount,
        refresh
    } = usePagination({
        fetchingAPIInstance:({controller, page, take}) => authInstance.get([authConstraints.userRoot, authConstraints.getOrderOffers].join("/"), {
            headers: {
                'Authorization': [config.AuthenticationSchema, localStorage.getItem(authConstraints.LOCAL_KEY)].join(' ')
            },
            params: {
                orderId: searchParams.get(keyquery),
                page,
                amount: take
            },
            signal: controller.signal
        }),
        propToGetItem: "result",
        deps: [order],
        propToGetTotalPage: "total",
        amountPerPage: rows[0],
        startingPage: 1,
        totalPages: 1
    });

    useEffect(() =>{
        if(searchParams.get(keyquery)){
            getOrderInfo();
        }
    }, [searchParams]);

    useEffect(() =>{
        if(order){
            refresh();
        }
    }, [order])

    function getOrderInfo(){
        setLoading(true);
        authInstance.get([authConstraints.userRoot, authConstraints.getAllOrderInfo].join('/'), {
            headers: {
                'Authorization': [config.AuthenticationSchema, localStorage.getItem(authConstraints.LOCAL_KEY)].join(" ")
            },
            params: {
                orderId: searchParams.get(keyquery)
            }
        }).then(response =>{
            if(response?.data?.successed){
                setResult(response?.data?.result);
            }
            setLoading(false);
        }).catch(error =>{
            if(error.message === "Axios Error" && error.code === 403){
                setError("Forbiden");
                toast.error("Forbiden");
            }
            setLoading(false);
        });
    }

    function acceptDriver(driverId) {
        setLoading(true);
        authInstance.put([authConstraints.userRoot, authConstraints.acceptDriverOffer].join("/"), null, {
            headers: {
                'Authorization': [config.AuthenticationSchema, localStorage.getItem(authConstraints.LOCAL_KEY)].join(' ')
            },
            params: {
                orderId: searchParams.get(keyquery),
                driverId: driverId,
            }
        })
        .then(response =>{
            if(response?.data?.successed && response.data?.result){
                const {orderId, driverId} = response.data?.result;
                getOrderInfo();
                createOrderPayment(orderId,driverId);
            }
            setLoading(false);
        })
        .catch(error => {
            toast.error(error?.message);
            setError(error?.message);
            setLoading(false);
        });
    }

    function cancelDriver(driverId){
        setLoading(true);
        authInstance.put([authConstraints.userRoot, authConstraints.cancelDriverOffer].join("/"), null, {
            headers: {
                'Authorization': [config.AuthenticationSchema, localStorage.getItem(authConstraints.LOCAL_KEY)].join(' ')
            },
            params: {
                orderId: searchParams.get(keyquery),
                driverId: driverId,
            }
        })
        .then(response =>{
            if(response?.data?.successed && response.data?.result){
                const {orderId, driverId} = response.data?.result;
                getOrderInfo();
            }
            setLoading(false);
        })
        .catch(error => {
            toast.error(error?.message);
            setError(error?.message);
            setLoading(false);
        });
    }

    function createOrderPayment(orderId, driverId){
        setPopupLoading(true);
        return authInstance.post([authConstraints.userRoot, authConstraints.postCheckoutIntentSessions].join("/"), null, {
            headers: {
                'Authorization': [config.AuthenticationSchema, localStorage.getItem(authConstraints.LOCAL_KEY)].join(" ")
            },
            params: {
                orderId,
                driverId
            }
        }).then(response =>{
            if(response.data?.successed){
                setShow(true);
                const {clientSecrete} = response?.data;
                setClientSecret(clientSecrete);
            }
            setPopupLoading(false);
        }).catch(error =>{
            setShow(false);
            setPopupLoading(false);
        });
    }

    function checkoutServerAPI(orderId, driverId) {
        return authInstance.post([authConstraints.userRoot, authConstraints.postCheckout].join("/"), {}, {
            headers: {
                'Authorization': [config.AuthenticationSchema, localStorage.getItem(authConstraints.LOCAL_KEY)].join(" ")
            },
            params: {
                orderId,
                driverId
            }
        }).then(response =>{
            if(response.data?.successed){
                toast.success("Successfully payment");
            }
        }).catch(error => {
            toast.error(error?.message);
        })
    }

    if(loading) 
        return (<Container>
            <CustomSpinner></CustomSpinner>
        </Container>);

    if(error === "Forbiden"){
        return (<Navigate to="/user/order"></Navigate>);
    }

    return(
        <div>
            <div>
                <p className='product-detail-header'>Details</p>
            </div>

            <div>
                {/* Delivery Information Title*/}
                <div className='sender-product-title'>
                    <p className='product-content-title my-3'>Delivery Information</p>
                </div>
                {/* Delivery Information Body*/}
                <Row className='product-form-content'>
                    {/* Left Info: ID, Sender name, Phone number, From, To, Receiver Name, Receiver Phone, Posted Date, Vehicles */}
                    <Col>
                        <div className='product-form-info'>
                            <div>
                                <div className='product-label-info'>
                                    <p className='product-label'>
                                        ID
                                    </p>
                                    <p className='product-content'>
                                        {"000000".substring(0, 6 - order?.id?.toString().length) + order?.id}
                                    </p>
                                </div>
                                <div className='product-label-info'>
                                    <p className='product-label'>
                                        Sender Name
                                    </p>
                                    <p className='product-content'>
                                        {order?.sender?.name}
                                    </p>
                                </div>
                                <div className='product-label-info'>
                                    <p className='product-label'>
                                        Phone number
                                    </p>
                                    <p className='product-content'>
                                        {order?.sender?.phoneNumber}
                                    </p>
                                </div>
                                <div className='product-label-info'>
                                    <p className='product-label'>
                                        From
                                    </p>
                                    <p className='product-content'>
                                        {order?.sendingLocation}
                                    </p>
                                </div>
                                <div className='product-label-info'>
                                    <p className='product-label'>
                                        To
                                    </p>
                                    <p className='product-content'>
                                        {order?.destination}
                                    </p>
                                </div>
                                <div className='product-label-info'>
                                    <p className='product-label'>
                                        Receiver Name
                                    </p>
                                    <p className='product-content'>
                                        {order?.receiverName || "Provide now"}
                                    </p>
                                </div>
                                <div className='product-label-info'>
                                    <p className='product-label'>
                                        Receiver Phone
                                    </p>
                                    <p className='product-content'>
                                        {order?.receiverPhone}
                                    </p>
                                </div>
                                <div className='product-label-info'>
                                    <p className='product-label'>
                                        Posted Date
                                    </p>
                                    <p className='product-content'>
                                        {new moment(order?.createdDate).format('YYYY-MM-DD HH : mm : ss')}
                                    </p>
                                </div>
                                <div className='product-label-info' style={{alignItems: 'flex-start'}}>
                                    <p className='product-label'>
                                        Vehicles
                                    </p>
                                    <div className='product-content'>
                                        {order?.vehicles?.map?.((str,idx) =>{
                                            return <p key={idx}>- {str}</p>
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                    {/* Right Info: Starting shipping rates, Selected shipping rates, Status, Delivery Images, Received Images */}
                    <Col>
                        <div>
                            <div className='product-label-info'>
                                <p className='product-label-fit'>
                                    Starting shipping rates
                                </p>
                                <p className='product-content'>
                                    {order?.orderItems?.[0]?.startingRate} AUD
                                </p>
                            </div>
                            <div className='product-label-info'>
                                <p className='product-label-fit'>
                                    Selected shipping rates
                                </p>
                                <p className='product-content'>
                                {order?.orderItems?.[0]?.selectedRate} AUD
                                </p>
                            </div>
                            <div className='product-label-info'>
                                <p className='product-label-fit'>
                                    Status
                                </p>
                                
                                {order?.status === "WaitingForPayment" || order?.status === "Paid" ? (
                                    <p className="content-red">
                                        Closed
                                    </p>
                                ): order?.status !== "Cancelled" ? (
                                    <p className='content-green'>
                                        Opening
                                    </p>
                                ): (
                                    <p className='content-red'>
                                        Not available
                                    </p>
                                )}
                            </div>
                            <div className='product-label-info'  style={{alignItems:'unset'}}>
                                <p className='product-label-fit'>
                                    Delivery Images
                                </p>
                                <div>
                                    <div className='img-front-frame'  style={{padding:'10px 0 '}} onClick={()=>{setDeliveryImg(true)}}>
                                        <div className='background-front'>
                                            <div style={{position:'relative',color:'gray',fontSize:'50px',opacity:'70%'}}>{order?.deliverdItemImages?.split("[space]")?.length || 0}</div>
                                            <p className='driving-txt'>view image</p>
                                        </div>
                                        <img className='img-front' src={order?.deliverdItemImages?.split?.("[space]")?.[0]}/>
                                    </div>
                                    <div>
                                        <Modal
                                            size="lg"
                                            aria-labelledby="contained-modal-title-vcenter"
                                            centered
                                            show={deliveryImg}
                                            >
                                            <Modal.Header>
                                                <Modal.Title className='txt-center w-100' onClick={()=>{setDeliveryImg(false)}}>
                                                    <div style={{textAlign:'right'}}>
                                                        <FaTimes style={{color:'grey',cursor:'pointer'}}></FaTimes>
                                                    </div>
                                                </Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body className='link-slider'>
                                                <Carousel>
                                                    {order?.deliverdItemImages?.split?.("[space]")?.map((url,index) =>{
                                                        return <Carousel.Item style={{borderLeft:'none'}} key={index}>
                                                            <img
                                                            className="w-100"
                                                            src={url}
                                                            alt="First slide"
                                                            />
                                                            <Carousel.Caption>
                                                            </Carousel.Caption>
                                                        </Carousel.Item>
                                                    })}
                                                </Carousel>
                                            </Modal.Body>
                                        </Modal>
                                    </div>
                                </div>
                            </div>
                            <div className='product-label-info'  style={{alignItems:'unset'}}>
                                <p className='product-label-fit'>
                                    Received Images
                                </p>
                                <div>
                                    <div className='img-front-frame'  style={{padding:'10px 0 '}} onClick={()=>{setReceiveImg(true)}}>
                                        <div className='background-front'>
                                            <div style={{position:'relative',color:'gray',fontSize:'50px',opacity:'70%'}}>{order?.receivedItemImages?.split("[space]")?.length || 0}</div>
                                            <p className='driving-txt'>view image</p>
                                        </div>
                                        <img className='img-front' src={order?.receivedItemImages?.split?.("[space]")?.[0]}/>
                                    </div>
                                    <Modal
                                            size="lg"
                                            aria-labelledby="contained-modal-title-vcenter"
                                            centered
                                            show={receiveImg}
                                            >
                                            <Modal.Header>
                                                <Modal.Title className='txt-center w-100' onClick={()=>{setReceiveImg(false)}}>
                                                    <div style={{textAlign:'right'}}>
                                                        <FaTimes style={{color:'grey',cursor:'pointer'}}></FaTimes>
                                                    </div>
                                                </Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body className='link-slider'>
                                                <Carousel>
                                                    {order.receivedItemImages?.split?.("[space]")?.map((url,index) =>{
                                                        return <Carousel.Item style={{borderLeft:'none'}} key={index}>
                                                            <img
                                                            className="w-100"
                                                            src={url}
                                                            alt="First slide"
                                                            />
                                                            <Carousel.Caption>
                                                            </Carousel.Caption>
                                                        </Carousel.Item>
                                                    })}
                                                </Carousel>
                                            </Modal.Body>
                                        </Modal>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Item Information */}
                <div className='sender-product-title'>
                    <p className='product-content-title my-4'>Product Information</p>
                </div>
                {order?.orderItems?.map?.((item,index) =>{
                    return (
                        <Row className='product-form-content' key={index + 1}>
                            <Col>
                                <div className='product-form-info'>
                                    <div>
                                        <div className='product-label-info'>
                                            <p className='product-label'>
                                                Item Name
                                            </p>
                                            <p className='product-content'>
                                                {item.itemName}
                                            </p>
                                        </div>
                                        <div className='product-label-info'>
                                            <p className='product-label'>
                                                Charcode
                                            </p>
                                            <p className='product-content'>
                                                {"000000".substring(0, 6 - item.itemCharCode.toString().length) + item.itemCharCode}
                                            </p>
                                        </div>
                                        <div className='product-label-info'>
                                            <p className='product-label'>
                                                Note
                                            </p>
                                            <p className='product-content'>
                                                {item.itemDescription}
                                            </p>
                                        </div>
                                        <div className='product-label-info'>
                                            <p className='product-label'>
                                                Quantity
                                            </p>
                                            <p className='product-content'>
                                                {item.quantity}
                                            </p>
                                        </div>
                                        <div className='product-label-info'>
                                            <p className='product-label'>
                                                Weight
                                            </p>
                                            <p className='product-content'>
                                                {item?.weight} Kilograms
                                            </p>
                                        </div>
                                        <div className='product-label-info'>
                                            <p className='product-label'>
                                                Package Type
                                            </p>
                                            <p className='product-content'>
                                                {item.packageType}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col>
                                <div>
                                    <div className='product-label-info' style={{alignItems:'unset'}}>
                                        <p className="product-label-fit">
                                            Received Barcode
                                        </p>
                                        <p>
                                            {item?.itemCharCode}
                                        </p>
                                    </div>
                                    <div className='product-label-info'  style={{alignItems:'unset'}}>
                                        <p className='product-label-fit'>
                                            Product pictures
                                        </p>
                                        <div>
                                            <div className='img-front-frame'  style={{padding:'10px 0 '}} onClick={()=>{setSlider(true)}}>
                                                <div className='background-front'>
                                                    <div style={{position:'relative',color:'gray',fontSize:'50px',opacity:'70%'}}>{order?.orderItems?.[0]?.itemImages?.split("[space]")?.length}</div>
                                                    <p className='driving-txt'>view image</p>
                                                </div>
                                                <img className='img-front' src={item.itemImages?.split?.("[space]")?.[0]}/>
                                            </div>
                                            <div>
                                                {
                                                    slider 
                                                    ? 
                                                    <div>
                                                        <Modal
                                                                size="lg"
                                                                aria-labelledby="contained-modal-title-vcenter"
                                                                centered
                                                                show={slider}
                                                                >
                                                                <Modal.Header>
                                                                    <Modal.Title className='txt-center w-100' onClick={()=>{setSlider(false)}}>
                                                                        <div style={{textAlign:'right'}}>
                                                                            <FaTimes style={{color:'grey',cursor:'pointer'}}></FaTimes>
                                                                        </div>
                                                                    </Modal.Title>
                                                                </Modal.Header>
                                                                <Modal.Body className='link-slider'>
                                                                    <Carousel>
                                                                        {item.itemImages?.split?.("[space]")?.map((url,index) =>{
                                                                            return <Carousel.Item style={{borderLeft:'none'}} key={index}>
                                                                                <img
                                                                                className="w-100"
                                                                                src={url}
                                                                                alt="First slide"
                                                                                />
                                                                                <Carousel.Caption>
                                                                                </Carousel.Caption>
                                                                            </Carousel.Item>
                                                                        })}
                                                                    </Carousel>
                                                                </Modal.Body>
                                                            </Modal>
                                                    </div>
                                                    :
                                                    <></>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    )
                })}

                {/* Order Status And Table of Offer*/}
                <div className='py-4'>
                    <div className='product-label-info my' >
                        <p className='product-label-fit'>
                            Status
                        </p>
                        <p className='content-blue'>
                            {order.status?.replace?.(/([A-Z])/g, ' $1')?.trim?.()}
                        </p>
                    </div>
                    <div>
                        <p style={{fontWeight:'600'}}>The driver requested {order?.offerNumber} offers</p>
                    </div>
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
                                            <Dropdown.Item key={index} onClick={()=> setPerPageAmount(item)}>{item}</Dropdown.Item>
                                        )
                                    })}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <p className='m-0'>Rows</p>
                    </div>
                    {offerLoading ? <Spinner></Spinner> : offers.length === 0 ? (<div className='txt-center'>
                            <h5>No Data Found</h5>
                    </div>) :
                    (<>
                        <Table bordered >
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th style={{minWidth: '150px'}}>Rate</th>
                                    <th>Status</th>
                                    <th>Sent at</th>
                                    <th>Driver Vehicles</th>
                                    <th>Action</th>
                                </tr>
                            </thead> 
                            <tbody>
                                {
                                    offers?.map?.((offer,index) =>{
                                        return (
                                            <tr key={index}>
                                                <td>{"000000".substring(0, 6 - (index + 1)?.toString().length) + (index + 1)}
                                                </td>
                                                <td>
                                                    <Row>
                                                        <Col>ShipFee:</Col>
                                                        <Col>{offer?.ratePrice}</Col>
                                                    </Row>
                                                    <Row>
                                                        <Col>GST:</Col>
                                                        <Col>10%</Col>
                                                    </Row>
                                                    <Row>
                                                        <Col>Freight:</Col>
                                                        <Col>10%</Col>
                                                    </Row>
                                                    <Row>
                                                        <Col>Total</Col>
                                                        <Col>{(offer?.ratePrice * (1 + 0.1 + 0.1)).toFixed(2)}</Col>
                                                    </Row>
                                                </td>
                                                <td>
                                                    {<div className={offer.status === 'Accepted' ? 'content-green' : 
                                                    offer.status === 'Denied' ? 'content-danger' : 'content-yellow'}>
                                                        {offer.status}
                                                    </div>}
                                                </td>
                                                <td>{new moment(offer?.createdDate).format("DD/MM/YYYY")}</td>
                                                <td>
                                                    {offer?.driver?.vehicles?.join?.(" - ") || offer?.driverVehicles?.join(" - ")}
                                                </td>
                                                <td className='sender-action justify-content-center'>
                                                    {
                                                        // Case 1: Button Accept 
                                                        ((order.status === "LookingForDriver" || order.status === "Trading" || order.status === "WaitingForPayment") && offer.status === "Waiting") ?
                                                        (<div className='txt-success'>
                                                            <Button className="w-100 mb-2" variant="success" onClick={() => acceptDriver(offer?.driverId)}>Accept</Button>
                                                        </div>) :
                                                        // Case 2: Button Checkout
                                                        (order.status === "WaitingForPayment" && offer?.status === 'Accepted') ? 
                                                        (<div className='txt-success'>
                                                            <div style={{
                                                                cursor: 'pointer',
                                                                fontSize: '1.4rem',
                                                            }}
                                                            onClick={() => createOrderPayment(order?.id, offer?.driverId)}>
                                                                <p>
                                                                    <MdPayment></MdPayment><span className='ms-auto' style={{fontSize: '1rem'}}>Checkout Now</span>
                                                                </p>
                                                            </div>
                                                            <Button className='w-100' variant="danger" onClick={() => cancelDriver(offer?.driverId)}>Cancel</Button>
                                                        </div>) : 
                                                        // Case 3: Button Support, View and Print invoice
                                                        ((order.status === "Paid" || order.status === "Prepared" || order.status === "Delivering") && offer?.status === 'Accepted') ? 
                                                        (<Stack>
                                                            <Button className="w-100 mb-2" variant="warning">
                                                                Support
                                                            </Button>
                                                            <Button className="w-100 mb-2">View Invoice</Button>
                                                            <Button className="w-100 mb-2" variant="success">Print Invoice</Button>
                                                        </Stack>
                                                        ) :
                                                        // Case 4: Text Completed
                                                        (order.status === "Completed" && offer?.status === 'Accepted') ? 
                                                        (<p className='content-green'>Completed</p>) :
                                                        // Default
                                                        (<></>)
                                                    }
                                                    {/* (!!order?.driverId && post.driverId !== order?.driverId) ? 
                                                    (<p className='content-yellow text-center'>Your package had been delivered</p>) : */}
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </Table>
                        <Pagination className='pg-form w-100'>
                            {/* <Pagination.First onClick={first} className='pg-first' style={{color:'black'}}/> */}
                            <Pagination.Prev onClick={prevPage} className='pg-first' />
                            {Array.from(Array(total).keys()).map((item,index) => {
                                return (
                                    <div>
                                        <div key={index}>
                                            <Pagination.Item 
                                                className={item + 1 === currentPage ? "pg-no pg-active" : "pg-no"}
                                                onClick={()=> setCurrent(item + 1)}
                                            >{item + 1}</Pagination.Item>
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
            
            <PaymentPopup 
                show={show} 
                onHide={() => setShow(false)} 
                clientSecret={clientSecret}
                loading={popupLoading}
                checkoutServerAPI={() => checkoutServerAPI(order?.id, order?.driverId)}
            ></PaymentPopup>


            {order?.driverId && (order?.status === "Completed" 
            || order?.status === "Delivering" 
            || order?.status === "Prepared"
            || order?.status === "Paid") 
            && <Driver 
                    driver={order.driver} 
                    preparedTime={order?.preparedDate}
                    deliveringTime={order?.deliveredDate}
                    completedTime={order?.completedDate}
                    createdTime={order?.approvedDate}
                    cancelledTime={order?.cancelledDate}
                    deliveryImages={order?.deliverdItemImages?.split?.("[space]")}
                    receivedImages={order?.receivedItemImages?.split?.("[space]")}
                    orderStatus={
                        order?.status === "Paid" ? 0 :
                        order?.status === "Prepared" ? 1 :
                        order?.status === "Delivering" ? 2 : 
                        order?.status === "Completed" ? 3 : 
                        4}
                ></Driver>}
        </div>
    )
}

let productSchema = yup.object().shape({
    shippingRates: yup.string().required("Selected shipper rates is required field"),
    phoneNumber: yup.number().typeError("Phone Number must be number").required("Phone Number is required field"),
});

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
                                            placeholder="Enter Id"
                                            isInvalid={touched.id && errors.id}
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
                                            placeholder="Enter Shipping Rate"
                                            isInvalid={touched.shippingRates && errors.shippingRates}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.shippingRates}</Form.Control.Feedback>
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
                                        <Form.Control.Feedback type="invalid">{errors.senderLocation}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group>
                                        <div className='mb-2'>
                                            <Form.Label className='label'>Destination</Form.Label>
                                        </div>
                                        <Form.Control
                                            type="text"
                                            name="destination"
                                            placeholder="Enter Destination"
                                            isInvalid={touched.destination && errors.destination}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.destination}</Form.Control.Feedback>
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

function Driver({createdTime,preparedTime, deliveringTime, completedTime,cancelledTime, driver, deliveryImages, orderStatus}){
    const [active,setActive] = React.useState(orderStatus);
    const [modalShow, setModalShow] = React.useState(false);
    const [modalDeliveryImage, setModalDeliveryImage] = React.useState(false);
    const stepTemplate = [
        {
            type: "Waiting",
            message: "We has sent the request to delivery of driver",
            date: moment(createdTime).format("YYYY-MM-DD HH:mm:ss"),
        },
        {
            type: "Prepared",
            message: "Driver has received the order",
            date: moment(preparedTime).format("YYYY-MM-DD HH:mm:ss")
        },
        {
            type: "Delivering", 
            message: "Driver are on his way",
            date: moment(deliveringTime).format("YYYY-MM-DD HH:mm:ss")
        },
        {
            type: "Completed",
            message: "Driver has come to you",
            date: moment(completedTime).format("YYYY-MM-DD HH:mm:ss")
        },
        {
            type: "Cancelled",
            message: "Driver has cancelled",
            date: moment(cancelledTime).format("YYYY-MM-DD HH:mm:ss")
        },
    ];

    return(
        <div>
            {/* Driver Name  */}
            <div className='product-label-info'>
                <p className='product-label-fit'>
                    Driver
                </p>
                <p>
                    {driver.name}
                </p>
            </div>
            {/* Driver License Detail */}
            <div className='product-label-info'>
                <p className='product-label-fit'>
                Driving license
                </p>
                <div className="license-form" onClick={() => setModalShow(true)}>
                    <BsFillPersonVcardFill className='license-icon'></BsFillPersonVcardFill>
                    <p className='m-0'>{driver.name}</p>
                </div>
            <PopUpCenteredModal
                show={modalShow}
                driver={driver}
                onHide={() => setModalShow(false)}
            />
            </div>
            {/* Process */}
            <div className='product-label-info' style={{alignItems:'unset'}}>
                <p className='product-label-fit py-2'>
                    Process
                </p> 
                <div>
                <section className="step-wizard">
                    <ul className='order-progress'>
                    {stepTemplate?.map?.((template,index) =>{
                        return (<li className='order-progress-item' key={index} data-active={index <= active}>
                            <div className="progress-circle"></div>
                            <div className="progress-label">
                                <h2 className='progress-txt-header'>
                                    {template.type}
                                </h2>
                                <p className='order-progress-description'>
                                    At <b>{template.date}</b>, {template.message}
                                </p>
                            </div>
                        </li>)
                    })}
                    </ul>
                </section>
                </div>
            </div>
            {/* Delivery Pictures */}
            <div className='product-label-info py-3' style={{alignItems:'unset'}}>
                <p className='product-label-fit py-1'>
                    Delivery pictures
                </p>
                <div>
                    <div className='img-front-frame'  style={{padding:'10px 0 '}}>
                        <div className='background-front'>
                            <div style={{position:'relative',color:'gray',fontSize:'50px',opacity:'70%'}}>{deliveryImages?.length}</div>
                            <p className='driving-txt'>view image</p>
                        </div>
                        <img className='img-front' src={deliveryImages?.[0] || 'https://tinyurl.com/5ehpcctt'}/>
                    </div>
                    <Modal centered show={modalDeliveryImage} onHide={() => setModalDeliveryImage(false)}>
                        <Modal.Header></Modal.Header>
                        <Modal.Body>
                            <Carousel>
                            {
                                deliveryImages && deliveryImages?.map?.((image,index) =>{
                                    return (<Carousel.Item key={index}>
                                        <img src={image} />
                                    </Carousel.Item>)
                                })
                            }
                            </Carousel>
                        </Modal.Body>
                    </Modal>
                </div>
            </div>
        </div>
    )
}

function PopUpCenteredModal({driver, ...props}) {
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
                            Full Name
                        </p>
                        <p className='product-content'>
                            {driver?.name}
                        </p>
                    </div>
                    <div className='product-label-info'>
                        <p className='product-label'>
                            Phone number
                        </p>
                        <p className='product-content'>
                            {driver?.phoneNumber}
                        </p>
                    </div>
                    <div className='product-label-info'>
                        <p className='product-label'>
                            Email
                        </p>
                        <p className='product-content'>
                            {driver?.email}
                        </p>
                    </div>
                    <div className='product-label-info'>
                        <p className='product-label'>
                            ABNnumber
                        </p>
                        <p className='product-content'>
                            {driver?.abnNumber}
                        </p>
                    </div>
                    <div className='product-label-info'>
                        <p className='product-label'>
                            Address
                        </p>
                        <p className='product-content'>
                            {driver?.address}
                        </p>
                    </div>
                    <div className='product-label-info'>
                        <p className='product-label'>
                            City
                        </p>
                        <p className='product-content'>
                            {driver?.city}
                        </p>
                    </div>
                    <div className='product-label-info'>
                        <p className='product-label'>
                            Driving license
                        </p>
                        <img width={"400px"} src={driver?.frontDrivingLiense}/>
                    </div>
                </Col>
                <Col>
                    <div className='product-label-info'>
                        <p className='product-label'>
                            State
                        </p>
                        <p className='product-content'>
                            Australian
                        </p>
                    </div>
                    <div className='product-label-info'>
                        <p className='product-label'>
                            Zipcode
                        </p>
                        <p className='product-content'>
                            {driver?.zipCode}
                        </p>
                    </div>
                    <div className='product-label-info'>
                        <p className='product-label'>
                            Vehicles
                        </p>
                        <p className='product-content' style={{wordWrap:"break-word",maxWidth:'200px'}}>
                            {driver?.vehicles?.join?.(", ")}
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

function PaymentPopup({show,onHide,clientSecret,loading,checkoutServerAPI, order,...props}){
    return (<>
        <Modal
            show={show}
            onHide={onHide}
            closeButton
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
            <Modal.Header closebutton>
            </Modal.Header>
            <Modal.Body className='p-4'>
                <PaymentComponents.Payment clientSecret={clientSecret} checkoutServerAPI={checkoutServerAPI}></PaymentComponents.Payment>
            </Modal.Body>
        </Modal>
    </>)
}

const keyquery = "orderid";

export default function Index() {
    const [searchParams] = useSearchParams();

    if(!searchParams.has(keyquery) || !searchParams.get(keyquery)){
        return <Navigate to="/user/order/list"></Navigate>
    }

    return (<>
        <ProductDetail></ProductDetail>
    </>
  )
}
