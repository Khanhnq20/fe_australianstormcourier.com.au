import React from "react";
import { Col, FloatingLabel, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Formik } from "formik";
import * as yup from "yup";
import "../style/productHistoryDetail.css";

function OrderDetail() {
  const [process, setProcess] = React.useState(false);
  return (
    <div>
      <div>
        <p className="product-detail-header">Details</p>
      </div>
      <div>
        <div>
          <p className="product-content-title mb-3">Product Information</p>
        </div>
        <Row className="product-form-content">
          <Col>
            <div className="product-form-info">
              <div>
                <div className="product-label-info">
                  <p className="product-label">ID</p>
                  <p className="product-content">00001</p>
                </div>
                <div className="product-label-info">
                  <p className="product-label">Username</p>
                  <p className="product-content">Ansel</p>
                </div>
                <div className="product-label-info">
                  <p className="product-label">Phone number</p>
                  <p className="product-content">07731158000</p>
                </div>
                <div className="product-label-info">
                  <p className="product-label">Email</p>
                  <p className="product-content">Anselm@gmail.com</p>
                </div>
                <div className="product-label-info">
                  <p className="product-label">ABNnumber</p>
                  <p className="product-content">189795</p>
                </div>
              </div>
            </div>
          </Col>
          <Col>
            <div>
              <div className="product-label-info">
                <p className="product-label-fit">Starting shipping rates</p>
                <p className="product-content">300$</p>
              </div>
              <div className="product-label-info">
                <p className="product-label-fit">Selected shipping rates</p>
                <p className="product-content">06785634545$</p>
              </div>
              <div className="product-label-info">
                <p className="product-label-fit">Status</p>
                <p className="content-green">Looking for a driver</p>
              </div>
              <div className="product-label-info">
                <p className="product-label-fit">Additional Information</p>
                <p className="product-content">Additional Information</p>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <p className="product-content-title my-3">Order</p>
          <Col>
            <Process>{2}</Process>
          </Col>
        </Row>
      </div>
    </div>
  );
}

