import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Study from './pages/Study'
import Quiz from './pages/Quiz'
import Lab from './pages/Lab'
import Lecture from './pages/Lecture'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App() {
  return (
    <div className="bg-gray-950 min-h-screen text-white">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/study" element={<Study />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/lab" element={<Lab />} />
        <Route path="/lecture" element={<Lecture />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
<Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  )
}

export default App