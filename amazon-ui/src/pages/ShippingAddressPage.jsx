import React, {useContext, useEffect, useState} from 'react';
import {Helmet} from "react-helmet-async";
import {Button, Form} from "react-bootstrap";
import {Store} from "../store/Store";
import {useNavigate} from "react-router-dom";
import CheckoutSteps from "../components/UI/CheckoutSteps";

function ShippingAddressPage(props) {
  // use navigation from react-dom
  const navigate = useNavigate();

  // Get the React context store
  const {state, dispatch: ctxDispatch} = useContext(Store)
  const { userInfo, cart: {shippingAddress}} = state

  // input State
  const [fullName, setFullName] = useState(shippingAddress.fullName || '')
  const [address, setAddress] = useState(shippingAddress.address || '')
  const [city, setCity] = useState(shippingAddress.city || '')
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '')
  const [country, setCountry] = useState(shippingAddress.country || '')

  useEffect(() => {
    if (!userInfo)
      navigate('/signin')
  }, [userInfo, navigate])

  function submitHandler(event) {
    event.preventDefault()
    // 1- Store The input data to context store
    ctxDispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: {
        fullName,
        address,
        city,
        postalCode,
        country
      }
    })
    // 2- store the data into local storage
    localStorage.setItem('shippingAddress', JSON.stringify({fullName, address, city, postalCode, country}))
    // 3- Navigate user to payment page
    navigate('/payment')
  }

  return (
      <div>
        <Helmet>
          <title>Shipping Address</title>
        </Helmet>
        <CheckoutSteps step1 step2 />
        <div className="container small-container">
          <h1 className="mt-3">Shipping Address</h1>
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="fullName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                  value={fullName}
                  onChange={event => setFullName(event.target.value)}
                  required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
                  value={address}
                  onChange={event => setAddress(event.target.value)}
                  required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="city">
              <Form.Label>City</Form.Label>
              <Form.Control
                  value={city}
                  onChange={event => setCity(event.target.value)}
                  required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="postalCode">
              <Form.Label>Postal Code</Form.Label>
              <Form.Control
                  value={postalCode}
                  onChange={event => setPostalCode(event.target.value)}
                  required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="country">
              <Form.Label>Country</Form.Label>
              <Form.Control
                  value={country}
                  onChange={event => setCountry(event.target.value)}
                  required
              />
            </Form.Group>
            <div className="mb-3">
              <Button variant="primary" type="submit">Continue</Button>
            </div>

          </Form>
        </div>
      </div>
  );
}

export default ShippingAddressPage;