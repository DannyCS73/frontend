import React, { useContext, useEffect } from "react"
import Login from "./User/Login"
import Register from "./Registering/Register"
import Admin from "./Admin/Admin"
import RequestEvaluation from "./User/RequestEvaluation"
import ResetPassword from "./PasswordReset/ResetPassword"
import ForgotPassword from "./PasswordReset/ForgotPassword"
import { BrowserRouter, Routes, Router , Route, Link} from 'react-router-dom'
import VerifyRegister from "./Registering/VerifyRegister"




function App() {

  return (
    <BrowserRouter>
    <Routes>
          <Route exact path="/" element={<Login />}/>
          <Route exact path="/register" element={<Register />}/>
          <Route exact path="/home" element={<RequestEvaluation />}/>
          <Route exact path="/reset/:id" element={<ResetPassword />}/>
          <Route exact path="/forgotpassword" element={<ForgotPassword />}/>
          <Route exact path="/register/:id/verify" element={<VerifyRegister />}/>
          <Route exact path="/admin" element={<Admin />}/>
    </Routes>
</BrowserRouter>
  )
}

export default App;
