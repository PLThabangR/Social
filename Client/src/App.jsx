import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home/Home"
import SignUp from "./pages/auth/SignUp"
import Login from "./pages/auth/Login"

function App() {
 

  return (
    <>
    <div className="flex max-w-6xl mx-auto">
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/login" element={<Login/>}/>
    </Routes>


    </div>
    </>
  )
}

export default App
