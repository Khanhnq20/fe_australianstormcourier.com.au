import React, { useRef } from 'react';
import logo from '../../../image/as-logo.png';
import { useReactToPrint } from 'react-to-print';

export default function TotalInvoice({
    destination,
    itemName,
    weight,
    quantity,
    receiverName,
    receiverPhone,
    packageType,
    note,
}) {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'new document',
        onafterprint: () => alert('Print Success'),
    });
    return (
        <div className="t-invoice-root">
            <div className="t-invoice-form m-2 p-3" ref={componentRef} style={{ border: '1px solid #010101' }}>
                <div>
                    <div className="t-invoice-header">
                        <div style={{ width: '70px' }}>
                            <img src={logo} width={'100%'} />
                        </div>
                        <div className="t-invoice-header-txt">ID : 122322DFG</div>
                    </div>
                </div>
                <div className="t-invoice-to">
                    <span className="t-invoice-to-label">To</span>
                    <span className="t-invoice-to-content">
                        <p className="t-invoice-to-child">{destination}</p>
                        {/* <p className="t-invoice-to-child">{streetNumber}</p>
                        <p className="t-invoice-to-child">{streetName}</p> */}
                        {/* <div className="t-invoice-form-suburb">
                            <span className="t-invoice-to-child">{suburb}</span>
                            <span className="t-invoice-to-child">{state}</span>
                            <span className="t-invoice-to-child">{postcode}</span>
                        </div> */}
                    </span>
                </div>
                <div className="t-invoice-item">
                    <div className="t-invoice-form-suburb">
                        <span>
                            Item Name: <b>{itemName}</b>
                        </span>
                        <span>
                            Weight: <b>{weight}</b>
                        </span>
                        <span>
                            Quantity: <b>{quantity}</b>
                        </span>
                    </div>
                    <div className="t-invoice-form-suburb">
                        <span>
                            Receiver Name: <b>{receiverName}</b>{' '}
                        </span>
                        <span>
                            Receiver Phone: <b>{receiverPhone}</b>
                        </span>
                        <span>
                            Package Type: <b>{packageType}</b>
                        </span>
                    </div>
                    <div>
                        Note : <b>{note}</b>
                    </div>
                </div>
            </div>
            <div className="w-100" style={{ textAlign: 'center', padding: '20px', paddingBottom: '0' }}>
                <button className="my-btn-yellow mb-2" onClick={handlePrint}>
                    Print Label
                </button>
            </div>
        </div>
    );
}
