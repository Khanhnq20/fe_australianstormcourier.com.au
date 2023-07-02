import React from 'react';
import '../style/review.css';
import Rater from 'react-rater';
import moment from 'moment';
import { authConstraints, authInstance, config } from '../../../api';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { Star } from '../../user product detail/component/comment';
import { Col, Row } from 'react-bootstrap';

const commentArr = [
    {
        author: 'khanh',
        emailAth: 'khanh@gmail.com',
        rate: 5,
        content: 'qua tuyet voi',
    },
    {
        author: 'Kha',
        emailAth: 'kha@gmail.com',
        rate: 2,
        content: 'qua',
    },
    {
        author: 'unique',
        emailAth: 'test@gmail.com',
        rate: 3,
        content: 'qua tuyet ',
    },
];

export default function Index() {
    const [evaluate, setEvaluate] = React.useState([]);

    React.useEffect(() => {
        authInstance
            .get([authConstraints.driverRoot, authConstraints.getFeedbackList].join('/'), {
                headers: {
                    Authorization: [config.AuthenticationSchema, localStorage.getItem(authConstraints.LOCAL_KEY)].join(
                        ' ',
                    ),
                },
            })
            .then(({ data }) => {
                if (data?.successed && Array.isArray(data?.result)) {
                    setEvaluate(data?.result);
                } else if (data?.error) {
                    toast.error(data?.error);
                }
            })
            .catch(() => {
                toast.error('Something went wrong');
            });
    }, []);

    return (
        <div className="container">
            <div className="py-3">
                Total Review <b>{evaluate?.length}</b>
            </div>
            {evaluate?.map((item, index) => {
                return (
                    <SingleReview
                        key={index}
                        username={item.author}
                        email={item.emailAth}
                        content={item?.feedback}
                        star={item?.star}
                        containerClassName={'mb-2'}
                    />
                );
            })}
        </div>
    );
}

function SingleReview({ username, email, star, content, createdAt = Date.now(), containerClassName }) {
    const stars = [1, 2, 3, 4, 5];
    return (
        <div className={'review-form ' + containerClassName} style={{ background: 'var(--clr-primary)' }}>
            <Row>
                <Col sm="auto">
                    <img
                        style={{ margin: 0, padding: 0 }}
                        height="45px"
                        weight="45px"
                        src="https://thumbs.dreamstime.com/b/male-avatar-icon-flat-style-male-user-icon-cartoon-man-avatar-hipster-vector-stock-91462914.jpg"
                    />
                </Col>
                <Col>
                    <div>
                        <p style={{ fontWeight: '600', margin: 0 }}>{username}</p>
                        <i style={{ marginTop: '5px' }}>{email}</i>
                        <Rater interactive={false} total={5} rating={star}>
                            <Star isActive={true} height={20} width={20} ratedColor="#2F4858"></Star>
                        </Rater>
                        <span style={{ float: 'right' }}>
                            <i className="me-2" style={{ margin: 0 }}>
                                {moment(createdAt).fromNow()}
                            </i>
                        </span>
                    </div>
                    <div>
                        <p className="review-content">{content}</p>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

// const Star = ({ starId, rating, onMouseEnter, onMouseLeave, onClick }) => {
//     let styleClass = 'star-rating-blank';
//     if (rating >= starId) {
//         styleClass = 'star-rating-filled';
//     }

//     return (
//         <div className="star" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={onClick}>
//             <svg height="30px" width="30px" class={styleClass} viewBox="0 0 25 23" data-rating="1">
//                 <polygon stroke-width="0" points="9.9, 1.1, 3.3, 21.78, 19.8, 8.58, 0, 8.58, 16.5, 21.78" />
//             </svg>
//         </div>
//     );
// };
