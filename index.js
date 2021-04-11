const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))
app.use(cors())
const port = 5000

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6i5ol.mongodb.net/emaJohn2021?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohn2021").collection("item");
  const orderCollection = client.db("emaJohn2021").collection("orders");
  
 app.post('/addProducts', (req, res)=>{
     const products = req.body;
     productsCollection.insertOne(products)
     .then(result =>{

        
         res.send(result.insertedCount > 0)
     })
 })

 app.get('/products', (req, res)=>{
     const search = req.query.search
    productsCollection.find({name:{$regex:search}})
     .toArray((err, documents)=>{
         res.send(documents)
     })
 })
 app.get('/product/:key', (req, res)=>{
    productsCollection.find({key:req.params.key})
    .toArray((err, documents)=>{
        res.send(documents[0])
    })
})
app.post('/productsByKey', (req, res)=>{
    const productsKeys = req.body
    productsCollection.find({key:{$in:productsKeys}})
    .toArray((err, documents)=>{
        res.send(documents)
    })
})

app.post('/addOrder', (req, res)=>{
    const order = req.body;
    
    orderCollection.insertOne(order)
    .then(result =>{
        
        res.send(result.insertedCount > 0)
    })
})

});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)


