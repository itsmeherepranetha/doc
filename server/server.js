const mongoose = require('mongoose');
const Document=require('./document')
mongoose.connect('mongodb://127.0.0.1:27017/doc');

const defaultValue="";

async function findOrCreateDocument(id)
{
    if(id==null)return;

    const doc=await Document.findById(id);
    if(doc)return doc;

    const newDoc=Document.create({_id:id,data:defaultValue});
    return newDoc;
}


const io=require('socket.io')(3000,{
    cors:{
        origin:"http://localhost:5173",
        methods:['GET','POST']
    }
})


io.on('connection',socket=>{
    console.log("connected");

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