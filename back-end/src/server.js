import express from 'express';
import {cartItems as cartItemsRaw, products as productsRaw} from './temp-data';
// cant directly modify cartItems and products since they live in another file
// rename and use lets to work around this
let cartItems = cartItemsRaw;
let products = productsRaw;

const app = express();

//this will parse the request body
app.use(express.json());

app.get('/hello', (req, res) => {
  res.send("Hello");
});

function populateCardIds(ids) {
  return ids.map(id => products.find(product => product.id === id));
}

app.get('/products', (req,res) => {
  res.json(products);
});

app.get('/cart', (req,res) => {
  // use map function to map an id to a item
  const populatedCart = populateCardIds(cartItems);
  res.json(populatedCart);
})

app.get('/products/:productId', (req,res) => {
  const productId = req.params.productId;
  const product = products.find(product => product.id === productId);
  res.json(product);
})

app.post('/cart', (req,res) => {
  const productId = req.body.id;
  cartItems.push(productId);
  const populatedCart = populateCardIds(cartItems);
  res.json(populatedCart);
});

app.delete('/cart/:productId', (req,res) => {
  const productId = req.body.id;
  cartItems = cartItems.filter(id => id !== productId);
  const populatedCart = populateCardIds(cartItems);
  res.json(populatedCart);
});

app.listen(8000, () => {
  console.log("Server is listening on port 8000");
})