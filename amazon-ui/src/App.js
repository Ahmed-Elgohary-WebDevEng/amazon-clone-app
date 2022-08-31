import {Link, Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import {Badge, Button, Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap"
import {useContext, useEffect, useState} from "react";
import {Store} from "./store/Store";
import CartPage from "./pages/CartPage";
import SignInPage from "./pages/SignInPage";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import ShippingAddressPage from "./pages/ShippingAddressPage";
import SignUpPage from "./pages/SignUpPage";
import PaymentMethodPage from "./pages/PaymentMethodPage";
import PlaceOrderPage from "./pages/PlaceOrderPage";
import OrderPage from "./pages/OrderPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import ProfilePage from "./pages/ProfilePage";
import * as categories from "react-bootstrap/ElementChildren";
import {getError} from "./utils/utils";
import axios from "axios";
import SearchBox from "./components/UI/SearchBox";
import SearchPage from "./pages/SearchPage";
import ProteectedRoute from "./components/ProteectedRoute";
import AdminRoute from "./components/AdminRoute";
import DashboardPage from "./pages/DashboardPage";

function App() {
   const {state, dispatch: cixDispatch} = useContext(Store)
   const {cart, userInfo} = state

   function signOutHandler() {
      cixDispatch({type: "USER_SIGN_OUT"})
      localStorage.removeItem('userInfo')
      localStorage.removeItem('shippingAddress')
      localStorage.removeItem('paymentMethod')
      window.location.href = '/signin'
   }

   const [sidebarIsOpen, setSidebarIsOpen] = useState(false)
   const [categories, setCategories] = useState([])

   useEffect(() => {
      const fetchCategories = async () => {
         try {
            const {data} = await axios.get('/api/products/categories')
            setCategories(data)
         } catch (err) {
            toast.error(getError(err))
         }
      }

      fetchCategories()
   }, [])
   return (
       <div className={sidebarIsOpen ? "d-flex flex-column site-container active-cont" : "d-flex flex-column site-container"}>
          <ToastContainer position="bottom-center" limit={1}/>
          <header>
             <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                   <Button variant="dark" onClick={() => setSidebarIsOpen(!sidebarIsOpen)}>
                      <i className="fas fa-bars"></i>
                   </Button>
                   <LinkContainer to="/">
                      <Navbar.Brand>Amazon</Navbar.Brand>
                   </LinkContainer>
                   <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                   <Navbar.Collapse id="basic-navbar-nav">
                      <SearchBox></SearchBox>
                      <Nav className="me-auto w-100 justify-content-end">
                         <Link to={"/cart"} className={"nav-link"}>
                            Cart
                            {cart.cartItems.length > 0 && (
                                <Badge pill bg={"danger"}>
                                   {cart.cartItems.reduce((a, c) => {
                                      return a + c.quantity;
                                   }, 0)}
                                </Badge>
                            )}
                         </Link>
                         {userInfo ? (
                             <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                                <LinkContainer to="/profile">
                                   <NavDropdown.Item>User Profile</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to="/order-history">
                                   <NavDropdown.Item>Order History</NavDropdown.Item>
                                </LinkContainer>
                                <NavDropdown.Divider/>
                                <Link to="#signout" className="dropdown-item" onClick={signOutHandler}>Sign Out</Link>
                             </NavDropdown>
                         ) : (
                             <Link className="nav-link" to="/signin">Sign In</Link>
                         )}
                         {userInfo && userInfo.isAdmin && (
                             <NavDropdown title="Admin" id="admin-nav-dropdown">
                                <LinkContainer to="/admin/dashboard">
                                   <NavDropdown.Item>Dashboard</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to="/admin/products">
                                   <NavDropdown.Item>Products</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to="/admin/orders">
                                   <NavDropdown.Item>Orders</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to="/admin/users">
                                   <NavDropdown.Item>Users</NavDropdown.Item>
                                </LinkContainer>
                             </NavDropdown>
                         )}
                      </Nav>
                   </Navbar.Collapse>
                </Container>
             </Navbar>
          </header>
          <div className={sidebarIsOpen ? "active-nav side-navbar d-flex justify-content-between flex-wrap flex-column" : "side-navbar d-flex justify-content-between flex-wrap flex-column"}>
             <Nav className="flex-column text-white w-100 p-2">
                <Nav.Item>
                   <strong>Categories</strong>
                </Nav.Item>
                {
                   categories.map((category) => (
                       <Nav.Item key={category}>
                          <LinkContainer to={`search?category=${category}`} onClick={() => setSidebarIsOpen(false)}>
                             <Nav.Link>{category}</Nav.Link>
                          </LinkContainer>
                       </Nav.Item>
                   ))
                }
             </Nav>
          </div>
          <main>
             <Container className="mt-3">
                <Routes>
                   <Route path="/product/:slug" element={<ProductPage/>}/>
                   <Route path="/cart" element={<CartPage/>}/>
                   <Route path="/search" element={<SearchPage/>}/>
                   <Route path="/signin" element={<SignInPage/>}/>
                   <Route path="/signup" element={<SignUpPage/>}/>
                   <Route path="/profile" element={
                      <ProteectedRoute>
                         <ProfilePage/>
                      </ProteectedRoute>
                   }/>
                   <Route path="/shipping" element={<ShippingAddressPage/>}/>
                   <Route path="/payment" element={<PaymentMethodPage/>}/>
                   <Route path="/placeorder" element={<PlaceOrderPage/>}/>
                   /* Admin Routes */
                   <Route
                       path="/admin/dashboard"
                       element={
                          <AdminRoute>
                             <DashboardPage />
                          </AdminRoute>
                       }
                   ></Route>
                   {/*<Route
                       path="/admin/orders"
                       element={
                          <AdminRoute>
                             <OrderListScreen />
                          </AdminRoute>
                       }
                   ></Route>
                   <Route
                       path="/admin/users"
                       element={
                          <AdminRoute>
                             <UserListScreen />
                          </AdminRoute>
                       }
                   ></Route>
                   <Route
                       path="/admin/products"
                       element={
                          <AdminRoute>
                             <ProductListScreen />
                          </AdminRoute>
                       }
                   ></Route>
                   <Route
                       path="/admin/product/:id"
                       element={
                          <AdminRoute>
                             <ProductEditScreen />
                          </AdminRoute>
                       }
                   ></Route>
                   <Route
                       path="/admin/user/:id"
                       element={
                          <AdminRoute>
                             <UserEditScreen />
                          </AdminRoute>
                       }
                   ></Route>

                   */}
                   <Route path="/" element={<HomePage/>}/>
                </Routes>
             </Container>
          </main>
          <footer>
             <div className="text-center">All Right Reserved</div>
          </footer>
       </div>
   );
}

export default App;
