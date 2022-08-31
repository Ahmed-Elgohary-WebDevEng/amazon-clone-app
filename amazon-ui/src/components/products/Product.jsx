import React, {useContext} from 'react';
import {Link} from "react-router-dom";
import {Button, Card} from "react-bootstrap";
import Rating from "./Rating";
import axios from "axios";
import {Store} from "../../store/Store";

function Product({product}) {
  /* Configure Context in cart page */
  const {state, dispatch: ctxDispatch} = useContext(Store)

  /*Get the cart item data*/
  const {cart: {cartItems}} = state

  /* Update Cart Function */
  async function addToCartHandler(item) {
    // Check item exist or not
    const existItem = cartItems.find(item => item._id === product._id)
    // Update quantity
    const quantity = existItem ? existItem.quantity + 1 : 1

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

  return (
      <Card>
        <Link to={`/product/${product.slug}`}>
          <img className="card-img-top" src={product.image} alt={product.name}/>
        </Link>
        <Card.Body>
          <Link to={`/product/${product.slug}`}>
            <Card.Title>{product.name}</Card.Title>
          </Link>
          <Rating rating={product.rating} numReviews={product.numReviews}/>
          <Card.Text>${product.price}</Card.Text>
          {product.countInStock = 0 ?
              <Button variant={"light"} disabled >Out of the Stock</Button>
              :
              <Button onClick={() => addToCartHandler(product)}>Add to cart</Button>
          }

        </Card.Body>
      </Card>
  );
}

export default Product;
