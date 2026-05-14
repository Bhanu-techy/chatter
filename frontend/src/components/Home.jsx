import {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import SideBar from './SideBar'
import Users from './Users'

function Home() {

  const [rooms, setRooms] = useState([])
  const [chats, setChats] = useState([])

  const name= Cookies.get('name')
  const userId = Cookies.get('userId')

  useEffect(()=>{
    const getRooms = async () => {
      const response = await fetch('https://chatter-ric5.onrender.com/rooms')
      const data = await response.json()
      if (response.ok){
        setRooms(data)
      }
    }
    const getChats = async () => {
      const chatresponse = await fetch(`https://chatter-ric5.onrender.com/users/${userId}/private-users`)
      const chatdata = await chatresponse.json()
      if (chatresponse.ok){
        setChats(chatdata)
      }
    }
    getChats();
    getRooms();
  })

  return (
    <div className='flex'>
      <SideBar/>
      <div className='p-1 w-[50%]'>
        <h1 className='m-2 h-[50px] text-2xl italic'>Wellcome back, {name}</h1>
        <h1 className='m-2 text-2xl font-bold text-blue-600'>Public Rooms</h1>
        <ul className='flex flex-col h-[50%]'>
          {rooms.map(each => (
            <Link key={each.id}  to={`/room/${each.id}`}>
            <li  className='border border-blue-400 h-[40px] p-1 rounded m-1 mb-3 shadow shadow-blue-200'>{each.name}
            </li>
            </Link>
          ))}
        </ul>
        <hr className='h-[2px] bg-gray-300'/>
        <h1 className='m-2 text-2xl font-bold text-blue-600'>Direct Messages</h1>
        <ul>
          {chats.map(each =>(
            <Link to={`chat/${each.id}`} key={each.id}>
            <li className='flex items-center mb-1'>
              <img className='w-12 h-12 rounded-full object-cover mr-3' src={each.avatar_url} alt={each.username} />
              <p>{each.full_name}</p>
            </li>
            </Link>
          ))}
        </ul>
      </div>
      <Users/>
    </div>
  )
}

export default Home