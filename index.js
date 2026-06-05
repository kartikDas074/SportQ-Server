const express=require('express');
const cors=require('cors');
const dotenv=require('dotenv');
const app=express();
dotenv.config();

//port Initialize
const port=process.env.PORT;


//For cross server
app.use(cors());
app.use(express.json());


// Main Code
app.get('/',(req,res)=>{
     res.send('the more you live the more you realise.. the world is fucked up')
})
app.listen(port,()=>{
    console.log(`server run on|${port}`);
})