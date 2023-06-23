import React from 'react';
import logo from '../../../image/as-logo.png';

export default function TotalInvoice({ values }) {
    return (
        <div className="t-invoice-root">
            <div className="t-invoice-form">
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
                        <p className="t-invoice-to-child">Unit Number</p>
                        <p className="t-invoice-to-child">Street Number</p>
                        <p className="t-invoice-to-child">Street Name</p>
                        <div className="t-invoice-form-suburb">
                            <span className="t-invoice-to-child">suburb</span>
                            <span className="t-invoice-to-child">state</span>
                            <span className="t-invoice-to-child">post code</span>
                        </div>
                    </span>
                </div>
                <div className="t-invoice-item">
                    <div className="t-invoice-form-suburb">
                        <span>
                            Item Name: <b>People</b>
                        </span>
                        <span>
                            Weight: <b>100kg</b>
                        </span>
                        <span>
                            Quantity: <b>2</b>
                        </span>
                    </div>
                    <div className="t-invoice-form-suburb">
                        <span>
                            Receiver Name: <b>Nguyen Khanh</b>{' '}
                        </span>
                        <span>
                            Receiver Phone: <b>+84 122 122 122</b>
                        </span>
                        <span>
                            Package Type: <b>Special Item</b>
                        </span>
                    </div>
                    <div>
                        Note : <b>loading.....</b>
                    </div>
                </div>
            </div>
        </div>
    );
}
