import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../styles/home.css';
import Button from 'react-bootstrap/Button';
import "../../../layout/navigation/style/navigation.css"

export default function Index() {
  return (
    <>
        <div>
            <Banner>
            </Banner>
            <Delivery></Delivery>
            <Rate></Rate>
            <Notifycation></Notifycation>
            <Marketing></Marketing>
            <BecomeCustomer></BecomeCustomer>
            <Address></Address>
        </div>
    </>
  )
}

function Banner(){
    return(
        <>
            <div className='ban-background'>
                <div className='container'>
                    <Row className='ban-background'>
                        <Col className='ban-ctn-1'>
                            <div className='ban-content'>
                                <h3 className='ban-txt-header'>AUSTRALIAN STORM COURIER – AS COURIER</h3>
                                <p className='ban-txt'>Australian Storm Courier is a professional 
                                and equitable delivery company based in Australia who can provide 
                                standard or same-day deliveries across each city in Australia</p>
                            </div>
                        </Col>
                        <Col>
                            <div>
                                <img className='ban-img' src='https://australianstormcourier.com.au/wp-content/uploads/2023/04/sender1-1024x1024.png'/>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    )
}

function Delivery(){
    return(
        <>
            <div className='del-root'>
                <div className='container'>
                    <Row>
                        <Col className='del-content'>
                                <h3>DELIVERY SERVICES</h3>
                                <p>
                                If you need assistance with parcel deliveries, we can help! We can assist with deliveries of all 
                                sizes whether personal or business related. AS Courier provides package delivery and same-day courier 
                                services within each city in Australia. We cater to households and businesses; specialising in providing 
                                final mile delivery solutions for eCommerce businesses and online traders.
                                </p>
                                <Button variant="warning" className='my-btn-yellow'>BECOME A CUSTOMER</Button>
                        </Col>
                        <Col>
                            <div>
                                <div>
                                    <img className='del-img' src="https://australianstormcourier.com.au/wp-content/uploads/2023/04/shipping.jpg"/>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    )
}

function Rate(){
    return(
        <>
            <div className='rate-root'>
                <div className='container'>
                    <Row className='del-row'>
                        <Col>
                            <div>
                                <div>
                                    <img className='del-img' src="https://australianstormcourier.com.au/wp-content/uploads/2023/04/gps.jpg"/>
                                </div>
                            </div>
                        </Col>
                        <Col className='del-content'>
                                <h3>CHOOSE YOUR OWN RATES</h3>
                                <p>
                                You decide your own rates and dates and our drivers can accept your jobs or offer a different rate. We offer you the flexibility to choose your favourite drivers and rates.
                                </p>
                                <Button variant="warning" className='my-btn-yellow'>SEND NOW</Button>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    )
}

function Notifycation(){
    return(
        <>
            <div className='del-root'>
                <div className='container'>
                    <Row>
                        <Col className='del-content'>
                                <h3>WHY DRIVER FOR AUSTRALIAN STORM COURIER?</h3>
                                <p>
                                We offer job flexibility and choice. You get to decide what jobs are best suited for you, 
                                and get paid for it! At Australian Storm Courier, we understand the importance of a 
                                balanced lifestyle. Connect with us here to start delivering
                                </p>
                                <Button variant="warning" className='my-btn-yellow'>BECOME A DRIVER</Button>
                        </Col>
                        <Col>
                            <div>
                                <div>
                                    <img className='del-img' src="https://australianstormcourier.com.au/wp-content/uploads/2023/04/shipping.jpg"/>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    )
}

