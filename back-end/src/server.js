import express from 'express';
import {MongoClient} from 'mongodb';
import {cartItems as cartItemsRaw, products as productsRaw} from './temp-data';
// cant directly modify cartItems and products since they live in another file
// rename and use lets to work around this
let cartItems = cartItemsRaw;
let products = productsRaw;

// pass url of mongo database you want to connect to
async function start () {
  const url = `mongodb+srv://savperera369:Mksolive30@cluster0.x7lzrkr.mongodb.net/?retryWrites=true&w=majority`;
  const client = new MongoClient(url);
  const app = express();

  //this will parse the request body
  app.use(express.json());

  await client.connect();
  const db = client.db('fsv-db');

  async function populateCardIds(ids) {
    return Promise.all(ids.map(id => db.collection('products').findOne({id})));
  }

  app.get('/products', async (req,res) => {
    const products = await db.collection('products').find({}).toArray();
    res.send(products);
  });

  app.get('/users/:userId/cart', async (req,res) => {
    const user = await db.collection('users').findOne({id: req.params.userId});
    // use map function to map an id to a item
    const populatedCart = await populateCardIds(user.cartItems);
    res.json(populatedCart);
  })

  app.get('/products/:productId', async (req,res) => {
    const productId = req.params.productId;
    // findOne uses a filter object
    const product = await db.collection('products').findOne({id: productId});
    res.json(product);
  })

  app.post('/users/:userId/cart', async (req,res) => {
    const userId = req.params.userId;
    const productId = req.body.id;

    await db.collection('users').updateOne({id: userId}, {
      $addToSet: {cartItems: productId}
    })
    
    const user = await db.collection('users').findOne({id: req.params.userId});
    // use map function to map an id to a item
    const populatedCart = await populateCardIds(user.cartItems);
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
  });
}

start();
