import React, {useContext, useEffect, useState} from 'react';
import {Button, Container, Form} from "react-bootstrap";
import {Helmet} from "react-helmet-async";
import {Link, useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import {Store} from "../store/Store";
import {toast} from "react-toastify";
import {getError} from "../utils/utils";

function SignInPage(props) {
  const navigate = useNavigate()
  /* Get the url from the current page */
  const {search} = useLocation();
  /* Search in the url for the (redirect) word */
  const redirectInURL = new URLSearchParams(search).get('redirect')
  /* Check if the (redirect) word is in URL or not  */
  const redirect = redirectInURL ? redirectInURL : '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const {state, dispatch: ctxDispatch} = useContext(Store)
  const {userInfo} = state

  async function submitHandler(event) {
    event.preventDefault()
    try {
      // Send User data into sign in api
      const {data} = await axios.post("/api/users/signin", {
        email,
        password
      })
      // Send the data to the React store
      ctxDispatch({
        type: "USER_SIGN_IN",
        payload: data
      })
      // Store user data in local storage
      localStorage.setItem('userInfo', JSON.stringify(data))
      // redirect user to the shipping page
      navigate(redirect || '/')

      // Display toast success
      toast.success("Sign in Successful", {
        position: toast.POSITION.BOTTOM_CENTER
      })
    } catch (err) {
      toast.error(getError(err), {
        position: toast.POSITION.BOTTOM_CENTER
      })
    }
  }

  useEffect(() => {
    if (userInfo){
      navigate(redirect)
    }
  }, [navigate, userInfo, redirect])

  return (
      <Container className={"small-container"}>
        <Helmet>
          <title>Sign In</title>
        </Helmet>
        <h1 className="my-3">Sign In</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" required onChange={(event) => {setEmail(event.target.value)}} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" required onChange={(event) => {setPassword(event.target.value)}} />
          </Form.Group>
          <div className="mb-3">
            <Button type="submit">Sign in</Button>
          </div>
          <div className="mb-3">
            New Customer {' '}
            <Link to={`/signup?redirect=${redirect}`} >Create your account</Link>
          </div>
        </Form>
      </Container>
  );
}

export default SignInPage;