function Marketing(){
    return(
        <>
            <div>       
                <div className='container py-5'>
                    <Row>
                        <Col>
                            <h3 className='mar-txt-header'>WHY CHOOSE US?</h3>
                            <p className='mar-txt'>Need to send something on time? Contact us now. Over 100 businesses trust 
                                Australian Storm Courier. Whether it’s small parcels or large pallets, we’re 
                                here for you anytime to get these shipments where they need to be.</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm="12" lg="6">
                            <div className='mar-item'>
                                <div>
                                    <img src='https://australianstormcourier.com.au/wp-content/uploads/2023/04/truck-300x300.png' width={"60px"}/>
                                </div>
                                <div>
                                    <div>
                                        <h4>
                                            Fastest Delivery
                                        </h4>
                                        <p>
                                            We specialize in same-day delivery, door-to-door express shipping, contactless, and pickups.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col sm="12" lg="6">
                            <div className='mar-item mb-4'>
                                <div>
                                    <img src='https://australianstormcourier.com.au/wp-content/uploads/2023/04/truck-300x300.png' width={"60px"}/>
                                </div>
                                <div>
                                    <div>
                                        <h4>
                                            Fastest Delivery
                                        </h4>
                                        <p>
                                            We specialize in same-day delivery, door-to-door express shipping, contactless, and pickups.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col sm="12" lg="6">
                        <div className='mar-item'>
                                <div>
                                    <img src='https://australianstormcourier.com.au/wp-content/uploads/2023/04/truck-300x300.png' width={"60px"}/>
                                </div>
                                <div>
                                    <div>
                                        <h4>
                                            Fastest Delivery
                                        </h4>
                                        <p>
                                            We specialize in same-day delivery, door-to-door express shipping, contactless, and pickups.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col sm="12" lg="6">
                        <div className='mar-item'>
                                <div>
                                    <img src='https://australianstormcourier.com.au/wp-content/uploads/2023/04/truck-300x300.png' width={"60px"}/>
                                </div>
                                <div>
                                    <div>
                                        <h4>
                                            Fastest Delivery
                                        </h4>
                                        <p>
                                            We specialize in same-day delivery, door-to-door express shipping, contactless, and pickups.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    )
}

function BecomeCustomer(){
    return(
        <>
            <div className='cus-root'>
                <div className='container px-4 py-5'>
                    <div className='pb-4'>
                        <h3 className='mar-txt-header'>YOU CAN QUICKLY BECOME A CUSTOMER OR DRIVER.</h3>
                        <p className='mar-txt'>When you are a customer, you can send your package quickly. 
                        When you are a driver, you can receive many orders in a day.</p>
                    </div>
                    <Row className='gap-4'>
                        <Col className='cus-item p-3' >
                            <div className='cus-img'>
                                <img src='https://australianstormcourier.com.au/wp-content/uploads/2023/04/sender.png' width="100%" height="100%"/>
                            </div>
                            <Button variant="warning" className='w-100 my-btn-yellow my-4'>BECOME A DRIVER</Button>
                        </Col>
                        <Col className='cus-item p-3'>
                            <div className='cus-img'>
                                <img src='https://australianstormcourier.com.au/wp-content/uploads/2023/04/sender.png' width="100%" height="100%"/>
                            </div>
                            <Button variant="warning" className='w-100 my-btn-yellow my-4'>BECOME A DRIVER</Button>
                        </Col>
                        <Col className='cus-item p-3'>
                            <div className='cus-img'>
                                <img src='https://australianstormcourier.com.au/wp-content/uploads/2023/04/sender.png' width="100%" height="100%"/>
                            </div>
                            <Button variant="warning" className='w-100 my-btn-yellow my-4'>BECOME A DRIVER</Button>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    )
}

function Address(){
    return(
        <>
            <div>
                <div className='container py-5'>
                    <Row>
                        <Col className='as-ctn-1'>
                            <div className='as-img mb-4'>
                                <img src='https://australianstormcourier.com.au/wp-content/uploads/2023/04/as-logo.png' width={'100%'}/>
                            </div>
                            <h3 className='mar-txt-header mb-4'>AUSTRALIAN STORM COURIER</h3>
                            <div>
                                <h5>ABN: 82 654 966 604</h5>
                                <h5>Email: info@australianstormcourier.com.au</h5>
                            </div>
                        </Col>
                        <Col>
                            <div>
                                <h3>FOLLOW US</h3>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>  
        </>
    )
}