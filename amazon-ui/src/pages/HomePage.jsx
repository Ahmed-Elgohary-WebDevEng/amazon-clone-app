import React, {useEffect, useReducer} from 'react';
import axios from "axios";
import {Col, Row} from "react-bootstrap";
import Product from "../components/products/Product";
import {Helmet} from "react-helmet-async";
import LoadingBox from "../components/UI/LoadingBox";
import MessageBox from "../components/UI/MessageBox";

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return {...state, loading: true}
    case 'FETCH_SUCCESS':
      return {...state, products: action.payload, loading: false}
    case 'FETCH_FAILED':
      return {...state, loading: false, error: action.payload}
    default:
      return state
  }
}

function HomePage(props) {
  // State for products data
  // const [products, setProducts] = useState([]);
  // Using reducer instead of state
  const [{loading, error, products}, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      dispatch({type: 'FETCH_REQUEST'})
      try {
        const response = await axios.get('/api/products')
        dispatch({type: 'FETCH_SUCCESS', payload: response.data})
      } catch (error) {
        console.log(error)
        dispatch({type: 'FETCH_FAILED', payload: error.message})
      }
      // setProducts(response.data)
    }
    fetchData()
  }, [])
  return (
      <div>
        <Helmet>
          <title>amazon</title>
        </Helmet>
        <h1>Featured Products</h1>
        <div className="products">
          {
            loading ? (<LoadingBox/>)
                : error ? (<MessageBox variant={'danger'}>{error}</MessageBox>)
                    : (
                        <Row>
                          {
                            products.map((product) => (
                                <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                                  <Product product={product}/>
                                </Col>
                            ))
                          }
                        </Row>
                    )

          }
        </div>
      </div>
  );
}

export default HomePage;