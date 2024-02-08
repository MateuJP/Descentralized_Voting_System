import express from 'express';
import cors from 'cors';
import db from './database/db.js';
import router from './routes/routes.js';

const app=express();
app.use(cors())
app.use(express.json())
app.use('/appiCCM',router);

try{
    await db.authenticate();
    console.log('Conexión exitosa');
}catch(error){
    console.log("Error en la conexión ",error);
}
/*
app.get('/',(req,res)=>{
    res.send("Hola");
})
*/

app.listen(8000,()=>{
    console.log("Server Up Runing in  http://localhost:8000/")
})