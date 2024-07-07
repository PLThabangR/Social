import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home/Home"
import SignUp from "./pages/auth/SignUp"
import Login from "./pages/auth/Login"
import SideBar from "./components/common/SideBar"
import RightPanel from "./components/common/RightPanel"

function App() {
 

  return (
    <>
    <div className="flex max-w-6xl mx-auto">
      {/*This is a common component*/ }
      <SideBar/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/login" element={<Login/>}/>
    </Routes>
<RightPanel/>

    </div>
    </>
  )
}

export default App
