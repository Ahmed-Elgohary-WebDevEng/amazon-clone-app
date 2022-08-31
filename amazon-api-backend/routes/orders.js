import express from "express";
import req from "express/lib/request.js";
import expressAsyncHandler from "express-async-handler";
import res from "express/lib/response.js";
import Order from "../models/Order.js";
import {isAuth} from "../utils/utils.js";
import Data from "../data.js";

const orderRoutes = express.Router()

orderRoutes.post('/', isAuth, expressAsyncHandler(async (req, res) => {
   const newOrder = new Order({
      orderItems: req.body.orderItems.map(item => ({...item, product: item._id})),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
   })

   const order = await newOrder.save()
   res.status(201).send({message: 'New order created', order})
}))

orderRoutes.get('/mine', isAuth, expressAsyncHandler(async (req, res) => {
       const orders = await Order.find({user: req.user._id});
       res.send(orders);
    })
);

orderRoutes.get('/:id', isAuth, expressAsyncHandler(async (req, res) => {
   const order = await Order.findById(req.params.id)

   if (order) {
      res.status(200).send(order)
   } else {
      res.status(404).send('Order not found')
   }
}))

orderRoutes.put('/:id/pay', isAuth, expressAsyncHandler(async (req, res) => {
   const order = await Order.findById(req.params.id)

   if (order) {
      order.isPaid = true
      order.paidAt = Date.now()
      order.paymentResult = {
         id: req.body.id,
         status: req.body.status,
         update_time: req.body.update_time,
         email_address: req.body.email_address,
      }

      const updateOrder = await order.save();

      res.status(201).send({message: 'Order paid', order: updateOrder})
   } else {
      res.status(404).send('Order not found')
   }
}))


export default orderRoutes