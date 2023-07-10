import { FieldArray } from 'formik';
import Form from 'react-bootstrap/Form';
import React, { useContext, useRef } from 'react';
import { Button, Col, InputGroup, Row } from 'react-bootstrap';
import { AuthContext } from '../../../stores';
import '../style/createProduct.css';
import PhoneInput from 'react-phone-input-2';
import Barcode from 'react-barcode';
import { RiImageEditFill } from 'react-icons/ri';
import { TiEdit } from 'react-icons/ti';
import { BsPlusSquareFill, BsTrash2Fill } from 'react-icons/bs';
import { AiFillMinusSquare } from 'react-icons/ai';
import { MdContentCopy } from 'react-icons/md';
import { toast } from 'react-toastify';

export default function ItemCreation({
    name,
    index,
    touched,
    errors,
    values,
    setFieldValue,
    handleChange,
    handleBlur,
    itemName,
    setParentPhoneError,
    onEditReceiver,
    onAddItem,
    onDeleteItem,
}) {
    const product_img_ipt = useRef();
    const [phoneError, setPhoneError] = React.useState('');
    const [authState] = useContext(AuthContext);
    const receiverIndex = values.orderItems?.[index].receiverIndex;
    const receiverValue = values.receivers?.[receiverIndex];
    const receiverError = errors.receivers?.[receiverIndex];
    const receiverTouch = touched.receivers?.[receiverIndex];

    return (
        <div className="p-2">
            <Row className="my-xl-3" style={{ userSelect: 'none' }}>
                <Col>{itemName ? <h5>{itemName}</h5> : <h5>Item {index + 1}</h5>}</Col>
                <Col className="text-end" style={{ lineHeight: 1 }}>
                    <span className="text-success" style={{ fontSize: '1.5rem' }} onClick={() => onAddItem()}>
                        <BsPlusSquareFill></BsPlusSquareFill>
                    </span>
                    {values.orderItems.filter((p) => p.receiverIndex === receiverIndex).length > 1 && (
                        <span
                            className="text-danger ms-3"
                            style={{ fontSize: '1.85rem' }}
                            onClick={() => onDeleteItem()}
                        >
                            <AiFillMinusSquare></AiFillMinusSquare>
                        </span>
                    )}
                </Col>
            </Row>

            <Form.Group>
                {/* Item Name  */}
                <Form.Group className="mb-3">
                    <div className="mb-2">
                        <Form.Label className="label">Item Name</Form.Label>
                        <p className="asterisk">*</p>
                    </div>
                    <Form.Control
                        type="text"
                        name={`${name}.itemName`}
                        value={values.orderItems?.[index]?.itemName}
                        placeholder="Enter Product Name"
                        isInvalid={touched.orderItems?.[index]?.itemName && errors.orderItems?.[index]?.itemName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    <Form.Control.Feedback type="invalid">{errors.orderItems?.[index]?.itemName}</Form.Control.Feedback>
                </Form.Group>
                {/* Item BarCode  */}
                <Form.Group className="mb-3">
                    <div className="mb-2">
                        <Form.Label className="label">Barcode</Form.Label>
                        <p className="asterisk">*</p>
                    </div>

                    <p
                        onClick={() => {
                            const charcode = values?.orderItems?.[index]?.itemCharcode?.toString();
                            navigator.clipboard.writeText(charcode);
                            toast.success('Clipboard has added');
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        {values?.orderItems?.[index]?.itemCharcode?.toString()}{' '}
                        <span>
                            <MdContentCopy></MdContentCopy>
                        </span>
                    </p>

                    <div className="text-danger" style={{ fontStyle: 'italic' }}>
                        <b>*Please send this barcode to receiver before receiving the delivery</b>
                    </div>
                    {/* <Barcode value={values?.orderItems?.[index]?.itemCharcode?.toString()}></Barcode> */}
                </Form.Group>
                {/* Item Description  */}
                <Form.Group className="mb-3">
                    <div className="mb-2">
                        <Form.Label className="label">Product Description</Form.Label>
                        <p className="asterisk">*</p>
                    </div>
                    <Form.Control
                        as="textarea"
                        row="3"
                        placeholder="Enter Product Description"
                        name={`${name}.itemDescription`}
                        value={values.orderItems?.[index]?.itemDescription}
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
            </Form.Group>

            <Form.Group style={{ borderBottom: '1px solid #c1c1c1' }}>
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
                                value={values?.orderItems?.[index]?.quantity}
                                isInvalid={
                                    touched?.orderItems?.[index]?.quantity && !!errors?.orderItems?.[index]?.quantity
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
                                    value={values?.orderItems?.[index]?.weight}
                                    isInvalid={
                                        touched?.orderItems?.[index]?.weight && !!errors?.orderItems?.[index]?.weight
                                    }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    aria-describedby="weight"
                                />
                                <InputGroup.Text id="weight">Kilogram</InputGroup.Text>
                                <Form.Control.Feedback type="invalid">
                                    {errors?.orderItems?.[index]?.weight}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                </Row>
                {/* Product Pictures & Shipping Rate & PackageType & Vehicles*/}
                <Row>
                    {/* Shipping Rate & Package Type & Vehicles */}
                    <Col sm="12">
                        {/* Package Type */}
                        <Form.Group className="mb-3">
                            <div className="mb-2">
                                <Form.Label className="label">Package Type</Form.Label>
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
                                defaultValue={values?.['orderItems']?.[index]?.packageType}
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
                    {/* Product pictures */}
                    <Col sm="12">
                        <Form.Group className="mb-3">
                            <div className="mb-2">
                                <Form.Label className="label">Product Images</Form.Label>
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
                                                    isInvalid={!!errors?.orderItems?.[index]?.productPictures}
                                                    onChange={(e) => {
                                                        const files = e.target.files;
                                                        for (var i = 0; i < files.length; i++) {
                                                            //for multiple files
                                                            (function (file) {
                                                                const fileReader = new FileReader();
                                                                fileReader.onload = function (e) {
                                                                    // get file content
                                                                    fileReader.addEventListener('loadend', (e) => {
                                                                        arrayHelpers.push({
                                                                            file,
                                                                            url: fileReader.result,
                                                                        });
                                                                    });
                                                                };
                                                                fileReader.readAsDataURL(file);
                                                            })(files[i]);
                                                        }
                                                    }}
                                                    accept="img"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors?.orderItems?.[index]?.productPictures}
                                                </Form.Control.Feedback>
                                                <Row
                                                    style={{
                                                        flexDirection: 'column',
                                                    }}
                                                >
                                                    {values?.orderItems?.[index]?.productPictures?.map?.(
                                                        (picture, ind) => {
                                                            return (
                                                                <Col key={ind}>
                                                                    <div className="img-front-frame">
                                                                        {picture?.url ? (
                                                                            <></>
                                                                        ) : (
                                                                            <div className="background-front">
                                                                                <RiImageEditFill
                                                                                    style={{
                                                                                        position: 'relative',
                                                                                        color: 'gray',
                                                                                        fontSize: '50px',
                                                                                        opacity: '70%',
                                                                                    }}
                                                                                ></RiImageEditFill>
                                                                                <p className="driving-txt">
                                                                                    Change Product Images
                                                                                </p>
                                                                            </div>
                                                                        )}
                                                                        <img
                                                                            className="img-front"
                                                                            src={
                                                                                picture?.url ||
                                                                                'https://tinyurl.com/5ehpcctt'
                                                                            }
                                                                        />
                                                                    </div>
                                                                    <Button
                                                                        variant="danger"
                                                                        onClick={() => arrayHelpers.remove(ind)}
                                                                    >
                                                                        Remove
                                                                    </Button>
                                                                    {
                                                                        errors?.orderItems?.[index]?.productPictures?.[
                                                                            ind
                                                                        ]?.file
                                                                    }
                                                                </Col>
                                                            );
                                                        },
                                                    )}
                                                    <Col>
                                                        <div
                                                            className="img-front-frame"
                                                            onClick={() => product_img_ipt.current.click()}
                                                        >
                                                            <div className="background-front">
                                                                <RiImageEditFill
                                                                    style={{
                                                                        position: 'relative',
                                                                        color: 'gray',
                                                                        fontSize: '50px',
                                                                        opacity: '70%',
                                                                    }}
                                                                ></RiImageEditFill>
                                                                <p className="driving-txt">Change Product Images</p>
                                                            </div>
                                                            <img
                                                                className="img-front"
                                                                src={'https://tinyurl.com/5ehpcctt'}
                                                            />
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Form.Control
                                                    type="file"
                                                    id="driver_image_back"
                                                    ref={product_img_ipt}
                                                    multiple
                                                    isInvalid={!!errors?.productPictures}
                                                    onChange={(e) => {
                                                        const files = e.target.files;
                                                        for (var i = 0; i < files.length; i++) {
                                                            //for multiple files
                                                            (function (file) {
                                                                const fileReader = new FileReader();
                                                                fileReader.onload = function (e) {
                                                                    // get file content
                                                                    fileReader.addEventListener('loadend', (e) => {
                                                                        arrayHelpers.push({
                                                                            file,
                                                                            url: fileReader.result,
                                                                        });
                                                                    });
                                                                };
                                                                fileReader.readAsDataURL(file);
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
                </Row>
            </Form.Group>

            {/* Receiver Information */}
            <Form.Group className="mb-4">
                {/* Receiver Information */}
                <Row className="justify-content-between">
                    <Col sm="6">
                        <h5 className="my-3">Receiver Information</h5>
                    </Col>
                    <Col sm="6" md="6" className="text-end">
                        <h5 className="" style={{ cursor: 'pointer' }} onClick={() => onEditReceiver(receiverIndex)}>
                            {receiverError && (
                                <b className="text-end text-danger" style={{ display: 'block', fontSize: '0.8rem' }}>
                                    Fill and edit receiver information here
                                </b>
                            )}{' '}
                            <TiEdit></TiEdit>
                        </h5>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group className="mb-2">
                            <div className="mb-2">
                                <Form.Label className="label">Receiver Name</Form.Label>
                                <p className="asterisk">*</p>
                            </div>
                            <Form.Control
                                type="text"
                                placeholder="Enter Receiver Name"
                                value={receiverValue?.receiverName}
                                isInvalid={receiverTouch?.receiverName && !!receiverError?.receiverName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                readOnly
                            />
                            <Form.Control.Feedback type="invalid">{receiverError?.receiverName}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col>
                        {/* Phone */}
                        <Form.Group>
                            <div className="mb-2">
                                <Form.Label className="label">Phone Number</Form.Label>

                                <p className="asterisk">*</p>
                            </div>
                            <PhoneInput
                                country={'au'}
                                value={receiverValue?.receiverPhone}
                                containerClass="w-100"
                                inputClass="w-100"
                                onChange={(phone) => setFieldValue(`${name}.receiverPhone`, phone)}
                                onlyCountries={['au', 'vn']}
                                preferredCountries={['au']}
                                placeholder="Enter Receiver Phone number"
                                autoFormat={true}
                                disabled
                                isValid={(inputNumber, _, countries) => {
                                    const isValid = countries.some((country) => {
                                        return (
                                            inputNumber.startsWith(country.dialCode) ||
                                            country.dialCode.startsWith(inputNumber)
                                        );
                                    });

                                    setPhoneError('');
                                    setParentPhoneError('');

                                    if (!isValid) {
                                        setPhoneError('Your phone is not match with dial code');
                                        setParentPhoneError('Phone number is invalid');
                                    }

                                    return isValid;
                                }}
                            ></PhoneInput>
                            <Form.Control
                                type="hidden"
                                name={`${name}.receiverPhone`}
                                defaultValue={values.orderItems?.[index]?.phone}
                                isInvalid={!!errors.orderItems?.[index]?.phone || !!phoneError}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.orderItems?.[index]?.phone || phoneError}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
            </Form.Group>
            {/* Destination */}
            <Form.Group className="mb-4">
                <div className="mb-2">
                    <Form.Label className="label">Destination</Form.Label>
                    <p className="asterisk">*</p>
                </div>
                <div className="pickup-post">
                    {/* Unit Number */}
                    <Form.Group>
                        <Form.Control
                            type="text"
                            placeholder="Enter Unit number (apartment, room,...)"
                            value={receiverValue?.destination?.unitNumber}
                            isInvalid={
                                receiverTouch?.destination?.unitNumber && !!receiverError?.destination?.unitNumber
                            }
                            readOnly
                        />
                        <Form.Control.Feedback type="invalid">
                            {receiverError?.destination?.unitNumber}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Street Number */}
                    <Form.Group>
                        <Form.Control
                            type="text"
                            value={receiverValue?.destination?.streetNumber}
                            placeholder="Enter street number"
                            isInvalid={
                                receiverTouch?.destination?.streetNumber && !!receiverError?.destination?.streetNumber
                            }
                            readOnly
                        />
                        <Form.Control.Feedback type="invalid">
                            {receiverError?.destination?.streetNumber}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Street Name */}
                    <Form.Group>
                        <Form.Control
                            type="text"
                            placeholder="Enter Street Name"
                            value={receiverValue?.destination?.streetName}
                            isInvalid={
                                receiverTouch?.destination?.streetName && !!receiverError?.destination?.streetName
                            }
                            readOnly
                        />
                        <Form.Control.Feedback type="invalid">
                            {receiverError?.destination?.streetName}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Suburb */}
                    <Form.Group>
                        <Form.Control
                            type="text"
                            placeholder="Enter Suburb"
                            value={receiverValue?.destination?.suburb}
                            isInvalid={receiverTouch?.destination?.suburb && !!receiverError?.destination?.suburb}
                            readOnly
                        />
                        <Form.Control.Feedback type="invalid">
                            {receiverError?.destination?.suburb}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* State */}
                    <Form.Group>
                        <Form.Control
                            type="text"
                            placeholder="Enter state"
                            value={receiverValue?.destination?.state}
                            isInvalid={receiverTouch?.destination?.state && !!receiverError?.destination?.state}
                            readOnly
                        />
                        <Form.Control.Feedback type="invalid">
                            {receiverError?.destination?.state}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Postcode */}
                    <Form.Group>
                        <Form.Control
                            type="text"
                            placeholder="Enter post code"
                            value={receiverValue?.destination?.postCode}
                            isInvalid={receiverTouch?.destination?.postCode && !!receiverError?.destination?.postCode}
                            readOnly
                        />
                        <Form.Control.Feedback type="invalid">
                            {receiverError?.destination?.postCode}
                        </Form.Control.Feedback>
                    </Form.Group>
                </div>
            </Form.Group>
        </div>
    );
}
