import React, { useContext, useState } from "react";
import * as yup from "yup";
import { Formik } from "formik";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Message, Sidebar } from "../../../layout";
import { AuthContext, taskStatus } from "../../../stores";
import { Spinner } from "react-bootstrap";
import { authConstraints } from "../../../api";

let changePasswordSchema = yup.object().shape({
  oldPassword: yup.string().required("This field is requied"),
  password: yup
    .string()
    .required("This field is requied")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
  passwordConfirm: yup
    .string()
    .required("This field is requied")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

function ChangePassword() {
  const [authState, { changePassword }] = useContext(AuthContext);
  const [showPass, setShowPass] = React.useState(false);
  const [showPassConfirm, setShowPassConfirm] = React.useState(false);
  const showPassHandler = () => {
    setShowPass((e) => !e);
  };
  const showPassConfirmHandler = () => {
    setShowPassConfirm((e) => !e);
  };
  const isLoading =
    authState.tasks?.hasOwnProperty(authConstraints.changePwd) &&
    authState.tasks?.[authConstraints.changePwd] === taskStatus.Inprogress;

  return (
    <Formik
      initialValues={{
        oldPassword: "",
        password: "",
        passwordConfirm: "",
      }}
      isInitialValid={false}
      validationSchema={changePasswordSchema}
      onSubmit={(values) => {
        changePassword(values.oldPassword, values.password);
      }}
    >
      {({
        touched,
        errors,
        handleSubmit,
        handleChange,
        handleBlur,
        isValid,
        values,
      }) => {
        return (
          <>
            <div className="container p-3">
              <h3 className="ui-header p-2">Information</h3>
              <div>
                <Form className="form" onSubmit={handleSubmit}>
                  {authState.errors.length > 0 && (
                    <Message.Error>
                      {authState.errors.map((error) => (
                        <p>{error}</p>
                      ))}
                    </Message.Error>
                  )}
                  <Form.Group className="form-group">
                    <div className="mb-2">
                      <Form.Label className="label">Old Password</Form.Label>
                      <p className="asterisk">*</p>
                    </div>
                    <div className="frame-pass">
                      <Form.Control
                        type={showPass ? "text" : "password"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.oldPassword && errors.oldPassword}
                        placeholder="Enter your password"
                        name="oldPassword"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.oldPassword}
                      </Form.Control.Feedback>
                      <div className="override-block"></div>
                      <div className="eyes-pass">
                        {showPass ? (
                          <AiFillEye onClick={showPassHandler}></AiFillEye>
                        ) : (
                          <AiFillEyeInvisible
                            onClick={showPassHandler}
                          ></AiFillEyeInvisible>
                        )}
                      </div>
                    </div>
                  </Form.Group>
                  <Form.Group className="form-group">
                    <div className="mb-2">
                      <Form.Label className="label">New Password</Form.Label>
                      <p className="asterisk">*</p>
                    </div>
                    <div className="frame-pass">
                      <Form.Control
                        type={showPass ? "text" : "password"}
                        isInvalid={touched.password && errors.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter new password"
                        name="password"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                      <div className="override-block"></div>
                      <div className="eyes-pass">
                        {showPass ? (
                          <AiFillEye onClick={showPassHandler}></AiFillEye>
                        ) : (
                          <AiFillEyeInvisible
                            onClick={showPassHandler}
                          ></AiFillEyeInvisible>
                        )}
                      </div>
                    </div>
                  </Form.Group>
                  <Form.Group className="form-group">
                    <div className="mb-2">
                      <Form.Label className="label">
                        Confirm Password
                      </Form.Label>
                      <p className="asterisk">*</p>
                    </div>
                    <div className="frame-pass">
                      <Form.Control
                        type={showPassConfirm ? "text" : "password"}
                        name="passwordConfirm"
                        placeholder="Enter password again"
                        isInvalid={
                          touched.passwordConfirm && errors.passwordConfirm
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
                            onClick={showPassConfirmHandler}
                          ></AiFillEye>
                        ) : (
                          <AiFillEyeInvisible
                            onClick={showPassConfirmHandler}
                          ></AiFillEyeInvisible>
                        )}
                      </div>
                    </div>
                  </Form.Group>
                  <Button
                    variant="warning"
                    type="submit"
                    style={{ backgroundColor: "#f2a13b", border: "none" }}
                    disabled={!isValid && isLoading}
                    className={`my-btn-yellow my-3`}
                  >
                    {(isLoading && <Spinner></Spinner>) || "Update"}
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

export default function Index() {
  return <ChangePassword></ChangePassword>;
}
