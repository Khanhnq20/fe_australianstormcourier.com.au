import React, { useEffect, useRef, useState } from 'react';
import './style.css';
import { useReactToPrint } from 'react-to-print';
import {Elements, useStripe} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import { authConstraints, authInstance, config } from '../../api';
import {useSearchParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { CustomSpinner } from '../../layout';
import { NonRouting } from '..';
import { toast } from 'react-toastify';
import moment from 'moment';

const stripePromise = loadStripe(config.StripePublicKey);

export default function Index(){
    const [allowed, setAllow] = useState(false);
    const [loading, setLoading] = useState(true);
    const [options, setOptions] = useState({clientSecret: ''});
    const [payment, setPayment] = useState(null);
    const [params] = useSearchParams();
    const query = ['id'];
    const controller = new AbortController();

    useEffect(() =>{
        if(query.every(w => params.has(w))){
            setAllow(true);
        }
        setLoading(false);
    },[]);

    useEffect(() =>{
        const paymentId = params.get(query[0]);
        if(paymentId){
            authInstance.get([authConstraints.userRoot, authConstraints.getSinglePayment].join("/"), {
                headers: {
                    'Authorization': [config.AuthenticationSchema, localStorage.getItem(authConstraints.LOCAL_KEY)].join(" ")
                },
                params: {
                    paymentId
                },
                signal: controller.signal
            }).then(response =>{
                if(response.data?.successed){
                    setOptions({
                        clientSecret: response.data?.secreteKey
                    });
                    setPayment(response.data?.result);
                    // toast.success(response.data?.secreteKey);
                }
                else{
                    toast.error(response.data?.error);
                }
                setLoading(false);
            }).catch(error =>{
                setLoading(false);
            });
        }

        return () =>{
            controller.abort();
        }
    }, []);

    if(loading) return (
        <Container>
            <CustomSpinner></CustomSpinner>
        </Container>
    )

    if(allowed && options.clientSecret) return (
        <Elements stripe={stripePromise} options={options}>
            <Invoice clientSecrete={options.clientSecret} payment={payment}/>
        </Elements>
    )

    return (
        <Container>
            <NonRouting></NonRouting>
        </Container>
    )
}


function Invoice({clientSecrete, payment}) {
    const stripe = useStripe();
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content:()=> componentRef.current,
        documentTitle : 'new document',
        onafterprint:()=>alert('Print Success')
    });
    const [invoice, setInvoice] = useState(null);

    useEffect(() =>{
        if(stripe){
            stripe.retrieveSource({
                client_secret: clientSecrete,
                id: payment.paymentStripeId
            }).then(order=>{
                console.log(order);
                setInvoice(order);
            }).catch(error =>{
                console.log(error);
            });
        }
    },[]);

    return (
    <div>
        <div className='invoice mb-4' >
                <div style={{textAlign:'right',maxWidth:"1500px"}}>
                    <button className='my-btn-yellow' onClick={handlePrint}>Print Invoice</button>
                </div>
            <div className='invoice-form' ref={componentRef}>
                <div className='invoice-header'>
                    <div style={{maxWidth: "100px",marginBottom:'20px'}}>
                        <img src="https://australianstormcourier.com.au/wp-content/uploads/2023/04/as-logo.png" width="100%"/>
                    </div>
                    <div>
                        <p className='invoice-txt-header'>sameday courier services pty ltd</p>
                        <p style={{margin: "5px"}}>ABN | 82 654 966 604</p>
                        <p style={{margin: "5px"}}>Phone Number | 04 66 56 22 86</p>
                    </div>
                </div>
                <div style={{margin:"0 auto"}}>
                    <div style={{display: "flex",gap: "30px"}}>
                        <div>
                            <div className='invoice-txt-label'>Invoice Id</div>
                            <div className='invoice-txt-label'> Date</div>
                            <div className='invoice-txt-label'> Address</div>
                            <div className='invoice-txt-label'> Phone</div>
                        </div>
                        <div>
                            <div className='invoice-txt-content'>{payment?.stripePaymentId}</div>
                            <div className='invoice-txt-content'>{moment(payment?.createdAt).format('MM/DD/YYYY')}</div>
                            <div className='invoice-txt-content'>{payment?.sender?.address}</div>
                            <div className='invoice-txt-content'>+{payment?.sender?.phoneNumber}</div>
                        </div>
                    </div>
                    <div style={{width: "auto",overflow: "hidden",marginTop: "20px"}}>
                        <table className='invoice-table'>
                            <thead>
                                <tr style={{backgroundColor: "#025464",color: "white"}}>
                                    <th>Item Description</th>
                                    <th>Rate</th>
                                    <th>Unit</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        Order #{payment?.order?.id}
                                        <p>From: {Object.entries(payment?.order?.sendingLocation).map(([_,v]) => v).join(", ")}</p>
                                        <p>To: {payment?.order?.destination}</p>
                                    </td>
                                    <td>{payment?.order?.shipFee}</td>
                                    <td>1</td>
                                    <td>{payment?.order?.shipFee}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className='invoice-table-fee-form'>
                        <table className='invoice-table-fee'>
                            <tbody>
                                <tr>
                                    <th>Subtotal</th>
                                    <td>${payment?.order?.shipFee}</td>
                                </tr>
                                <tr>
                                    <th>Freight</th>
                                    <td>${payment?.order?.cod - payment?.order?.shipFee}</td>
                                </tr>
                                <tr>
                                    <th>GST</th>
                                    <td>${payment?.order?.gst - payment?.order?.cod}</td>
                                </tr>
                                <tr>
                                <th>Total Cost</th>
                                <td
                                    style={{textAlign:'center',background:'#025464',color:'white'}}
                                >${payment?.order?.total}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className='invoice-last-info' style={{marginTop:'35px'}}>
                            <div>
                                <div className='invoice-txt-label'>Payment Method</div>
                                <div className='invoice-txt-label'>Name </div>
                                <div className='invoice-txt-label'> BSB</div>
                                <div className='invoice-txt-label'> ACC NO</div>
                            </div>
                            <div>
                                <div style={{marginBottom: "10px",textTransform: "uppercase"}}>bank transfer</div>
                                <div style={{marginBottom: "10px",textTransform: "uppercase"}}>sameday courier services pty ltd</div>
                                <div className='invoice-txt-content'>013-437</div>
                                <div className='invoice-txt-content'>1555 00392</div>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
