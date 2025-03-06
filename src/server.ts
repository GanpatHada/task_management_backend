import dotenv from "dotenv";
dotenv.config();

const PORT=process.env.PORT || 3000

import app from "./app";
import connectDB from "./config/db.config";

connectDB().then(()=>{
  console.log('✅ connected to database')
  app.listen(PORT,()=>console.log('✅ server is running on port '+PORT))
})
.catch((e)=>{
  console.log("❌ server failed "+e)
})

