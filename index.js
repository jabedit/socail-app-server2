const express = require('express')
const cors = require('cors')
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express()
const port = process.env.PORT || 5000

//middlewares
//middleware
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.icgs0.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        const database = client.db('socail_media')
        const media = database.collection('media')
        const comments = database.collection('comments')
        const abouts = database.collection('abouts')
        
        app.get('/media', async (req, res) => {
          const query = {}
          const result = await media.find(query).sort({postLike: 1}).toArray()
          res.send(result)
        })
        app.get('/topmedia', async (req, res) => {
          const query = {}
          const result = await media.find(query).limit(3).sort({postLike: -1}).toArray()
          res.send(result)
        })
        app.get('/signlepost/:id', async (req, res) =>{
          const id = req.params.id
          const query = {_id : ObjectId(id)}
          const result = await media.findOne(query)
          res.send(result)
         
      })
        app.post('/media', async (req, res) => {
          const data = req.body
          console.log(data)
          const result = await media.insertOne(data)
          res.send(result)
        })
        
        app.get('/abouts' , async(req, res) =>{
          let query = {}

          if(req.query.email){
              query = {
                 email: req.query.email
              }
          }
          const result = await  abouts.find(query).toArray()
          res.send(result)
      
      } )
        app.post('/abouts', async (req, res) => {
          const data = req.body
          console.log(data)
          const result = await abouts.insertOne(data)
          res.send(result)
        })
        app.get('/comments', async(req, res)=>{
          let query = {}
          if(req.query.comment_id){
            query = {
              comment_id : req.query.comment_id
            }
        }
          const result = await comments.find(query).toArray()
          res.send(result)
        })
        app.post('/comments', async(req, res)=>{
          const data = req.body
          const result = await comments.insertOne(data)
          res.send(result)
        })
        app.get('/media/:id', async(req, res) =>{
          const id = req.params.id
          const query = { _id: ObjectId(id)}
          const result = await media.findOne(query)
          res.send(result)
        })
        app.put('/abouts/profile/:id', async(req, res)=>{
          const id = req.params.id
          const profile = req.body
          const filter = {_id: ObjectId(id)}
          const option = {upsert: true}
          const updatedocs = {
              $set: {
                user_img:profile.user_img,
                name: profile.name,
                email: profile.email,
                university: profile.university,
                address: profile.address
                 

              }
          }
          const result = await abouts.updateOne(filter, updatedocs, option)
          res.send(result)
          console.log(result)
          
      })
        app.put('/media/like/:id', async(req, res)=>{
          const id = req.params.id
          const Like = req.body
          console.log(Like)
          const filter = {_id: ObjectId(id)}
          const option = {upsert: true}
          const updatedocs = {
              $set: {
                postLike: Like.userLike
                 

              }
          }
          const result = await media.updateOne(filter, updatedocs, option)
          res.send(result)
          console.log(result)
          
      })
    
       
      } finally {
      }
}
run().catch(console.dir)

app.get('/', (req, res) =>{
    res.send('Socail media server api running')
})



app.listen(port, () =>{
    console.log('Server Running on Port', port)
})

