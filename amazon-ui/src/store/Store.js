import {createContext, useReducer} from "react";

export const Store = createContext();

const initialState = {
  userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
  cart: {
    cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
    shippingAddress: localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : {},
    paymentMethod: localStorage.getItem('paymentMethod') ? localStorage.getItem('paymentMethod') : ''
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART':
      // add item to the cart
      const newItem = action.payload
      const existItem = state.cart.cartItems.find(item => item._id === newItem._id)

      // if this item exist in the cart --> update the current item with the new item
      const cartItems = existItem ?
          state.cart.cartItems.map(item => item._id === existItem._id ? newItem : item) :
          [...state.cart.cartItems, newItem]
        localStorage.setItem('cartItems', JSON.stringify(cartItems))
      return {...state, cart: {...state.cart, cartItems}}
    case "REMOVE_FROM_CART": {
      const cartItems = state.cart.cartItems.filter((item) => item._id !== action.payload._id)
      localStorage.setItem('cartItems', JSON.stringify(cartItems))
      return {...state, cart: {...state.cart, cartItems}}
    }
    case "CART_CLEAR":
      return {...state, cart: { ...state.cart, cartItems: []}}
    case "USER_SIGN_IN":
      return { ...state, userInfo: action.payload}
    case "USER_SIGN_OUT":
      return {
        ...state,
        userInfo: null,
        cart: {
          cartItems: [],
          shippingAddress: {},
          paymentMethod: ''
        }
      }
    case "SAVE_SHIPPING_ADDRESS":
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload
        }
      }
    case "SAVE_PAYMENT_METHOD":
      return {
        ...state,
        cart: {
          ...state.cart, paymentMethod: action.payload
        }
      }
    default:
      return state
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = {state, dispatch}

  return (
      <Store.Provider value={value}>{props.children}</Store.Provider>
  )
}