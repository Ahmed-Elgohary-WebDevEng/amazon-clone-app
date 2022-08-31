import React, {useContext} from 'react';
import {Store} from "../store/Store";
import {Helmet} from "react-helmet-async";
import {Button, Card, Col, ListGroup, Row} from "react-bootstrap";
import MessageBox from "../components/UI/MessageBox";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

function CartPage() {
  /* Configure Context in cart page */
  const {state, dispatch: ctxDispatch} = useContext(Store)
  /*Get the cart item data*/
  const {cart: {cartItems}} = state
  const navigate = useNavigate()

  /* Update Cart Function */
  async function updateCartHandler(item, quantity) {
    const {data} = await axios.get(`/api/products/product/${item._id}`)

    // Check if the item in the stock or not
    if (data.countInStock < quantity) {
      window.alert('Sorry, Product is out of the stock.')
      return
    }
    ctxDispatch({
      type: 'ADD_TO_CART',
      payload: {...item, quantity}
    })
  }

  function removeItemHandler(item) {
    ctxDispatch({type: "REMOVE_FROM_CART", payload: item})
  }

  function checkoutHandler() {
    navigate('/signin?redirect=/shipping')
  }

  /* Return JSX */
  return (
      <div>
        <Helmet>
          <title>Shopping Cart</title>
        </Helmet>
        <h1>Shopping Cart</h1>
        <Row>
          <Col md={8}>
            {
              cartItems.length === 0 ? (
                  <MessageBox>
                    Cart is empty. <Link to={"/"}>Go Shopping</Link>
                  </MessageBox>
              ) : (
                  <ListGroup>
                    {
                      cartItems.map(item => (
                          <ListGroup.Item key={item._id}>
                            <Row className={"align-items-center"}>
                              <Col md={4}>
                                <img src={item.image} alt={item.name} className={"img-fluid rounded img-thumbnail"}/> {" "}
                                <Link to={`/slug/${item.slug}`}> {item.name}</Link>
                              </Col>
                              <Col md={3}>
                                <Button
                                    onClick={() => updateCartHandler(item, item.quantity - 1)}
                                    variant={"light"}
                                    disabled={item.quantity === 1}
                                >
                                  <i className="fas fa-minus-circle"></i>
                                </Button>{' '}
                                <span>{item.quantity}</span>{' '}
                                <Button
                                    onClick={() => updateCartHandler(item, item.quantity + 1)}
                                    variant={"light"}
                                    disabled={item.quantity === item.countInStock}
                                >
                                  <i className="fas fa-plus-circle"></i>
                                </Button>
                              </Col>
                              <Col md={3}>${item.price}</Col>
                              <Col md={2}>
                                <Button
                                    onClick={() => removeItemHandler(item)}
                                    variant={"light"}
                                >
                                  <i className="fas fa-trash"></i>
                                </Button>
                              </Col>
                            </Row>
                          </ListGroup.Item>
                      ))
                    }
                  </ListGroup>
              )
            }
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <ListGroup variant={"flush"}>
                  <ListGroup.Item>
                    <h3>
                      Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '} items) : $
                      {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                    </h3>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button
                          onClick={checkoutHandler}
                          type={"button"}
                          variant={"primary"}
                          disabled={cartItems.length === 0}>
                        Proceed to Checkout
                      </Button>
                    </div>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
  );
}

export default CartPage;