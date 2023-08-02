import express from 'express';
import {MongoClient} from 'mongodb';

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
      $addToSet: {cartItems: productId},
    })
    
    const user = await db.collection('users').findOne({id: userId});
    // use map function to map an id to a item
    const populatedCart = await populateCardIds(user.cartItems);
    res.json(populatedCart);
  });

  app.delete('/users/:userId/cart/:productId', async (req,res) => {
    const userId = req.params.userId;
    const productId = req.params.productId;
    await db.collection('users').updateOne({id:userId}, {
      $pull: {cartItems: productId},
    })
    const user = await db.collection('users').findOne({id: userId});
    // use map function to map an id to a item
    const populatedCart = await populateCardIds(user.cartItems);
    res.json(populatedCart);
  });

  app.listen(8000, () => {
    console.log("Server is listening on port 8000");
  });
}

start();
