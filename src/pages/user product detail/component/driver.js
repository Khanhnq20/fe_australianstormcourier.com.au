import React from 'react';
import Comment from './comment';
import moment from 'moment';
import { BsFillPersonVcardFill } from 'react-icons/bs';
import PopUpCenteredModal from './popupCenteredModal';
import { Carousel, Modal } from 'react-bootstrap';
import Feedback from './feedback';

function Driver({
    createdTime,
    preparedTime,
    deliveringTime,
    completedTime,
    cancelledTime,
    driver,
    orderId,
    reviews = [],
    deliveryImages,
    orderStatus,
}) {
    const [active, setActive] = React.useState(orderStatus);
    const [modalShow, setModalShow] = React.useState(false);
    const [modalDeliveryImage, setModalDeliveryImage] = React.useState(false);
    // const location = useLocation();
    const stepTemplate = [
        {
            type: 'Waiting',
            message: 'We has sent the request to delivery of driver',
            date: moment(createdTime).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            type: 'Prepared',
            message: 'Driver has received the order',
            date: moment(preparedTime).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            type: 'Delivering',
            message: 'Driver are on his way',
            date: moment(deliveringTime).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            type: 'Completed',
            message: 'Driver has come to you',
            date: moment(completedTime).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            type: 'Cancelled',
            message: 'Driver has cancelled',
            date: moment(cancelledTime).format('YYYY-MM-DD HH:mm:ss'),
        },
    ];
    const [showReview, setShowReview] = React.useState(
        stepTemplate?.[active]?.type === 'Completed' && !reviews?.length,
    );

    return (
        <div>
            {/* Driver Name  */}
            <div className="product-label-info">
                <p className="product-label-fit">Driver</p>
                <p>{driver.name}</p>
            </div>
            {/* Driver License Detail */}
            <div className="product-label-info">
                <p className="product-label-fit">Driving license</p>
                <div className="license-form" onClick={() => setModalShow(true)}>
                    <BsFillPersonVcardFill className="license-icon"></BsFillPersonVcardFill>
                    <p className="m-0">{driver.name}</p>
                </div>
                <PopUpCenteredModal
                    show={modalShow}
                    driver={driver}
                    reviews={reviews}
                    onHide={() => setModalShow(false)}
                />
            </div>
            {/* Process */}
            <div className="product-label-info" style={{ alignItems: 'unset' }}>
                <p className="product-label-fit py-2">Process</p>
                <div>
                    <section className="step-wizard">
                        <ul className="order-progress">
                            {stepTemplate?.map?.((template, index) => {
                                return (
                                    <li className="order-progress-item" key={index} data-active={index <= active}>
                                        <div className="progress-circle"></div>
                                        <div className="progress-label">
                                            <h2 className="progress-txt-header">{template.type}</h2>
                                            <p className="order-progress-description">
                                                At <b>{template.date}</b>, {template.message}
                                            </p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </section>
                </div>
            </div>
            {/* Delivery Pictures */}
            <div className="product-label-info py-3" style={{ alignItems: 'unset' }}>
                <p className="product-label-fit py-1">Delivery pictures</p>
                <div>
                    <div className="img-front-frame" style={{ padding: '10px 0 ' }}>
                        <div className="background-front">
                            <div
                                style={{
                                    position: 'relative',
                                    color: 'gray',
                                    fontSize: '50px',
                                    opacity: '70%',
                                }}
                            >
                                {deliveryImages?.length}
                            </div>
                            <p className="driving-txt">view image</p>
                        </div>
                        <img className="img-front" src={deliveryImages?.[0] || 'https://tinyurl.com/5ehpcctt'} />
                    </div>
                    <Modal centered show={modalDeliveryImage} onHide={() => setModalDeliveryImage(false)}>
                        <Modal.Header></Modal.Header>
                        <Modal.Body>
                            <Carousel>
                                {deliveryImages &&
                                    deliveryImages?.map?.((image, index) => {
                                        return (
                                            <Carousel.Item key={index}>
                                                <img src={image} />
                                            </Carousel.Item>
                                        );
                                    })}
                            </Carousel>
                        </Modal.Body>
                    </Modal>
                </div>
            </div>
            {/* Review Driver */}
            {reviews.map((review) => {
                return (
                    <div className="p-3">
                        <Feedback review={review}></Feedback>
                    </div>
                );
            })}
            {stepTemplate?.[active]?.type === 'Completed' && (
                <div className="product-label-info py-3" style={{ alignItems: 'unset' }}>
                    <p className="product-label-fit py-1">Review driver</p>
                    <div className="py-3" style={{ alignItems: 'unset' }}>
                        <Comment driverId={driver?.id} orderId={orderId}></Comment>
                    </div>
                </div>
            )}
            <Modal show={showReview} onHide={() => setShowReview(false)}>
                <Modal.Header closeButton>
                    <p className="product-label-fit py-1" style={{ margin: 0 }}>
                        Review driver
                    </p>
                </Modal.Header>
                <Modal.Body>
                    <div className="py-3" style={{ alignItems: 'unset' }}>
                        <Comment driverId={driver?.id} orderId={orderId}></Comment>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Driver;
