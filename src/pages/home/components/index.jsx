import React from 'react';
import Container from 'react-bootstrap/Container';

export default function Index() {
  return (
    <>
        <div>
            <Banner>
            </Banner>
        </div>
    </>
  )
}

function Banner(){
    return(
        <>
            <div>
                <Container className='ban-background'>
                    <div>
                        <div>Header</div>
                        <p>Text</p>
                    </div>
                    <div>
                        <div>
                            <img src='https://australianstormcourier.com.au/wp-content/uploads/2023/04/sender1-1024x1024.png'/>
                        </div>
                    </div>
                </Container>
            </div>
        </>
    )
}
