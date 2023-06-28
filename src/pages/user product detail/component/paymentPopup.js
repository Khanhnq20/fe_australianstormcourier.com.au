import { Modal } from 'react-bootstrap';
import { PaymentComponents } from '../..';

function PaymentPopup({ show, onHide, clientSecret, loading, checkoutServerAPI, order, ...props }) {
    return (
        <Modal show={show} onHide={onHide} closeButton aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closebutton></Modal.Header>
            <Modal.Body className="p-4" style={{ overflow: 'scroll' }}>
                <PaymentComponents.Payment clientSecret={clientSecret} checkoutServerAPI={checkoutServerAPI} />
            </Modal.Body>
        </Modal>
    );
}

export default PaymentPopup;
