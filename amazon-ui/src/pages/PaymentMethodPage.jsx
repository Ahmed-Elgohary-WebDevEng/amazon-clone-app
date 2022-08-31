import React, {useContext, useEffect, useState} from 'react';
import CheckoutSteps from "../components/UI/CheckoutSteps";
import {Helmet} from "react-helmet-async";
import {Button, Form} from "react-bootstrap";
import {Store} from "../store/Store";
import {useNavigate} from "react-router-dom";

function PaymentMethodPage(props) {
  // Get the context store
  const {state, dispatch: ctxDispatch} = useContext(Store)
  const { cart: {shippingAddress, paymentMethod}} = state

  const [paymentMethodName, setPaymentMethod] = useState(paymentMethod || 'PayPal')

  const navigate = useNavigate()

  useEffect(() => {
    if (!shippingAddress.address)
      navigate('/shipping')
  }, [shippingAddress, navigate])
  function submitHandler(event) {
    event.preventDefault()
    // Store payment method
    ctxDispatch({
      type: 'SAVE_PAYMENT_METHOD',
      payload: paymentMethodName
    })
    // store payment method in local storage
    localStorage.setItem('paymentMethod', paymentMethodName)
    // redirect user to place Order
    navigate('/placeorder')
  }

  return (
      <div>
        <CheckoutSteps step1 step2 step3/>
        <div className="container small-container">
          <Helmet>
            <title>Payment Method</title>
          </Helmet>
          <h1>Payment Method</h1>
          <Form onSubmit={submitHandler}>
            <div className="mb-3">

              <Form.Check
                  type="radio"
                  id="PayPal"
                  label="PayPal"
                  value="PayPal"
                  checked={paymentMethodName === 'PayPal'}
                  onChange={event => setPaymentMethod(event.target.value)}
              />
            </div>
            <div className="mb-3">
              <Form.Check
                  type="radio"
                  id="Stripe"
                  label="Stripe"
                  value="Stripe"
                  checked={paymentMethodName === 'Stripe'}
                  onChange={event => setPaymentMethod(event.target.value)}
              />
            </div>
            <Button type="submit">Continue</Button>
          </Form>
        </div>
      </div>
  );
}

export default PaymentMethodPage;