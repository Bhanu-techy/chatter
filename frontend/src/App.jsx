import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import ProtectedRoute from './components/ProtectedRoute'
import PrivateChat from './PrivateChat'
import Rooms from './components/Rooms'
import Chats from './components/Chats'
import RoomsChat from './components/RoomsChat'
import './App.css'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/login' element={<Login/>}/>
      <Route path='/' element={<ProtectedRoute><Home/></ProtectedRoute>} />
      <Route path='/rooms' element={<ProtectedRoute><Rooms/></ProtectedRoute>} />
      <Route path='/chats' element={<ProtectedRoute><Chats/></ProtectedRoute>} />
      <Route path='/chat/:id' element={<ProtectedRoute><PrivateChat/></ProtectedRoute>}/>
      <Route path='/room/:id' element={<ProtectedRoute><RoomsChat/></ProtectedRoute>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
