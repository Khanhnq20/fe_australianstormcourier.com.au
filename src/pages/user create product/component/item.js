import { FieldArray } from "formik";
import Form from "react-bootstrap/Form";
import React, { useContext, useRef } from "react";
import { Button, Col, InputGroup, Row } from "react-bootstrap";
import { AuthContext } from "../../../stores";
import "../style/createProduct.css";
import PhoneInput from "react-phone-input-2";
import Barcode from "react-barcode";
import { RiImageEditFill } from "react-icons/ri";

export default function ItemCreation({
    name,
    index,
    touched,
    errors,
    values,
    setFieldValue,
    setPhoneError,
    phoneError,
    handleChange,
    handleBlur,
    isValid,
}) {
    const product_img_ipt = useRef();
    const [authState] = useContext(AuthContext);

    return (
        <div>
            <Form.Group className="mb-4">
                {/* Receiver Information */}
                <h5 className="my-3" style={{ userSelect: "none" }}>
                    Item {index + 1}
                </h5>
                <Row>
                    <Col>
                        <Form.Group>
                            <div className="mb-2">
                                <Form.Label className="label">
                                    Receiver Name
                                </Form.Label>
                                <p className="asterisk">*</p>
                            </div>
                            <Form.Control
                                type="text"
                                name="receiverName"
                                placeholder="Enter Receiver Name"
                                isInvalid={
                                    touched?.receiverName &&
                                    !!errors?.receiverName
                                }
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors?.receiverName}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col>
                        {/* Phone */}
                        <Form.Group>
                            <div className="mb-2">
                                <Form.Label className="label">
                                    Phone Number
                                </Form.Label>
                                <p className="asterisk">*</p>
                            </div>
                            <PhoneInput
                                country={"au"}
                                value={values?.phone}
                                containerClass="w-100"
                                inputClass="w-100"
                                onChange={(phone) =>
                                    setFieldValue("receiverPhone", phone)
                                }
                                onlyCountries={["au", "vn"]}
                                preferredCountries={["au"]}
                                placeholder="Enter Receiver Phone number"
                                autoFormat={true}
                                isValid={(inputNumber, _, countries) => {
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
                                name="receiverPhone"
                                defaultValue={values?.phone}
                                isInvalid={!!errors.phone || !!phoneError}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.phone || phoneError}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
            </Form.Group>
            <Form.Group className="mb-4">
                <div>
                    {/* Destination */}
                    <Form.Group>
                        <div className="mb-2">
                            <Form.Label className="label">
                                Destination
                            </Form.Label>
                            <p className="asterisk">*</p>
                        </div>
                        <div className="pickup-post">
                            {/* Unit Number */}
                            <Form.Group>
                                <Form.Control
                                    type="text"
                                    name={`${name}.destination.unitNumber`}
                                    placeholder="Enter Unit number (apartment, room,...)"
                                    isInvalid={
                                        touched.destination?.unitNumber &&
                                        !!errors?.destination?.unitNumber
                                    }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors?.destination?.unitNumber}
                                </Form.Control.Feedback>
                            </Form.Group>

                            {/* Street Number */}
                            <Form.Group>
                                <Form.Control
                                    type="text"
                                    name="destination.streetNumber"
                                    placeholder="Enter street number"
                                    isInvalid={
                                        touched.destination?.streetNumber &&
                                        !!errors?.destination?.streetNumber
                                    }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors?.destination?.streetNumber}
                                </Form.Control.Feedback>
                            </Form.Group>

                            {/* Street Name */}
                            <Form.Group>
                                <Form.Control
                                    type="text"
                                    name="destination.streetName"
                                    placeholder="Enter Street Name"
                                    isInvalid={
                                        touched.destination?.streetName &&
                                        !!errors?.destination?.streetName
                                    }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors?.destination?.streetName}
                                </Form.Control.Feedback>
                            </Form.Group>

                            {/* Suburb */}
                            <Form.Group>
                                <Form.Control
                                    type="text"
                                    name="destination.suburb"
                                    placeholder="Enter Suburb"
                                    isInvalid={
                                        touched.destination?.suburb &&
                                        !!errors?.destination?.suburb
                                    }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors?.destination?.suburb}
                                </Form.Control.Feedback>
                            </Form.Group>

                            {/* State */}
                            <Form.Group>
                                <Form.Control
                                    type="text"
                                    name="destination.state"
                                    placeholder="Enter state"
                                    isInvalid={
                                        touched.destination?.state &&
                                        !!errors?.destination?.state
                                    }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors?.destination?.state}
                                </Form.Control.Feedback>
                            </Form.Group>

                            {/* State */}
                            <Form.Group>
                                <Form.Control
                                    type="text"
                                    name="destination.postCode"
                                    placeholder="Enter post code"
                                    isInvalid={
                                        touched.destination?.postCode &&
                                        !!errors?.destination?.postCode
                                    }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors?.destination?.postCode}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </div>
                    </Form.Group>
                </div>
            </Form.Group>
            {/* Item Name  */}
            <Form.Group className="mb-3">
                <div className="mb-2">
                    <Form.Label className="label">Item Name</Form.Label>
                    <p className="asterisk">*</p>
                </div>
                <Form.Control
                    type="text"
                    name={`${name}.itemName`}
                    placeholder="Enter Product Name"
                    isInvalid={
                        touched.orderItems?.[index]?.itemName &&
                        errors.orderItems?.[index]?.itemName
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.orderItems?.[index]?.itemName}
                </Form.Control.Feedback>
            </Form.Group>
            {/* Item BarCode  */}
            <Form.Group className="mb-3">
                <div className="mb-2">
                    <Form.Label className="label">Barcode</Form.Label>
                    <p className="asterisk">*</p>
                </div>
                <Barcode
                    value={values.orderItems[index].itemCharCode.toString()}
                ></Barcode>
            </Form.Group>
            {/* Item Description  */}
            <Form.Group className="mb-3">
                <div className="mb-2">
                    <Form.Label className="label">
                        Product Description
                    </Form.Label>
                    <p className="asterisk">*</p>
                </div>
                <Form.Control
                    as="textarea"
                    row="3"
                    placeholder="Enter Product Description"
                    name={`${name}.itemDescription`}
                    isInvalid={
                        touched.orderItems?.[index]?.itemDescription &&
                        !!errors.orderItems?.[index]?.itemDescription
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                <Form.Control.Feedback type="invalid">
                    {errors?.orderItems?.[index]?.itemDescription}
                </Form.Control.Feedback>
            </Form.Group>
            {/* Quantity and Weight */}
            <Row>
                <Col>
                    {/* Quantity  */}
                    <Form.Group className="mb-3">
                        <div className="mb-2">
                            <Form.Label className="label">Quantity</Form.Label>
                            <p className="asterisk">*</p>
                        </div>
                        <Form.Control
                            type="number"
                            className="product-form-input"
                            min={0}
                            max={10}
                            name={`${name}.quantity`}
                            placeholder="Enter Quantity"
                            isInvalid={
                                touched?.orderItems?.[index]?.quantity &&
                                !!errors?.orderItems?.[index]?.quantity
                            }
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors?.orderItems?.[index]?.quantity}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    {/* Weight  */}
                    <Form.Group className="mb-3">
                        <div className="mb-2">
                            <Form.Label className="label">Weight</Form.Label>
                            <p className="asterisk">*</p>
                        </div>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                name={`${name}.weight`}
                                placeholder="Enter item weight"
                                isInvalid={
                                    touched?.orderItems?.[index]?.weight &&
                                    !!errors?.orderItems?.[index]?.weight
                                }
                                onChange={handleChange}
                                onBlur={handleBlur}
                                aria-describedby="weight"
                            />
                            <InputGroup.Text id="weight">
                                Kilogram
                            </InputGroup.Text>
                            <Form.Control.Feedback type="invalid">
                                {errors?.orderItems?.[index]?.weight}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                </Col>
            </Row>
            {/* Product Pictures & Shipping Rate & PackageType & Vehicles*/}
            <Row>
                {/* Product pictures */}
                <Col sm="12" lg="6">
                    <Form.Group className="mb-3">
                        <div className="mb-2">
                            <Form.Label className="label">
                                Product Images
                            </Form.Label>
                            <p className="asterisk">*</p>
                        </div>
                        <div className="back-up">
                            <FieldArray
                                name={`${name}.productPictures`}
                                render={(arrayHelpers) => {
                                    return (
                                        <>
                                            <Form.Control
                                                type="file"
                                                id="driver_image_back"
                                                ref={product_img_ipt}
                                                multiple
                                                isInvalid={
                                                    !!errors?.orderItems?.[
                                                        index
                                                    ]?.productPictures
                                                }
                                                onChange={(e) => {
                                                    const files =
                                                        e.target.files;
                                                    for (
                                                        var i = 0;
                                                        i < files.length;
                                                        i++
                                                    ) {
                                                        //for multiple files
                                                        (function (file) {
                                                            const fileReader =
                                                                new FileReader();
                                                            fileReader.onload =
                                                                function (e) {
                                                                    // get file content
                                                                    fileReader.addEventListener(
                                                                        "loadend",
                                                                        (e) => {
                                                                            arrayHelpers.push(
                                                                                {
                                                                                    file,
                                                                                    url: fileReader.result,
                                                                                }
                                                                            );
                                                                        }
                                                                    );
                                                                };
                                                            fileReader.readAsDataURL(
                                                                file
                                                            );
                                                        })(files[i]);
                                                    }
                                                }}
                                                accept="img"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {
                                                    errors?.orderItems?.[index]
                                                        ?.productPictures
                                                }
                                            </Form.Control.Feedback>
                                            <Row
                                                style={{
                                                    flexDirection: "column",
                                                }}
                                            >
                                                {values?.orderItems?.[
                                                    index
                                                ]?.productPictures?.map?.(
                                                    (picture, ind) => {
                                                        return (
                                                            <Col key={ind}>
                                                                <div className="img-front-frame">
                                                                    <div className="background-front">
                                                                        <RiImageEditFill
                                                                            style={{
                                                                                position:
                                                                                    "relative",
                                                                                color: "gray",
                                                                                fontSize:
                                                                                    "50px",
                                                                                opacity:
                                                                                    "70%",
                                                                            }}
                                                                        ></RiImageEditFill>
                                                                        <p className="driving-txt">
                                                                            Change
                                                                            Product
                                                                            Images
                                                                        </p>
                                                                    </div>
                                                                    <img
                                                                        className="img-front"
                                                                        src={
                                                                            picture?.url ||
                                                                            "https://tinyurl.com/5ehpcctt"
                                                                        }
                                                                    />
                                                                </div>
                                                                <Button
                                                                    variant="danger"
                                                                    onClick={() =>
                                                                        arrayHelpers.remove(
                                                                            ind
                                                                        )
                                                                    }
                                                                >
                                                                    Remove
                                                                </Button>
                                                                {
                                                                    errors
                                                                        ?.orderItems?.[
                                                                        index
                                                                    ]
                                                                        ?.productPictures?.[
                                                                        ind
                                                                    ]?.file
                                                                }
                                                            </Col>
                                                        );
                                                    }
                                                )}
                                                <Col>
                                                    <div
                                                        className="img-front-frame"
                                                        onClick={() =>
                                                            product_img_ipt.current.click()
                                                        }
                                                    >
                                                        <div className="background-front">
                                                            <RiImageEditFill
                                                                style={{
                                                                    position:
                                                                        "relative",
                                                                    color: "gray",
                                                                    fontSize:
                                                                        "50px",
                                                                    opacity:
                                                                        "70%",
                                                                }}
                                                            ></RiImageEditFill>
                                                            <p className="driving-txt">
                                                                Change Product
                                                                Images
                                                            </p>
                                                        </div>
                                                        <img
                                                            className="img-front"
                                                            src={
                                                                "https://tinyurl.com/5ehpcctt"
                                                            }
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Form.Control
                                                type="file"
                                                id="driver_image_back"
                                                ref={product_img_ipt}
                                                multiple
                                                isInvalid={
                                                    !!errors?.productPictures
                                                }
                                                onChange={(e) => {
                                                    const files =
                                                        e.target.files;
                                                    for (
                                                        var i = 0;
                                                        i < files.length;
                                                        i++
                                                    ) {
                                                        //for multiple files
                                                        (function (file) {
                                                            const fileReader =
                                                                new FileReader();
                                                            fileReader.onload =
                                                                function (e) {
                                                                    // get file content
                                                                    fileReader.addEventListener(
                                                                        "loadend",
                                                                        (e) => {
                                                                            arrayHelpers.push(
                                                                                {
                                                                                    file,
                                                                                    url: fileReader.result,
                                                                                }
                                                                            );
                                                                        }
                                                                    );
                                                                };
                                                            fileReader.readAsDataURL(
                                                                file
                                                            );
                                                        })(files[i]);
                                                    }
                                                }}
                                                accept="img"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors?.productPictures}
                                            </Form.Control.Feedback>
                                        </>
                                    );
                                }}
                            />
                        </div>
                    </Form.Group>
                </Col>

                {/* Shipping Rate & Package Type & Vehicles */}
                <Col sm="12" lg="6">
                    {/* Start shipping rate */}
                    <Form.Group className="mb-3">
                        <div className="mb-2">
                            <Form.Label className="label">
                                Your preference rate
                            </Form.Label>
                            <p className="asterisk">*</p>
                        </div>
                        <Form.Control
                            type="number"
                            name={`${name}.startingRate`}
                            placeholder="Enter your shipping rate"
                            value={values?.orderItems?.[index]?.startingRate}
                            isInvalid={
                                touched?.orderItems?.[index]?.startingRate &&
                                !!errors?.orderItems?.[index]?.startingRate
                            }
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors?.orderItems?.[index]?.startingRate}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Vehicles */}
                    <Form.Group className="form-group">
                        <div className="mb-2">
                            <Form.Label className="label">Vehicles</Form.Label>
                            <p className="asterisk">*</p>
                        </div>
                        <div className="list-vehicle">
                            {authState.vehicles.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <label className="fr-checkbox mb-2">
                                            <input
                                                type="checkbox"
                                                name="vehicles"
                                                value={item?.id}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            <span className="checkmark"></span>
                                            <span
                                                className="txt-checkbox"
                                                style={{ fontWeight: "500" }}
                                            >
                                                {item?.name}
                                            </span>
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                        <p className="content-red mt-2">{errors?.vehicles}</p>
                    </Form.Group>

                    {/* Package Type */}
                    <Form.Group className="mb-3">
                        <div className="mb-2">
                            <Form.Label className="label">
                                Package Type
                            </Form.Label>
                            <p className="asterisk">*</p>
                        </div>

                        <Form.Select
                            type="string"
                            name={`${name}.packageType`}
                            placeholder="Select your type of package"
                            isInvalid={
                                touched?.orderItems?.[index]?.packageType &&
                                !!errors?.orderItems?.[index]?.packageType
                            }
                            onChange={handleChange}
                            onBlur={handleBlur}
                            defaultValue={
                                values?.["orderItems"]?.[index]?.packageType
                            }
                        >
                            {authState?.packageTypes?.map((type, index) => {
                                return (
                                    <option key={index} value={type}>
                                        {type}
                                    </option>
                                );
                            })}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors?.orderItems?.[index]?.packageType}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
        </div>
    );
}
