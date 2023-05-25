import React from 'react';
import './style.css'

export default function Invoice() {
  return (
    <div>
        <div className='invoice'>
            <div className='invoice-form'>
                <div className='invoice-header'>
                    <div style={{maxWidth: "100px"}}>
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
                            <div className='invoice-txt-content'>1</div>
                            <div className='invoice-txt-content'> 22/2/2022</div>
                            <div className='invoice-txt-content'> 21 Ngo Quyen</div>
                            <div className='invoice-txt-content'> 123456788</div>
                        </div>
                    </div>
                    <div style={{width: "auto",overflow: "hidden",marginTop: "20px"}}>
                        <table className='invoice-table'>
                            <tr style={{backgroundColor: "#025464",color: "white"}}>
                                <th>Item Description</th>
                                <th>Rate</th>
                                <th>Unit</th>
                                <th>Amount</th>
                            </tr>
                            <tr>
                                <td>Alfreds Futterkiste</td>
                                <td>Maria Anders</td>
                                <td>Germany</td>
                                <td>Germany</td>
                            </tr>
                            <tr>
                                <td>Centro comercial Moctezuma</td>
                                <td>Francisco Chang</td>
                                <td>Mexico</td>
                                <td>Germany</td>
                            </tr>
                            <tr>
                                <td>Ernst Handel</td>
                                <td>Roland Mendel</td>
                                <td>Austria</td>
                                <td>Germany</td>
                            </tr>
                        </table>
                    </div>
                    <div className='invoice-table-fee-form'>
                        <table className='invoice-table-fee'>
                            <tr>
                                <th>Subtotal</th>
                                <td>$1500</td>
                            </tr>
                            <tr>
                                <th >GST</th>
                                <td>$500</td>
                            </tr>
                            <tr>
                            <th>Total Cost</th>
                            <td
                                style={{textAlign:'center',background:'#025464',color:'white'}}
                            >$2000</td>
                            </tr>
                        </table>
                    </div>
                    <div className='invoice-last-info'>
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
                                <div className='invoice-txt-content'> 123 456 788</div>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