function Process({ children }) {
  const [active, setActive] = React.useState(1);
  const [stepTemplate, setTemplate] = React.useState([
    "Prepare",
    "Ordering",
    "Delivering",
    "Completed",
  ]);

  return (
    <div>
      <div className="product-label-info">
        <p className="product-label-fit">Status</p>
        <p className="content-yellow">In processing</p>
      </div>
      <div className="product-label-info" style={{ alignItems: "unset" }}>
        <p className="product-label-fit py-2">Process</p>
        <div>
          <section class="step-wizard">
            <ul className="order-progress">
              {stepTemplate.map((template, index) => {
                return (
                  <li
                    className="order-progress-item"
                    key={index}
                    data-active={index <= active}
                  >
                    <div class="progress-circle"></div>
                    <div class="progress-label">
                      <h2 className="progress-txt-header">{template}</h2>
                      <p>At 9PM, the driver requested to deliver the good</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
      <div className="product-label-info py-3" style={{ alignItems: "unset" }}>
        <p className="product-label-fit py-1">Delivery pictures</p>
        <div>
          <div className="img-front-frame" style={{ padding: "10px 0 " }}>
            <div className="background-front">
              <div
                style={{
                  position: "relative",
                  color: "gray",
                  fontSize: "50px",
                  opacity: "70%",
                }}
              >
                4
              </div>
              <p className="driving-txt">view image</p>
            </div>
            <img className="img-front" src={"https://tinyurl.com/5ehpcctt"} />
          </div>
        </div>
      </div>
      <Comment></Comment>
    </div>
  );
}

let rateSchema = yup.object().shape({
  reason: yup.string().required("Rate is required field"),
});

function StatusFail() {
  return (
    <div>
      <div className="product-label-info">
        <p className="product-label-fit">Status</p>
        <p className="content-red">Fail</p>
      </div>
      <Formik
        initialValues={{
          reason: "",
        }}
        validationSchema={rateSchema}
      >
        {({ touched, errors, handleSubmit, handleChange, handleBlur }) => {
          return (
            <Form>
              <Form.Group className="form-group">
                <div className="mb-2">
                  <Form.Label className="product-label-fit my-0">
                    Reason fail
                  </Form.Label>
                </div>
                <div className="product-rate-form">
                  <div className="frame-pass" style={{ flexGrow: "1" }}>
                    <Form.Control
                      type={"text"}
                      as="textarea"
                      rows={3}
                      style={{ position: "relative", background: "#fafafa" }}
                      isInvalid={touched.reason && errors.reason}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Fill rate (rate must be number)"
                      name="rate"
                    />
                  </div>
                </div>
              </Form.Group>
              <Button variant="warning" className="my-btn-yellow">
                Submit
              </Button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

function Comment() {
  const [rating, setRating] = React.useState(0);
  const [hoverRating, setHoverRating] = React.useState(0);
  const [evaluate, setEvaluate] = React.useState();
  const [comment, setComment] = React.useState("");
  const [user, setUser] = React.useState({});
  const [error, setError] = React.useState();
  // const locationParams = useParams();
  // const {userID} = useAthContext();
  const Star = ({ starId, rating, onMouseEnter, onMouseLeave, onClick }) => {
    let styleClass = "star-rating-blank";
    if (rating >= starId) {
      styleClass = "star-rating-filled";
    }

    return (
      <div
        className="star"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        <svg
          height="30px"
          width="30px"
          class={styleClass}
          viewBox="0 0 25 23"
          data-rating="1"
        >
          <polygon
            stroke-width="0"
            points="9.9, 1.1, 3.3, 21.78, 19.8, 8.58, 0, 8.58, 16.5, 21.78"
          />
        </svg>
      </div>
    );
  };
  const handleChange = (e) => {
    setComment(e.target.value);
    console.log(e.target.value);
  };

  // const handleSubmit = () =>{
  //   console.log(locationParams?.id)
  //   if(!comment){
  //       setError("Enter somethings to comment");
  //   }
  //   if(rating === 0){
  //       setError("Pls rating")
  //   }else if(locationParams?.id){
  //       const {id} = locationParams;
  //       setError("");
  //       commentProduct(comment,rating,user?.name,user?.email,id).then(()=>{
  //           var data = {
  //               content : comment,
  //               rate : rating,
  //               author : user?.name,
  //               emailAth: user?.email
  //           }
  //           setEvaluate(o =>[...o, data]);
  //           setRating(0);
  //           toast.success("Successful evaluation!")
  //       })
  //   }
  // }
  const stars = [1, 2, 3, 4, 5];

  return (
    <>
      {evaluate?.map((item, index) => {
        return (
          <div key={index}>
            <div class="header">
              <img
                style={{ margin: 0, padding: 0 }}
                height="45px"
                weight="45px"
                src="https://thumbs.dreamstime.com/b/male-avatar-icon-flat-style-male-user-icon-cartoon-man-avatar-hipster-vector-stock-91462914.jpg"
              />
              <div>
                <p style={{ fontWeight: "600" }}>{item.author}</p>
                <p style={{ fontSize: "13px", marginTop: "5px" }}>
                  {item.emailAth}
                </p>
              </div>
              <div style={{ display: "flex", transform: "translate(40%)" }}>
                {stars.map((star, i) => (
                  <Star key={i} starId={i} rating={item.rate} />
                ))}
              </div>
            </div>
            <div>
              <p style={{ margin: "12px 5px" }}>{item.content}</p>
            </div>
          </div>
        );
      })}
      {/* commentFormSubmit */}
      <Form>
        <div className="comment__form">
          <div class="header">
            <img
              style={{ margin: 0, padding: 0 }}
              height="45px"
              weight="45px"
              src="https://thumbs.dreamstime.com/b/male-avatar-icon-flat-style-male-user-icon-cartoon-man-avatar-hipster-vector-stock-91462914.jpg"
            />
            <div>
              <p style={{ fontWeight: "600" }}>{user?.name || "Guest"}</p>
              <p style={{ fontSize: "13px", marginTop: "5px" }}>
                {user?.email || "Loading"}
              </p>
            </div>
          </div>
          <div style={{ display: "flex" }}>
            {stars.map((i) => (
              <Star
                key={i}
                starId={i}
                rating={hoverRating || rating}
                onMouseEnter={() => setHoverRating(i)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(i)}
              />
            ))}
          </div>
          <Form.Group className="">
            <div>
              <FloatingLabel
                controlId="floatingTextarea"
                label="Comment"
                className="mb-3"
              >
                <Form.Control
                  as="textarea"
                  name="comment"
                  onChange={handleChange}
                />
              </FloatingLabel>
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </Form.Group>
          <Button className="my-btn-yellow">Review</Button>
        </div>
      </Form>
    </>
  );
}
export default function Index() {
  return (
    <>
      <OrderDetail></OrderDetail>
    </>
  );
}
