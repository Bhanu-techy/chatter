import {useState, useEffect} from 'react'
import {Link, useParams} from 'react-router-dom'
import Cookies from 'js-cookie'
import SideBar from './SideBar'

function RoomsChat() {

  const [data, setData] = useState([])
  const id = useParams();
 

  useEffect(()=>{
    const getRooms = async () => {
      const response = await fetch(`https://chatter-ric5.onrender.com/group-chats/${id.id}/messages`)
      const data = await response.json()
      if (response.ok){
        setData(data)
      }
    }
    getRooms();
  })

  return (
    <div className='flex'>
      <SideBar/>
      <div className='p-1 w-[50%]'>
        <h1 className='m-2 text-2xl font-bold text-blue-600'>room</h1>
        <ul className='flex flex-col h-[50%]'>
          {data.map(each => (
            <li key={each.id} className='flex flex-col p-2 border border-blue-400 h-[70px] p-1 rounded m-1 mb-3 shadow shadow-blue-200'>
                <div className='flex'>
                    <img src={each.avatar_url} alt={each.username} className="w-10 h-10 rounded-full object-cover mr-3"/>
                    <p>{each.message}</p>
                    </div>
                <p className='text-sm self-end'>-{each.username}</p>
            </li>
          ))}
        </ul>
      </div>
    
    </div>
  )
}

export default RoomsChat