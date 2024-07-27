import React from "react"
import { Routes, Route } from "react-router-dom"
import Home from "../pages/Home"

// import Login from "../pages/Login"
// import Dashboard from "../pages/Dashboard"

export default function Router() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="users/login" element={<Login />} />{" "}
        <Route path="/admin/login" element={<Dashboard />} />
      
      </Routes>
    </div>
  )
}
