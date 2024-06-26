import { Col, Modal, Row } from 'react-bootstrap';
import Rater from 'react-rater';
import 'react-rater/lib/react-rater.css';

function PopUpCenteredModal({ driver, reviews, ...props }) {
    return (
        <Modal {...props} closeButton size="xl" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton></Modal.Header>
            <div>
                <Modal.Body className="p-4">
                    <Row className="license-info-form">
                        <Col>
                            <div className="product-label-info">
                                <p className="product-label">Full Name</p>
                                <p className="product-content">{driver?.name}</p>
                            </div>
                            <div className="product-label-info">
                                <p className="product-label">Phone number</p>
                                <p className="product-content">{driver?.phoneNumber}</p>
                            </div>
                            <div className="product-label-info">
                                <p className="product-label">Email</p>
                                <p className="product-content">{driver?.email}</p>
                            </div>
                            <div className="product-label-info">
                                <p className="product-label">ABNnumber</p>
                                <p className="product-content">{driver?.abnNumber}</p>
                            </div>
                            <div className="product-label-info">
                                <p className="product-label">Address</p>
                                <p className="product-content">{driver?.address}</p>
                            </div>
                            <div className="product-label-info">
                                <p className="product-label">City</p>
                                <p className="product-content">{driver?.city}</p>
                            </div>
                            <div className="product-label-info">
                                <p className="product-label">Driving license</p>
                                <img width={'400px'} src={driver?.frontDrivingLiense} />
                            </div>
                        </Col>
                        <Col>
                            <div className="product-label-info">
                                <p className="product-label">State</p>
                                <p className="product-content">Australian</p>
                            </div>
                            <div className="product-label-info">
                                <p className="product-label">Zipcode</p>
                                <p className="product-content">{driver?.postCode}</p>
                            </div>
                            <div className="product-label-info">
                                <p className="product-label">Vehicles</p>
                                <p className="product-content" style={{ wordWrap: 'break-word', maxWidth: '200px' }}>
                                    {driver?.vehicles?.join?.(', ')}
                                </p>
                            </div>
                            <div className="product-label-info">
                                <p className="product-label">Status</p>
                                <p className="content-green">Actived</p>
                            </div>
                            <div className="product-label-info">
                                <p className="product-label">Birthday</p>
                                <p className="product-content">22/02/1991</p>
                            </div>
                            <div className="product-label-info">
                                <p className="product-label">Gender</p>
                                <p className="product-content">Male</p>
                            </div>
                            <div className="product-label-info">
                                <p className="product-label">Additional Information</p>
                                <p className="product-content">Additional Information</p>
                            </div>
                            <div className="product-label-info" style={{ alignItems: 'start' }}>
                                <p className="product-label">Review</p>
                                <ul className="product-content" style={{ padding: 0 }}>
                                    {reviews?.map((i, ind) => (
                                        <li key={ind} className="mb-2" style={{ listStyleType: 'none' }}>
                                            <Rater total={5} rating={i?.star || 1} interactive={false}></Rater>
                                            <label className="ms-2">{i?.star}</label>
                                            <p style={{ margin: 0 }}>{i?.feedback}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
            </div>
        </Modal>
    );
}

export default PopUpCenteredModal;
