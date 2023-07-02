import React from 'react';
import { AuthContext } from '../../../stores';
import { authConstraints, authInstance, config } from '../../../api';
import { toast } from 'react-toastify';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Button, FloatingLabel, Form, Spinner } from 'react-bootstrap';

function Comment({
    driverId,
    orderId,
    avatar = 'https://thumbs.dreamstime.com/b/male-avatar-icon-flat-style-male-user-icon-cartoon-man-avatar-hipster-vector-stock-91462914.jpg',
}) {
    const [hoverRating, setHoverRating] = React.useState(0);
    const [authState] = React.useContext(AuthContext);
    const [loading, setLoading] = React.useState(false);

    function sendFeedback(values) {
        setLoading(true);
        authInstance
            .post([authConstraints.userRoot, authConstraints.postFeedback].join('/'), values, {
                headers: {
                    Authorization: [config.AuthenticationSchema, localStorage.getItem(authConstraints.LOCAL_KEY)].join(
                        ' ',
                    ),
                },
            })
            .then((response) => {
                if (response.data?.successed) {
                    toast.success('Send feedback successful');
                } else if (response.data?.error) {
                    toast.error(response.data?.error);
                }
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
            });
    }

    const stars = [1, 2, 3, 4, 5];

    return (
        <>
            <Formik
                initialValues={{
                    driverId: driverId,
                    orderId: orderId,
                    star: 0,
                    feedback: 0,
                }}
                validationSchema={yup.object().shape({
                    driverId: yup.string().required(),
                    orderId: yup.number().required(),
                    star: yup.number().moreThan(0).required(),
                    feedback: yup.string(),
                })}
                // enableReinitialize={true}
                onSubmit={(values) => {
                    sendFeedback(values);
                }}
            >
                {({ values, errors, touched, handleSubmit, setFieldValue, handleChange, handleBlur, isValid }) => {
                    return (
                        <Form onSubmit={handleSubmit}>
                            <div class="header">
                                <img style={{ margin: 0, padding: 0 }} height="45px" weight="45px" src={avatar} />
                                <div>
                                    <h5 style={{ fontWeight: '600' }}>{authState?.accountInfo?.username}</h5>
                                    <div className="mb-2" style={{ display: 'flex' }}>
                                        {stars.map((i) => (
                                            <Star
                                                key={i}
                                                starId={i}
                                                isActive={i <= values.star}
                                                rating={hoverRating || values.star}
                                                onMouseEnter={() => setHoverRating(i)}
                                                onMouseLeave={() => setHoverRating(values.star)}
                                                onClick={() => {
                                                    setFieldValue('star', i);
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <Form.Group>
                                    <Form.Control
                                        name="star"
                                        type="hidden"
                                        value={values.star}
                                        isInvalid={!!errors?.star}
                                    ></Form.Control>
                                    <Form.Control.Feedback type="invalid">{errors?.star}</Form.Control.Feedback>
                                </Form.Group>
                            </div>
                            <Form.Group className="">
                                <FloatingLabel controlId="floatingTextarea" label="Comment" className="mb-3">
                                    <Form.Control
                                        className="w-100"
                                        as="textarea"
                                        name="feedback"
                                        isInvalid={touched?.feedback && !!errors?.feedback}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors?.feedback}</Form.Control.Feedback>
                                </FloatingLabel>
                            </Form.Group>
                            <Button type="submit" className="my-btn-yellow" disabled={!isValid || loading}>
                                {loading ? <Spinner></Spinner> : 'Review'}
                            </Button>
                        </Form>
                    );
                }}
            </Formik>
        </>
    );
}

export const Star = ({
    starId,
    rating,
    onMouseEnter,
    onMouseLeave,
    onClick,
    isActive,
    height = 30,
    width = 30,
    ratedColor = 'var(--clr-primary)',
    blurColor = '#d8d8d8',
}) => {
    // let styleClass = 'star-rating-blank';
    let style = {
        fill: blurColor,
    };

    if (rating >= starId || isActive) {
        // styleClass = 'star-rating-filled';
        style = {
            fill: ratedColor,
        };
    }

    return (
        <div className="star" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={onClick}>
            <svg
                height={`${height}px`}
                width={`${width}px`}
                // class={styleClass}
                style={style}
                viewBox="0 0 25 23"
                data-rating="1"
            >
                <polygon strokeWidth="0" points="9.9, 1.1, 3.3, 21.78, 19.8, 8.58, 0, 8.58, 16.5, 21.78" />
            </svg>
        </div>
    );
};

export default Comment;
