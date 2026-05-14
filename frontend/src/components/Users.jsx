import {useState, useEffect} from 'react'

function Users() {

    const [users, setUsers] = useState([])

    useEffect(()=>{
        const getUsers = async () => {
            const url = 'https://chatter-ric5.onrender.com/users'
            const response = await fetch (url)
            const data = await response.json()
            setUsers(data)
        }
        getUsers();
    })

  return (
    <div className='w-[200px] flex flex-col h-[100vh] items-center p-2'>
        <h1 className='text-2xl mb-3'>Users</h1>
        <ul>
          {users.map(each =>(
            <li className='flex items-center mb-1'>
              <img className='w-12 h-12 rounded-full object-cover mr-3' src={each.avatar_url} alt={each.username} />
              <p>{each.full_name}</p>
            </li>
          ))}
        </ul>
    </div>
  )
}

export default Users