const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

dotenv.config();

//port Initialize
const port = process.env.PORT;
const uri = process.env.MONGODB_URI;

//For cross server
app.use(cors());
app.use(express.json());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const DB = client.db("SportQuest");
    const ground = DB.collection("SGround");
    const Bookings = DB.collection("Bookings");
    app.get("/ground", async (req, res) => {
      try {
        const grd = await ground.find({}).toArray();
        res.status(200).json(grd);
      } catch (e) {
        res.status(500).json({
          success: false,
          msg: e.message,
        });
      }
    });

    app.get("/ground/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const grd = await ground.findOne({
          _id: { $eq: new ObjectId(id) },
        });
        res.status(200).json(grd);
      } catch (e) {
        res.status(500).json({
          success: false,
          msg: e.message,
        });
      }
    });

    app.post('/ground',async(req,res)=>{
     try{
      const data=req.body;
      const result=await ground.insertOne(data);
      res.status(201).json({
          success: true,
          insertedId: result.insertedId,
        });
     }catch(e){
         res.status(500).json({
          success: false,
          message: "Internal Server Error",
        });
     }
    })

    app.get('/ground/owner/:email',async(req,res)=>{
      try{
        const email=req.params.email;
        console.log(email);
        const result=await ground.find({
          email:{$eq:email}
        }).toArray();
         res.status(200).json(result);
      }catch (e) {
        res.status(500).json({
          success: false,
          msg: e.message,
        });
      }
    })

    app.delete('/ground/:id',async(req,res)=>{
         try{
          const id=req.params.id;
         const result=await ground.deleteOne({
          _id:{$eq:new ObjectId(id)}
         })
         return res.status(200).json(result)
         }catch(e){
          res.status(500).json({
            success: false,
          msg: e.message,
          })
         }
    })

    app.patch('/ground/:id',async(req,res)=>{
      try{
        const id=new ObjectId(req.params.id);
        const data=req.body;
        const result=await ground.updateOne({
          _id:id
        },{
          $set:data
        })
       return res.status(200).json(result);
      }catch(e){
        return res.status(500).json({
      success: false,
      msg: e.message,
    });
      }

    })

    app.post("/Bookings", async (req, res) => {
      try {
        const booking = req.body;
        const result = await Bookings.insertOne(booking);

        res.status(201).json({
          success: true,
          insertedId: result.insertedId,
        });
      } catch (e) {
        res.status(500).json({
          success: false,
          message: "Internal Server Error",
        });
      }
    });

    app.delete("/Bookings/:id",async(req,res)=>{
         try{
          const id=req.params.id;
         const result=await Bookings.deleteOne({
          _id:{$eq:new ObjectId(id)}
         })
         return res.status(200).json(result)
         }catch(e){
          res.status(500).json({
            success: false,
          msg: e.message,
          })
         }
    })
    
    app.get("/Bookings/user/:Id",async(req,res)=>{
      try{
        const id=req.params.Id;
        const bookings=await Bookings.find({
           user_id:{$eq:id}
        }).toArray();
        res.status(200).json(bookings);
      }catch(e){
         res.status(500).json({
          success: false,
          msg: e.message,
        });
      }
    })

    app.get("/Bookings/owner/:email",async(req,res)=>{
      try{
        const email=req.params.email;
        const bookings=await Bookings.find({
           owner_email:{$eq:email}
        }).toArray();
        res.status(200).json(bookings);
      }catch(e){
         res.status(500).json({
          success: false,
          msg: e.message,
        });
      }
    })

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// Main Code
app.get("/", (req, res) => {
  res.send("the more you live the more you realise.. the world is fucked up");
});
app.listen(port, () => {
  console.log(`server run on|${port}`);
});
