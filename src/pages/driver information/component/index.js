import React, { useContext } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Formik } from "formik";
import * as yup from "yup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { AuthContext } from "../../../stores";
import { Link } from "react-router-dom";
import { authConstraints, authInstance, config } from "../../../api";
import { toast } from "react-toastify";
import { Modal, Spinner } from "react-bootstrap";
import PhoneInput from "react-phone-input-2";

let updateDriverSchema = yup.object().shape({
  fullName: yup.string().required("Full Name is required field"),
  address: yup.string().required("Full Address is required field"),
  city: yup.string().required("City is required field"),
  zipCode: yup
    .number()
    .typeError("Zip code must be number")
    .required("Zip code is required field"),
});

function UpdateDriver() {
  const [authState, { updateDriverProfile }] = useContext(AuthContext);
  const [phoneError, setPhoneError] = React.useState("");
  const [showPhoneVerification, setShowPhoneVerification] =
    React.useState(false);
  const [loading, setLoading] = React.useState(false);

  function sendPhoneDigit() {
    setLoading(true);
    authInstance
      .get([authConstraints.root, authConstraints.sendPhoneDigit].join("/"), {
        headers: {
          Authorization: [
            config.AuthenticationSchema,
            localStorage.getItem(authConstraints.LOCAL_KEY),
          ].join(" "),
        },
      })
      .then((response) => {
        if (response.data?.successed) {
          toast.success("Check your whatsapp to receive confirmation digit");
          setLoading(false);
        } else {
          toast.error("Failed");
          setLoading(false);
        }
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
      });
  }

  function confirmPhone(digit) {
    setLoading(true);
    authInstance
      .get([authConstraints.root, authConstraints.verifiedPhone].join("/"), {
        headers: {
          Authorization: [
            config.AuthenticationSchema,
            localStorage.getItem(authConstraints.LOCAL_KEY),
          ].join(" "),
        },
        params: {
          digit,
        },
      })
      .then((response) => {
        if (response.data?.successed) {
          toast.success("Your account has been confirmed phone");
          setLoading(false);
        } else {
          toast.error("Failed");
          setLoading(false);
        }
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
      });
  }

  return (
    <Formik
      initialValues={{
        fullName: authState?.accountInfo?.name,
        userName: authState?.accountInfo?.username,
        phone: authState?.accountInfo?.phoneNumber,
        address: authState?.accountInfo?.address,
        zipCode: authState?.accountInfo?.zipCode,
        city: authState?.accountInfo?.city,
        vehicles: [],
        addInfo: "",
      }}
      validationSchema={updateDriverSchema}
      onSubmit={(values) => {
        updateDriverProfile(values);
      }}
    >
      {({
        values,
        touched,
        errors,
        setFieldValue,
        handleSubmit,
        handleChange,
        handleBlur,
        isValid,
      }) => {
        return (
          <div className="container">
            <Row>
              <Col className="mb-5">
                <h3 className="ui-header mb-5">Information</h3>
                <div>
                  {/* Full Name */}
                  <div className="product-label-info">
                    <p className="product-label">Full Name</p>
                    <p className="product-content">
                      {authState?.accountInfo?.name}
                    </p>
                  </div>
                  <div className="product-label-info">
                    <p className="product-label">User name</p>
                    <p className="product-content">
                      {authState?.accountInfo?.username}
                    </p>
                  </div>
                  <div className="product-label-info">
                    <p className="product-label">Email</p>
                    <p className="product-content">
                      {authState?.accountInfo?.email}
                    </p>
                  </div>
                  <div className="product-label-info">
                    <p className="product-label">Phone number</p>
                    <p className="product-content">
                      {authState?.accountInfo?.phoneNumber}
                    </p>
                  </div>
                  <div className="product-label-info">
                    <p className="product-label">Confirmed phone number</p>
                    <p className="product-content">
                      {authState?.accountInfo?.phoneNumberConfirmed ? (
                        <span>Confirmed</span>
                      ) : (
                        <Button
                          variant="success"
                          onClick={() => {
                            setShowPhoneVerification(true);
                          }}
                        >
                          Not confirmed
                        </Button>
                      )}
                    </p>
                    <Modal
                      show={showPhoneVerification}
                      onHide={() => setShowPhoneVerification(false)}
                    >
                      <Modal.Header closeButton></Modal.Header>
                      <Modal.Body style={{ minHeight: "200px" }}>
                        {loading ? (
                          <Spinner></Spinner>
                        ) : (
                          <div>
                            <Row>
                              <Col>
                                <b>Step 1:</b>
                              </Col>
                              <Col>
                                <p>
                                  Download{" "}
                                  <a
                                    href="https://www.whatsapp.com/download"
                                    target="_blank"
                                  >
                                    Whatsapp
                                  </a>{" "}
                                  on your phone
                                </p>
                              </Col>
                            </Row>
                            <Row>
                              <Col>
                                <b>Step 2:</b>
                              </Col>
                              <Col>
                                <p>
                                  <b>Signin</b> with your phone number
                                </p>
                              </Col>
                            </Row>
                            <Row>
                              <Col>
                                <b>Step 3:</b>
                              </Col>
                              <Col>
                                <p>
                                  Check new message and copy 6-digit code.
                                  Return website and paste <b>code</b> to the
                                  below
                                </p>
                                <img src=""></img>
                                <Formik
                                  initialValues={{
                                    digit: "",
                                  }}
                                  onSubmit={(value) => {
                                    confirmPhone(value?.digit);
                                  }}
                                >
                                  {({ handleChange, handleSubmit, values }) => (
                                    <Form onSubmit={handleSubmit}>
                                      <Form.Group>
                                        <Form.Control
                                          type="text"
                                          name="digit"
                                          value={values.digit}
                                          className="mb-2"
                                          onChange={handleChange}
                                        ></Form.Control>
                                        <Button variant="success" type="submit">
                                          Send
                                        </Button>
                                      </Form.Group>
                                    </Form>
                                  )}
                                </Formik>
                                <div>
                                  if you are not receiving any code?{" "}
                                  <Button
                                    variant="primary"
                                    className="me-2"
                                    onClick={() => sendPhoneDigit()}
                                  >
                                    Resend code
                                  </Button>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        )}
                      </Modal.Body>
                    </Modal>
                  </div>
                  <div className="product-label-info">
                    <p className="product-label">Address</p>
                    <p className="product-content">
                      {authState?.accountInfo?.address}
                    </p>
                  </div>
                  <div className="product-label-info">
                    <p className="product-label">ABN Number</p>
                    <p className="product-content">
                      {authState?.accountInfo?.abnNumber || (
                        <Link>Not yet</Link>
                      )}
                    </p>
                  </div>
                  <div className="product-label-info">
                    <p className="product-label">Authorized account type</p>
                    <p className="product-content">
                      {authState?.accountInfo?.roles?.[0]}
                    </p>
                  </div>
                  <div
                    className="product-label-info"
                    style={{ alignItems: "flex-start" }}
                  >
                    <p className="product-label">BSB</p>
                    <p className="product-content">
                      {authState?.accountInfo?.bsb}
                    </p>
                  </div>
                  <div
                    className="product-label-info"
                    style={{ alignItems: "flex-start" }}
                  >
                    <p className="product-label">Vehicles</p>
                    <Row>
                      {authState?.accountInfo?.vehicles?.map((vehicle) => {
                        return (
                          <Col sm="auto">
                            <p className="product-content">{vehicle}</p>
                          </Col>
                        );
                      })}
                    </Row>
                  </div>
                  <div
                    className="product-label-info"
                    style={{ alignItems: "flex-start" }}
                  >
                    <p className="product-label">Front Driving Liense</p>
                    <p className="product-content">
                      <div style={{ maxWidth: "320px" }}>
                        <img
                          style={{ width: "100%" }}
                          src={authState?.accountInfo?.frontDrivingLiense}
                        ></img>
                      </div>
                    </p>
                  </div>
                  <div
                    className="product-label-info"
                    style={{ alignItems: "flex-start" }}
                  >
                    <p className="product-label">Back Driving Liense</p>
                    <p className="product-content">
                      <div style={{ maxWidth: "320px" }}>
                        <img
                          style={{ width: "100%" }}
                          src={authState?.accountInfo?.backDrivingLiense}
                        ></img>
                      </div>
                    </p>
                  </div>
                </div>
              </Col>
              <Col className="mb-5">
                <h3 className="ui-header mb-5">Edit Driver</h3>
                <Form onSubmit={handleSubmit}>
                  {/* Full Name */}
                  <Form.Group className="form-group">
                    <div className="mb-2">
                      <Form.Label className="label">Full name</Form.Label>
                      <p className="asterisk">*</p>
                    </div>
                    <Form.Control
                      type="text"
                      name="fullName"
                      placeholder="Enter Full Name"
                      value={values.fullName}
                      isInvalid={touched.fullName && !!errors?.fullName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors?.fullName}
                    </Form.Control.Feedback>
                  </Form.Group>
                  {/* Phone */}
                  <Form.Group>
                    <div className="mb-2">
                      <Form.Label className="label">Phone Number</Form.Label>
                      <p className="asterisk">*</p>
                    </div>
                    <PhoneInput
                      containerClass="w-100"
                      inputClass="w-100"
                      country={"au"}
                      value={values?.phone}
                      onChange={(phone) => setFieldValue("phone", phone)}
                      onlyCountries={["au", "vn"]}
                      preferredCountries={["au"]}
                      placeholder="Enter your phone"
                      autoFormat={true}
                      isValid={(inputNumber, _, countries) => {
                        const isValid = countries.some((country) => {
                          return (
                            inputNumber.startsWith(country.dialCode) ||
                            country.dialCode.startsWith(inputNumber)
                          );
                        });

                        setPhoneError("");

                        if (!isValid) {
                          setPhoneError(
                            "Your phone is not match with dial code"
                          );
                        }

                        return isValid;
                      }}
                    ></PhoneInput>
                    <Form.Control
                      type="hidden"
                      name="phone"
                      defaultValue={values?.phoneNumber}
                      isInvalid={!!errors?.phoneNumber || !!phoneError}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors?.phoneNumber || phoneError}
                    </Form.Control.Feedback>
                  </Form.Group>
                  {/* Address */}
                  <Form.Group className="form-group">
                    <div className="mb-2">
                      <Form.Label className="label">Address</Form.Label>
                      <p className="asterisk">*</p>
                    </div>
                    <Form.Control
                      type="text"
                      name="address"
                      placeholder="Enter Your Full Address"
                      value={values.address}
                      isInvalid={touched.address && errors.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.address}
                    </Form.Control.Feedback>
                  </Form.Group>
                  {/* City */}
                  <Form.Group className="form-group">
                    <div className="mb-2">
                      <Form.Label className="label">City</Form.Label>
                      <p className="asterisk">*</p>
                    </div>
                    <Form.Control
                      type="text"
                      name="city"
                      placeholder="Enter Your Full Address"
                      value={values.city}
                      isInvalid={touched.city && errors.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.city}
                    </Form.Control.Feedback>
                  </Form.Group>
                  {/* Zipcode */}
                  <Form.Group className="form-group">
                    <div className="mb-2">
                      <Form.Label className="label">Zip code</Form.Label>
                      <p className="asterisk">*</p>
                    </div>
                    <Form.Control
                      type="text"
                      name="zipCode"
                      placeholder="Enter Your Zipcode"
                      value={values.zipCode}
                      isInvalid={touched.zipCode && errors.zipCode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.zipCode}
                    </Form.Control.Feedback>
                  </Form.Group>
                  {/* ABN Number */}
                  <Form.Group className="form-group">
                    <div className="mb-2">
                      <Form.Label className="label">ABN Number</Form.Label>
                      <p className="asterisk">*</p>
                    </div>
                    <Form.Control
                      type="text"
                      name="abnNumber"
                      placeholder="Enter Your ABN Number"
                      value={values.abnNumber}
                      isInvalid={touched.abnNumber && !!errors?.abnNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors?.abnNumber}
                    </Form.Control.Feedback>
                  </Form.Group>
                  {/* Vehicles */}
                  <Form.Group className="form-group">
                    <div className="mb-2">
                      <Form.Label className="label">Vehicles</Form.Label>
                      <p className="asterisk">*</p>
                    </div>
                    <div className="list-vehicle">
                      {authState?.vehicles?.map?.((item, index) => {
                        return (
                          <div key={index}>
                            <label class="fr-checkbox mb-2">
                              <input
                                type="checkbox"
                                checked={authState?.accountInfo?.vehicles?.includes?.(
                                  item?.name
                                )}
                              />
                              <span className="checkmark"></span>
                              <span
                                className="txt-checkbox"
                                style={{
                                  fontWeight: "500",
                                }}
                              >
                                {item?.name}
                              </span>
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </Form.Group>
                  {/* Additional Information */}
                  <Form.Group className="form-group">
                    <div className="mb-2">
                      <Form.Label className="label">
                        Additional Information
                      </Form.Label>
                      <p className="asterisk">*</p>
                    </div>
                    <Form.Control
                      type="text"
                      style={{ background: "#fafafa" }}
                      name="city"
                      as="textarea"
                      rows={3}
                      placeholder="Enter Your Additional Information"
                      isInvalid={touched.addInfo && !!errors?.addInfo}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.addInfo}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="warning"
                    disabled={!isValid}
                    style={{
                      backgroundColor: "#f2a13b",
                      border: "none",
                    }}
                    className="my-btn-yellow my-2"
                  >
                    Send your updates
                  </Button>
                </Form>
              </Col>
            </Row>
          </div>
        );
      }}
    </Formik>
  );
}

export default function Index() {
  return <UpdateDriver></UpdateDriver>;
}
