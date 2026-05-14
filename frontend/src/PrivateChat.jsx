import {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import SideBar from './components/SideBar'

function PrivateChat() {
    const [data, setData] = useState([])
    const [user, setUser] = useState([])
    const id = useParams()
    
    useEffect(()=>{
        const getChats=async () => {
            const url = `https://chatter-ric5.onrender.com/conversations/${id.id}`
            const response = await fetch(url)
            const data = await response.json();
            setData(data)
            setUser(data[0])
        }
        getChats()
    })

const conversations = []

for (let i = 0; i < data.length; i += 2) {
  conversations.push({
    msg: {
      message: data[i]?.message,
      sender: data[i]?.username,
      avatar: data[i]?.avatar_url,
      created_at: data[i]?.created_at
    },

    reply: {
      message: data[i + 1]?.message,
      sender: data[i + 1]?.username,
      avatar: data[i + 1]?.avatar_url,
      created_at: data[i + 1]?.created_at
    }
  })
}

  return (
    <div className='text-black flex'>
        <SideBar/>
        <div className='flex flex-col w-full'>
             <div className='flex p-3 bg-yellow-100'>
                <img src={user.avatar_url} alt={user.username} className='w-12 h-12 rounded-full object-cover'/>
             <h1 className='text-2xl pl-3'>{user.username}</h1>   
             </div>
        <ul className='w-full p-3 bg-purple-200'>
            {conversations.map(each =>(
                <li key={each.id} className='flex flex-col justify-between items-start m-2'>
                    <p className='bg-purple-400 p-1 rounded min-w-[50px] text-left pl-1'>{each.msg.message} </p>
                    <p className='bg-pink-400 mt-3 self-end p-1 rounded min-w-[50px] text-right pr-3'>{each.reply.message}</p>
                </li>
            ))}
        </ul>
        </div>
    </div>
  )
}

export default PrivateChat