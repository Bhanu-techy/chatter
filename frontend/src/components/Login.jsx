import {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

function Login() {

   const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showSubmitErr, setShowErr] = useState(false)
    const [errMsg, setErrmsg ] = useState("")

     const navigate = useNavigate();

    const submitForm = async event => {
        event.preventDefault()

    const userDetails = {email, password}
    const url = 'https://chatter-ric5.onrender.com/login'
    const options = {
      method: 'POST',
      headers : {"Content-Type" : "application/json"},
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    if (response.ok) {
      Cookies.set('jwt_token', data.jwt_token, {expires: 30})
      Cookies.set('userId', data.userId, {expires: 30})
      Cookies.set('name', data.name)
      navigate("/", {replace : true})
      
    } else {
      setErrmsg(data.error_msg)
      setShowErr(true)
    }
    }

  return (
    <div className="w-screen h-screen flex justify-center items-center">
        <div className='w-[450px] h-[350px] rounded shadow-lg shadow-blue-200 flex justify-center items-center '>
          <form onSubmit={submitForm} className='h-[90%] w-[100%] flex flex-col justify-between items-center'>
          <h1 className='text-blue-600 text-2xl font-mono'>Login</h1>
          <div className="flex flex-col w-[300px] m-3">
                  <label htmlFor="username">Email</label>
                  <input
                    id="username"
                    type="text"
                    className="w-[270px] h-[30px] rounded mt-1 bg-gray-300"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                  />
                </div>
                <div className="flex flex-col justiy-center items-start w-[300px] m-3">
                  <label htmlFor="password">PASSWORD</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    className="w-[270px] h-[30px] rounded mt-1 bg-gray-300"
                    onChange={(e)=>setPassword(e.target.value)}
                  />
                </div>
                {showSubmitErr && <p className="text-red-600">{errMsg}</p>}
                <button type="submit" className="text-white bg-blue-600 h-[30px] w-[100px] rounded m-3">
                  Login
                </button>
              </form>
        </div>
    </div>
  )
}

export default Login