import React from "react"
import { Routes, Route } from "react-router-dom"
//import Home from "../pages/Home"

import Login from "../pages/primaryUser/authentication/Login.jsx"
//import Register from "../pages/primaryUser/authentication/Register.jsx"
import mastersRoutes from "./CrmRoutes/childRoutes/mastersRoutes.js"
import reportsRoutes from "./CrmRoutes/childRoutes/reportsRoutes.js"
import tasksRoutes from "./CrmRoutes/childRoutes/tasksRoutes.js"
import transactionsRoutes from "./CrmRoutes/childRoutes/transactionsRoutes.js"
import ProductList from "../components/common/ProductList.jsx"

const Mainrouter = () => {
  const allRoutes = [
    ...mastersRoutes,
    ...reportsRoutes,
    ...tasksRoutes,
    ...transactionsRoutes,
  ]
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/productlist" element={<ProductList />} />

        {allRoutes.map((route, index) => {
          const { path, component: Component, title } = route
          return (
            <Route
              key={index}
              path={path}
              element={<Component />}
              title={title}
            />
          )
        })}
      </Routes>
    </div>
  )
}
export default Mainrouter
