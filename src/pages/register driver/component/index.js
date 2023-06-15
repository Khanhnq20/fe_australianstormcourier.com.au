import React, { useContext, useRef } from "react";
import { Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import "../style/registerDriver.css";
import { AuthContext, taskStatus } from "../../../stores";
import { serialize } from "object-to-formdata";

import { RiImageEditFill } from "react-icons/ri";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { VscFilePdf } from "react-icons/vsc";
import { CustomSpinner, Message } from "../../../layout";
import { authConstraints, config } from "../../../api";
import { GrDocumentPdf } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const PERMIT_FILE_FORMATS = ["image/jpeg", "image/png", "image/jpg"];

let registerSchema = yup.object().shape({
    userName: yup.string().required("User Name is required field"),
    phone: yup.string().required("Phone Number is required field"),
    email: yup.string().email().required("Email is required field"),
    password: yup
        .string()
        .required("This field is requied")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
        ),
    confirmPassword: yup
        .string()
        .required("This field is requied")
        .oneOf([yup.ref("password"), null], "Passwords must match"),
    fullName: yup.string().required("Full Name is required field"),
    ABNNumber: yup.number().typeError("ABN must be number").nullable(),
    businessName: yup.string().nullable(),
    address: yup.string().required("Full Address is required field"),
    city: yup.string().required("City is required field"),
    postCode: yup
        .number()
        .typeError("Zip code must be number")
        .required("Zip code is required field"),
    vehicles: yup.array().min(1, "Select one vehicle to complete the registry"),
    adInfo: yup.string().nullable(),
    bsb: yup
        .string()
        .required(
            "You should specify this field to create transactions with user"
        ),
    isAusDrivingLiense: yup.boolean().default(false),
    frontDrivingLiense: yup
        .mixed()
        .nullable()
        .required("Front Driving License is required field")
        .test("FILE SIZE", "the file is too large", (value) => {
            if (!value) {
                return true;
            }

            return value.size <= 2 * 1024 * 1024;
        })
        .test(
            "FILE FORMAT",
            `the file format should be ${PERMIT_FILE_FORMATS.join()}`,
            (value) => {
                if (!value) {
                    return true;
                }
                return PERMIT_FILE_FORMATS.includes(value.type);
            }
        ),
    backDrivingLiense: yup
        .mixed()
        .nullable()
        .required("Back Driving License is required field")
        .test("FILE SIZE", "the file is too large", (value) => {
            if (!value) {
                return true;
            }

            return value.size <= 2 * 1024 * 1024;
        })
        .test(
            "FILE FORMAT",
            `the file format should be ${PERMIT_FILE_FORMATS.join()}`,
            (value) => {
                if (!value) {
                    return true;
                }
                return PERMIT_FILE_FORMATS.includes(value.type);
            }
        ),
    drivingCertificate: yup
        .mixed()
        .required("Driving Certificate is required field")
        .when("isAusDrivingLiense", {
            is: (isAusDrivingLiense) => {
                return !isAusDrivingLiense;
            },
            then: (schema) => {
                return schema
                    .required()
                    .test("FILE SIZE", "the file is too large", (value) => {
                        if (!value) {
                            return true;
                        }

                        return value.size <= 5 * 1024 * 1024;
                    })
                    .test(
                        "FILE FORMAT",
                        `the file format should be pdf`,
                        (value) => {
                            if (!value) {
                                return true;
                            }
                            return value.type === "application/pdf";
                        }
                    );
            },
            otherwise: (schema) => {
                return schema.notRequired();
            },
        }),
});

