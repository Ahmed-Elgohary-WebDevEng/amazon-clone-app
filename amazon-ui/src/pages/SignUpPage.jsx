import React, {useContext, useEffect, useState} from 'react';
import {Button, Container, Form} from "react-bootstrap";
import {Helmet} from "react-helmet-async";
import {Link, useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import {Store} from "../store/Store";
import {toast} from "react-toastify";
import {getError} from "../utils/utils";

function SignUpPage(props) {
  const navigate = useNavigate()
  const {state, dispatch: ctxDispatch} = useContext(Store)
  const {userInfo} = state

  /* Get the url from the current page */
  const {search} = useLocation();
  /* Search in the url for the (redirect) word */
  const redirectInURL = new URLSearchParams(search).get('redirect')
  /* Check if the (redirect) word is in URL or not  */
  const redirect = redirectInURL ? redirectInURL : '/'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  async function submitHandler(event) {
    event.preventDefault()
    // If the password is identical or not
    if (password !== confirmPassword) {
      toast.error("password didn't match", {
        position: toast.POSITION.BOTTOM_CENTER
      })
      return
    }
    try {
      // Send User data into sign in api
      const {data} = await axios.post("/api/users/signup", {
        name,
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
      navigate('/')

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
          <title>Sign Up</title>
        </Helmet>
        <h1 className="my-3">Sign Up</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control type="name" required onChange={(event) => {setName(event.target.value)}} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" required onChange={(event) => {setEmail(event.target.value)}} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" required onChange={(event) => {setPassword(event.target.value)}} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type="password" required onChange={(event) => {setConfirmPassword(event.target.value)}} />
          </Form.Group>
          <div className="mb-3">
            <Button type="submit">Sign Up</Button>
          </div>
          <div className="mb-3">
            Already have an account {' '}
            <Link to={`/signin?redirect=${redirect}`} >Sign-In</Link>
          </div>
        </Form>
      </Container>
  );
}

export default SignUpPage;