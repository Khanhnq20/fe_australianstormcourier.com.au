import React from 'react';
import '../style/review.css';

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
    const [rating, setRating] = React.useState(0);
    const [evaluate, setEvaluate] = React.useState();
    const [comment, setComment] = React.useState('');
    const [user, setUser] = React.useState({});
    const [error, setError] = React.useState();
    React.useEffect(() => {
        setEvaluate(commentArr);
    }, []);
    // const locationParams = useParams();
    // const {userID} = useAthContext();
    const Star = ({ starId, rating, onMouseEnter, onMouseLeave, onClick }) => {
        let styleClass = 'star-rating-blank';
        if (rating >= starId) {
            styleClass = 'star-rating-filled';
        }

        return (
            <div className="star" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={onClick}>
                <svg height="30px" width="30px" class={styleClass} viewBox="0 0 25 23" data-rating="1">
                    <polygon stroke-width="0" points="9.9, 1.1, 3.3, 21.78, 19.8, 8.58, 0, 8.58, 16.5, 21.78" />
                </svg>
            </div>
        );
    };
    const stars = [1, 2, 3, 4, 5];

    return (
        <div className="container">
            <div className="py-3">
                Total Review <b>{evaluate.length}</b>
            </div>
            {evaluate?.map((item, index) => {
                return (
                    <div key={index} className="review-form">
                        <div class="header">
                            <img
                                style={{ margin: 0, padding: 0 }}
                                height="45px"
                                weight="45px"
                                src="https://thumbs.dreamstime.com/b/male-avatar-icon-flat-style-male-user-icon-cartoon-man-avatar-hipster-vector-stock-91462914.jpg"
                            />
                            <div>
                                <p style={{ fontWeight: '600' }}>{item.author}</p>
                                <p style={{ fontSize: '13px', marginTop: '5px' }}>{item.emailAth}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex' }}>
                            {stars.map((star, i) => (
                                <Star key={star} starId={star} rating={item.rate} />
                            ))}
                        </div>
                        <div>
                            <p className="review-content">{item.content}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
