import moment from 'moment';
import React from 'react';
import Rater from 'react-rater';
import 'react-rater/lib/react-rater.css';
import { Star } from './comment';

function Feedback({
    review,
    avatar = 'https://thumbs.dreamstime.com/b/male-avatar-icon-flat-style-male-user-icon-cartoon-man-avatar-hipster-vector-stock-91462914.jpg',
}) {
    return (
        <div className="text-center py-2" style={{ background: 'var(--clr-primary)' }}>
            <img src={avatar} style={{ margin: 0, padding: 0 }} height="45px" weight="45px"></img>
            <div>
                <Rater total={5} rating={review?.star || 1} interactive={false}>
                    {/* <Star isActive={true}></Star> */}
                </Rater>
            </div>
            <i style={{ fontFamily: 'fangsong' }}>{review?.feedback}</i>
            <p>{moment(review?.createdAt).format('hh:mm DD/MM/YYYY')}</p>
        </div>
    );
}

export default Feedback;
