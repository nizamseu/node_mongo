const express = require ('express');
const cors = require ('cors');
const bodyParser = require('body-parser');
const  MongoClient = require('mongodb').MongoClient;
const app = express();
require('dotenv').config()
app.use(cors());
app.use(bodyParser.json());

// const pass=process.env.DB_PASS;
// const user=process.env.DB_USER;

const uri = process.env.DB_PATH
// const uri = "mongodb+srv://dbUser:bSgtVXvRU7BL1f1U@cluster0-r2lzi.mongodb.net/test?retryWrites=true&w=majority";
//  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/products', (req,res) => {
  let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    MongoClient.connect(uri, function(err, client) {
        const collection = client.db("store").collection("product");
        // perform actions on the collection object
        
        collection.find().toArray((error,documents)=>{
          if(error){
              console.log(error);
              res.status(500).send({message:error})
          }
          else{
            res.send(documents);
          }
           
            })
      // client.close();
      });
      
})

app.get ('/nizam/data',(req,res)=>{
    res.send({
        id:1,
        name:"Nizam Uddin",
        Address: "Cumilla,Bangladesh",
        phone:"01827612791",
        email:"Nizam@gmail.com"
    })
})
 
//datbase


// app.get('/users:id'

app.get('/product/:key',(req,res)=>{
  const key= req.params.key;
  MongoClient.connect(uri, function(err, client) {
    const collection = client.db("store").collection("product");
    // perform actions on the collection object
    collection.find({key}).toArray((error,documents)=>{
      if(error){
          console.log(error);
          res.status(500).send({message:error})
      }
      else{
        res.send(documents[0]);
      }
       
        })
    client.close();
  });
  
})



//cpy
app.post('/getProductByKey',(req,res)=>{
  const key= req.params.key;
  const productKeys=req.body;
  MongoClient.connect(uri, function(err, client) {
    const collection = client.db("store").collection("product");
    // perform actions on the collection object
    collection.find({key:{$in:productKeys}}).toArray((error,documents)=>{
      if(error){
          console.log(error);
          res.status(500).send({message:error})
      }
      else{
        res.send(documents);
      }
       
        })
        
  client.close();
  });
  
})





app.post('/addProduct',(req,res) =>{
    //save to datbase
    const product=req.body;
   console.log(product);
   
    MongoClient.connect(uri, function(err, client) {
        const collection = client.db("store").collection("product");
        // perform actions on the collection object
        collection.insert(product, (error,result)=>{
            console.log("sucessfully Insert",result);
          if(error){
              console.log(err);
              res.status(500).send({message:error})
          }
          else{
            res.send(result.ops[0]);
          }
           
            })
        client.close();
      });   
})







app.post('/placeOrder',(req,res) =>{
  //save to datbase
  const orderDetails=req.body;
  orderDetails.orderTime=new Date();
 console.log(orderDetails);
 
  MongoClient.connect(uri, function(err, client) {
      const collection = client.db("store").collection("orders");
      // perform actions on the collection object
      collection.insertOne(orderDetails, (error,result)=>{
          console.log("sucessfully Insert",result);
        if(error){
            console.log(err);
            res.status(500).send({message:error})
        }
        else{
          res.send(result.ops[0]);
        }
         
          })
      client.close();
    });   
})


const port = process.env.PORT || 4200
app.listen(port ,() => console.log("listing port 4200"));