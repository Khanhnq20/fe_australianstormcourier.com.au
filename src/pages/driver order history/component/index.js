import React from "react";
import { Formik } from "formik";
import { BiSearchAlt2 } from "react-icons/bi";
import {
  Table,
  Pagination,
  Form,
  Button,
  Dropdown,
  Row,
  Col,
} from "react-bootstrap";
import { usePagination } from "../../../hooks";
import { authConstraints, authInstance, config } from "../../../api";
import moment from "moment";

function Product() {
  const rows = [10, 15, 20, 25, 30, 35, 40];
  const {
    currentPage,
    perPageAmount,
    total,
    loading,
    items: offers,
    nextPage,
    prevPage,
    setCurrent,
    setPerPageAmount,
  } = usePagination({
    fetchingAPIInstance: ({ controller, page, take }) =>
      authInstance.get(
        [authConstraints.driverRoot, authConstraints.getDriverHistory].join(
          "/"
        ),
        {
          headers: {
            Authorization: [
              config.AuthenticationSchema,
              localStorage.getItem(authConstraints.LOCAL_KEY),
            ].join(" "),
          },
          params: {
            page,
            amount: take,
          },
          signal: controller.signal,
        }
      ),
    propToGetItem: "results",
    propToGetTotalPage: "total",
    amountPerPage: rows[0],
    startingPage: 1,
    totalPages: 1,
  });

  return (
    <Formik
      initialValues={{
        id: "",
        from: "",
        fullNameSender: "",
        fullNameDriver: "",
        to: "",
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
          <div>
            <div className="p-3">
              <div>
                <Form>
                  <div className="form-order">
                    <Form.Group>
                      <div className="mb-2">
                        <Form.Label className="label">
                          Pickup Location
                        </Form.Label>
                      </div>
                      <Form.Control
                        type="text"
                        name="senderLocation"
                        placeholder="Enter Sender Location"
                        isInvalid={
                          touched.senderLocation && errors.senderLocation
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.id}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                      <div className="mb-2">
                        <Form.Label className="label">Destination</Form.Label>
                      </div>
                      <Form.Control
                        type="text"
                        name="destiantion"
                        placeholder="Enter Destination"
                        isInvalid={touched.destination && errors.destination}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.destination}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  <div>
                    <Button
                      variant="warning"
                      style={{ backgroundColor: "#f2a13b", border: "none" }}
                      className={`my-btn-yellow my-4 product-btn-search`}
                    >
                      <BiSearchAlt2 style={{ fontSize: "20px" }}></BiSearchAlt2>
                      Search
                    </Button>
                  </div>
                </Form>
              </div>
            </div>

            <div>
              <div className="pg-rows">
                <p className="m-0">Show</p>
                <div>
                  <Dropdown className="reg-dr" style={{ width: "fit-content" }}>
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
                <p className="m-0">Rows</p>
              </div>
              {offers?.length === 0 ? (
                <div className="txt-center">
                  <h5>No Data Found</h5>
                </div>
              ) : (
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
                            minWidth: "140px",
                          }}
                        >
                          Pickup
                        </th>
                        <th
                          style={{
                            minWidth: "140px",
                          }}
                        >
                          Destination
                        </th>
                        <th
                          style={{
                            minWidth: "140px",
                          }}
                        >
                          Expected date
                        </th>
                        <th
                          style={{
                            minWidth: "140px",
                          }}
                        >
                          Expected time frame
                        </th>
                        <th
                          style={{
                            minWidth: "140px",
                          }}
                        >
                          Sender Offer
                        </th>
                        <th
                          style={{
                            minWidth: "140px",
                          }}
                        >
                          My Offer
                        </th>
                        <th
                          style={{
                            minWidth: "140px",
                          }}
                        >
                          Order Status
                        </th>
                        <th
                          style={{
                            minWidth: "140px",
                          }}
                        >
                          Offer Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {offers
                        ?.slice(
                          (currentPage - 1) * perPageAmount,
                          currentPage * perPageAmount
                        )
                        .map((offer, index) => {
                          const allowDelivery =
                            (offer?.status === "Accepted" &&
                              offer?.order?.status === "Paid") ||
                            offer?.order?.status === "Prepared" ||
                            offer?.order?.status === "Delivering" ||
                            offer?.order?.status === "Completed";
                          return (
                            <tr key={index}>
                              <td>{offer?.order?.id}</td>
                              <td>
                                <Row>
                                  <Col sm="5">
                                    <img
                                      src={
                                        offer?.order?.orderItems?.[0]?.itemImages?.split?.(
                                          "[space]"
                                        )?.[0]
                                      }
                                      style={{
                                        width: "100%",
                                        maxWidth: "120px",
                                      }}
                                    ></img>
                                  </Col>
                                  <Col sm="7">
                                    <b>
                                      {offer?.order?.orderItems?.[0]?.itemName}
                                    </b>
                                  </Col>
                                </Row>
                              </td>
                              <td>{offer?.order?.sendingLocation}</td>
                              <td>{offer?.order?.destination}</td>
                              <td>
                                {!!offer?.order?.deliverableDate
                                  ? moment(
                                      offer?.order?.deliverableDate
                                    ).format("DD-MM-YYYY")
                                  : ""}
                              </td>
                              <td>{offer?.order?.timeFrame}</td>
                              <td>
                                {offer?.order?.orderItems?.reduce?.(
                                  (i, c) => i + c?.startingRate,
                                  0
                                )}{" "}
                                aud
                              </td>
                              <td>{offer?.ratePrice} aud</td>
                              <td>{offer?.order?.status}</td>
                              <td>{offer?.status}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </Table>
                  <Pagination className="pg-form w-100">
                    <Pagination.Prev onClick={prevPage} className="pg-first" />
                    {Array.from(Array(total).keys()).map((item, index) => {
                      return (
                        <div key={index}>
                          <Pagination.Item
                            className={
                              item + 1 === currentPage
                                ? "pg-no pg-active"
                                : "pg-no"
                            }
                            onClick={() => setCurrent(item + 1)}
                          >
                            {item + 1}
                          </Pagination.Item>
                        </div>
                      );
                    })}
                    <Pagination.Next onClick={nextPage} className="pg-first" />
                  </Pagination>
                </div>
              )}
            </div>
          </div>
        );
      }}
    </Formik>
  );
}

export default function Index() {
  return <Product></Product>;
}
