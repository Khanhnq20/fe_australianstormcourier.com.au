import React, { useContext } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { AuthContext } from '../../../stores';
import { Link } from 'react-router-dom';
import '../style/driverDetail.css'

function DriverDetail() {
    const [authState,{updateDriverProfile}] = useContext(AuthContext);
    return (
        <div className='px-3 py-2'>
            <h3 className='ui-header'>Information</h3>
            <Row>
                <div>
                    <div className='driver-form container'>
                        <div className='product-label-info'>
                            <p className='product-label'>
                                Driver Name
                            </p>
                            <p className='product-content'>
                                {authState?.accountInfo?.name}
                            </p>
                        </div>
                        <div className='product-label-info'>
                            <p className='product-label'>
                                User Name
                            </p>
                            <p className='product-content'>
                                {authState?.accountInfo?.username}
                            </p>
                        </div>
                        <div className='product-label-info'>
                            <p className='product-label'>
                                Email
                            </p>
                            <p className='product-content'>
                                {authState?.accountInfo?.email}
                            </p>
                        </div>
                        <div className='product-label-info'>
                            <p className='product-label'>
                                BSB
                            </p>
                            <p className='product-content'>
                                {authState?.accountInfo?.bsb || <Link>Not yet</Link>}
                            </p>
                        </div>
                        <div className='product-label-info'>
                            <p className='product-label'>
                                Has Inspected
                            </p>
                            <p className='product-content'>
                                {authState?.accountInfo?.hasInspected || <Link>Not yet</Link>}
                            </p>
                        </div>
                        <div className='product-label-info'>
                            <p className='product-label'>
                                Phone number
                            </p>
                            <p className='product-content'>
                            {authState?.accountInfo?.phoneNumber}
                            </p>
                        </div>
                        <div className='product-label-info'>
                            <p className='product-label'>
                                Address
                            </p>
                            <p className='product-content'>
                                {authState?.accountInfo?.address}
                            </p>
                        </div>
                        <div className='product-label-info' style={{alignItems: 'flex-start'}}>
                            <p className='product-label'>
                                Back Driving Liense
                            </p>
                            <p className='product-content'>
                                <div style={{maxWidth: '320px'}}>
                                    <img style={{width: "100%"}} src={authState?.accountInfo?.backDrivingLiense}></img>
                                </div>
                            </p>
                        </div>
                        <div className='product-label-info'>
                            <p className='product-label'>
                                ABN Number
                            </p>
                            <p className='product-content'>
                                {authState?.accountInfo?.abnNumber}
                            </p>
                        </div>
                        <div className='product-label-info' style={{alignItems: 'flex-start'}}>
                            <p className='product-label'>
                                Front Driving Liense
                            </p>
                            <p className='product-content'  >
                                <div style={{maxWidth: '320px'}}>
                                    <img style={{width: "100%"}} src={authState?.accountInfo?.frontDrivingLiense}></img>
                                </div>
                            </p>
                        </div>
                        <div className='product-label-info'>
                            <p className='product-label'>
                                City
                            </p>
                            <p className='product-content'>
                                {authState?.accountInfo?.city}
                            </p>
                        </div>
                        <div className='product-label-info'>
                            <p className='product-label'>
                                Confirm Driving License
                            </p>
                            <p className='product-content'>
                                {authState?.accountInfo?.drivingLicenseConfirm ? <span>Confirmed</span> : <span>Not confirmed</span>}
                            </p>
                        </div>
                        <div className='product-label-info' style={{alignItems: 'flex-start'}}>
                            <p className='product-label'>
                                Vehicles
                            </p>
                            <Row>
                                {authState?.accountInfo?.vehicles?.map(vehicle =>{
                                    return (<Col sm="auto">
                                        <p className='product-content'>
                                            {vehicle}
                                        </p>
                                    </Col>)
                                })}
                            </Row>
                        </div>
                    </div>   
                </div>
            </Row>
        </div>
    )
}


export default function Index(){
    return(
        <DriverDetail></DriverDetail>
    )
}