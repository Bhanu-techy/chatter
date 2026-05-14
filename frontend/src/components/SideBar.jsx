import {useState, useEffect} from 'react'
import Cookies from 'js-cookie'
import { useNavigate, Link } from 'react-router-dom'

function SideBar() {
const [username, setUserName] = useState("")
const [fullname, setFullName] = useState("")
const [profile, setProfile] = useState('avatar.png')

const userId = Cookies.get('userId')

  useEffect(()=>{
    const userDetails = async ()=>{
      const url = `https://chatter-ric5.onrender.com/user/${userId}`
      const response = await fetch(url)
      const data = await response.json()
      if (response.ok){
        setProfile(data[0].avatar_url)
        setFullName(data[0].full_name)
        setUserName(data[0].username)
      }

    }
    userDetails()
  },[userId])

  const navigate = useNavigate()

  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    Cookies.remove('userId')
    navigate('/login', {replace :true})
  }

  return (
    <div className='w-[25%] bg-blue-200 h-screen p-1 flex flex-col flex-between items-center bg-fixed'>
        <div className="flex  items-center gap-3 h-[20%]">
        <div className="w-11 h-11 rounded-2xl bg-purple-600 flex items-center justify-center text-xl font-bold">
        C
        </div>
        <h1 className="text-2xl font-bold text-white">
        Chatter
        </h1>
        </div>
    <div className='h-[80%]'>
    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl mb-5">
      <img
        src={profile}
        alt={username}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div>
        <h3 className="text-black font-semibold w-[150px]">
          {fullname}
        </h3>
        <p className="text-orange-500 text-sm">
          {username}
        </p>
      </div>
    </div>
    <div className='flex flex-col'>
    <Link to='/'>
    <button className="bg-purple-500 h-[33px] text-white px-5 m-1 w-[90%] rounded-lg hover:bg-purple-700 transition">Dashboard</button>
    </Link>
    <Link to='/rooms'>
    <button className="bg-purple-500 h-[33px] text-white m-1 px-5 w-[90%] rounded-lg hover:bg-purple-700 transition">Rooms</button>
    </Link>
    <Link to='chats'>
    <button className="bg-purple-500 h-[33px] text-white m-1 px-5 w-[90%] rounded-lg hover:bg-purple-700 transition">Direct Chats</button>
    </Link>
    <button className="bg-purple-500 h-[33px] text-white m-1 px-5 w-[90%] rounded-lg hover:bg-purple-700 transition">Settings</button>
    </div>

    </div> 
    <div className='w-[100%] text-center'>
    <button className='bg-gray-500 rounded w-[200px] h-[33px] flex-end text-white' onClick={onClickLogout}>Logout</button>
    </div>
    </div>
  )
}

export default SideBar