function RegisterDriver() {
    const [{ vehicles, loading: authLoading, ...authState }, { signupDriver }] =
        useContext(AuthContext);
    const navigate = useNavigate();
    const f_driver_img_ipt = useRef();
    const b_driver_img_ipt = useRef();
    const d_certificate = useRef();
    const [imgUrlFront, setImgUrlFront] = React.useState();
    const [imgUrlBack, setImgUrlBack] = React.useState();
    const [pdf, setPdf] = React.useState();
    const [showPass, setShowPass] = React.useState(false);
    const [showPassConfirm, setShowPassConfirm] = React.useState(false);
    const [next, setNext] = React.useState(true);
    const [phoneError, setPhoneError] = React.useState("");
    const showPassHandler = () => {
        setShowPass((e) => !e);
    };
    const showPassConfirmHandler = () => {
        setShowPassConfirm((e) => !e);
    };

    if (authLoading) return <CustomSpinner></CustomSpinner>;

    const isLoading =
        authState?.tasks?.[authConstraints.signupDriver] &&
        authState?.tasks?.[authConstraints.signupDriver] ===
            taskStatus.InProgress;
    return (
        <Formik
            initialValues={{
                userName: "",
                phone: "",
                email: "",
                password: "",
                confirmPassword: "",
                fullName: "",
                ABNNumber: "",
                businessName: "",
                address: "",
                city: "",
                postCode: 0,
                frontDrivingLiense: null,
                backDrivingLiense: null,
                drivingCertificate: null,
                isAusDrivingLiense: false,
                vehicles: [],
                adInfo: "",
                bsb: "",
            }}
            validationSchema={registerSchema}
            onSubmit={(values) => {
                const formData = serialize(values, {
                    indices: true,
                    dotsForObjectNotation: true,
                });

                signupDriver(
                    formData,
                    `${window.location.protocol}//${window.location.host}${config.AccountConfirmationURL}`,
                    () => {
                        navigate("/auth/register/confirm");
                    }
                );
            }}
        >
            {({
                values,
                touched,
                errors,
                setFieldValue,
                setErrors,
                handleSubmit,
                handleChange,
                handleBlur,
                isValid,
            }) => {
                const permitedNext =
                    !errors.userName &&
                    !errors.phone &&
                    !errors.email &&
                    !errors.password;

                return (
                    <div
                        style={{ minHeight: "calc(90vh - 54px)" }}
                        className="container p-sm-2 p-lg-5"
                    >
                        <div className="text-center">
                            <h3 className="ui-header">Become driver</h3>
                        </div>
                        <Form className="form" onSubmit={handleSubmit}>
                            {isLoading && <CustomSpinner></CustomSpinner>}

                            {!!authState?.errors?.length && (
                                <Message.Error>
                                    {authState?.errors?.map((error) => (
                                        <p>{error}</p>
                                    ))}
                                </Message.Error>
                            )}

                            <Row>
                                <Col
                                    className={
                                        next ? "step1-show" : "step1-hide"
                                    }
                                >
                                    <h4
                                        className="my-3"
                                        style={{ textTransform: "capitalize" }}
                                    >
                                        Account information
                                    </h4>
                                    {/* Username and email */}
                                    <Row>
                                        <Col>
                                            {/* UserName */}
                                            <Form.Group className="form-group">
                                                <div className="mb-2">
                                                    <Form.Label className="label">
                                                        User name
                                                    </Form.Label>
                                                    <p className="asterisk">
                                                        *
                                                    </p>
                                                </div>
                                                <Form.Control
                                                    type="text"
                                                    name="userName"
                                                    placeholder="Enter Your Full Name"
                                                    isInvalid={
                                                        touched.userName &&
                                                        errors.userName
                                                    }
                                                    value={values.userName}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.userName}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            {/* Email */}
                                            <Form.Group className="form-group">
                                                <div className="mb-2">
                                                    <Form.Label className="label">
                                                        Email
                                                    </Form.Label>
                                                    <p className="asterisk">
                                                        *
                                                    </p>
                                                </div>
                                                <Form.Control
                                                    type="text"
                                                    name="email"
                                                    placeholder="Enter Your Email"
                                                    isInvalid={
                                                        touched.email &&
                                                        errors.email
                                                    }
                                                    value={values.email}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.email}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    {/* Password */}
                                    <Form.Group className="form-group">
                                        <div className="mb-2">
                                            <Form.Label className="label">
                                                Password
                                            </Form.Label>
                                            <p className="asterisk">*</p>
                                        </div>
                                        <div className="frame-pass">
                                            <Form.Control
                                                type={
                                                    showPass
                                                        ? "text"
                                                        : "password"
                                                }
                                                isInvalid={
                                                    touched.password &&
                                                    errors.password
                                                }
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="Enter your Password"
                                                name="password"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.password}
                                            </Form.Control.Feedback>
                                            <div className="override-block"></div>
                                            <div className="eyes-pass">
                                                {showPass ? (
                                                    <AiFillEye
                                                        onClick={
                                                            showPassHandler
                                                        }
                                                    ></AiFillEye>
                                                ) : (
                                                    <AiFillEyeInvisible
                                                        onClick={
                                                            showPassHandler
                                                        }
                                                    ></AiFillEyeInvisible>
                                                )}
                                            </div>
                                        </div>
                                    </Form.Group>

                                    {/* Confirm Password */}
                                    <Form.Group className="form-group">
                                        <div className="mb-2">
                                            <Form.Label className="label">
                                                Confirm Password
                                            </Form.Label>
                                            <p className="asterisk">*</p>
                                        </div>
                                        <div className="frame-pass">
                                            <Form.Control
                                                type={
                                                    showPassConfirm
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="confirmPassword"
                                                placeholder="Enter password again"
                                                isInvalid={
                                                    touched.passwordConfirm &&
                                                    errors.passwordConfirm
                                                }
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.passwordConfirm}
                                            </Form.Control.Feedback>
                                            <div className="override-block"></div>
                                            <div className="eyes-pass">
                                                {showPassConfirm ? (
                                                    <AiFillEye
                                                        onClick={
                                                            showPassConfirmHandler
                                                        }
                                                    ></AiFillEye>
                                                ) : (
                                                    <AiFillEyeInvisible
                                                        onClick={
                                                            showPassConfirmHandler
                                                        }
                                                    ></AiFillEyeInvisible>
                                                )}
                                            </div>
                                        </div>
                                    </Form.Group>

                                    {/* Phone */}
                                    <Form.Group className="form-group mb-4">
                                        <div className="mb-2">
                                            <Form.Label className="label">
                                                Phone Number
                                            </Form.Label>
                                            <p className="asterisk">*</p>
                                        </div>
                                        <PhoneInput
                                            containerClass="w-100"
                                            inputClass="w-100"
                                            country={"au"}
                                            value={values?.phone}
                                            onChange={(phone) =>
                                                setFieldValue("phone", phone)
                                            }
                                            onlyCountries={["au", "vn", "us"]}
                                            preferredCountries={["au"]}
                                            placeholder="Enter Your Phone number"
                                            autoFormat={true}
                                            isValid={(
                                                inputNumber,
                                                _,
                                                countries
                                            ) => {
                                                const isValid = countries.some(
                                                    (country) => {
                                                        return (
                                                            inputNumber.startsWith(
                                                                country.dialCode
                                                            ) ||
                                                            country.dialCode.startsWith(
                                                                inputNumber
                                                            )
                                                        );
                                                    }
                                                );
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
                                            defaultValue={values?.phone}
                                            isInvalid={
                                                !!errors.phone || !!phoneError
                                            }
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.phone || phoneError}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Button
                                        variant="warning"
                                        disabled={!permitedNext || !!phoneError}
                                        onClick={() => setNext((e) => !e)}
                                        className="my-btn-yellow w-100 w-lg-40"
                                    >
                                        Next
                                    </Button>
                                </Col>

                                <Col
                                    className={
                                        !next ? "step2-show" : "step2-hide"
                                    }
                                >
                                    <Button
                                        type="submit"
                                        variant="warning"
                                        onClick={() => setNext((e) => !e)}
                                        className="my-btn-yellow mb-4"
                                    >
                                        Back
                                    </Button>
                                    {/* Full Name */}
                                    <Form.Group className="form-group">
                                        <div className="mb-2">
                                            <Form.Label className="label">
                                                Full name
                                            </Form.Label>
                                            <p className="asterisk">*</p>
                                        </div>
                                        <Form.Control
                                            type="text"
                                            name="fullName"
                                            placeholder="Enter Full Name"
                                            isInvalid={
                                                touched.fullName &&
                                                errors.fullName
                                            }
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.fullName}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    {/* ABN Number */}
                                    <Form.Group className="form-group">
                                        <div className="mb-2">
                                            <Form.Label className="label">
                                                ABN
                                            </Form.Label>
                                        </div>
                                        <Form.Control
                                            type="text"
                                            name="ABNNumber"
                                            placeholder="Enter Your ABN Number"
                                            isInvalid={
                                                touched.ABNNumber &&
                                                errors.ABNNumber
                                            }
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.ABNNumber}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    {/* Business Name */}
                                    <Form.Group className="form-group">
                                        <div className="mb-2">
                                            <Form.Label className="label">
                                                Business Name
                                            </Form.Label>
                                        </div>
                                        <Form.Control
                                            type="text"
                                            name="bussinessName"
                                            placeholder="Enter Your Business Name"
                                            isInvalid={
                                                touched.bussinessName &&
                                                !!errors?.bussinessName
                                            }
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors?.bussinessName}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    {/* Address */}
                                    <Form.Group className="form-group">
                                        <div className="mb-2">
                                            <Form.Label className="label">
                                                Address
                                            </Form.Label>
                                            <p className="asterisk">*</p>
                                        </div>
                                        <Form.Control
                                            type="text"
                                            name="address"
                                            placeholder="Enter Your Address"
                                            isInvalid={
                                                touched?.address &&
                                                !!errors?.address
                                            }
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors?.address}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    {/* City */}
                                    <Form.Group className="form-group">
                                        <div className="mb-2">
                                            <Form.Label className="label">
                                                City
                                            </Form.Label>
                                            <p className="asterisk">*</p>
                                        </div>
                                        <Form.Control
                                            type="text"
                                            name="city"
                                            placeholder="Enter Your City"
                                            isInvalid={
                                                touched?.city && !!errors?.city
                                            }
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors?.city}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    {/* PostCode */}
                                    <Form.Group className="form-group">
                                        <div className="mb-2">
                                            <Form.Label className="label">
                                                Postcode
                                            </Form.Label>
                                            <p className="asterisk">*</p>
                                        </div>
                                        <Form.Control
                                            type="text"
                                            name="postCode"
                                            placeholder="Enter Your Post Code"
                                            isInvalid={
                                                touched.postCode &&
                                                !!errors?.postCode
                                            }
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors?.postCode}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    {/* Driving Liense Images */}
                                    <Form.Group className="form-group">
                                        <div className="mb-2">
                                            <Form.Label className="label py-3 mb-2">
                                                Driving License (Front and Back)
                                            </Form.Label>
                                            <p className="asterisk">*</p>
                                        </div>
                                        <div className="front-up">
                                            <h6>Front</h6>
                                            <div
                                                className="img-front-frame"
                                                onClick={() =>
                                                    f_driver_img_ipt.current.click()
                                                }
                                            >
                                                <div className="background-front">
                                                    <RiImageEditFill
                                                        style={{
                                                            position:
                                                                "relative",
                                                            color: "gray",
                                                            fontSize: "50px",
                                                            opacity: "70%",
                                                        }}
                                                    ></RiImageEditFill>
                                                    <p className="driving-txt">
                                                        Change driving license
                                                    </p>
                                                </div>
                                                <img
                                                    className="img-front"
                                                    src={
                                                        imgUrlFront ||
                                                        "https://tinyurl.com/5ehpcctt"
                                                    }
                                                />
                                            </div>
                                            <Form.Control
                                                type="file"
                                                id="driver_image_front"
                                                name="frontDrivingLiense"
                                                ref={f_driver_img_ipt}
                                                isInvalid={
                                                    !!errors?.frontDrivingLiense
                                                }
                                                onChange={(e) => {
                                                    const file =
                                                        e.target.files[0];
                                                    setFieldValue(
                                                        e.target.name,
                                                        file,
                                                        true
                                                    );

                                                    const fileReader =
                                                        new FileReader();
                                                    if (file) {
                                                        fileReader.addEventListener(
                                                            "loadend",
                                                            (e) => {
                                                                setImgUrlFront(
                                                                    fileReader.result
                                                                );
                                                            }
                                                        );
                                                        fileReader.readAsDataURL(
                                                            file
                                                        );
                                                    }
                                                }}
                                            />
                                            <Form.Control.Feedback
                                                className="mb-2"
                                                type="invalid"
                                            >
                                                {errors?.frontDrivingLiense}
                                            </Form.Control.Feedback>
                                        </div>
                                        <div className="back-up">
                                            <div>
                                                <h6>Back</h6>
                                            </div>
                                            <div
                                                className="img-front-frame"
                                                onClick={() =>
                                                    b_driver_img_ipt.current.click()
                                                }
                                            >
                                                <div className="background-front">
                                                    <RiImageEditFill
                                                        style={{
                                                            position:
                                                                "relative",
                                                            color: "gray",
                                                            fontSize: "50px",
                                                            opacity: "70%",
                                                        }}
                                                    ></RiImageEditFill>
                                                    <p className="driving-txt">
                                                        Change driving license
                                                    </p>
                                                </div>
                                                <img
                                                    className="img-front"
                                                    src={
                                                        imgUrlBack ||
                                                        "https://tinyurl.com/5ehpcctt"
                                                    }
                                                />
                                            </div>

                                            <Form.Control
                                                type="file"
                                                id="driver_image_back"
                                                name="backDrivingLiense"
                                                ref={b_driver_img_ipt}
                                                isInvalid={
                                                    !!errors?.backDrivingLiense
                                                }
                                                onChange={(e) => {
                                                    const file =
                                                        e.target.files[0];
                                                    setFieldValue(
                                                        e.target.name,
                                                        file,
                                                        true
                                                    );

                                                    const fileReader =
                                                        new FileReader();

                                                    if (file) {
                                                        fileReader.addEventListener(
                                                            "loadend",
                                                            (e) => {
                                                                setImgUrlBack(
                                                                    fileReader.result
                                                                );
                                                            }
                                                        );
                                                        fileReader.readAsDataURL(
                                                            file
                                                        );
                                                    }
                                                }}
                                            />
                                            <Form.Control.Feedback
                                                className="mb-2"
                                                type="invalid"
                                            >
                                                {errors?.backDrivingLiense}
                                            </Form.Control.Feedback>
                                        </div>
                                        <label className="fr-checkbox mb-2">
                                            <input
                                                type="checkbox"
                                                name="isAusDrivingLiense"
                                                checked={
                                                    values.isAusDrivingLiense
                                                }
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            <span className="checkmark"></span>
                                            <span
                                                className="txt-checkbox"
                                                style={{ fontWeight: "500" }}
                                            >
                                                Your driving license is from
                                                australian
                                            </span>
                                        </label>
                                        {!values.isAusDrivingLiense && (
                                            <div className="drivingCertificate">
                                                <div>
                                                    <h6>Driving Certificate</h6>
                                                </div>
                                                <div
                                                    className="img-front-frame"
                                                    style={{
                                                        minWidth: "120px",
                                                        minHeight: "200px",
                                                    }}
                                                    onClick={() =>
                                                        d_certificate.current.click()
                                                    }
                                                >
                                                    {(!values.drivingCertificate && (
                                                        <div className="background-front">
                                                            <GrDocumentPdf
                                                                style={{
                                                                    position:
                                                                        "relative",
                                                                    color: "gray",
                                                                    fontSize:
                                                                        "50px",
                                                                    opacity:
                                                                        "70%",
                                                                }}
                                                            ></GrDocumentPdf>
                                                            <p className="driving-txt">
                                                                Change PDF
                                                            </p>
                                                        </div>
                                                    )) || (
                                                        <div>
                                                            <VscFilePdf
                                                                style={{
                                                                    fontSize:
                                                                        "10rem",
                                                                }}
                                                            ></VscFilePdf>
                                                        </div>
                                                    )}
                                                </div>

                                                <Form.Control
                                                    type="file"
                                                    id="driver_pdf"
                                                    name="drivingCertificate"
                                                    accept="application/pdf"
                                                    ref={d_certificate}
                                                    isInvalid={
                                                        !!errors?.drivingCertificate
                                                    }
                                                    onChange={(e) => {
                                                        const file =
                                                            e.target.files[0];
                                                        setFieldValue(
                                                            e.target.name,
                                                            file,
                                                            true
                                                        );
                                                        const fileReader =
                                                            new FileReader();
                                                        if (file) {
                                                            fileReader.addEventListener(
                                                                "loadend",
                                                                (e) => {
                                                                    setPdf(
                                                                        fileReader.result
                                                                    );
                                                                }
                                                            );
                                                            fileReader.readAsDataURL(
                                                                file
                                                            );
                                                        }
                                                    }}
                                                />
                                                <Form.Control.Feedback
                                                    className="mb-2"
                                                    type="invalid"
                                                >
                                                    {errors?.drivingCertificate}
                                                </Form.Control.Feedback>
                                            </div>
                                        )}
                                    </Form.Group>

                                    {/* Vehicles */}
                                    <Form.Group className="form-group">
                                        <div
                                            className="mb-2"
                                            style={{ paddingTop: "20px" }}
                                        >
                                            <Form.Label className="label">
                                                Vehicles
                                            </Form.Label>
                                            <p className="asterisk">*</p>
                                        </div>
                                        <div className="list-vehicle">
                                            {vehicles.map((item, index) => {
                                                return (
                                                    <div key={index}>
                                                        <label className="fr-checkbox mb-2">
                                                            <input
                                                                type="checkbox"
                                                                name="vehicles"
                                                                value={item?.id}
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                onBlur={
                                                                    handleBlur
                                                                }
                                                            />
                                                            <span className="checkmark"></span>
                                                            <span
                                                                className="txt-checkbox"
                                                                style={{
                                                                    fontWeight:
                                                                        "500",
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

                                    {/* BSB */}
                                    <Form.Group className="form-group">
                                        <div className="mb-2">
                                            <Form.Label className="label">
                                                BSB
                                            </Form.Label>
                                            <p className="asterisk">*</p>
                                        </div>
                                        <Form.Control
                                            type="text"
                                            name="bsb"
                                            placeholder="Enter Bsb"
                                            isInvalid={
                                                touched.bsb && !!errors?.bsb
                                            }
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors?.bsb}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    {/* Additional Information */}
                                    <Form.Group className="form-group">
                                        <div className="mb-2">
                                            <Form.Label className="label">
                                                Additional Information
                                            </Form.Label>
                                        </div>
                                        <Form.Control
                                            type="text"
                                            style={{ background: "#fafafa" }}
                                            name="adInfo"
                                            as="textarea"
                                            rows={3}
                                            placeholder="Enter Your Additional Information"
                                            isInvalid={
                                                touched.adInfo &&
                                                !!errors.adInfo
                                            }
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.adInfo}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Button
                                        type="submit"
                                        variant="warning"
                                        style={{
                                            backgroundColor: "#f2a13b",
                                            border: "none",
                                        }}
                                        disabled={authLoading && !isValid}
                                        className="my-btn-yellow my-2"
                                    >
                                        {isLoading ? (
                                            <Spinner></Spinner>
                                        ) : (
                                            "Submit"
                                        )}
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                );
            }}
        </Formik>
    );
}

export default function Index() {
    return <RegisterDriver></RegisterDriver>;
}
