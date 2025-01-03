import Quill from "quill";
import 'quill/dist/quill.snow.css'
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {io} from 'socket.io-client';

const TOOLBAR_OPTIONS=[
    [{header:[1,2,3,4,5,6,false]}],
    [{font:[]}],
    [{list:"ordered"},{list:"bullet"}],
    ["bold","italic","underline"],
    [{color:[]},{background:[]}],
    [{script:"sub"},{script:"super"}],
    ["image","blockquote","code-block"],
    ["clean"],
]

const SAVE_INTERVAL=2000;

export default function TextEditor()
{
    const {id:docId}=useParams(); // getting it from the Browser Router and renaming it to docId
    const [socket,setSocket]=useState();
    const [quill,setQuill]=useState();
    
    useEffect(()=>{
        const newSocketConnection=io('http://localhost:3000');
        setSocket(s=>newSocketConnection);
        return(
            ()=>{newSocketConnection.disconnect();}
        )
    },[])

    useEffect(()=>{
        if(socket==null || quill==null)return;
        const changeHandler=(delta,oldDelta,source)=>{
            if(source!=='user')return
            socket.emit("send-changes",delta);
        }
        quill.on('text-change',changeHandler)

        return(
            ()=>{
                quill.off('text-change',changeHandler);
            }
        )
    },[socket,quill])

    useEffect(()=>{
        if(socket==null || quill==null)return;
        const changeHandler=(delta)=>{
            quill.updateContents(delta)
        }
        socket.on('recieve-changes',changeHandler)

        return(
            ()=>{
                socket.off('recieve-changes',changeHandler);
            }
        )
    },[socket,quill])

    useEffect(()=>{
        if(socket==null || quill==null)return;

        socket.once("load-document",doc=>{
            quill.setContents(doc);
            quill.enable();
        })
        socket.emit('get-document',docId);
    },[socket,quill,docId])

    useEffect(()=>{
        if(socket==null || quill==null)return;
        const interval=setInterval(()=>{
            socket.emit("save-doc",quill.getContents());
        },SAVE_INTERVAL)

        return(
            ()=>{clearInterval(interval)}
        )
    },[socket,quill]);
    
    
    const wrapperRef=useCallback((wrapper)=>{
        if(!wrapper)return;
        wrapper.innerHTML="";
        const editor=document.createElement('div');
        wrapper.append(editor);
        const newQuill=new Quill(editor,{theme:"snow",modules:{toolbar:TOOLBAR_OPTIONS}});
        newQuill.disable();
        newQuill.setText('Loading...')
        setQuill(q=>newQuill);
    },[])


    return(
        <div className="container" ref={wrapperRef}></div>
    )
}