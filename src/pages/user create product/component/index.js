import { FieldArray, Formik } from "formik";
import * as yup from "yup";
import Form from "react-bootstrap/Form";
import React, { useContext } from "react";
import { Button, Col, Modal, Row, Spinner } from "react-bootstrap";
import { AuthContext, OrderContext } from "../../../stores";
import "../style/createProduct.css";
import moment from "moment";
import { Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { dotnetFormDataSerialize } from "../../../ultitlies";
import "react-phone-input-2/lib/style.css";
import ItemCreation from "./item";

const PERMIT_FILE_FORMATS = ["image/jpeg", "image/png", "image/jpg"];

let orderSchema = yup.object().shape({
    senderId: yup.string().required(),
    sendingLocation: yup.object().shape({
        unitNumber: yup.string().required("Unit Number is required"),
        streetNumber: yup.string().required("Street Number is required"),
        streetName: yup.string().required("Street Name is required"),
        suburb: yup.string().required("Suburb is required"),
        state: yup.string().required("State is required"),
        postCode: yup.number().required("Post code is required"),
    }),
    receiverName: yup.string().required("Receiver Name is required"),
    receiverPhone: yup.string().required("Receiver Phone is required"),
    deliverableDate: yup.date().required(),
    timeFrame: yup
        .string()
        .test("TIME INCORRECT", "The time format is incorrect", (value) => {
            var timeFrames = value?.split("-");
            return timeFrames.length === 2;
        })
        .test(
            "TIME EXCEEDED",
            "The time of end should be larger than start",
            (value) => {
                var timeFrames = value.split("-");
                var start = moment(timeFrames[0], "HH:mm");
                var end = moment(timeFrames[1], "HH:mm");
                return end.diff(start) > 0;
            }
        ),
    vehicles: yup.array().of(yup.string()).min(1),
    orderItems: yup.array().of(
        yup.object().shape({
            itemName: yup.string().required("Item Name is required field"),
            itemCharcode: yup
                .number()
                .default(
                    Math.floor(Math.random() * (999999 - 100000 + 1) + 100000)
                ),
            destination: yup.object().shape({
                unitNumber: yup.string().required("Unit Number is required"),
                streetNumber: yup
                    .string()
                    .required("Street Number is required"),
                streetName: yup.string().required("Street Name is required"),
                suburb: yup.string().required("Suburb is required"),
                state: yup.string().required("State is required"),
                postCode: yup.number().required("Post code is required"),
            }),
            itemDescription: yup.string().nullable(),
            quantity: yup
                .number()
                .positive()
                .min(1, "Quantity should be larger then 1 and least than 10")
                .max(10, "Quantity should be larger then 1 and least than 10")
                .required("Quantity is required field"),
            weight: yup
                .number()
                .positive()
                .required("Weight is required field"),
            startingRate: yup
                .number()
                .positive()
                .required("Starting Rate is required field"),
            packageType: yup
                .string()
                .required("Package Type is required field"),
            productPictures: yup
                .array()
                .of(
                    yup.object().shape({
                        file: yup.mixed().required(),
                        url: yup.string().required(),
                    })
                )
                .min(1, "Adding more pictures for product")
                .required("Adding more pictures for product")
                .test(
                    "FILE SIZE",
                    "the file collection is too large",
                    (files) => {
                        if (!files) {
                            return true;
                        }
                        return (
                            files.reduce((p, c) => c.file.size + p, 0) <=
                            2 * 1024 * 1024
                        );
                    }
                )
                .test(
                    "FILE FORMAT",
                    `the file format should be ${PERMIT_FILE_FORMATS.join()}`,
                    (files) => {
                        if (!files.length) {
                            return true;
                        }
                        return files.every((c) =>
                            PERMIT_FILE_FORMATS.includes(c.file.type)
                        );
                    }
                ),
        })
    ),
});

function OrderCreation() {
    const [authState] = useContext(AuthContext);
    const [orderState, { postOrder }] = useContext(OrderContext);
    const [phoneError, setPhoneError] = React.useState("");

    const pagination = {
        clickable: true,
        renderBullet: function (index, className) {
            return '<span class="' + className + '">' + (index + 1) + "</span>";
        },
    };

    return (
        <Formik
            initialValues={{
                senderId: authState.accountInfo?.id,
                sendingLocation: {
                    unitNumber: "",
                    streetNumber: "",
                    streetName: "",
                    suburb: "",
                    state: "",
                    postCode: "",
                },
                deliverableDate: Date.now(),
                timeFrame: "-",
                vehicles: [],
                orderItems: [
                    {
                        itemName: "",
                        itemCharCode: Math.floor(
                            Math.random() * (999999 - 100000 + 1) + 100000
                        ),
                        destination: {
                            unitNumber: "",
                            streetNumber: "",
                            streetName: "",
                            suburb: "",
                            state: "",
                            postCode: "",
                        },
                        receiverName: "",
                        receiverPhone: "",
                        itemDescription: "",
                        quantity: "",
                        weight: "",
                        startingRate: "",
                        packageType: authState?.packageTypes?.[0],
                        productPictures: [],
                    },
                ],
            }}
            validationSchema={orderSchema}
            onSubmit={(values) => {
                const handledObjects = {
                    ...values,
                    orderItems: values.orderItems.map((item) => ({
                        ...item,
                        productPictures: item.productPictures.map(
                            (item) => item?.file
                        ),
                    })),
                };

                const formData = dotnetFormDataSerialize(handledObjects, {
                    indices: true,
                    dotsForObjectNotation: true,
                });

                postOrder(formData);
            }}
        >
            {(formProps) => {
                const {
                    touched,
                    isValid,
                    errors,
                    setFieldValue,
                    handleSubmit,
                    handleChange,
                    handleBlur,
                    values,
                } = formProps;
                return (
                    <div className="p-3">
                        <Modal
                            show={orderState.loading}
                            size="lg"
                            backdrop="static"
                            keyboard={false}
                            centered
                        >
                            <Modal.Body className="text-center">
                                <Spinner className="mb-2"></Spinner>
                                <h2>Please waiting for us</h2>
                                <p>
                                    We are handling your request,{" "}
                                    <b style={{ color: "red" }}>
                                        Don't close your device
                                    </b>
                                </p>
                            </Modal.Body>
                        </Modal>
                        <Form onSubmit={handleSubmit}>
                            <div
                            // className='form-order'
                            >
                                {/* Sending location & Destination */}
                                <h3 className="my-3">Order Location</h3>

                                <Row>
                                    <Col>
                                        {/* Sending Location */}
                                        <Form.Group>
                                            <div className="mb-2">
                                                <Form.Label className="label">
                                                    Pick Up
                                                </Form.Label>
                                                <p className="asterisk">*</p>
                                            </div>
                                            <div className="pickup-post">
                                                {/* Unit Number */}
                                                <Form.Group>
                                                    <Form.Control
                                                        type="text"
                                                        name="sendingLocation.unitNumber"
                                                        placeholder="Enter Unit number (apartment, room,...)"
                                                        isInvalid={
                                                            touched
                                                                .sendingLocation
                                                                ?.unitNumber &&
                                                            !!errors
                                                                ?.sendingLocation
                                                                ?.unitNumber
                                                        }
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {
                                                            errors
                                                                ?.sendingLocation
                                                                ?.unitNumber
                                                        }
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                {/* Street Number */}
                                                <Form.Group>
                                                    <Form.Control
                                                        type="text"
                                                        name="sendingLocation.streetNumber"
                                                        placeholder="Enter street number"
                                                        isInvalid={
                                                            touched
                                                                .sendingLocation
                                                                ?.streetNumber &&
                                                            !!errors
                                                                ?.sendingLocation
                                                                ?.streetNumber
                                                        }
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {
                                                            errors
                                                                ?.sendingLocation
                                                                ?.streetNumber
                                                        }
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                {/* Street Name */}
                                                <Form.Group>
                                                    <Form.Control
                                                        type="text"
                                                        name="sendingLocation.streetName"
                                                        placeholder="Enter Street Name"
                                                        isInvalid={
                                                            touched
                                                                .sendingLocation
                                                                ?.streetName &&
                                                            !!errors
                                                                ?.sendingLocation
                                                                ?.streetName
                                                        }
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {
                                                            errors
                                                                ?.sendingLocation
                                                                ?.streetName
                                                        }
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                {/* Suburb */}
                                                <Form.Group>
                                                    <Form.Control
                                                        type="text"
                                                        name="sendingLocation.suburb"
                                                        placeholder="Enter Suburb"
                                                        isInvalid={
                                                            touched
                                                                .sendingLocation
                                                                ?.suburb &&
                                                            !!errors
                                                                ?.sendingLocation
                                                                ?.suburb
                                                        }
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {
                                                            errors
                                                                ?.sendingLocation
                                                                ?.suburb
                                                        }
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                {/* State */}
                                                <Form.Group>
                                                    <Form.Control
                                                        type="text"
                                                        name="sendingLocation.state"
                                                        placeholder="Enter state"
                                                        isInvalid={
                                                            touched
                                                                .sendingLocation
                                                                ?.state &&
                                                            !!errors
                                                                ?.sendingLocation
                                                                ?.state
                                                        }
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {
                                                            errors
                                                                ?.sendingLocation
                                                                ?.state
                                                        }
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                {/* State */}
                                                <Form.Group>
                                                    <Form.Control
                                                        type="text"
                                                        name="sendingLocation.postCode"
                                                        placeholder="Enter post code"
                                                        isInvalid={
                                                            touched
                                                                .sendingLocation
                                                                ?.postCode &&
                                                            !!errors
                                                                ?.sendingLocation
                                                                ?.postCode
                                                        }
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {
                                                            errors
                                                                ?.sendingLocation
                                                                ?.postCode
                                                        }
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </div>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                {/* Delivery Date */}
                                <h3 className="my-3">Delivery Capability</h3>
                                <Row>
                                    <Col>
                                        {/* Deliverable Date */}
                                        <Form.Group>
                                            <div className="mb-2">
                                                <Form.Label className="label">
                                                    Deliverable Date
                                                </Form.Label>
                                                <p className="asterisk">*</p>
                                            </div>
                                            <Form.Control
                                                type="date"
                                                name="deliverableDate"
                                                placeholder="Enter deliverable date"
                                                isInvalid={
                                                    touched.deliverableDate &&
                                                    !!errors?.deliverableDate
                                                }
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors?.deliverableDate}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        {/* Time Frame */}
                                        <Form.Group>
                                            <div className="mb-2">
                                                <Form.Label className="label">
                                                    Time Frame From
                                                </Form.Label>
                                                <p className="asterisk">*</p>
                                            </div>
                                            <Form.Control
                                                type="time"
                                                name="timeFrame"
                                                placeholder="Enter time frame start"
                                                isInvalid={
                                                    touched?.timeFrame &&
                                                    !!errors?.timeFrame
                                                }
                                                onChange={(e) => {
                                                    var timeFrames =
                                                        values[
                                                            e.target.name
                                                        ].split("-");

                                                    timeFrames[0] =
                                                        e.target.value;
                                                    setFieldValue(
                                                        e.target.name,
                                                        timeFrames.join("-"),
                                                        true
                                                    );
                                                }}
                                                onBlur={handleBlur}
                                            />
                                            <div className="mb-2">
                                                <Form.Label className="label">
                                                    Time Frame To
                                                </Form.Label>
                                                <p className="asterisk">*</p>
                                            </div>
                                            <Form.Control
                                                type="time"
                                                name="timeFrame"
                                                placeholder="Enter time frame end"
                                                isInvalid={
                                                    touched.timeFrame &&
                                                    !!errors?.timeFrame
                                                }
                                                onChange={(e) => {
                                                    var timeFrames =
                                                        values[
                                                            e.target.name
                                                        ].split("-");

                                                    timeFrames[1] =
                                                        e.target.value;
                                                    setFieldValue(
                                                        e.target.name,
                                                        timeFrames.join("-"),
                                                        true
                                                    );
                                                }}
                                                onBlur={handleBlur}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors?.timeFrame}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* OrderItems */}
                                <h3 className="my-3">Item Information</h3>

                                <FieldArray
                                    name="orderItems"
                                    render={(arrayHelpers) => {
                                        return (
                                            <>
                                                <Swiper
                                                    pagination={pagination}
                                                    modules={[Pagination]}
                                                >
                                                    {values.orderItems.map(
                                                        (item, index) => {
                                                            return (
                                                                <SwiperSlide>
                                                                    <ItemCreation
                                                                        key={
                                                                            index
                                                                        }
                                                                        index={
                                                                            index
                                                                        }
                                                                        name={`orderItems[${index}]`}
                                                                        phoneError={
                                                                            phoneError
                                                                        }
                                                                        setPhoneError={
                                                                            setPhoneError
                                                                        }
                                                                        {...formProps}
                                                                    ></ItemCreation>
                                                                    {values
                                                                        .orderItems
                                                                        .length >
                                                                        1 && (
                                                                        <Button
                                                                            onClick={() =>
                                                                                arrayHelpers.remove(
                                                                                    index
                                                                                )
                                                                            }
                                                                        >
                                                                            Remove
                                                                        </Button>
                                                                    )}
                                                                </SwiperSlide>
                                                            );
                                                        }
                                                    )}
                                                </Swiper>
                                                <Button
                                                    onClick={() =>
                                                        arrayHelpers.push(
                                                            values.orderItems?.[
                                                                values
                                                                    .orderItems
                                                                    .length - 1
                                                            ]
                                                        )
                                                    }
                                                >
                                                    Push
                                                </Button>
                                            </>
                                        );
                                    }}
                                />

                                <Button
                                    type="submit"
                                    variant="warning"
                                    disabled={!isValid || !!phoneError}
                                    className="my-btn-yellow"
                                >
                                    Search for driver
                                </Button>
                            </div>
                        </Form>
                    </div>
                );
            }}
        </Formik>
    );
}

export default function Index() {
    return <OrderCreation></OrderCreation>;
}
