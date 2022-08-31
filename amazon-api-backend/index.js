import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import path from "path"

import productRoutes from './routes/product.js'
import seedRoutes from "./routes/seed.js";
import userRoutes from "./routes/user.js";
import orderRoutes from "./routes/orders.js";
import req from "express/lib/request.js";
import res from "express/lib/response.js";

dotenv.config()

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("Connected to mongodb")
    })
    .catch(err => {
      console.log(err)
    })

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/api/keys/paypal', (req, res) => {
   res.send(process.env.PAYPAL_CLIENT_ID || 'sb')
})
app.use('/api/seed', seedRoutes)
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)

const __dirname = path.resolve()
app.use(express.static(path.join(__dirname, '/amazon-ui/build/index.html')))

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message})
})

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
