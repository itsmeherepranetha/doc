if(process.env.NODE_ENV!=='production')require('dotenv').config();
const mongoose = require('mongoose');
const Document=require('./document')
const MONGO_URL=process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/doc'
mongoose.connect(MONGO_URL);

const defaultValue="";

async function findOrCreateDocument(id)
{
    if(id==null)return;

    const doc=await Document.findById(id);
    if(doc)return doc;

    const newDoc=Document.create({_id:id,data:defaultValue});
    return newDoc;
}

const frontend_port=process.env.FRONTEND_PORT || 5173;
const backend_port=process.env.BACKEND_PORT || 3000;
const io=require('socket.io')(backend_port,{
    cors:{
        origin:`http://localhost:${frontend_port}`,
        methods:['GET','POST']
    }
})


io.on('connection',socket=>{
    //console.log("connected");

    socket.on('get-document',async(docId)=>{
        const doc=await findOrCreateDocument(docId);
        socket.join(docId);
        socket.emit('load-document',doc.data);
        socket.on("send-changes",delta=>{
            //console.log(delta);
            socket.broadcast.to(docId).emit("recieve-changes",delta);
        })
        socket.on("save-doc",async(data)=>{
            await Document.findByIdAndUpdate(docId,{data});
        })
    })
})