import React, {useContext, useEffect, useReducer} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {Badge, Button, Card, Col, ListGroup, Row} from "react-bootstrap";
import Rating from "../components/products/Rating";
import {Helmet} from "react-helmet-async";
import LoadingBox from "../components/UI/LoadingBox";
import MessageBox from "../components/UI/MessageBox";
import {getError} from "../utils/utils";
import {Store} from "../store/Store";

const reducer = (state, action) => {
  switch (action.type) {
    case 'REFRESH_PRODUCT':
      return {...state, product: action.payload};
    case 'CREATE_REQUEST':
      return {...state, loadingCreateReview: true};
    case 'CREATE_SUCCESS':
      return {...state, loadingCreateReview: false};
    case 'CREATE_FAIL':
      return {...state, loadingCreateReview: false};
    case 'FETCH_REQUEST':
      return {...state, loading: true};
    case 'FETCH_SUCCESS':
      return {...state, product: action.payload, loading: false};
    case 'FETCH_FAIL':
      return {...state, loading: false, error: action.payload};
    default:
      return state;
  }
};


function ProductPage(props) {
  const {slug} = useParams()
  const navigate = useNavigate()

  const [{loading, error, product}, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({type: 'FETCH_REQUEST'});
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({type: 'FETCH_SUCCESS', payload: result.data});
      } catch (err) {
        dispatch({type: 'FETCH_FAIL', payload: getError(err)});
      }
    };
    fetchData();
  }, [slug]);

  const {state, dispatch: ctxDispatch} = useContext(Store);
  const {cart} = state

  async function addToCartHandler() {
    // Check item exist or not
    const existItem = cart.cartItems.find(item => item._id === product._id)
    // Update quantity
    const quantity = existItem ? existItem.quantity + 1 : 1
    // get the item data from api
    // console.log(product)
    const {data} = await axios.get(`/api/products/product/${product._id}`)
    // console.log(data)
    // Check if the item in the stock or not
    if (data.countInStock < quantity) {
      window.alert('Sorry, Product is out of the stock.')
      return
    }
    ctxDispatch({
      type: 'ADD_TO_CART',
      payload: {...product, quantity}
    })
    navigate('/cart')
  }

  return (
      loading ? (
          <LoadingBox>Loading...</LoadingBox>
      ) : error ? (
          <MessageBox variant={'danger'}>{error}</MessageBox>
      ) : (
          <div>
            <Row>
              <Col md={6}>
                <img className="img-large" src={product.image} alt={product.name}/>
              </Col>
              <Col md={3}>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Helmet>
                      <title>{product.name}</title>
                    </Helmet>
                    <h1>{product.name}</h1>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Rating rating={product.rating} numReviews={product.numReviews}></Rating>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Description: <p>{product.description}</p>
                  </ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={3}>
                <Card>
                  <Card.Body>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <Row>
                          <Col>Price:</Col>
                          <Col>${product.price}</Col>
                        </Row>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Col>Status:</Col>
                        <Col>{
                          product.countInStock > 0 ? (<Badge bg="success">In Stock</Badge>) : (
                              <Badge bg="danger">Unavailable</Badge>)
                        }</Col>
                      </ListGroup.Item>
                      {product.countInStock > 0 && (
                          <ListGroup.Item>
                            <div className="d-grid">
                              <Button onClick={addToCartHandler} variant="primary">Add to cart</Button>
                            </div>
                          </ListGroup.Item>
                      )}
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
      )
  );
}

export default ProductPage;
