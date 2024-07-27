import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
//import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Header from "./header/Header"
//import { Provider } from "react-redux"
//import Router from "./router/Router"
//import '@fortawesome/fontawesome-free/css/all.min.css';

import "./tailwind.css"
//import Layout from "./layouts/Layout"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Header />
      {/* <ToastContainer
        theme="dark"
        position="top-right"
        autoClose={3000}
        closeOnClick
        pauseOnHover={true}
      /> */}
    </BrowserRouter>
  </React.StrictMode>
)
