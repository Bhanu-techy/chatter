import {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import SideBar from './SideBar'
import Users from './Users'

function Rooms() {

  const [rooms, setRooms] = useState([])

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
            <li key={each.id} className='border border-blue-400 h-[40px] p-1 rounded m-1 mb-3 shadow shadow-blue-200'>{each.name}
            </li>
          ))}
        </ul>
      </div>
    
    </div>
  )
}

export default Rooms