import "../../register user/style/registerUser.css";
import React, { useContext, useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { AiFillLock } from "react-icons/ai";
import "../style/login.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../stores";
import { CustomSpinner, Message } from "../../../layout";
import { config } from "../../../api";

let loginSchema = yup.object().shape({
    email: yup
        .string()
        .email("This field must be email type")
        .required("Email is required field"),
    password: yup.string().required("This field is requied"),
});

export default function Index() {
    const [authState, funcs] = useContext(AuthContext);
    const [showPass, setShowPass] = React.useState(false);
    const showPassHandler = () => {
        setShowPass((e) => !e);
    };
    if (authState.loading) {
        return <CustomSpinner></CustomSpinner>;
    }

    return (
        <Formik
            initialValues={{
                email: "",
                password: "",
                rememberMe: false,
            }}
            isInitialValid={false}
            validationSchema={loginSchema}
            onSubmit={(values) => {
                funcs.signin(
                    {
                        UserName: values.email,
                        Password: values.password,
                        RememeberMe: values.rememberMe,
                    },
                    `${window.location.protocol}//${window.location.host}${config.AccountConfirmationURL}`
                );
            }}
        >
            {({
                touched,
                errors,
                handleSubmit,
                handleChange,
                handleBlur,
                isValid,
            }) => {
                return (
                    <>
                        <div
                            style={{ minHeight: "calc(90vh - 54px)" }}
                            className="container px-sm-2 py-5 p-lg-5"
                        >
                            <div>
                                <div>
                                    <h3 className="reg-header txt-center">
                                        Login
                                    </h3>
                                    <h4 className="reg-txt-u txt-center">
                                        Get started with Us
                                    </h4>
                                    <p className="txt-center">
                                        Login to continue to
                                        Australianstormcourier.
                                    </p>
                                </div>
                                <Form className="form" onSubmit={handleSubmit}>
                                    {authState?.errors?.map?.((error) => {
                                        console.log(error);
                                        return (
                                            <Message.Error>
                                                {error || error?.message || (
                                                    <p></p>
                                                )}
                                            </Message.Error>
                                        );
                                    })}

                                    <Form.Group className="form-group">
                                        <div className="mb-2">
                                            <Form.Label className="label">
                                                Email
                                            </Form.Label>
                                            <p className="asterisk">*</p>
                                        </div>
                                        <Form.Control
                                            type="text"
                                            name="email"
                                            placeholder="Enter Your Email"
                                            onChange={handleChange}
                                            // isInvalid={touched.email && touched.password && !!errors.email && !!errors.password}
                                            isInvalid={
                                                touched.email && errors.email
                                            }
                                            onBlur={handleBlur}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.email}
                                        </Form.Control.Feedback>
                                    </Form.Group>
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
                                                onChange={handleChange}
                                                placeholder="Enter Your Password"
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
                                    <div className="log-service">
                                        <label className="fr-checkbox">
                                            <input type="checkbox" />
                                            <span className="checkmark"></span>
                                            <span className="txt-checkbox">
                                                Remember me
                                            </span>
                                        </label>
                                        <div>
                                            <span className="log-lock-icon">
                                                <AiFillLock></AiFillLock>
                                            </span>
                                            <span className="log-txt-forgot">
                                                <Link
                                                    to="/auth/forgot"
                                                    className="log-link-forgot"
                                                >
                                                    Forgot password?
                                                </Link>
                                            </span>
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        variant="warning"
                                        style={{
                                            backgroundColor: "#f2a13b",
                                            border: "none",
                                        }}
                                        disabled={!isValid}
                                        className={`my-btn-yellow my-3`}
                                    >
                                        Login
                                    </Button>
                                </Form>
                            </div>
                        </div>
                    </>
                );
            }}
        </Formik>
    );
}
