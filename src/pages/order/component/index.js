import React, { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { BiSearchAlt2 } from "react-icons/bi";
import Dropdown from "react-bootstrap/Dropdown";
import Table from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";
import { usePagination } from "../../../hooks";
import { authConstraints, authInstance, config } from "../../../api";
import { Col, Row, Spinner } from "react-bootstrap";
import moment from "moment";
import { Link } from "react-router-dom";

let loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("This field must be email type")
    .required("Email is required field"),
  password: yup.string().required("This field is requied"),
});

function UserOrders() {
  const {
    currentPage,
    perPageAmount,
    total,
    loading,
    error,
    items,
    nextPage,
    prevPage,
    setCurrent,
    setPerPageAmount,
  } = usePagination({
    fetchingAPIInstance: authInstance.get(
      [authConstraints.userRoot, authConstraints.getUserOrders].join("/"),
      {
        headers: {
          Authorization: [
            config.AuthenticationSchema,
            localStorage.getItem(authConstraints.LOCAL_KEY),
          ].join(" "),
        },
      }
    ),
    propToGetItem: "results",
    propToGetTotalPage: "total",
    amountPerPage: 10,
    startingPage: 0,
    totalPages: 1,
  });

  const rows = [10, 15, 20, 25, 30, 35, 40];

  if (loading) {
    return <Spinner></Spinner>;
  }

  return (
    <Formik
      initialValues={{
        id: "",
        from: "",
        fullNameSender: "",
        fullNameDriver: "",
        to: "",
      }}
      validationSchema={loginSchema}
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
            <div>
              <div className="p-3">
                <div>
                  <Form onSubmit={handleSubmit}>
                    <div className="form-order">
                      {/* ID */}
                      <Form.Group>
                        <div className="mb-2">
                          <Form.Label className="label">ID</Form.Label>
                        </div>
                        <Form.Control
                          type="text"
                          name="id"
                          placeholder="Enter Full Name"
                          isInvalid={touched.fullName && errors.fullName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.fullName}
                        </Form.Control.Feedback>
                      </Form.Group>

                      {/* From */}
                      <Form.Group>
                        <div className="mb-2">
                          <Form.Label className="label">From</Form.Label>
                        </div>
                        <Form.Control
                          type="text"
                          name="from"
                          placeholder="Enter Full Name"
                          isInvalid={touched.fullName && errors.fullName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.fullName}
                        </Form.Control.Feedback>
                      </Form.Group>

                      {/* Full Name Sender */}
                      <Form.Group>
                        <div className="mb-2">
                          <Form.Label className="label">
                            Full name sender
                          </Form.Label>
                        </div>
                        <Form.Control
                          type="text"
                          name="fullNameSender"
                          placeholder="Enter Full Name"
                          isInvalid={touched.fullName && errors.fullName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.fullName}
                        </Form.Control.Feedback>
                      </Form.Group>

                      {/* To */}
                      <Form.Group>
                        <div className="mb-2">
                          <Form.Label className="label">To</Form.Label>
                        </div>
                        <Form.Control
                          type="text"
                          name="to"
                          placeholder="Enter Full Name"
                          isInvalid={touched.fullName && errors.fullName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.fullName}
                        </Form.Control.Feedback>
                      </Form.Group>

                      {/* Full Name Driver */}
                      <Form.Group>
                        <div className="mb-2">
                          <Form.Label className="label">
                            Full name driver
                          </Form.Label>
                        </div>
                        <Form.Control
                          type="text"
                          name="fullNameDriver"
                          placeholder="Enter Full Name"
                          isInvalid={touched.fullName && errors.fullName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.fullName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                    <div>
                      <Button
                        variant="warning"
                        style={{ backgroundColor: "#f2a13b", border: "none" }}
                        className={`my-btn-yellow my-4 product-btn-search`}
                      >
                        <BiSearchAlt2
                          style={{ fontSize: "20px" }}
                        ></BiSearchAlt2>
                        Search
                      </Button>
                    </div>
                  </Form>
                </div>
              </div>

              <div>
                {/* Request to show row number */}
                <div className="pg-rows">
                  <p className="m-0">Show</p>
                  <div>
                    <Dropdown
                      className="reg-dr"
                      style={{ width: "fit-content" }}
                    >
                      <Dropdown.Toggle
                        className="dr-btn py-1"
                        id="dropdown-basic"
                      >
                        {perPageAmount}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {rows.map((item, index) => {
                          return (
                            <Dropdown.Item
                              key={index}
                              onClick={() => setPerPageAmount(item)}
                            >
                              {item}
                            </Dropdown.Item>
                          );
                        })}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  <p className="m-0">Items</p>
                </div>

                {items?.length === 0 ? (
                  <div className="txt-center">
                    <h5>No Data Found</h5>
                  </div>
                ) : (
                  <>
                    <div style={{ maxWidth: "100%", overflowX: "scroll" }}>
                      <Table striped bordered>
                        <thead>
                          <tr>
                            <th>Order Id</th>
                            <th
                              style={{
                                minWidth: "320px",
                              }}
                            >
                              Item Name
                            </th>
                            <th
                              style={{
                                minWidth: "150px",
                              }}
                            >
                              Pickup Location
                            </th>
                            <th
                              style={{
                                minWidth: "150px",
                              }}
                            >
                              Destination
                            </th>
                            <th
                              style={{
                                minWidth: "150px",
                              }}
                            >
                              Posted At
                            </th>
                            <th
                              style={{
                                minWidth: "150px",
                              }}
                            >
                              Expected date
                            </th>
                            <th
                              style={{
                                minWidth: "150px",
                              }}
                            >
                              Expected time frame
                            </th>
                            <th
                              style={{
                                minWidth: "150px",
                              }}
                            >
                              Status
                            </th>
                            <th
                              style={{
                                minWidth: "150px",
                              }}
                            >
                              Vehicles
                            </th>
                            <th
                              style={{
                                minWidth: "150px",
                              }}
                            >
                              Offer Amount
                            </th>
                            <th
                              style={{
                                minWidth: "150px",
                              }}
                            >
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {items
                            ?.slice(
                              (currentPage - 1) * perPageAmount,
                              perPageAmount * (1 + currentPage)
                            )
                            .map((post, index) => {
                              return (
                                <tr key={index}>
                                  <td>{post?.id}</td>
                                  <td>
                                    <Row>
                                      <Col sm="4">
                                        <img
                                          src={
                                            post?.orderItems?.[0]?.itemImages?.split?.(
                                              "[space]"
                                            )?.[0]
                                          }
                                          style={{ width: "100%" }}
                                        ></img>
                                      </Col>
                                      <Col sm="8">
                                        <b>{post?.orderItems?.[0]?.itemName}</b>
                                      </Col>
                                    </Row>
                                  </td>
                                  <td>{post?.sendingLocation}</td>
                                  <td>{post?.destination}</td>
                                  <td>
                                    {!!post?.createdDate
                                      ? moment(post?.createdDate).format(
                                          "DD-MM-YYYY"
                                        )
                                      : ""}
                                  </td>
                                  <td>
                                    {!!post?.deliveredDate
                                      ? moment(post?.deliveredDate).format(
                                          "DD-MM-YYYY"
                                        )
                                      : ""}
                                  </td>
                                  <td>{post?.timeFrame}</td>
                                  <td>
                                    {post?.status
                                      ?.replace?.(/([A-Z])/g, " $1")
                                      ?.trim?.()}
                                  </td>
                                  <td>
                                    {post?.vehicles?.map?.((v) => {
                                      return <p>{v}</p>;
                                    })}
                                  </td>
                                  <td>{post?.offerNumber}</td>
                                  <td>
                                    <Row>
                                      <Col>
                                        <Link
                                          to={`/user/order/detail?orderid=${post?.id}`}
                                          state={post}
                                        >
                                          <Button variant="primary">
                                            Detail
                                          </Button>
                                        </Link>
                                      </Col>
                                    </Row>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </Table>
                    </div>

                    <Pagination className="pg-form w-100">
                      {/* <Pagination.First onClick={first} className='pg-first' style={{color:'black'}}/> */}
                      <Pagination.Prev
                        onClick={prevPage}
                        className="pg-first"
                      />
                      {Array.from(total).map((item, index) => {
                        return (
                          <div>
                            <div key={index}>
                              <Pagination.Item
                                className={
                                  item === currentPage
                                    ? "pg-no pg-active"
                                    : "pg-no"
                                }
                                onClick={() => setCurrent(item)}
                              >
                                {item}
                              </Pagination.Item>
                            </div>
                          </div>
                        );
                      })}
                      <Pagination.Next
                        onClick={nextPage}
                        className="pg-first"
                      />
                      {/* <Pagination.Last onClick={last} className='pg-first'/> */}
                    </Pagination>
                  </>
                )}
              </div>
            </div>
          </>
        );
      }}
    </Formik>
  );
}

export default function Index() {
  return <UserOrders></UserOrders>;
}
