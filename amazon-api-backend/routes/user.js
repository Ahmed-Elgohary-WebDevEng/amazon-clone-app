import express from "express";
import expressAsyncHandler from 'express-async-handler'
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import {generateToken, isAuth} from "../utils/utils.js";
import req from "express/lib/request.js";
import res from "express/lib/response.js";

const userRoutes = express.Router()

userRoutes.post('/signin', expressAsyncHandler(async (req, res) => {
  const user = await User.findOne({email: req.body.email})
  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user)
      })
    }
    return
  }
  res.status(401).send({message: "Invalid Email or password"})
}))

userRoutes.post('/signup', expressAsyncHandler(async (req, res) => {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 12)
  })

  const user = await newUser.save();
  res.status(201).send({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(user)
  })
}))

userRoutes.put('/profile', isAuth, expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    if (req.body.password) {
      user.password = bcrypt.hashSync(req.body.password, 12)
    }

    const updatedUser = await user.save()

    res.send({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser)
    })
  }else {
    res.status(404).send({message: 'User not Found'})
  }
}))

export default userRoutes